"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiLock, FiTruck, FiCreditCard, FiCheck } from "react-icons/fi";
import { clearCart } from "@/app/Redux/cartSlice";
import { useProducts } from "@/app/Redux/provider";
import { api } from "@/lib/client/api";
import useRequireAuth from "@/components/useRequireAuth";
import useCart from "@/components/useCart";
import OrderSummary from "@/components/OrderSummary/OrderSummary";
import EmptyState from "@/components/EmptyState/EmptyState";
import style from "./checkout.module.scss";

const EMPTY = { name: "", phone: "", pinCode: "", line: "", city: "", district: "", state: "", country: "India" };

export default function Checkout() {
  const session = useRequireAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { refresh } = useProducts();
  const { items, available, totals, ready, hasUnavailable } = useCart();

  const [form, setForm] = useState(EMPTY);
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState("cod");
  const [saveDetails, setSaveDetails] = useState(true);
  const [pinState, setPinState] = useState("idle");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const placed = useRef(false);

  useEffect(() => {
    if (!session) return;
    if (session.role === "admin") {
      router.replace("/AdminPage/AllOrders");
      return;
    }
    api("/api/MyUser").then((res) => {
      if (!res.success) return;
      const { name, phone, pinCode, email } = res.result;
      setEmail(email);
      setForm((f) => ({ ...f, name: f.name || name || "", phone: f.phone || phone || "", pinCode: f.pinCode || pinCode || "" }));
    });
  }, [session, router]);

  // Fill in city/state from the PIN code.
  useEffect(() => {
    if (!/^\d{6}$/.test(form.pinCode)) {
      setPinState("idle");
      return;
    }
    let cancelled = false;
    setPinState("loading");
    fetch(`https://api.postalpincode.in/pincode/${form.pinCode}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const office = data?.[0]?.Status === "Success" && data[0].PostOffice?.[0];
        if (!office) return setPinState("invalid");
        setPinState("ok");
        setForm((f) => ({ ...f, city: office.Name, district: office.District, state: office.State, country: office.Country || "India" }));
      })
      .catch(() => !cancelled && setPinState("idle"));
    return () => {
      cancelled = true;
    };
  }, [form.pinCode]);

  const set = (k) => (e) => {
    const value = k === "phone" || k === "pinCode" ? e.target.value.replace(/\D/g, "") : e.target.value;
    setForm({ ...form, [k]: value });
    setErrors({ ...errors, [k]: undefined });
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Please enter the recipient's name";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit mobile number";
    if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = "Enter a 6-digit PIN code";
    if (!form.line.trim()) e.line = "Enter your house number and street";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state.trim()) e.state = "Enter your state";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setBusy(true);
    const res = await api("/api/Orders", {
      method: "POST",
      body: { items: available.map((l) => ({ id: l.id, qty: l.qty })), address: form, paymentMethod: payment },
    });
    if (!res.success) {
      setBusy(false);
      refresh();
      toast.error(res.result);
      return;
    }
    if (saveDetails) api("/api/MyUser", { method: "PUT", body: { name: form.name, phone: form.phone, pinCode: form.pinCode } });
    placed.current = true;
    dispatch(clearCart());
    refresh();
    router.replace(`/Components/Orders/${res.result._id}?placed=1`);
  };

  if (!session || !ready) {
    return (
      <div className="page-loader">
        <span className="spinner" />
      </div>
    );
  }

  if (!items.length && !placed.current) {
    return (
      <div className="container page">
        <EmptyState
          title="Nothing to check out yet"
          text="Your bag is empty. Add a few things you love and come back."
          action={
            <Link href="/" className="btn btn-lg">
              Start shopping
            </Link>
          }
        />
      </div>
    );
  }

  const fieldErr = (k) => errors[k] && <small className={style.err}>{errors[k]}</small>;

  return (
    <div className="container page">
      <div className={style.head}>
        <h1 className="page-title">Checkout</h1>
        <ol className={style.steps} aria-label="Progress">
          <li data-done>Bag</li>
          <li data-current>Details</li>
          <li>Confirmation</li>
        </ol>
      </div>

      <form className={style.layout} onSubmit={placeOrder} noValidate>
        <div className={style.main}>
          <section className={style.block}>
            <h2>
              <span>1</span> Contact
            </h2>
            <div className="form-grid">
              <label className="field">
                <span>Full name</span>
                <input className="input" value={form.name} onChange={set("name")} autoComplete="name" />
                {fieldErr("name")}
              </label>
              <label className="field">
                <span>Mobile number</span>
                <input className="input" value={form.phone} onChange={set("phone")} inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10 digits" />
                {fieldErr("phone")}
              </label>
              <label className="field span-2">
                <span>Email</span>
                <input className="input" value={email || session.email} readOnly />
                <small>Order updates go here.</small>
              </label>
            </div>
          </section>

          <section className={style.block}>
            <h2>
              <span>2</span> Delivery address
            </h2>
            <div className="form-grid">
              <label className="field">
                <span>PIN code</span>
                <input className="input" value={form.pinCode} onChange={set("pinCode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" placeholder="6 digits" />
                {fieldErr("pinCode") ||
                  (pinState === "loading" && <small>Looking up your area…</small>) ||
                  (pinState === "ok" && <small className={style.ok}>Found: {form.city}, {form.state}</small>) ||
                  (pinState === "invalid" && <small className={style.err}>We couldn&apos;t find that PIN. Fill in the details below.</small>)}
              </label>
              <label className="field">
                <span>City / area</span>
                <input className="input" value={form.city} onChange={set("city")} autoComplete="address-level2" />
                {fieldErr("city")}
              </label>
              <label className="field span-2">
                <span>House no., building, street</span>
                <input className="input" value={form.line} onChange={set("line")} autoComplete="street-address" placeholder="e.g. 12B, Lake View Apartments, MG Road" />
                {fieldErr("line")}
              </label>
              <label className="field">
                <span>District</span>
                <input className="input" value={form.district} onChange={set("district")} />
              </label>
              <label className="field">
                <span>State</span>
                <input className="input" value={form.state} onChange={set("state")} autoComplete="address-level1" />
                {fieldErr("state")}
              </label>
            </div>
            <label className={style.check}>
              <input type="checkbox" checked={saveDetails} onChange={(e) => setSaveDetails(e.target.checked)} />
              Save my name, phone and PIN code for next time
            </label>
          </section>

          <section className={style.block}>
            <h2>
              <span>3</span> Payment
            </h2>
            <div className={style.payments} role="radiogroup">
              <PayOption value="cod" current={payment} onChange={setPayment} icon={FiTruck} title="Cash on delivery" text="Pay in cash or UPI when your order arrives." />
              <PayOption value="online" current={payment} onChange={setPayment} icon={FiCreditCard} title="Pay online" text="Demo mode: payment is simulated and always succeeds." />
            </div>
          </section>
        </div>

        <OrderSummary totals={totals} lines={available}>
          {hasUnavailable && (
            <p className={style.err}>
              Some items sold out. <Link href="/Components/Cart" className="link">Review your bag</Link>
            </p>
          )}
          <button className="btn btn-accent btn-lg btn-block" disabled={busy || hasUnavailable}>
            {busy ? <span className="spinner" /> : <>Place order <FiLock /></>}
          </button>
          <p className={style.small}>By placing your order you agree to our friendly returns policy.</p>
        </OrderSummary>
      </form>
    </div>
  );
}

function PayOption({ value, current, onChange, icon: Icon, title, text }) {
  const selected = value === current;
  return (
    <label className={`${style.pay} ${selected ? style.paySelected : ""}`}>
      <input type="radio" name="payment" value={value} checked={selected} onChange={() => onChange(value)} className="visually-hidden" />
      <span className={style.payIcon}>
        <Icon />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <span className={style.radio}>{selected && <FiCheck />}</span>
    </label>
  );
}
