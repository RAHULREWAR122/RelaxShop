"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import { api } from "@/lib/client/api";
import { Logo } from "@/components/Header/Header";
import auth from "../Auth/auth.module.scss";
import style from "./forgot.module.scss";

// Two steps on one page: find the account by email, then choose a new password.
export default function ResetFlow() {
  const urlToken = useSearchParams().get("token");
  const [reset, setReset] = useState(urlToken ? { token: urlToken, name: "" } : null);

  return (
    <div className={`container ${style.wrap}`}>
      <div className={auth.card}>
        <div className={auth.cardLogo}>
          <Logo size="lg" />
        </div>
        {reset ? <NewPassword token={reset.token} name={reset.name} onRestart={() => setReset(null)} /> : <FindAccount onFound={setReset} />}
      </div>
    </div>
  );
}

function FindAccount({ onFound }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setBusy(true);
    const res = await api("/api/forgotPassword", { method: "POST", body: { email } });
    setBusy(false);
    if (res.success) onFound(res.result);
    else setError(res.result);
  };

  return (
    <form className={auth.form} onSubmit={submit} noValidate>
      <div className={auth.head}>
        <h1>
          Forgot your <em>password?</em>
        </h1>
        <p>Enter the email you signed up with and you can choose a new password straight away.</p>
      </div>
      <label className="field">
        <span>Email</span>
        <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>
      {error && (
        <p className={auth.error} role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-lg btn-block" disabled={busy}>
        {busy ? <span className="spinner" /> : "Continue"}
      </button>
      <Link href="/Components/Auth/UserAuthentication" className={style.back}>
        <FiArrowLeft /> Back to sign in
      </Link>
    </form>
  );
}

function NewPassword({ token, name, onRestart }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", cPassword: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.cPassword) return setError("Passwords don't match.");
    setBusy(true);
    const res = await api("/api/forgotPassword", { method: "PUT", body: { token, ...form } });
    setBusy(false);
    if (!res.success) return setError(res.result);
    toast.success("Password updated. Please sign in.");
    router.replace("/Components/Auth/UserAuthentication");
  };

  const matched = form.cPassword && form.password === form.cPassword;

  return (
    <form className={auth.form} onSubmit={submit} noValidate>
      <div className={auth.head}>
        <h1>
          Choose a <em>new</em> password
        </h1>
        <p>
          {name ? <>Hi {name.split(" ")[0]}, make</> : "Make"} it something you haven&apos;t used here before.
        </p>
      </div>
      <label className="field">
        <span>New password</span>
        <input className="input" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input className="input" type="password" autoComplete="new-password" value={form.cPassword} onChange={(e) => setForm({ ...form, cPassword: e.target.value })} placeholder="Type it again" />
        {form.cPassword && <small style={{ color: matched ? "var(--success)" : "var(--danger)" }}>{matched ? "Passwords match" : "Passwords don't match yet"}</small>}
      </label>
      {error && (
        <p className={auth.error} role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-accent btn-lg btn-block" disabled={busy}>
        {busy ? <span className="spinner" /> : "Update password"}
      </button>
      <button type="button" className={style.back} onClick={onRestart}>
        <FiArrowLeft /> Use a different email
      </button>
    </form>
  );
}
