"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiPlus, FiSave, FiTrash2, FiExternalLink } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useProducts } from "@/app/Redux/provider";
import { CATEGORIES, categoryByKey, productHref } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import style from "../admin.module.scss";

const PAGE = 10;

export default function AdminProducts() {
  const { refresh } = useProducts();
  const [items, setItems] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);

  const load = () => api("/api/Products?all=1").then((res) => setItems(res.success ? res.result : []));
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (items || []).filter((p) => (cat === "all" || p.category === cat) && (!term || p.title.toLowerCase().includes(term)));
  }, [items, q, cat]);

  useEffect(() => setPage(1), [q, cat]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  const stats = useMemo(() => {
    const list = items || [];
    return {
      total: list.length,
      out: list.filter((p) => p.availableQty < 1).length,
      low: list.filter((p) => p.availableQty > 0 && p.availableQty <= 5).length,
      units: list.reduce((n, p) => n + (p.availableQty || 0), 0),
    };
  }, [items]);

  const onChanged = (updated) => {
    setItems((list) => list.map((p) => (p._id === updated._id ? updated : p)));
    refresh();
  };
  const onDeleted = (id) => {
    setItems((list) => list.filter((p) => p._id !== id));
    refresh();
  };

  return (
    <>
      <div className={style.pageHead}>
        <div>
          <h1>Products</h1>
          <p>Edit prices and stock inline, or remove listings.</p>
        </div>
        <Link href="/AdminPage/AddProducts" className="btn btn-accent">
          <FiPlus /> Add product
        </Link>
      </div>

      <div className={style.stats}>
        <div className={`${style.stat} ${style.statAccent}`}>
          <span>Listings</span>
          <strong>{stats.total}</strong>
        </div>
        <div className={style.stat}>
          <span>Units in stock</span>
          <strong>{stats.units.toLocaleString("en-IN")}</strong>
        </div>
        <div className={style.stat}>
          <span>Low stock</span>
          <strong>{stats.low}</strong>
        </div>
        <div className={style.stat}>
          <span>Sold out</span>
          <strong>{stats.out}</strong>
        </div>
      </div>

      <div className={style.toolbar}>
        <input className="input" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <select className={style.select} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.group === "men" ? "Men · " : c.group === "women" ? "Women · " : ""}
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Rating</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!items &&
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td colSpan={5}>
                    <div className="skeleton" style={{ height: 40 }} />
                  </td>
                </tr>
              ))}
            {items && !rows.length && (
              <tr>
                <td colSpan={5} className="muted" style={{ textAlign: "center", padding: 40 }}>
                  No products match.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <ProductRow key={p._id} product={p} onChanged={onChanged} onDeleted={onDeleted} />
            ))}
          </tbody>
        </table>
      </div>

      <div className={style.pager}>
        <span>
          {filtered.length} products · page {page} of {pages}
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

function ProductRow({ product, onChanged, onDeleted }) {
  const [price, setPrice] = useState(String(product.price));
  const [qty, setQty] = useState(String(product.availableQty));
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = Number(price) !== product.price || Number(qty) !== product.availableQty;

  const save = async () => {
    setBusy(true);
    const res = await api(`/api/Products/${product._id}`, { method: "PUT", body: { price, availableQty: qty } });
    setBusy(false);
    if (res.success) {
      onChanged(res.result);
      toast.success("Product updated");
    } else toast.error(res.result);
  };

  const remove = async () => {
    setBusy(true);
    const res = await api(`/api/Products/${product._id}`, { method: "DELETE" });
    setBusy(false);
    if (res.success) {
      onDeleted(product._id);
      toast.success("Product deleted");
    } else toast.error(res.result);
  };

  const stockClass = product.availableQty < 1 ? style.outStock : product.availableQty <= 5 ? style.lowStock : "";

  return (
    <tr>
      <td>
        <div className={style.titleCell}>
          <img src={product.thumbnail} alt="" className={style.thumb} />
          <div>
            <strong title={product.title}>{product.title}</strong>
            <small>{categoryByKey(product.category)?.label || product.category}</small>
          </div>
        </div>
      </td>
      <td>
        <input className={`input ${style.numInput}`} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} aria-label="Price" />
      </td>
      <td>
        <input className={`input ${style.numInput} ${stockClass}`} type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} aria-label="Stock" />
      </td>
      <td>{product.rating}</td>
      <td>
        <div className={style.rowActions}>
          {confirm ? (
            <>
              <button className="btn btn-sm btn-danger" onClick={remove} disabled={busy}>
                Delete
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirm(false)}>
                Keep
              </button>
            </>
          ) : (
            <>
              {dirty && (
                <button className="btn btn-sm" onClick={save} disabled={busy}>
                  <FiSave /> Save
                </button>
              )}
              <Link href={productHref(product._id)} target="_blank" className="icon-btn" aria-label="View in store" title={`View ${formatINR(product.price)} listing`}>
                <FiExternalLink />
              </Link>
              <button className="icon-btn" onClick={() => setConfirm(true)} aria-label={`Delete ${product.title}`}>
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
