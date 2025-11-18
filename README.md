# 🍕 Yi'Cem Restoran - Antalya

Modern, responsive ve kullanıcı dostu restoran menü sitesi. Taze malzemelerle hazırlanan özel tariflerinizi müşterilerinizle buluşturun.

## 🌟 Özellikler

### 🎨 Modern Tasarım
- **Dark/Light Tema** - Kullanıcı tercihine göre tema değiştirme
- **Responsive Design** - Tüm cihazlarda mükemmel görünüm
- **Mobile-First** - Mobil cihazlar için optimize edilmiş
- **Modern UI/UX** - Kullanıcı dostu arayüz

### 🌍 Çoklu Dil Desteği
- **6 Dil** - Türkçe, İngilizce, Rusça, Almanca, Fransızca, Arapça
- **RTL Desteği** - Arapça için sağdan sola yazım
- **localStorage** - Dil tercihi kayıt sistemi
- **Otomatik Çeviri** - Tüm içerikler çevrilmiş

### 📱 PWA (Progressive Web App)
- **Offline Çalışma** - İnternet olmadan da menü görüntüleme
- **Ana Ekrana Ekleme** - Mobil cihazlarda uygulama gibi kullanım
- **Hızlı Yükleme** - Cache sistemi ile optimize edilmiş performans
- **Install Prompt** - "Download" butonu ile kolay kurulum

### 🍽️ Restoran Özellikleri
- **13 Kategori** - Pizza, Ayvalık Tostu, Döner, Hamburger, Salata ve daha fazlası
- **Ürün Detayları** - Resim, açıklama, fiyat, içerikler
- **Sepet Sistemi** - WhatsApp entegrasyonu ile sipariş
- **QR Kod** - Hızlı erişim için QR kod

### ⚡ Teknik Özellikler
- **Vanilla JavaScript** - Framework bağımlılığı yok
- **Modern CSS** - Grid, Flexbox, CSS Variables
- **Service Worker** - Offline çalışma desteği
- **SEO Optimized** - Arama motoru dostu

## 🚀 Kurulum

### Gereksinimler
- Modern web tarayıcısı
- HTTP sunucusu (yerel geliştirme için)

### Yerel Geliştirme
```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx http-server -p 8000 --cors

# PHP ile
php -S localhost:8000
```

### GitHub Pages ile Deploy
1. Repository'yi GitHub'a yükleyin
2. Settings > Pages > Source: Deploy from a branch
3. Branch: main, Folder: / (root)
4. Save

## 📁 Proje Yapısı

```
yicemcafe/
├── index.html              # Ana sayfa
├── styles.css              # Stil dosyası
├── script.js               # JavaScript
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── robots.txt              # SEO robots
├── sitemap.xml             # SEO sitemap
├── images/                 # Resim klasörü
│   ├── icon-192.svg        # PWA icon (192x192)
│   ├── icon-512.svg        # PWA icon (512x512)
│   └── pizzaqr.png         # QR kod
└── JSON dosyaları          # Menü verileri
    ├── pizza.json
    ├── manti.json
    ├── kofte.json
    └── ...
```

## 🛠️ Özelleştirme

### Menü Güncelleme
JSON dosyalarını düzenleyerek menüyü güncelleyebilirsiniz:
- `pizza.json` - Pizza menüsü
- `manti.json` - Mantı menüsü
- `kofte.json` - Köfte menüsü
- Ve diğer kategori dosyaları...

### Tema Değiştirme
`styles.css` dosyasındaki CSS değişkenlerini düzenleyerek renkleri değiştirebilirsiniz:

```css
:root {
    --color-primary: #e53935;    /* Ana renk */
    --color-secondary: #2c3e50;  /* İkincil renk */
    --color-accent: #f39c12;     /* Vurgu rengi */
}
```

### Dil Ekleme
`script.js` dosyasındaki `getTranslations()` fonksiyonuna yeni dil ekleyebilirsiniz.

## 📞 İletişim

**Yi'Cem Restoran**
- 📍 **Adres:** Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA
- 📞 **Telefon:** +90 242 323 1177
- 📱 **WhatsApp:** +90 541 242 9007
- 📧 **E-posta:** info@yicem.com
- 🕒 **Çalışma Saatleri:** Pazartesi - Cumartesi: 09:00 - 20:30

## 🌐 Canlı Site

[🌍 yicem.com.tr](https://yicem.com.tr)

## 📄 Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.

---

**Powered by [Kaysia.co](https://kaysia.co)** 🚀