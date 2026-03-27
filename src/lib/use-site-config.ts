"use client";

import { useState, useEffect } from "react";

type SiteConfig = Record<string, string>;

let cachedConfig: SiteConfig | null = null;

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(cachedConfig || {});
  const [loading, setLoading] = useState(!cachedConfig);

  useEffect(() => {
    if (cachedConfig) return;

    fetch("/api/site-config")
      .then((res) => res.ok ? res.json() : {})
      .then((data: SiteConfig) => {
        cachedConfig = data;
        setConfig(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
