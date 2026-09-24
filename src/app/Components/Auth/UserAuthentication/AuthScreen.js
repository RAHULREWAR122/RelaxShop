"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { useSession } from "@/app/Redux/provider";
import { Logo } from "@/components/Header/Header";
import style from "../auth.module.scss";

// Only allow redirects back into this site.
function safeNext(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default function AuthScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const { session, ready, signIn } = useSession();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const next = safeNext(params.get("next"));

  useEffect(() => {
    if (ready && session) router.replace(session.role === "admin" ? "/AdminPage/allProducts" : next);
  }, [ready, session, router, next]);

  const onSignedIn = ({ token, myUser, role }) => {
    signIn(token, myUser);
    toast.success(role === "admin" ? "Welcome back, admin" : `Welcome, ${myUser.name?.split(" ")[0] || "friend"}`);
    router.replace(role === "admin" ? "/AdminPage/allProducts" : next);
  };

  return (
    <div className={style.screen}>
      <aside className={style.visual}>
        <div className={style.visualArch}>
          <Image src="/shopHeroImgs/2.jpg" alt="" fill sizes="(max-width: 900px) 0px, 40vw" style={{ objectFit: "cover", objectPosition: "72% 40%" }} priority />
        </div>
        <blockquote>
          “Shopping should feel like a <em>deep breath</em>, not a sprint.”
        </blockquote>
        <p>Save your details once, check out in seconds and follow every order from bag to doorstep.</p>
      </aside>

      <section className={style.panel}>
        <div className={style.card}>
          <div className={style.cardLogo}>
            <Logo size="lg" />
          </div>
          <div className={style.tabs} role="tablist">
            <button role="tab" aria-selected={mode === "login"} onClick={() => setMode("login")}>
              Sign in
            </button>
            <button role="tab" aria-selected={mode === "register"} onClick={() => setMode("register")}>
              Create account
            </button>
            <span className={style.tabPill} data-mode={mode} aria-hidden />
          </div>

          {mode === "login" ? <LoginForm onSignedIn={onSignedIn} /> : <RegisterForm onRegistered={onSignedIn} switchToLogin={() => setMode("login")} />}
        </div>
      </section>
    </div>
  );
}

function PasswordInput({ id, value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className={style.passWrap}>
      <input
        id={id}
        className="input"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
      />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

function LoginForm({ onSignedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Please enter your email and password.");
    setBusy(true);
    const res = await api("/api/Login", { method: "POST", body: form });
    setBusy(false);
    if (res.success) onSignedIn(res.result);
    else setError(res.result);
  };

  return (
    <form className={style.form} onSubmit={submit} noValidate>
      <div className={style.head}>
        <h1>
          Welcome <em>back</em>
        </h1>
        <p>Sign in to your RelaxShop account.</p>
      </div>
      <label className="field">
        <span>Email</span>
        <input
          className="input"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />
      </label>
      <div className="field">
        <div className={style.labelRow}>
          <label htmlFor="login-pass">Password</label>
          <Link href="/Components/forgotPassword" className="link">
            Forgot password?
          </Link>
        </div>
        <PasswordInput id="login-pass" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" placeholder="Your password" />
      </div>
      {error && (
        <p className={style.error} role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-lg btn-block" disabled={busy}>
        {busy ? <span className="spinner" /> : <>Sign in <FiArrowRight /></>}
      </button>
    </form>
  );
}

function RegisterForm({ onRegistered, switchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");

    setBusy(true);
    const res = await api("/api/User", { method: "POST", body: { name: form.name, email: form.email, password: form.password } });
    if (!res.success) {
      setBusy(false);
      return setError(res.result);
    }
    // Sign straight in after creating the account.
    const login = await api("/api/Login", { method: "POST", body: { email: form.email, password: form.password } });
    setBusy(false);
    if (login.success) onRegistered(login.result);
    else {
      toast.success("Account created. Please sign in.");
      switchToLogin();
    }
  };

  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(form.password)).length);

  return (
    <form className={style.form} onSubmit={submit} noValidate>
      <div className={style.head}>
        <h1>
          Join <em>RelaxShop</em>
        </h1>
        <p>It takes less than a minute.</p>
      </div>
      <label className="field">
        <span>Full name</span>
        <input className="input" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input className="input" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
      </label>
      <div className="field">
        <label htmlFor="reg-pass">Password</label>
        <PasswordInput id="reg-pass" value={form.password} onChange={set("password")} autoComplete="new-password" placeholder="At least 6 characters" />
        {form.password && (
          <div className={style.strength} data-level={strength} aria-label={`Password strength ${strength} of 4`}>
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <div className="field">
        <label htmlFor="reg-confirm">Confirm password</label>
        <PasswordInput id="reg-confirm" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" placeholder="Type it again" />
      </div>
      {error && (
        <p className={style.error} role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-accent btn-lg btn-block" disabled={busy}>
        {busy ? <span className="spinner" /> : "Create account"}
      </button>
    </form>
  );
}
