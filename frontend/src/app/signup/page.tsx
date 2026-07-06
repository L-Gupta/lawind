"use client";
import { useState } from "react";
import Link from "next/link";
import { signup, saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await signup(email, password, fullName);
      saveAuth(data);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="rule" style={{ margin: "0 auto 2rem" }} />
        <p className="ey" style={{ textAlign: "center" }}>Get started</p>
        <h1 className="auth-title">Create your <em>LawInd</em> account</h1>
        <p className="auth-sub">Join India&apos;s legal intelligence platform</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Adv. Priya Sharma"
              required
              autoComplete="name"
            />
          </div>
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
              placeholder="Minimum 8 characters"
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--gold2)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
