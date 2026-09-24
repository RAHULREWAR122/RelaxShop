"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiMinus, FiPlus, FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiChevronDown } from "react-icons/fi";
import { addToCart } from "@/app/Redux/cartSlice";
import { useSession } from "@/app/Redux/provider";
import { categoryByKey, GROUPS } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import ProductCard, { Rating } from "@/components/ProductCard/ProductCard";
import LoginPrompt from "@/components/LoginPrompt/LoginPrompt";
import style from "./product.module.scss";

const CHECKOUT = "/Components/Checkout/buyNow";

export default function ProductDetail({ product, related }) {
  const images = [...new Set([product.thumbnail, ...(product.imgs || [])].filter(Boolean))];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [prompt, setPrompt] = useState(false);
  const [open, setOpen] = useState("details");
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSession();

  const category = categoryByKey(product.category);
  const group = category && GROUPS.find((g) => g.key === category.group);
  const stock = product.availableQty || 0;
  const soldOut = stock < 1;

  const add = () => {
    dispatch(addToCart({ product, qty }));
    toast.success(`${qty} × added to your bag`);
  };

  const buyNow = () => {
    dispatch(addToCart({ product, qty }));
    if (session) router.push(CHECKOUT);
    else setPrompt(true);
  };

  return (
    <div className="container page">
      {prompt && <LoginPrompt onClose={() => setPrompt(false)} next={CHECKOUT} />}

      <nav className={style.crumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {category && (
          <>
            <span aria-hidden>/</span>
            <Link href={category.href}>
              {group?.key !== "more" ? `${group.label}'s ` : ""}
              {category.label}
            </Link>
          </>
        )}
      </nav>

      <div className={style.layout}>
        <div className={style.gallery}>
          <div className={style.thumbs} role="tablist" aria-label="Product images">
            {images.map((src, i) => (
              <button key={src} role="tab" aria-selected={i === active} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <div className={style.mainImg}>
            <img src={images[active]} alt={product.title} />
            {soldOut && <span className={style.soldBadge}>Sold out</span>}
          </div>
        </div>

        <div className={style.info}>
          {category && <span className="eyebrow">{category.label}</span>}
          <h1>{product.title}</h1>

          <div className={style.priceRow}>
            <span className={style.price}>{formatINR(product.price)}</span>
            <Rating value={product.rating} className={style.rating} />
          </div>
          <p className={style.tierHint}>
            Add 2 or more items to your bag and save <strong>10%</strong>, rising to <strong>24%</strong> on bigger orders.
          </p>

          <div className={style.stock}>
            <span className={`${style.dot} ${soldOut ? style.dotOut : stock <= 5 ? style.dotLow : ""}`} />
            {soldOut ? "Currently out of stock" : stock <= 5 ? `Hurry, only ${stock} left` : "In stock and ready to ship"}
          </div>

          {!soldOut && (
            <div className={style.buy}>
              <div className={style.stepper} aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">
                  <FiMinus />
                </button>
                <output aria-live="polite">{qty}</output>
                <button onClick={() => setQty((q) => Math.min(stock, q + 1))} disabled={qty >= stock} aria-label="Increase quantity">
                  <FiPlus />
                </button>
              </div>
              <button className="btn btn-lg" onClick={add}>
                <FiShoppingBag /> Add to bag
              </button>
              <button className="btn btn-accent btn-lg" onClick={buyNow}>
                Buy now
              </button>
            </div>
          )}

          <ul className={style.promises}>
            <li>
              <FiTruck /> Free delivery, usually in 3–6 days
            </li>
            <li>
              <FiRefreshCw /> 7-day easy returns
            </li>
            <li>
              <FiShield /> Cash on delivery available
            </li>
          </ul>

          <div className={style.accordion}>
            <Section id="details" title="Description" open={open} setOpen={setOpen}>
              <p>{product.desc}</p>
            </Section>
            <Section id="specs" title="Product details" open={open} setOpen={setOpen}>
              <dl className={style.specs}>
                <dt>Name</dt>
                <dd>{product.title}</dd>
                <dt>Category</dt>
                <dd>{category?.label || product.category}</dd>
                <dt>Available</dt>
                <dd>{stock} units</dd>
                <dt>Origin</dt>
                <dd>India</dd>
              </dl>
            </Section>
            <Section id="delivery" title="Delivery & returns" open={open} setOpen={setOpen}>
              <p>
                Every order ships free. Orders can be cancelled any time before they&apos;re packed, and you can return items within 7 days of delivery.
              </p>
            </Section>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={style.related}>
          <div className="section-head">
            <div>
              <span className="eyebrow">You may also like</span>
              <h2>
                More from <em>{category?.label || "this shelf"}</em>
              </h2>
            </div>
            {category && (
              <Link href={category.href} className="btn btn-ghost">
                View all
              </Link>
            )}
          </div>
          <div className={style.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Section({ id, title, open, setOpen, children }) {
  const isOpen = open === id;
  return (
    <div className={style.section}>
      <button aria-expanded={isOpen} aria-controls={`sec-${id}`} onClick={() => setOpen(isOpen ? null : id)}>
        {title}
        <FiChevronDown aria-hidden />
      </button>
      {isOpen && (
        <div id={`sec-${id}`} className={style.sectionBody}>
          {children}
        </div>
      )}
    </div>
  );
}
