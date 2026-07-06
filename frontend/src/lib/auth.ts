const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8500";

export interface UserOut {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  is_verified: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export async function signup(email: string, password: string, full_name: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem("lawind_token", data.access_token);
  localStorage.setItem("lawind_user", JSON.stringify(data.user));
}

export function getUser(): UserOut | null {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("lawind_user");
  return u ? JSON.parse(u) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lawind_token");
}

export function logout() {
  localStorage.removeItem("lawind_token");
  localStorage.removeItem("lawind_user");
  window.location.href = "/login";
}

export const PLAN_FEATURES: Record<string, string[]> = {
  free: ["5 queries/month", "Basic case law search"],
  student: ["50 queries/month", "Full case law access", "Moot court prep mode"],
  individual: ["Unlimited research", "AI drafting studio", "Basic matter management"],
  firm: ["Full platform", "Contract intelligence", "Matter management", "Priority support"],
  enterprise: ["Contract review at scale", "Custom corpus training", "DPDPA compliance", "Dedicated account manager"],
};
