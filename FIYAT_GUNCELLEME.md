# Fiyat Güncelleme Kılavuzu

## 📋 Nasıl Kullanılır?

### 1. İlk Kurulum (Sadece bir kez)
```bash
node generate_txt.js
```
Bu komut `all.json`'dan `ana.txt` ve `ekstra.txt` dosyalarını oluşturur.

### 2. Fiyatları Değiştirme

#### Ana Ürün Fiyatları (`ana.txt`)
`ana.txt` dosyasını açın ve fiyatları değiştirin:

```
p1 | Margarita Yicem | 220
p2 | Mix Yicem | 290
```

Sadece son sayıyı (fiyatı) değiştirin:
```
p1 | Margarita Yicem | 250  ← 220'den 250'ye değiştirdim
```

#### Ekstra Fiyatlar (`ekstra.txt`)
`ekstra.txt` dosyasını açın ve ekstra fiyatları değiştirin:

```
p1 | option | o1 | Small (1 Kişilik) | 0
p1 | option | o2 | Medium (1-2 Kişilik) | 70
```

Sadece son sayıyı (fiyatı) değiştirin:
```
p1 | option | o2 | Medium (1-2 Kişilik) | 80  ← 70'den 80'e değiştirdim
```

### 3. Değişiklikleri Uygulama
```bash
node sync_txt_to_json.js
```
Bu komut `ana.txt` ve `ekstra.txt`'deki değişiklikleri `all.json`'a uygular.

## 📝 Dosya Formatları

### ana.txt Formatı
```
ÜRÜN_ID | ÜRÜN_ADI | FİYAT
```

Örnek:
```
p1 | Margarita Yicem | 220
p2 | Mix Yicem | 290
```

### ekstra.txt Formatı
```
ÜRÜN_ID | EKSTRA_TİPİ | EKSTRA_ID | EKSTRA_ADI | FİYAT
```

Ekstra Tipleri:
- `option` - Boyut seçenekleri (Small, Medium, Large, vb.)
- `mainProduct` - Ana ürünler (Soğuk Sandviç için)
- `sideProduct` - Yan ürünler (Soğuk Sandviç için)
- `menuOption` - Menü seçenekleri (Cips + Ayran, vb.)
- `potatoOption` - Patates seçenekleri
- `drinkOption` - İçecek seçenekleri

Örnek:
```
p1 | option | o1 | Small (1 Kişilik) | 0
p1 | option | o2 | Medium (1-2 Kişilik) | 70
cd1 | menuOption | menu1 | Menü (Cips + Ayran) | 60
```

## ⚠️ Önemli Notlar

1. **Yorum satırları**: `#` ile başlayan satırlar yorumdur, değiştirilmez
2. **Format korunmalı**: `|` işaretleri ve boşluklar korunmalı
3. **Sadece fiyat değiştirin**: Ürün ID, isim gibi alanları değiştirmeyin
4. **Yedek alın**: Değişiklik yapmadan önce `all.json`'un yedeğini alın

## 🔄 İş Akışı

1. `node generate_txt.js` - İlk kurulum veya all.json değiştiyse
2. `ana.txt` ve `ekstra.txt` dosyalarını düzenle
3. `node sync_txt_to_json.js` - Değişiklikleri uygula
4. `all.json`'u sunucuya yükle
5. Sayfayı yenile ve kontrol et

## 💡 İpuçları

- Excel veya Google Sheets'te düzenleyebilirsiniz (CSV olarak kaydedip `|` ile birleştirin)
- Toplu değişiklik için Find & Replace kullanabilirsiniz
- Fiyatları değiştirirken sadece sayıları değiştirin, formatı bozmayın

