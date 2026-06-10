import { apiFetch } from "./client";
import type { ApiInfoResponse, HealthResponse, PingResponse } from "./types";

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}

export async function getApiInfo(): Promise<ApiInfoResponse> {
  return apiFetch<ApiInfoResponse>("/");
}

export async function ping(): Promise<PingResponse> {
  return apiFetch<PingResponse>("/ping");
}
