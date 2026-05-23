"use client";

import { useEffect, useState } from "react";

export interface AuthStatus {
  ready: boolean;
  providers: string[];
  configured: {
    google: boolean;
    linkedin: boolean;
    github: boolean;
  };
  missing: string[];
  callbacks: Record<string, string>;
  loading: boolean;
}

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>({
    ready: false,
    providers: [],
    configured: { google: false, linkedin: false, github: false },
    missing: [],
    callbacks: {},
    loading: true,
  });

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) =>
        setStatus({
          ready: data.ready,
          providers: data.providers,
          configured: data.configured,
          missing: data.missing,
          callbacks: data.callbacks,
          loading: false,
        })
      )
      .catch(() => setStatus((s) => ({ ...s, loading: false })));
  }, []);

  return status;
}
