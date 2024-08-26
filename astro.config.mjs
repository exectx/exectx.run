import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solidJs()],
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: { enabled: true, configPath: "wrangler.toml" },
  }),
  vite: {
    ssr: {
      external: ["node:async_hooks"],
    },
  },
});
