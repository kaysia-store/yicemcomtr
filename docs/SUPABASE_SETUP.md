# Supabase Kurulum — 5 Adım

## 1. Migration çalıştır
Supabase Dashboard → **SQL Editor** → New query

Sırayla şu dosyaların **tüm içeriğini** yapıştır → **Run**:

1. `supabase/migrations/20260707000000_initial_schema.sql`
2. `supabase/migrations/20260707100000_admin_price_policies.sql`
3. `supabase/migrations/20260707120000_admin_full_menu_policies.sql`
4. `supabase/migrations/20260707140000_audit_log_and_category_insert.sql`

Başarılıysa Table Editor'da şu tablolar görünür:
- languages, categories, products, product_modifiers, audit_log, …

## 2. Ortam değişkenleri
`apps/web/.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
```

Supabase → **Project Settings** → **API**:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**DeepL (otomatik çeviri):** [DeepL API](https://www.deepl.com/pro-api) → Free plan → API anahtarı al → `DEEPL_API_KEY`  
Free anahtarlar `:fx` ile biter ve `api-free.deepl.com` kullanır. Vercel'de de aynı değişkeni **Environment Variables** bölümüne ekleyin.

## 3. Veri yükle (seed)
Proje kökünde PowerShell:

```powershell
$env:SUPABASE_URL="https://XXXX.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ... service_role key ..."
npm run seed
```

> `service_role` key **gizli** tutulmalı; sadece seed için kullanılır, siteye eklenmez.

## 4. Siteyi çalıştır
```bash
npm run dev
```
→ http://localhost:3000

Footer'da **Veri kaynağı: Supabase** yazıyorsa bağlantı tamamdır.

## 5. Kontrol
- [ ] 13 kategori görünüyor
- [ ] Ürünler ve fiyatlar doğru
- [ ] Görseller yükleniyor
- [ ] Footer'da **Veri kaynağı: Supabase** yazıyor
- [ ] Admin panelden yapılan değişiklikler ana sayfada görünüyor (sayfayı yenileyin)

---

## Canlı menü senkronu

Ana sayfa (`/`) artık **Supabase'den anlık** okunur. Admin panelde kategori, ürün, fiyat, görsel veya açıklama kaydettiğinizde canlı menü güncellenir.

- `.env.local` içinde Supabase URL ve anon key **zorunlu** (yoksa site eski `menu.json` yedeğine düşer)
- İlk kurulumda bir kez `npm run seed` ile veriyi yükleyin; sonrasında tüm düzenlemeler admin panelden yapılır
- Değişiklik görünmüyorsa: sayfayı yenileyin (PWA/service worker güncellendi)

---

## Sorun giderme

| Sorun | Çözüm |
|---|---|
| Footer'da `all.json` yazıyor | `.env.local` eksik veya yanlış; dev sunucusunu yeniden başlat |
| Seed hata veriyor | Önce migration çalıştırıldı mı kontrol et |
| Boş menü | `npm run seed` tekrar çalıştır |
