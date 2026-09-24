"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FiMinus, FiPlus, FiX, FiArrowRight, FiLock } from "react-icons/fi";
import { setQuantity, removeFromCart, clearCart } from "@/app/Redux/cartSlice";
import { useSession } from "@/app/Redux/provider";
import { productHref } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import useCart from "@/components/useCart";
import OrderSummary from "@/components/OrderSummary/OrderSummary";
import EmptyState from "@/components/EmptyState/EmptyState";
import LoginPrompt from "@/components/LoginPrompt/LoginPrompt";
import style from "./cart.module.scss";

const CHECKOUT = "/Components/Checkout/buyNow";

export default function CartView() {
  const { items, totals, ready, hasUnavailable } = useCart();
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSession();
  const [prompt, setPrompt] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!ready && !items.length) {
    return (
      <div className="page-loader">
        <span className="spinner" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container page">
        <EmptyState
          title="Your bag is feeling light"
          text="Nothing here yet. Just relax, and let us help you find something you'll love."
          action={
            <>
              <Link href="/" className="btn btn-lg">
                Start shopping
              </Link>
              <Link href="/Components/AllPages/Women/t_Shirts" className="btn btn-ghost btn-lg">
                New in women
              </Link>
            </>
          }
        />
      </div>
    );
  }

  const checkout = () => (session ? router.push(CHECKOUT) : setPrompt(true));

  return (
    <div className="container page">
      {prompt && <LoginPrompt onClose={() => setPrompt(false)} next={CHECKOUT} />}

      <div className={style.head}>
        <h1 className="page-title">
          Your <em>bag</em>
        </h1>
        <span className="muted">
          {totals.totalQty} {totals.totalQty === 1 ? "item" : "items"}
        </span>
      </div>

      <div className={style.layout}>
        <section>
          {hasUnavailable && (
            <p className={style.notice} role="alert">
              Some items have sold out since you added them. Remove them to continue to checkout.
            </p>
          )}
          <ul className={style.lines}>
            {items.map((line) => (
              <li key={line.id} className={`${style.line} ${line.unavailable ? style.unavailable : ""}`}>
                <Link href={productHref(line.id)} className={style.thumb}>
                  <img src={line.thumbnail} alt="" />
                </Link>
                <div className={style.lineInfo}>
                  <Link href={productHref(line.id)} className={style.lineTitle}>
                    {line.title}
                  </Link>
                  <span className="muted">{formatINR(line.price)} each</span>
                  {line.unavailable ? (
                    <span className={style.soldOut}>Sold out</span>
                  ) : (
                    <div className={style.stepper}>
                      <button onClick={() => dispatch(setQuantity({ id: line.id, qty: line.qty - 1 }))} disabled={line.qty <= 1} aria-label="Decrease quantity">
                        <FiMinus />
                      </button>
                      <output>{line.qty}</output>
                      <button
                        onClick={() => dispatch(setQuantity({ id: line.id, qty: line.qty + 1 }))}
                        disabled={Number.isFinite(line.stock) && line.qty >= line.stock}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  )}
                </div>
                <div className={style.lineEnd}>
                  <strong>{formatINR(line.price * line.qty)}</strong>
                  <button className={style.remove} onClick={() => dispatch(removeFromCart(line.id))} aria-label={`Remove ${line.title}`}>
                    <FiX /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={style.foot}>
            <Link href="/" className="link">
              ← Continue shopping
            </Link>
            {confirmClear ? (
              <span className={style.confirm}>
                Empty your bag?
                <button className="btn btn-sm btn-danger" onClick={() => dispatch(clearCart())}>
                  Yes, clear it
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setConfirmClear(false)}>
                  Cancel
                </button>
              </span>
            ) : (
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmClear(true)}>
                Clear bag
              </button>
            )}
          </div>
        </section>

        <OrderSummary totals={totals}>
          <button className="btn btn-accent btn-lg btn-block" onClick={checkout} disabled={hasUnavailable || !totals.totalQty}>
            Checkout <FiArrowRight />
          </button>
          <p className={style.secure}>
            <FiLock /> Secure checkout · Cash on delivery available
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}
