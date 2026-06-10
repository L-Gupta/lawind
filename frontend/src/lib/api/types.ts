export interface HealthResponse {
  status: string;
}

export interface PingResponse {
  pong: boolean;
  timestamp: string;
}

export interface ApiInfoResponse {
  message: string;
  status: string;
}
