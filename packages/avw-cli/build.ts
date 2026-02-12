const result = await Bun.build({
  entrypoints: ["./src/cli.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  minify: true,
  loader: { ".md": "text" },
  banner: "#!/usr/bin/env node",
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(`Built ${result.outputs.length} file(s) to dist/`);
