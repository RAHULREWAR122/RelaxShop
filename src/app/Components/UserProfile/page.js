"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiUser, FiPackage, FiLock, FiLogOut } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useSession } from "@/app/Redux/provider";
import useRequireAuth from "@/components/useRequireAuth";
import OrdersList from "@/components/OrdersList/OrdersList";
import style from "./profile.module.scss";

const TABS = [
  { key: "profile", label: "Profile", icon: FiUser },
  { key: "orders", label: "Orders", icon: FiPackage },
  { key: "security", label: "Security", icon: FiLock },
];

export default function ProfilePage() {
  const session = useRequireAuth();
  const { signOut } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!session) return;
    if (session.role === "admin") {
      router.replace("/AdminPage/allProducts");
      return;
    }
    api("/api/MyUser").then((res) => res.success && setProfile(res.result));
  }, [session, router]);

  if (!session || !profile) {
    return (
      <div className="page-loader">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className={`container page ${style.layout}`}>
      <aside className={style.side}>
        <div className={style.identity}>
          <span className={style.avatar}>{profile.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.email}</span>
          </div>
        </div>
        <nav className={style.tabs} role="tablist" aria-label="Account sections">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
              <Icon /> {label}
            </button>
          ))}
          <button
            className={style.signOut}
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <FiLogOut /> Sign out
          </button>
        </nav>
      </aside>

      <section className={style.content}>
        {tab === "profile" && <ProfileForm profile={profile} onSaved={setProfile} />}
        {tab === "orders" && (
          <>
            <Heading title="Your" em="orders" text="Follow deliveries and revisit past purchases." />
            <OrdersList compact />
          </>
        )}
        {tab === "security" && <PasswordForm />}
      </section>
    </div>
  );
}

function Heading({ title, em, text }) {
  return (
    <div className={style.heading}>
      <h1>
        {title} <em>{em}</em>
      </h1>
      {text && <p>{text}</p>}
    </div>
  );
}

function ProfileForm({ profile, onSaved }) {
  const [form, setForm] = useState({ name: profile.name, phone: profile.phone, pinCode: profile.pinCode });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: k === "name" ? e.target.value : e.target.value.replace(/\D/g, "") });
  const dirty = form.name !== profile.name || form.phone !== profile.phone || form.pinCode !== profile.pinCode;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await api("/api/MyUser", { method: "PUT", body: form });
    setBusy(false);
    if (res.success) {
      onSaved(res.result);
      toast.success("Profile saved");
    } else toast.error(res.result);
  };

  return (
    <form onSubmit={save}>
      <Heading title="Your" em="details" text="We use these to speed up checkout." />
      <div className={`form-grid ${style.card}`}>
        <label className="field span-2">
          <span>Full name</span>
          <input className="input" value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="field span-2">
          <span>Email</span>
          <input className="input" value={profile.email} readOnly />
          <small>Your email is your sign-in and can&apos;t be changed.</small>
        </label>
        <label className="field">
          <span>Mobile number</span>
          <input className="input" value={form.phone} onChange={set("phone")} inputMode="numeric" maxLength={10} placeholder="10 digits" />
        </label>
        <label className="field">
          <span>PIN code</span>
          <input className="input" value={form.pinCode} onChange={set("pinCode")} inputMode="numeric" maxLength={6} placeholder="6 digits" />
        </label>
        <div className={`span-2 ${style.actions}`}>
          <button className="btn" disabled={!dirty || busy}>
            {busy ? <span className="spinner" /> : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function PasswordForm() {
  const empty = { password: "", nwPassword: "", cPassword: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (form.nwPassword.length < 6) return setError("New password must be at least 6 characters.");
    if (form.nwPassword !== form.cPassword) return setError("New passwords don't match.");
    setBusy(true);
    const res = await api("/api/updatePassword", { method: "PUT", body: form });
    setBusy(false);
    if (res.success) {
      setForm(empty);
      toast.success("Password updated");
    } else setError(res.result);
  };

  return (
    <form onSubmit={save}>
      <Heading title="Change" em="password" text="Use at least 6 characters. A mix of letters, numbers and symbols is stronger." />
      <div className={`form-grid ${style.card}`}>
        <label className="field span-2">
          <span>Current password</span>
          <input className="input" type="password" value={form.password} onChange={set("password")} autoComplete="current-password" />
        </label>
        <label className="field">
          <span>New password</span>
          <input className="input" type="password" value={form.nwPassword} onChange={set("nwPassword")} autoComplete="new-password" />
        </label>
        <label className="field">
          <span>Confirm new password</span>
          <input className="input" type="password" value={form.cPassword} onChange={set("cPassword")} autoComplete="new-password" />
        </label>
        {error && (
          <p className={`span-2 ${style.error}`} role="alert">
            {error}
          </p>
        )}
        <div className={`span-2 ${style.actions}`}>
          <button className="btn" disabled={busy || !form.password || !form.nwPassword}>
            {busy ? <span className="spinner" /> : "Update password"}
          </button>
        </div>
      </div>
    </form>
  );
}
