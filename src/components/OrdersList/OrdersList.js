"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { formatINR } from "@/lib/pricing";
import EmptyState from "../EmptyState/EmptyState";
import style from "./ordersList.module.scss";

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersList({ compact = false }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/Orders").then((res) => {
      if (res.success) setOrders(res.result);
      else setError(res.result);
    });
  }, []);

  if (error) return <p className="muted">{error}</p>;

  if (!orders) {
    return (
      <div className={style.list}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--r-lg)" }} />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        compact={compact}
        title="No orders yet"
        text="When you place an order, you'll be able to follow it here."
        action={
          <Link href="/" className="btn">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <ul className={style.list}>
      {orders.map((o) => {
        const products = o.products || [];
        const count = products.reduce((n, p) => n + (p.qty || 0), 0);
        const status = o.deliveryStatus || "Pending";
        return (
          <li key={o._id}>
            <Link href={`/Components/Orders/${o._id}`} className={style.order}>
              <div className={style.thumbs}>
                {products.slice(0, 3).map((p, i) => (
                  <img key={i} src={p.img} alt="" style={{ zIndex: 3 - i }} />
                ))}
                {products.length > 3 && <span>+{products.length - 3}</span>}
              </div>
              <div className={style.info}>
                <div className={style.top}>
                  <strong>#{o.orderId}</strong>
                  <span className={`status status-${status}`}>{status}</span>
                </div>
                <span className="muted">
                  {formatDate(o.createdAt)} · {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
              <div className={style.amount}>
                <strong>{formatINR(o.amount)}</strong>
                <span>
                  Details <FiArrowRight />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
