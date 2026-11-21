import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "./",
  publicDir: "data",
  plugins: [solid(), tailwindcss()],
  build: { outDir: "site", emptyOutDir: true, target: "es2022" },
});
