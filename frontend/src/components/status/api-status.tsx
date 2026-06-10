"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHealth } from "@/lib/api/health";
import { API_BASE_URL } from "@/lib/api/client";

type ConnectionState = "loading" | "connected" | "disconnected";

export function ApiStatus() {
  const [state, setState] = useState<ConnectionState>("loading");
  const [latency, setLatency] = useState<number | null>(null);

  const checkHealth = useCallback(async () => {
    setState("loading");
    const start = performance.now();

    try {
      const health = await getHealth();
      if (health.status === "healthy") {
        setLatency(Math.round(performance.now() - start));
        setState("connected");
      } else {
        setLatency(null);
        setState("disconnected");
      }
    } catch {
      setLatency(null);
      setState("disconnected");
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Status</CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={checkHealth}
            disabled={state === "loading"}
            aria-label="Retry connection"
          >
            <RefreshCw
              className={state === "loading" ? "animate-spin" : undefined}
            />
          </Button>
        </div>
        <CardDescription>
          Connection to backend at {API_BASE_URL}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {state === "connected" ? (
            <Wifi className="size-5 text-emerald-600" />
          ) : state === "disconnected" ? (
            <WifiOff className="size-5 text-destructive" />
          ) : (
            <RefreshCw className="size-5 animate-spin text-muted-foreground" />
          )}
          <div className="flex flex-col gap-1">
            {state === "connected" && (
              <Badge className="w-fit bg-emerald-600 text-white hover:bg-emerald-600">
                Connected
              </Badge>
            )}
            {state === "disconnected" && (
              <Badge variant="destructive">Disconnected</Badge>
            )}
            {state === "loading" && (
              <Badge variant="secondary">Checking...</Badge>
            )}
            {latency !== null && (
              <span className="text-xs text-muted-foreground">
                Response time: {latency}ms
              </span>
            )}
            {state === "disconnected" && (
              <span className="text-xs text-muted-foreground">
                Start the backend with start.bat or uvicorn
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
