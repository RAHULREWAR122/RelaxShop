import { formatINR, nextTier } from "@/lib/pricing";
import style from "./orderSummary.module.scss";

// Totals panel shared by the bag and checkout.
export default function OrderSummary({ totals, children, title = "Order summary", lines }) {
  const upcoming = nextTier(totals.totalQty);
  const toGo = upcoming ? upcoming.min - totals.totalQty : 0;
  const progress = upcoming ? Math.min(100, (totals.totalQty / upcoming.min) * 100) : 100;

  return (
    <aside className={style.summary}>
      <h2>{title}</h2>

      {lines && (
        <ul className={style.lines}>
          {lines.map((l) => (
            <li key={l.id}>
              <span className={style.thumb}>
                <img src={l.thumbnail} alt="" />
                <em>{l.qty}</em>
              </span>
              <span className={style.lineTitle}>{l.title}</span>
              <span>{formatINR(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={style.meter}>
        <div className={style.meterText}>
          {upcoming ? (
            <>
              Add <strong>{toGo}</strong> more {toGo === 1 ? "item" : "items"} to save <strong>{Math.round(upcoming.rate * 100)}%</strong>
            </>
          ) : (
            <>
              You&apos;ve unlocked our <strong>best price</strong>
            </>
          )}
        </div>
        <div className={style.meterTrack}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <dl className={style.rows}>
        <div>
          <dt>Subtotal ({totals.totalQty} {totals.totalQty === 1 ? "item" : "items"})</dt>
          <dd>{formatINR(totals.subtotal)}</dd>
        </div>
        <div className={style.save}>
          <dt>Bulk discount {totals.rate > 0 && `(${Math.round(totals.rate * 100)}%)`}</dt>
          <dd>{totals.discount > 0 ? `− ${formatINR(totals.discount)}` : formatINR(0)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd className={style.free}>Free</dd>
        </div>
        <div className={style.total}>
          <dt>Total</dt>
          <dd>{formatINR(totals.total)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}
