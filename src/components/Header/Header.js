"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiArrowRight, FiLogOut, FiPackage, FiGrid, FiChevronDown } from "react-icons/fi";
import { cartCountSelector } from "@/app/Redux/cartSlice";
import { useProducts, useSession } from "@/app/Redux/provider";
import { CATEGORIES, GROUPS, productHref } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import style from "./header.module.scss";

const TICKER = [
  "Free delivery on every order",
  "Buy 2 or more and save 10%",
  "Up to 24% off bigger bags",
  "Cash on delivery available",
  "Easy 7-day returns",
];

// `onDark` sets the logo on a light pill so its colours stay readable on dark panels.
export function Logo({ onDark = false, size = "md" }) {
  return (
    <Link href="/" className={`${style.logo} ${style[`logo-${size}`]} ${onDark ? style.logoOnDark : ""}`} aria-label="RelaxShop home">
      <Image src="/logo.png" alt="RelaxShop" width={1520} height={540} priority sizes="160px" />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const count = useSelector(cartCountSelector);
  const { session, signOut } = useSession();

  const [openGroup, setOpenGroup] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [account, setAccount] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    setOpenGroup(null);
    setDrawer(false);
    setSearch(false);
    setAccount(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!account) return;
    const close = (e) => !accountRef.current?.contains(e.target) && setAccount(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [account]);

  useEffect(() => {
    document.body.style.overflow = drawer || search ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer, search]);

  const handleSignOut = () => {
    signOut();
    setAccount(false);
    router.push("/");
  };

  const group = GROUPS.find((g) => g.key === openGroup);

  return (
    <>
      <div className={style.ticker} aria-label="Store offers">
        <div className={style.tickerTrack}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} aria-hidden={i >= TICKER.length}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <header className={`${style.header} ${scrolled ? style.scrolled : ""}`} onMouseLeave={() => setOpenGroup(null)}>
        <div className={`container ${style.bar}`}>
          <button className={`icon-btn ${style.menuBtn}`} onClick={() => setDrawer(true)} aria-label="Open menu">
            <FiMenu />
          </button>

          <Logo />

          <nav className={style.nav} aria-label="Shop by department">
            {GROUPS.map((g) => (
              <button
                key={g.key}
                className={`${style.navLink} ${openGroup === g.key ? style.navActive : ""}`}
                onMouseEnter={() => setOpenGroup(g.key)}
                onFocus={() => setOpenGroup(g.key)}
                onClick={() => setOpenGroup(openGroup === g.key ? null : g.key)}
                aria-expanded={openGroup === g.key}
              >
                {g.label} <FiChevronDown aria-hidden />
              </button>
            ))}
          </nav>

          <div className={style.actions}>
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="Search products">
              <FiSearch />
            </button>

            {session ? (
              <div className={style.accountWrap} ref={accountRef}>
                <button className={`icon-btn ${style.avatar}`} onClick={() => setAccount((v) => !v)} aria-label="Account menu" aria-expanded={account}>
                  {(session.name || session.email || "?").charAt(0).toUpperCase()}
                </button>
                {account && (
                  <div className={style.accountMenu} role="menu">
                    <div className={style.accountHead}>
                      <strong>{session.name}</strong>
                      <span>{session.email}</span>
                    </div>
                    {session.role === "admin" ? (
                      <Link href="/AdminPage/allProducts" role="menuitem">
                        <FiGrid /> Admin dashboard
                      </Link>
                    ) : (
                      <>
                        <Link href="/Components/UserProfile" role="menuitem">
                          <FiUser /> My profile
                        </Link>
                        <Link href="/Components/Orders" role="menuitem">
                          <FiPackage /> My orders
                        </Link>
                      </>
                    )}
                    <button onClick={handleSignOut} role="menuitem">
                      <FiLogOut /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/Components/Auth/UserAuthentication" className={`icon-btn ${style.userLink}`} aria-label="Sign in">
                <FiUser />
              </Link>
            )}

            <Link href="/Components/Cart" className="icon-btn" aria-label={`Bag, ${count} items`}>
              <FiShoppingBag />
              {count > 0 && <span className={style.badge}>{count > 99 ? "99+" : count}</span>}
            </Link>
          </div>
        </div>

        {group && (
          <div className={style.mega}>
            <div className={`container ${style.megaInner}`}>
              <div className={style.megaIntro}>
                <span className="eyebrow">Shop {group.label}</span>
                <p className="display">
                  {group.key === "men" && (
                    <>
                      Easy fits for <em>unhurried</em> days.
                    </>
                  )}
                  {group.key === "women" && (
                    <>
                      From everyday tees to <em>festive</em> drapes.
                    </>
                  )}
                  {group.key === "more" && (
                    <>
                      Everything else that makes life <em>lighter</em>.
                    </>
                  )}
                </p>
              </div>
              <div className={style.megaGrid}>
                {CATEGORIES.filter((c) => c.group === group.key).map((c) => (
                  <Link key={c.key} href={c.href} className={style.megaItem}>
                    <span className={style.megaImg}>
                      <img src={c.image} alt="" />
                    </span>
                    <span>{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {drawer && <Drawer onClose={() => setDrawer(false)} session={session} onSignOut={handleSignOut} />}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}

function Drawer({ onClose, session, onSignOut }) {
  const [tab, setTab] = useState("men");
  return (
    <div className={style.drawerBackdrop} onClick={onClose}>
      <aside className={style.drawer} onClick={(e) => e.stopPropagation()} aria-label="Menu">
        <div className={style.drawerHead}>
          <Logo />
          <button className="icon-btn" onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
        </div>
        <div className={style.drawerTabs} role="tablist">
          {GROUPS.map((g) => (
            <button key={g.key} role="tab" aria-selected={tab === g.key} onClick={() => setTab(g.key)}>
              {g.label}
            </button>
          ))}
        </div>
        <ul className={style.drawerList}>
          {CATEGORIES.filter((c) => c.group === tab).map((c) => (
            <li key={c.key}>
              <Link href={c.href}>
                <img src={c.image} alt="" />
                <span>{c.label}</span>
                <FiArrowRight aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className={style.drawerFoot}>
          {session ? (
            <>
              {session.role === "admin" ? (
                <Link href="/AdminPage/allProducts" className="btn btn-ghost btn-block">
                  Admin dashboard
                </Link>
              ) : (
                <>
                  <Link href="/Components/UserProfile" className="btn btn-ghost btn-block">
                    My profile
                  </Link>
                  <Link href="/Components/Orders" className="btn btn-ghost btn-block">
                    My orders
                  </Link>
                </>
              )}
              <button className="btn btn-block" onClick={onSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/Components/Auth/UserAuthentication" className="btn btn-block">
              Sign in or create account
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

function SearchOverlay({ onClose }) {
  const { products, loading, error, refresh } = useProducts();
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) => p.title?.toLowerCase().includes(term)).slice(0, 8);
  }, [q, products]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (results[0]) router.push(productHref(results[0]._id));
  };

  return (
    <div className={style.searchBackdrop} onClick={onClose}>
      <div className={style.searchPanel} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
        <form className={`container ${style.searchForm}`} onSubmit={onSubmit}>
          <FiSearch aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tees, saris, sneakers…"
            aria-label="Search products"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <FiX />
          </button>
        </form>
        <div className={`container ${style.searchBody}`}>
          {!q.trim() && (
            <>
              <span className="eyebrow">Popular right now</span>
              <div className={style.searchChips}>
                {CATEGORIES.slice(0, 9).map((c) => (
                  <Link key={c.key} href={c.href} className="chip">
                    {c.group === "women" ? "Women's " : c.group === "men" ? "Men's " : ""}
                    {c.label}
                  </Link>
                ))}
              </div>
            </>
          )}
          {q.trim() && error && (
            <p className={style.searchEmpty}>
              Search isn&apos;t available right now ({error}).{" "}
              <button className="link" onClick={refresh}>
                Try again
              </button>
            </p>
          )}
          {q.trim() && !error && loading && <p className={style.searchEmpty}>Searching…</p>}
          {q.trim() && !error && !loading && results.length === 0 && (
            <p className={style.searchEmpty}>
              Nothing matches “{q}”. Try a simpler word, like <em>jeans</em> or <em>watch</em>.
            </p>
          )}
          {results.length > 0 && (
            <ul className={style.searchResults}>
              {results.map((p) => (
                <li key={p._id}>
                  <Link href={productHref(p._id)}>
                    <img src={p.thumbnail} alt="" />
                    <span className={style.resultTitle}>{p.title}</span>
                    <strong>{formatINR(p.price)}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
