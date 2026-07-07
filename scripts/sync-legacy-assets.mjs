/**
 * Legacy statik dosyaları apps/web/public ve styles'a kopyalar.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'apps', 'web');
const PUBLIC = path.join(WEB, 'public');
const STYLES = path.join(WEB, 'src', 'styles');

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⏭  Yok: ${path.relative(ROOT, src)}`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✅ ${path.relative(ROOT, dest)}`);
}

function copyDirIfExists(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⏭  Klasör yok: ${path.relative(ROOT, src)}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirIfExists(s, d);
    else {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
  console.log(`✅ ${path.relative(ROOT, dest)}/`);
}

fs.mkdirSync(PUBLIC, { recursive: true });
fs.mkdirSync(STYLES, { recursive: true });

const files = ['logo.png', 'favicon.png', 'qr.png', 'manifest.json', 'robots.txt', 'sitemap.xml'];
for (const f of files) {
  copyIfExists(path.join(ROOT, f), path.join(PUBLIC, f));
}

copyIfExists(path.join(ROOT, 'styles.css'), path.join(STYLES, 'legacy.css'));
copyIfExists(path.join(ROOT, 'all.json'), path.join(WEB, 'src', 'data', 'menu.json'));
copyDirIfExists(path.join(ROOT, 'pic'), path.join(PUBLIC, 'pic'));

console.log('\nLegacy asset sync tamamlandı.');
