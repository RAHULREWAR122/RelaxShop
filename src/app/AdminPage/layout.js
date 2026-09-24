"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiPlusSquare, FiPackage, FiLogOut, FiMenu, FiX, FiExternalLink } from "react-icons/fi";
import { useSession } from "@/app/Redux/provider";
import useRequireAuth from "@/components/useRequireAuth";
import { Logo } from "@/components/Header/Header";
import style from "./admin.module.scss";

const NAV = [
  { href: "/AdminPage/allProducts", label: "Products", icon: FiGrid },
  { href: "/AdminPage/AddProducts", label: "Add product", icon: FiPlusSquare },
  { href: "/AdminPage/AllOrders", label: "Orders", icon: FiPackage },
];

export default function AdminLayout({ children }) {
  const session = useRequireAuth({ role: "admin" });
  const { signOut } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  if (!session) {
    return (
      <div className="page-loader" style={{ minHeight: "100vh" }}>
        <span className="spinner" />
      </div>
    );
  }

  const current = NAV.find((n) => pathname.startsWith(n.href));

  return (
    <div className={style.shell}>
      <aside className={`${style.side} ${open ? style.sideOpen : ""}`}>
        <div className={style.brand}>
          <Logo onDark size="sm" />
          <span className={style.badge}>Admin</span>
          <button className={`icon-btn ${style.close}`} onClick={() => setOpen(false)} aria-label="Close menu">
            <FiX />
          </button>
        </div>
        <nav className={style.nav}>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
              <Icon /> {label}
            </Link>
          ))}
        </nav>
        <div className={style.sideFoot}>
          <Link href="/" target="_blank">
            <FiExternalLink /> View store
          </Link>
          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <FiLogOut /> Sign out
          </button>
        </div>
      </aside>
      {open && <div className={style.scrim} onClick={() => setOpen(false)} />}

      <div className={style.main}>
        <header className={style.top}>
          <button className={`icon-btn ${style.menu}`} onClick={() => setOpen(true)} aria-label="Open menu">
            <FiMenu />
          </button>
          <span className={style.crumb}>{current?.label || "Admin"}</span>
          <span className={style.who}>{session.email}</span>
        </header>
        <div className={style.content}>{children}</div>
      </div>
    </div>
  );
}
