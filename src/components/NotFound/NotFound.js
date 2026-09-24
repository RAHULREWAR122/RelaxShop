import Link from "next/link";
import style from "./notFound.module.scss";

export default function NotFound() {
  return (
    <div className={`container ${style.wrap}`}>
      <div className={style.numerals} aria-hidden>
        <span>4</span>
        <span className={style.zero} />
        <span>4</span>
      </div>
      <h1>
        This page took a <em>day off</em>.
      </h1>
      <p>The link may be broken, or the page may have moved. Let&apos;s get you back to something good.</p>
      <div className={style.actions}>
        <Link href="/" className="btn btn-lg">
          Back to home
        </Link>
        <Link href="/Components/Cart" className="btn btn-ghost btn-lg">
          View your bag
        </Link>
      </div>
    </div>
  );
}
