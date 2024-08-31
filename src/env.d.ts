/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_KEY: string;
  readonly PUBLIC_POSTHOG_API_HOST: string;
  readonly PUBLIC_POSTHOG_UI_HOST: string;
  readonly PUBLIC_PARTYKIT_HOST: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
