import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiTruck, FiRefreshCw, FiShield, FiPercent } from "react-icons/fi";
import { CATEGORIES, GROUPS } from "@/lib/catalog";
import { Logo } from "../Header/Header";
import style from "./footer.module.scss";

const PROMISES = [
  { icon: FiTruck, title: "Free delivery", text: "On every order, anywhere in India." },
  { icon: FiPercent, title: "Bulk savings", text: "Up to 24% off bigger bags." },
  { icon: FiRefreshCw, title: "Easy returns", text: "Changed your mind? 7 days to return." },
  { icon: FiShield, title: "Secure checkout", text: "Cash on delivery or online." },
];

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={`container ${style.promises}`}>
        {PROMISES.map(({ icon: Icon, title, text }) => (
          <div key={title} className={style.promise}>
            <span className={style.promiseIcon}>
              <Icon />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={style.main}>
        <div className={`container ${style.grid}`}>
          <div className={style.brand}>
            <Logo onDark />
            <p>
              Affordable fashion, gadgets and home finds, picked to make shopping feel <em>calm</em> again.
            </p>
            <div className={style.social}>
              <a href="https://github.com/RAHULREWAR122" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/rahul-rewar-202517276/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {GROUPS.map((g) => (
            <div key={g.key} className={style.col}>
              <h4>{g.label}</h4>
              <ul>
                {CATEGORIES.filter((c) => c.group === g.key).map((c) => (
                  <li key={c.key}>
                    <Link href={c.href}>{c.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={style.col}>
            <h4>Account</h4>
            <ul>
              <li>
                <Link href="/Components/Auth/UserAuthentication">Sign in</Link>
              </li>
              <li>
                <Link href="/Components/Orders">Track orders</Link>
              </li>
              <li>
                <Link href="/Components/Cart">Your bag</Link>
              </li>
              <li>
                <Link href="/Components/UserProfile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={`container ${style.bottom}`}>
          <span>© {new Date().getFullYear()} RelaxShop. All rights reserved.</span>
          <span className={style.word} aria-hidden>
            relax.
          </span>
        </div>
      </div>
    </footer>
  );
}
