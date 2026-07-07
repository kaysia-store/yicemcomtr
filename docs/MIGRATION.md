# Yi'Cem Migration — Faz 0

## Hedef
Mevcut statik menü sitesini Next.js + Supabase + Vercel altyapısına taşımak.

## Tamamlanan (Faz 0.1)
- [x] `apps/web` — Next.js 16 iskeleti
- [x] `supabase/migrations` — çok dilli menü şeması
- [x] `scripts/seed-from-all-json.mjs` — all.json → Supabase
- [x] `scripts/sync-legacy-assets.mjs` — CSS / görseller
- [x] Public menü sayfası (JSON fallback + Supabase hazır)

## Sıradaki (Faz 1)
- [ ] Ürün detay modalı + ekstralar
- [ ] 6 dil UI çevirileri (client)
- [ ] Dark/Light tema
- [ ] Sepet + WhatsApp
- [ ] PWA
- [ ] Bistro modal
- [ ] Vercel staging deploy

## Kurulum

### 1. Bağımlılıklar
```bash
npm install
cd apps/web && npm install @supabase/supabase-js
```

### 2. Legacy asset sync
```bash
npm run sync:assets
```

### 3. Supabase
1. [supabase.com](https://supabase.com) → yeni proje
2. SQL Editor → `supabase/migrations/20260707000000_initial_schema.sql` çalıştır
3. `apps/web/.env.local` oluştur:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # sadece seed için
```

### 4. Veri seed
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
```

### 5. Geliştirme
```bash
npm run dev
```
→ http://localhost:3000

Supabase yoksa site `all.json` fallback ile çalışır.

## Öncelik kuralı
Yeni istekler önce **Faz 1 taşıma kontrol listesi** ile değerlendirilir.
