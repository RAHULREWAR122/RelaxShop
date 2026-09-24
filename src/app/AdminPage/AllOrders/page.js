"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useProducts } from "@/app/Redux/provider";
import { ORDER_STATUSES } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { formatDate } from "@/components/OrdersList/OrdersList";
import style from "../admin.module.scss";

const PAGE = 12;

export default function AdminOrders() {
  const { refresh } = useProducts();
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api("/api/Orders").then((res) => setOrders(res.success ? res.result : []));
  }, []);

  const stats = useMemo(() => {
    const list = (orders || []).filter((o) => o.deliveryStatus !== "Cancelled");
    const revenue = list.reduce((s, o) => s + (o.amount || 0), 0);
    return {
      revenue,
      count: list.length,
      pending: list.filter((o) => (o.deliveryStatus || "Pending") === "Pending").length,
      avg: list.length ? revenue / list.length : 0,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (orders || []).filter(
      (o) =>
        (filter === "all" || (o.deliveryStatus || "Pending") === filter) &&
        (!term || o.orderId?.toLowerCase().includes(term) || o.email?.toLowerCase().includes(term) || o.name?.toLowerCase().includes(term))
    );
  }, [orders, filter, q]);

  useEffect(() => setPage(1), [filter, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  const updateStatus = async (order, deliveryStatus) => {
    const res = await api(`/api/Orders/${order._id}`, { method: "PUT", body: { deliveryStatus } });
    if (!res.success) return toast.error(res.result);
    setOrders((list) => list.map((o) => (o._id === order._id ? res.result : o)));
    if (deliveryStatus === "Cancelled") refresh();
    toast.success(`Order #${order.orderId} marked ${deliveryStatus}`);
  };

  return (
    <>
      <div className={style.pageHead}>
        <div>
          <h1>Orders</h1>
          <p>Move orders through packing and delivery.</p>
        </div>
      </div>

      <div className={style.stats}>
        <div className={`${style.stat} ${style.statAccent}`}>
          <span>Revenue</span>
          <strong>{formatINR(stats.revenue)}</strong>
        </div>
        <div className={style.stat}>
          <span>Orders</span>
          <strong>{stats.count}</strong>
        </div>
        <div className={style.stat}>
          <span>Awaiting packing</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className={style.stat}>
          <span>Avg. order</span>
          <strong>{formatINR(stats.avg)}</strong>
        </div>
      </div>

      <div className={style.toolbar}>
        <input className="input" placeholder="Search by order ID, email or name…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
        {["all", ...ORDER_STATUSES].map((s) => (
          <button key={s} className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!orders &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={7}>
                    <div className="skeleton" style={{ height: 36 }} />
                  </td>
                </tr>
              ))}
            {orders && !rows.length && (
              <tr>
                <td colSpan={7} className="muted" style={{ textAlign: "center", padding: 40 }}>
                  No orders here.
                </td>
              </tr>
            )}
            {rows.map((o) => {
              const status = o.deliveryStatus || "Pending";
              const isOpen = open === o._id;
              return (
                <Fragment key={o._id}>
                  <tr>
                    <td>
                      <strong>#{o.orderId}</strong>
                    </td>
                    <td>
                      <div>{o.name || "—"}</div>
                      <small className="muted">{o.email}</small>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(o.createdAt)}</td>
                    <td>
                      <strong>{formatINR(o.amount)}</strong>
                    </td>
                    <td>{o.paymentInfo === "COD" || o.paymentMethod === "cod" ? "COD" : o.paymentInfo || "—"}</td>
                    <td>
                      {status === "Cancelled" ? (
                        <span className="status status-Cancelled">Cancelled</span>
                      ) : (
                        <select className={style.select} value={status} onChange={(e) => updateStatus(o, e.target.value)} aria-label={`Status for order ${o.orderId}`}>
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <button className="icon-btn" onClick={() => setOpen(isOpen ? null : o._id)} aria-expanded={isOpen} aria-label="Show order items">
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className={style.expand}>
                      <td colSpan={7}>
                        <div className={style.expandGrid}>
                          <div>
                            <h4>Items</h4>
                            <ul>
                              {(o.products || []).map((p, i) => (
                                <li key={i}>
                                  <img src={p.img} alt="" className={style.thumb} />
                                  <span style={{ flex: 1 }}>{p.title}</span>
                                  <span>
                                    {p.qty} × {formatINR(p.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4>Ship to</h4>
                            <p>{o.address}</p>
                            {o.phone && <p className="muted">{o.phone}</p>}
                            <h4 style={{ marginTop: 16 }}>Discount</h4>
                            <p>{formatINR(o.dis)}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={style.pager}>
        <span>
          {filtered.length} orders · page {page} of {pages}
        </span>
        <div>
          <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <button className="btn btn-sm btn-ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
