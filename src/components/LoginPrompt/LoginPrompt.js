"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiX } from "react-icons/fi";
import style from "./loginPrompt.module.scss";

export function loginHref(next) {
  return `/Components/Auth/UserAuthentication${next ? `?next=${encodeURIComponent(next)}` : ""}`;
}

// Modal asking a guest to sign in before continuing to checkout.
export default function LoginPrompt({ onClose, next }) {
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={style.backdrop} onClick={onClose}>
      <div className={style.modal} role="dialog" aria-modal="true" aria-labelledby="login-prompt-title" onClick={(e) => e.stopPropagation()}>
        <button className={`icon-btn ${style.close}`} onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <div className={style.arch} aria-hidden />
        <h2 id="login-prompt-title">
          Almost <em>there</em>
        </h2>
        <p>Sign in to check out. Your bag stays just as you left it.</p>
        <div className={style.actions}>
          <Link href={loginHref(next || pathname)} className="btn btn-accent btn-lg btn-block">
            Sign in to continue
          </Link>
          <button className="btn btn-ghost btn-block" onClick={onClose}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
