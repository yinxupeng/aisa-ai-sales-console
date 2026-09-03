import { build } from "esbuild";

await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  format: "iife",
  target: "es2017",
  minify: true,
  define: {
    "process.env.NODE_ENV": "\"production\""
  },
  outdir: "assets",
  entryNames: "main",
  loader: {
    ".js": "jsx"
  }
});
