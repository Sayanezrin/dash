const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const dist = path.join(root, "dist");
const source = path.join(root, "frontend", "preview.html");
const target = path.join(dist, "index.html");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(source, target);

console.log("Built static dashboard to dist/index.html");
