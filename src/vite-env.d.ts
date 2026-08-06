/// <reference types="vite/client" />

interface PostHogApi {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  setPersonProperties?: (props: Record<string, unknown>) => void;
  identify?: (distinctId: string, traits?: Record<string, unknown>) => void;
  reset?: () => void;
}

interface Window {
  posthog?: PostHogApi;
  gtag?: (
    command: string,
    action?: string,
    params?: Record<string, unknown>,
  ) => void;
}
