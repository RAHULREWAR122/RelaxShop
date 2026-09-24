"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useProducts } from "@/app/Redux/provider";
import { CATEGORIES } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import admin from "../admin.module.scss";
import style from "./addProduct.module.scss";

const EMPTY = { title: "", price: "", thumbnail: "", desc: "", rating: "4.2", availableQty: "", category: "", imgs: [""] };

export default function AddProduct() {
  const { refresh } = useProducts();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const setImg = (i, value) => setForm({ ...form, imgs: form.imgs.map((v, j) => (j === i ? value : v)) });
  const addImg = () => form.imgs.length < 6 && setForm({ ...form, imgs: [...form.imgs, ""] });
  const removeImg = (i) => setForm({ ...form, imgs: form.imgs.filter((_, j) => j !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const missing = ["title", "price", "thumbnail", "desc", "availableQty", "category"].find((k) => !String(form[k]).trim());
    if (missing) return setError(`Please fill in the ${missing === "availableQty" ? "stock" : missing === "desc" ? "description" : missing} field.`);

    setBusy(true);
    const imgs = form.imgs.map((s) => s.trim()).filter(Boolean);
    const res = await api("/api/Products", { method: "POST", body: { ...form, imgs: imgs.length ? imgs : [form.thumbnail] } });
    setBusy(false);
    if (!res.success) return setError(res.result);
    toast.success("Product published");
    setForm(EMPTY);
    refresh();
  };

  return (
    <>
      <div className={admin.pageHead}>
        <div>
          <h1>Add a product</h1>
          <p>It goes live in the store as soon as you publish.</p>
        </div>
      </div>

      <div className={style.layout}>
        <form className={style.form} onSubmit={submit} noValidate>
          <section className="card">
            <h2>Basics</h2>
            <div className="form-grid">
              <label className="field span-2">
                <span>Title</span>
                <input className="input" value={form.title} onChange={set("title")} placeholder="e.g. Relaxed linen shirt" />
              </label>
              <label className="field">
                <span>Category</span>
                <select className="input" value={form.category} onChange={set("category")}>
                  <option value="">Choose…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.group === "men" ? "Men · " : c.group === "women" ? "Women · " : ""}
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Price (₹)</span>
                <input className="input" type="number" min="0" value={form.price} onChange={set("price")} />
              </label>
              <label className="field">
                <span>Stock</span>
                <input className="input" type="number" min="0" value={form.availableQty} onChange={set("availableQty")} />
              </label>
              <label className="field">
                <span>Rating (0–5)</span>
                <input className="input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set("rating")} />
              </label>
              <label className="field span-2">
                <span>Description</span>
                <textarea className="input" value={form.desc} onChange={set("desc")} placeholder="Fabric, fit, care and anything a shopper should know." />
              </label>
            </div>
          </section>

          <section className="card">
            <h2>Images</h2>
            <div className="form-grid">
              <label className="field span-2">
                <span>Thumbnail URL</span>
                <input className="input" value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://…" />
              </label>
              {form.imgs.map((v, i) => (
                <div key={i} className={`field span-2 ${style.imgRow}`}>
                  <input className="input" value={v} onChange={(e) => setImg(i, e.target.value)} placeholder={`Gallery image ${i + 1} URL`} aria-label={`Gallery image ${i + 1}`} />
                  {form.imgs.length > 1 && (
                    <button type="button" className="icon-btn" onClick={() => removeImg(i)} aria-label="Remove image">
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              {form.imgs.length < 6 && (
                <button type="button" className="btn btn-sm btn-ghost span-2" onClick={addImg} style={{ justifySelf: "start" }}>
                  <FiPlus /> Add another image
                </button>
              )}
            </div>
          </section>

          {error && (
            <p className={style.error} role="alert">
              {error}
            </p>
          )}
          <div className={style.actions}>
            <button type="button" className="btn btn-ghost" onClick={() => setForm(EMPTY)}>
              Reset
            </button>
            <button className="btn btn-accent btn-lg" disabled={busy}>
              {busy ? <span className="spinner" /> : "Publish product"}
            </button>
          </div>
        </form>

        <aside className={style.preview}>
          <span className="eyebrow">Live preview</span>
          <div className={style.previewCard}>
            <div className={style.previewImg}>{form.thumbnail ? <img src={form.thumbnail} alt="" /> : <span>Thumbnail</span>}</div>
            <p className={style.previewTitle}>{form.title || "Product title"}</p>
            <div className={style.previewMeta}>
              <strong>{formatINR(form.price || 0)}</strong>
              <span>★ {form.rating || "–"}</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
