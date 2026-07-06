const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8500";

export interface WaitlistRequest {
  email: string;
  full_name: string;
  firm_name?: string;
  message?: string;
}

export async function joinWaitlist(data: WaitlistRequest): Promise<void> {
  const res = await fetch(`${API_URL}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Something went wrong. Please try again.");
  }
}
