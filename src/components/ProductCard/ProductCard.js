"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiShoppingBag, FiStar } from "react-icons/fi";
import { addToCart } from "@/app/Redux/cartSlice";
import { categoryByKey, productHref } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import style from "./productCard.module.scss";

export function Rating({ value, className = "" }) {
  if (value === undefined || value === null) return null;
  return (
    <span className={`${style.rating} ${className}`} aria-label={`Rated ${value} out of 5`}>
      <FiStar aria-hidden /> {Number(value).toFixed(1)}
    </span>
  );
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const soldOut = !(product.availableQty > 0);
  const lowStock = !soldOut && product.availableQty <= 5;
  const category = categoryByKey(product.category);

  const quickAdd = (e) => {
    e.preventDefault();
    if (soldOut) return;
    dispatch(addToCart({ product }));
    toast.success(`Added to bag: ${product.title.slice(0, 32)}`);
  };

  return (
    <Link href={productHref(product._id)} className={`${style.card} ${soldOut ? style.soldOut : ""}`}>
      <div className={style.media}>
        <img src={product.thumbnail} alt={product.title} loading="lazy" decoding="async" />
        <Rating value={product.rating} className={style.ratingBadge} />
        {soldOut && <span className={style.tag}>Sold out</span>}
        {lowStock && <span className={`${style.tag} ${style.tagWarm}`}>Only {product.availableQty} left</span>}
      </div>

      <div className={style.body}>
        {category && <span className={style.category}>{category.label}</span>}
        <h3 className={style.title}>{product.title}</h3>
        <div className={style.foot}>
          <div className={style.priceWrap}>
            <span className={style.price}>{formatINR(product.price)}</span>
            <span className={style.delivery}>Free delivery</span>
          </div>
          {!soldOut && (
            <button className={style.add} onClick={quickAdd} aria-label={`Add ${product.title} to bag`} title="Add to bag">
              <FiShoppingBag aria-hidden />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={style.card} aria-hidden>
      <div className={`${style.media} skeleton`} />
      <div className={style.body}>
        <div className="skeleton" style={{ height: 10, width: "35%" }} />
        <div className="skeleton" style={{ height: 14, width: "90%", marginTop: 10 }} />
        <div className="skeleton" style={{ height: 14, width: "60%", marginTop: 8 }} />
        <div className="skeleton" style={{ height: 22, width: "40%", marginTop: 16 }} />
      </div>
    </div>
  );
}
