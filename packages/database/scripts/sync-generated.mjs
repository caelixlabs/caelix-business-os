// packages/database/scripts/sync-generated.mjs
import { cpSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../src/generated');
const dest = path.resolve(__dirname, '../dist/generated');

if (!existsSync(src)) {
  console.error('src/generated not found — run `npm run generate` first.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log('[database] synced generated Prisma client into dist/generated');