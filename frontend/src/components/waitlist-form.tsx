"use client";
import { useState } from "react";
import { joinWaitlist } from "@/lib/waitlist";

export function WaitlistForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [firmName, setFirmName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinWaitlist({ email, full_name: fullName, firm_name: firmName || undefined });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="waitlist-success">
        You&apos;re on the list. We&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="waitlist-form">
      {error && <div className="waitlist-error">{error}</div>}
      <div className="waitlist-fields">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
          placeholder="Firm / organization (optional)"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Joining..." : "Join the waitlist"}
      </button>
    </form>
  );
}
