import { build } from "esbuild";

await build({
  entryPoints: { main: "src/main.jsx", platform: "src/platform/main.tsx" },
  bundle: true,
  format: "iife",
  target: "es2017",
  minify: true,
  define: {
    "process.env.NODE_ENV": "\"production\""
  },
  outdir: "assets",
  entryNames: "[name]",
  loader: {
    ".js": "jsx"
  }
});
