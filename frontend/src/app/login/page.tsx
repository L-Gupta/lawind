"use client";
import { useState } from "react";
import Link from "next/link";
import { login, saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      saveAuth(data);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="rule" style={{ margin: "0 auto 2rem" }} />
        <p className="ey" style={{ textAlign: "center" }}>Welcome back</p>
        <h1 className="auth-title">Sign in to <em>LawInd</em></h1>
        <p className="auth-sub">India&apos;s legal intelligence platform</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@yourfirm.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "var(--gold2)" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
