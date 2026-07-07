/**
 * all.json → Supabase seed
 * Kullanım: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-from-all-json.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ALL_JSON = path.join(ROOT, 'all.json');

const LANGS = ['tr', 'en', 'ru', 'de', 'fr', 'ar'];

const CAT_MAP = {
  pizza: 'pizzalar',
  toast: 'ayvalik-tostu',
  sandwich: 'soguk-sandvic',
  'chicken-doner': 'tavuk-doner',
  'beef-doner': 'et-doner',
  pasta: 'makarnalar',
  manti: 'manti',
  hamburger: 'hamburger',
  kofte: 'kofte-spesiyel',
  aperatifler: 'aperatifler',
  bistro: 'bistro',
  salad: 'salata',
  drinks: 'icecekler',
};

const EXTRA_TYPES = [
  'mainProducts',
  'sideProducts',
  'menuOptions',
  'potatoOptions',
  'drinkOptions',
];

function pickLocalized(obj, lang) {
  if (!obj || typeof obj !== 'object') return '';
  return obj[lang] ?? obj.tr ?? obj.en ?? '';
}

function pickLocalizedArray(obj, lang) {
  if (!obj || typeof obj !== 'object') return [];
  const val = obj[lang] ?? obj.tr ?? [];
  return Array.isArray(val) ? val : [];
}

function normalizeImage(url) {
  if (!url) return null;
  return url.replace(/^\.\//, '/');
}

function dedupeBy(rows, keyFn) {
  const map = new Map();
  for (const row of rows) map.set(keyFn(row), row);
  return [...map.values()];
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(ALL_JSON, 'utf8'));
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let catOrder = 0;
  const categories = [];
  const categoryTranslations = [];
  const products = [];
  const productTranslations = [];
  const modifiers = [];
  const modifierTranslations = [];

  for (const category of raw.categories ?? []) {
    const slug = CAT_MAP[category.id] ?? category.id;
    categories.push({
      id: category.id,
      slug,
      sort_order: catOrder++,
      is_visible: true,
    });

    for (const lang of LANGS) {
      categoryTranslations.push({
        category_id: category.id,
        lang,
        name: pickLocalized(category.name, lang) || category.id,
      });
    }

    let productOrder = 0;
    for (const product of category.products ?? []) {
      products.push({
        id: product.id,
        category_id: category.id,
        price: product.price ?? 0,
        image_url: normalizeImage(product.image),
        sort_order: productOrder++,
        is_active: true,
      });

      for (const lang of LANGS) {
        productTranslations.push({
          product_id: product.id,
          lang,
          name: pickLocalized(product.name, lang) || product.id,
          description: pickLocalized(product.description, lang),
          contents: pickLocalizedArray(product.contents, lang),
        });
      }

      let modOrder = 0;
      for (const opt of product.options ?? []) {
        modifiers.push({
          product_id: product.id,
          modifier_id: opt.id,
          modifier_type: 'option',
          price: opt.price ?? 0,
          sort_order: modOrder++,
          is_active: true,
        });
        for (const lang of LANGS) {
          modifierTranslations.push({
            product_id: product.id,
            modifier_id: opt.id,
            lang,
            label: pickLocalized(opt.label, lang) || opt.id,
          });
        }
      }

      const extras = product.extras ?? {};
      for (const extraType of EXTRA_TYPES) {
        const list = extras[extraType];
        if (!Array.isArray(list)) continue;
        const dbType = extraType === 'mainProducts' ? 'mainProduct'
          : extraType === 'sideProducts' ? 'sideProduct'
          : extraType === 'menuOptions' ? 'menuOption'
          : extraType === 'potatoOptions' ? 'potatoOption'
          : 'drinkOption';

        for (const ex of list) {
          modifiers.push({
            product_id: product.id,
            modifier_id: ex.id,
            modifier_type: dbType,
            price: ex.price ?? 0,
            sort_order: modOrder++,
            is_active: true,
          });
          for (const lang of LANGS) {
            modifierTranslations.push({
              product_id: product.id,
              modifier_id: ex.id,
              lang,
              label: pickLocalized(ex.label ?? ex.name, lang) || ex.id,
            });
          }
        }
      }
    }
  }

  const upserts = [
    { table: 'categories', rows: categories, onConflict: 'id' },
    { table: 'category_translations', rows: categoryTranslations, onConflict: 'category_id,lang' },
    { table: 'products', rows: dedupeBy(products, (row) => row.id), onConflict: 'id' },
    { table: 'product_translations', rows: dedupeBy(productTranslations, (row) => `${row.product_id}::${row.lang}`), onConflict: 'product_id,lang' },
    { table: 'product_modifiers', rows: dedupeBy(modifiers, (row) => `${row.product_id}::${row.modifier_id}`), onConflict: 'product_id,modifier_id' },
    { table: 'product_modifier_translations', rows: dedupeBy(modifierTranslations, (row) => `${row.product_id}::${row.modifier_id}::${row.lang}`), onConflict: 'product_id,modifier_id,lang' },
  ];

  for (const { table, rows, onConflict } of upserts) {
    if (!rows.length) continue;
    const { error } = await supabase.from(table).upsert(rows, { onConflict });
    if (error) {
      console.error(`❌ ${table}:`, error.message);
      process.exit(1);
    }
    console.log(`✅ ${table}: ${rows.length} kayıt`);
  }

  await supabase.from('site_settings').upsert({
    key: 'restaurant',
    value: raw.restaurant ?? {},
  });

  console.log('\n🎉 Seed tamamlandı.');
  console.log(`   ${categories.length} kategori, ${products.length} ürün, ${modifiers.length} ekstra/seçenek`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
