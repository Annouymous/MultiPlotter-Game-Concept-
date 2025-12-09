"use client";

import { useState, useEffect, useCallback } from "react";

export type ConnectionStatus = "online" | "offline" | "reconnecting" | "unstable";

interface ConnectionStatusHook {
  status: ConnectionStatus;
  isOnline: boolean;
  isOffline: boolean;
  isReconnecting: boolean;
  latency: number | null;
  reconnectAttempts: number;
  manualReconnect: () => void;
}

export const useConnectionStatus = (): ConnectionStatusHook => {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const [latency, setLatency] = useState<number | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Check connection latency
  const checkLatency = useCallback(async () => {
    const start = Date.now();
    try {
      await fetch("/api/ping", {
        method: "HEAD",
        cache: "no-cache",
      });
      const ping = Date.now() - start;
      setLatency(ping);

      // Determine connection quality
      if (ping > 1000) {
        setStatus("unstable");
      } else if (status === "reconnecting") {
        setStatus("online");
        setReconnectAttempts(0);
      }
    } catch (error) {
      setLatency(null);
      setStatus("offline");
    }
  }, [status]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      setReconnectAttempts(0);
      checkLatency();
    };

    const handleOffline = () => {
      setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setStatus("offline");
    } else {
      checkLatency();
    }

    // Periodic latency check
    const interval = setInterval(checkLatency, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkLatency]);

  // Auto-reconnect logic
  useEffect(() => {
    if (status === "offline") {
      setStatus("reconnecting");
      const timeout = setTimeout(() => {
        setReconnectAttempts((prev) => prev + 1);
        checkLatency();
      }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)); // Exponential backoff, max 30s

      return () => clearTimeout(timeout);
    }
  }, [status, reconnectAttempts, checkLatency]);

  const manualReconnect = useCallback(() => {
    setStatus("reconnecting");
    setReconnectAttempts(0);
    checkLatency();
  }, [checkLatency]);

  return {
    status,
    isOnline: status === "online",
    isOffline: status === "offline",
    isReconnecting: status === "reconnecting",
    latency,
    reconnectAttempts,
    manualReconnect,
  };
};