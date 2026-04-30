import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

function resolveBase() {
  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";

  if (!repository || repository.endsWith(".github.io")) {
    return "/";
  }

  return `/${repository}/`;
}

export default defineConfig({
  base: resolveBase(),
  plugins: [vue()],
  server: {
    host: "127.0.0.1",
    watch: {
      usePolling: true,
    },
  },
});
