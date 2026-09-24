"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCheck, FiMapPin, FiCreditCard, FiX } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useProducts } from "@/app/Redux/provider";
import { ORDER_STAGES, productHref } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import useRequireAuth from "@/components/useRequireAuth";
import EmptyState from "@/components/EmptyState/EmptyState";
import { formatDate } from "@/components/OrdersList/OrdersList";
import style from "./orderDetail.module.scss";

export default function OrderDetail({ id }) {
  const session = useRequireAuth();
  const justPlaced = useSearchParams().get("placed") === "1";
  const { refresh } = useProducts();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) return;
    api(`/api/Orders/${id}`).then((res) => (res.success ? setOrder(res.result) : setError(res.result)));
  }, [session, id]);

  const cancel = async () => {
    setBusy(true);
    const res = await api(`/api/Orders/${id}`, { method: "PUT", body: { deliveryStatus: "Cancelled" } });
    setBusy(false);
    setConfirmCancel(false);
    if (res.success) {
      setOrder(res.result);
      refresh();
      toast.success("Your order has been cancelled.");
    } else toast.error(res.result);
  };

  if (error) {
    return (
      <div className="container page">
        <EmptyState
          title="We couldn't find that order"
          text={error}
          action={
            <Link href="/Components/Orders" className="btn">
              See all orders
            </Link>
          }
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-loader">
        <span className="spinner" />
      </div>
    );
  }

  const status = order.deliveryStatus || "Pending";
  const cancelled = status === "Cancelled";
  const stageIndex = ORDER_STAGES.indexOf(status);
  const products = order.products || [];
  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const method = order.paymentMethod === "cod" || order.paymentInfo === "COD" ? "Cash on delivery" : "Paid online";

  return (
    <div className="container page" style={{ maxWidth: 1040 }}>
      <Link href="/Components/Orders" className={style.back}>
        <FiArrowLeft /> All orders
      </Link>

      {justPlaced && !cancelled && (
        <div className={style.placed}>
          <span className={style.placedIcon}>
            <FiCheck />
          </span>
          <div>
            <h2>
              Thank you{order.name ? `, ${order.name.split(" ")[0]}` : ""}! Your order is <em>in</em>.
            </h2>
            <p>We&apos;ve received your order and will start packing it shortly.</p>
          </div>
        </div>
      )}

      <div className={style.head}>
        <div>
          <span className="eyebrow">Placed {formatDate(order.createdAt)}</span>
          <h1 className="page-title">Order #{order.orderId}</h1>
        </div>
        <span className={`status status-${status}`}>{status}</span>
      </div>

      {cancelled ? (
        <div className={style.cancelled}>
          <FiX /> This order was cancelled. Any items have been returned to stock.
        </div>
      ) : (
        <ol className={style.timeline}>
          {ORDER_STAGES.map((stage, i) => (
            <li key={stage} data-state={i < stageIndex ? "done" : i === stageIndex ? "current" : "todo"}>
              <span className={style.node}>{i <= stageIndex ? <FiCheck /> : i + 1}</span>
              <span>{stage === "Pending" ? "Order placed" : stage}</span>
            </li>
          ))}
        </ol>
      )}

      <div className={style.grid}>
        <section className={style.card}>
          <h2>Items</h2>
          <ul className={style.items}>
            {products.map((p, i) => {
              const inner = (
                <>
                  <img src={p.img} alt="" />
                  <span className={style.itemTitle}>
                    {p.title}
                    <small>
                      {formatINR(p.price)} × {p.qty}
                    </small>
                  </span>
                  <strong>{formatINR(p.price * p.qty)}</strong>
                </>
              );
              return (
                <li key={i}>
                  {p.productId ? <Link href={productHref(p.productId)}>{inner}</Link> : <div>{inner}</div>}
                </li>
              );
            })}
          </ul>
          <dl className={style.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div>
              <dt>Bulk discount</dt>
              <dd className={style.save}>− {formatINR(order.dis)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd className={style.save}>Free</dd>
            </div>
            <div className={style.total}>
              <dt>Total</dt>
              <dd>{formatINR(order.amount)}</dd>
            </div>
          </dl>
        </section>

        <aside className={style.side}>
          <section className={style.card}>
            <h3>
              <FiMapPin /> Delivering to
            </h3>
            {order.name && <strong>{order.name}</strong>}
            <p>{order.address}</p>
            {order.phone && <p className="muted">{order.phone}</p>}
          </section>
          <section className={style.card}>
            <h3>
              <FiCreditCard /> Payment
            </h3>
            <p>{method}</p>
          </section>
          {status === "Pending" && session?.role !== "admin" && (
            <section className={style.card}>
              {confirmCancel ? (
                <>
                  <p>Cancel this order? This can&apos;t be undone.</p>
                  <div className={style.cancelRow}>
                    <button className="btn btn-sm btn-danger" onClick={cancel} disabled={busy}>
                      {busy ? <span className="spinner" /> : "Yes, cancel"}
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setConfirmCancel(false)}>
                      Keep order
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="muted">Changed your mind? You can cancel until we pack it.</p>
                  <button className="btn btn-sm btn-ghost" onClick={() => setConfirmCancel(true)} style={{ marginTop: 12 }}>
                    Cancel order
                  </button>
                </>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
