"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi";
import { useProducts, useSession } from "./Redux/provider";
import { CATEGORIES } from "@/lib/catalog";
import { DISCOUNT_TIERS } from "@/lib/pricing";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard/ProductCard";
import { loginHref } from "@/components/LoginPrompt/LoginPrompt";
import style from "./home.module.scss";

const HERO_SLIDES = [
  { src: "/shopHeroImgs/1.jpg", pos: "70% 30%", alt: "Woman in a pink blazer holding shopping bags" },
  { src: "/shopHeroImgs/2.jpg", pos: "72% 40%", alt: "Woman in a pastel suit taking a selfie with shopping bags" },
];

const TIER_LABELS = DISCOUNT_TIERS.map((t) => ({
  items: t.max === Infinity ? `${t.min}+ items` : `${t.min}–${t.max} items`,
  off: `${Math.round(t.rate * 100)}%`,
}));

function useShuffled(list, count) {
  const [order, setOrder] = useState(null);
  useEffect(() => {
    if (!list.length) return;
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setOrder(copy.slice(0, count));
  }, [list, count]);
  return order || list.slice(0, count);
}

export default function Home() {
  const { products, loading } = useProducts();
  const trending = useShuffled(products, 8);
  const offers = useMemo(() => [...products].sort((a, b) => a.price - b.price).slice(0, 12), [products]);
  // Product sections only render while loading (as skeletons) or when there is something to show.
  const showProducts = loading || products.length > 0;

  return (
    <>
      <Hero />
      <Departments />
      {showProducts && (
        <section className={style.block}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Top offers</span>
                <h2>
                  Low prices, <em>no</em> compromise
                </h2>
              </div>
            </div>
            <Rail products={offers} loading={loading} />
          </div>
        </section>
      )}
      <SavingsBand />
      {showProducts && (
        <section className={style.block}>
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Trending this season</span>
                <h2>
                  What everyone&apos;s <em>loving</em>
                </h2>
              </div>
            </div>
            <div className={style.grid}>
              {loading
                ? Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)
                : trending.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}
      <Editorial />
      <GuestNudge />
    </>
  );
}

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className={`container ${style.hero}`}>
      <div className={`${style.heroText} reveal`}>
        <span className="eyebrow">The unhurried store</span>
        <h1>
          Dress easy.
          <br />
          Live <em>relaxed.</em>
        </h1>
        <p>
          Everyday clothing, festive wear, gadgets and home pieces at honest prices, delivered free. The more you add, the more you save.
        </p>
        <div className={style.heroCtas}>
          <Link href="/Components/AllPages/Women/t_Shirts" className="btn btn-accent btn-lg">
            Shop women <FiArrowRight />
          </Link>
          <Link href="/Components/AllPages/Men/t_Shirts" className="btn btn-ghost btn-lg">
            Shop men
          </Link>
        </div>
        <dl className={style.heroStats}>
          <div>
            <dt>13</dt>
            <dd>departments</dd>
          </div>
          <div>
            <dt>₹0</dt>
            <dd>delivery fee</dd>
          </div>
          <div>
            <dt>24%</dt>
            <dd>max bulk saving</dd>
          </div>
        </dl>
      </div>

      <div className={style.heroArt}>
        <div className={style.heroArch}>
          {HERO_SLIDES.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 90vw, 520px"
              style={{ objectFit: "cover", objectPosition: s.pos, opacity: i === slide ? 1 : 0 }}
              className={style.heroImg}
            />
          ))}
        </div>
        <div className={style.heroSmall}>
          <Image src="/shopHeroImgs/7.jpg" alt="A cosy sofa" fill sizes="220px" style={{ objectFit: "cover" }} />
        </div>
        <div className={style.stamp} aria-hidden>
          <svg viewBox="0 0 120 120">
            <defs>
              <path id="stampCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text>
              <textPath href="#stampCircle">free delivery · easy returns · free delivery ·</textPath>
            </text>
          </svg>
          <span>✦</span>
        </div>
        <div className={style.dots} role="tablist" aria-label="Hero images">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.src} role="tab" aria-selected={i === slide} aria-label={`Image ${i + 1}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Departments() {
  return (
    <section className={style.departments}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop by department</span>
            <h2>
              Find your <em>thing</em>
            </h2>
          </div>
        </div>
      </div>
      {/* Endless marquee: the list is rendered twice and the track slides by half its width.
          Hovering or focusing it pauses the motion. */}
      <div className={style.marquee}>
        <div className={style.marqueeTrack}>
          {[0, 1].map((copy) =>
            CATEGORIES.map((c) => (
              <Link
                key={`${copy}-${c.key}`}
                href={c.href}
                className={style.dept}
                aria-hidden={copy === 1 || undefined}
                tabIndex={copy === 1 ? -1 : undefined}
              >
                <span className={style.deptImg}>
                  <img src={c.image} alt="" />
                </span>
                <span className={style.deptLabel}>
                  {c.group === "men" ? "Men's " : c.group === "women" ? "Women's " : ""}
                  {c.label}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Rail({ products, loading }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className={style.railWrap}>
      <div className={style.rail} ref={ref}>
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={style.railItem}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div key={p._id} className={style.railItem}>
                <ProductCard product={p} />
              </div>
            ))}
      </div>
      <div className={style.railNav}>
        <button className="icon-btn" onClick={() => scroll(-1)} aria-label="Scroll back">
          <FiArrowLeft />
        </button>
        <button className="icon-btn" onClick={() => scroll(1)} aria-label="Scroll forward">
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

function SavingsBand() {
  return (
    <section className={style.savings}>
      <div className={`container ${style.savingsInner}`}>
        <div className={style.savingsText}>
          <span className="eyebrow">Bulk savings</span>
          <h2>
            The more you add,
            <br />
            the <em>less</em> you pay.
          </h2>
          <p>Discounts apply automatically in your bag. No codes, no fine print.</p>
          <Link href="/Components/Cart" className="btn btn-light btn-lg">
            Open your bag <FiArrowRight />
          </Link>
        </div>
        <ol className={style.tiers}>
          {TIER_LABELS.map((t, i) => (
            <li key={t.items} style={{ "--h": `${40 + i * 20}%` }}>
              <span className={style.tierBar}>
                <strong>{t.off}</strong>
                <small>off</small>
              </span>
              <span className={style.tierLabel}>{t.items}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className={style.block}>
      <div className={`container ${style.editorial}`}>
        <Link href="/Components/AllPages/Women/Sari" className={`${style.story} ${style.storyTall}`}>
          <Image src="/shopHeroImgs/1.jpg" alt="" fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "70% 30%" }} />
          <div className={style.storyText}>
            <span>Women</span>
            <h3>
              Festive drapes &amp; <em>everyday</em> ease
            </h3>
            <span className={style.storyCta}>
              Explore saris &amp; lehengas <FiArrowRight />
            </span>
          </div>
        </Link>
        <Link href="/Components/AllPages/Furniture" className={style.story}>
          <Image src="/shopHeroImgs/7.jpg" alt="" fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          <div className={style.storyText}>
            <span>Home</span>
            <h3>
              Make room to <em>unwind</em>
            </h3>
            <span className={style.storyCta}>
              Shop furniture <FiArrowRight />
            </span>
          </div>
        </Link>
        <Link href="/Components/AllPages/Electric" className={`${style.story} ${style.storyPlain}`}>
          <div className={style.storyText}>
            <span>Electronics</span>
            <h3>
              Smart gadgets, <em>sensible</em> prices
            </h3>
            <span className={style.storyCta}>
              Browse electronics <FiArrowRight />
            </span>
          </div>
          <img src="/navImgs/watch.webp" alt="" className={style.storyObject} />
        </Link>
      </div>
    </section>
  );
}

// A gentle, once-per-session invitation for guests to sign in.
function GuestNudge() {
  const { session, ready } = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready || session) return;
    try {
      if (sessionStorage.getItem("relax:nudged")) return;
    } catch {}
    const t = setTimeout(() => {
      setShow(true);
      try {
        sessionStorage.setItem("relax:nudged", "1");
      } catch {}
    }, 9000);
    return () => clearTimeout(t);
  }, [ready, session]);

  if (!show || session) return null;
  return (
    <aside className={style.nudge} role="status">
      <button className="icon-btn" onClick={() => setShow(false)} aria-label="Dismiss">
        <FiX />
      </button>
      <strong>Welcome to RelaxShop</strong>
      <p>Sign in to save your details, check out faster and track your orders.</p>
      <Link href={loginHref("/")} className="btn btn-sm btn-accent">
        Sign in or join
      </Link>
    </aside>
  );
}
