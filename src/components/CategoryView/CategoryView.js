"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/app/Redux/provider";
import { CATEGORIES, GROUPS, categoryByKey } from "@/lib/catalog";
import ProductCard, { ProductCardSkeleton } from "../ProductCard/ProductCard";
import EmptyState from "../EmptyState/EmptyState";
import style from "./categoryView.module.scss";

const SORTS = {
  featured: { label: "Featured", fn: null },
  "price-asc": { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  rating: { label: "Top rated", fn: (a, b) => (b.rating || 0) - (a.rating || 0) },
};

const BANDS = [
  { key: "all", label: "All prices", test: () => true },
  { key: "u500", label: "Under ₹500", test: (p) => p.price < 500 },
  { key: "500-1500", label: "₹500 – ₹1,500", test: (p) => p.price >= 500 && p.price <= 1500 },
  { key: "o1500", label: "Over ₹1,500", test: (p) => p.price > 1500 },
];

export default function CategoryView({ categoryKey }) {
  const category = categoryByKey(categoryKey);
  const group = GROUPS.find((g) => g.key === category.group);
  const { products, loading, error, refresh } = useProducts();
  const [sort, setSort] = useState("featured");
  const [band, setBand] = useState("all");

  const inCategory = useMemo(() => products.filter((p) => p.category === categoryKey), [products, categoryKey]);

  const visible = useMemo(() => {
    const list = inCategory.filter(BANDS.find((b) => b.key === band).test);
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [inCategory, band, sort]);

  const siblings = CATEGORIES.filter((c) => c.group === category.group);

  return (
    <div className="container page">
      <nav className={style.crumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <span>{group.label}</span>
        <span aria-hidden>/</span>
        <span aria-current="page">{category.label}</span>
      </nav>

      <section className={style.hero}>
        <div className={style.heroText}>
          <h1>
            {group.key !== "more" && <em>{group.label}&apos;s </em>}
            {category.label}
          </h1>
          <p className={style.blurb}>{category.blurb}</p>
        </div>
        <div className={style.heroImg} aria-hidden>
          <img src={category.image} alt="" />
        </div>
      </section>

      <nav className={style.tabs} aria-label={`More in ${group.label}`}>
        {siblings.map((c) => (
          <Link key={c.key} href={c.href} aria-current={c.key === categoryKey ? "page" : undefined}>
            {c.label}
          </Link>
        ))}
      </nav>

      <div className={style.toolbar}>
        <div className={style.bands} role="group" aria-label="Filter by price">
          {BANDS.map((b) => (
            <button key={b.key} className="chip" aria-pressed={band === b.key} onClick={() => setBand(b.key)}>
              {b.label}
            </button>
          ))}
        </div>
        <div className={style.right}>
          <span className="muted">{loading ? "Loading…" : `${visible.length} ${visible.length === 1 ? "item" : "items"}`}</span>
          <label className={style.sort}>
            <span className="visually-hidden">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className={style.grid}>
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="We couldn't load products"
          text={error}
          action={
            <button className="btn" onClick={refresh}>
              Try again
            </button>
          }
        />
      ) : visible.length ? (
        <div className={style.grid}>
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={inCategory.length ? "Nothing in this price range" : "New stock is on its way"}
          text={inCategory.length ? "Try another price filter to see more." : "This shelf is empty right now. Have a look around the rest of the shop."}
          action={
            inCategory.length ? (
              <button className="btn" onClick={() => setBand("all")}>
                Show all prices
              </button>
            ) : (
              <Link href="/" className="btn">
                Back to home
              </Link>
            )
          }
        />
      )}
    </div>
  );
}
