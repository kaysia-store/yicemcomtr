import type { LangCode } from "@/lib/menu/types";

export type UiKey =
  | "select_language"
  | "hero_title"
  | "hero_subtitle"
  | "download"
  | "all_categories"
  | "contact"
  | "address"
  | "phone"
  | "email"
  | "hours"
  | "weekdays"
  | "weekend"
  | "all_rights"
  | "call_now"
  | "details"
  | "qr_fast_access"
  | "qr_alt"
  | "data_source"
  | "data_source_supabase"
  | "data_source_json"
  | "close"
  | "product_details"
  | "ingredients"
  | "extras"
  | "toggle_theme"
  | "order_now"
  | "total"
  | "added_to_cart"
  | "whatsapp";

const UI: Record<LangCode, Record<UiKey, string>> = {
  tr: {
    select_language: "Dil Seçiniz",
    hero_title: "Ne Yi'cem diye düşünme!",
    hero_subtitle: "QR Menü Uygulamasını indir!",
    download: "İndir",
    all_categories: "Tümü",
    contact: "İletişim",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "Çalışma Saatleri",
    weekdays: "Pazartesi - Cumartesi: 09:00 - 20:30",
    weekend: "Pazar günü kapalı",
    all_rights: "Tüm hakları saklıdır.",
    call_now: "Ara",
    details: "Detay",
    qr_fast_access: "QR Kod ile Hızlı Erişim",
    qr_alt: "Yi'Cem Restoran QR Kodu",
    data_source: "Veri kaynağı",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (geliştirme)",
    close: "Kapat",
    product_details: "Ürün Detayları",
    ingredients: "İçerikler",
    extras: "Seçenekler",
    toggle_theme: "Tema Değiştir",
    order_now: "Sipariş Ver",
    total: "Toplam",
    added_to_cart: "Eklendi!",
    whatsapp: "WhatsApp",
  },
  en: {
    select_language: "Select Language",
    hero_title: "Don't think about what to eat!",
    hero_subtitle: "Download QR Menu App!",
    download: "Download",
    all_categories: "All",
    contact: "Contact",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "Working Hours",
    weekdays: "Monday - Saturday: 09:00 - 20:30",
    weekend: "Closed on Sunday",
    all_rights: "All rights reserved.",
    call_now: "Call",
    details: "Details",
    qr_fast_access: "Quick Access with QR Code",
    qr_alt: "Yi'Cem Restaurant QR Code",
    data_source: "Data source",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (development)",
    close: "Close",
    product_details: "Product Details",
    ingredients: "Ingredients",
    extras: "Options",
    toggle_theme: "Toggle theme",
    order_now: "Order Now",
    total: "Total",
    added_to_cart: "Added!",
    whatsapp: "WhatsApp",
  },
  ru: {
    select_language: "Выберите язык",
    hero_title: "Не думай, что поесть!",
    hero_subtitle: "Скачай QR Меню Приложение!",
    download: "Скачать",
    all_categories: "Все",
    contact: "Контакты",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "Часы работы",
    weekdays: "Понедельник - Суббота: 09:00 - 20:30",
    weekend: "Закрыто в воскресенье",
    all_rights: "Все права защищены.",
    call_now: "Позвонить",
    details: "Подробнее",
    qr_fast_access: "Быстрый доступ по QR-коду",
    qr_alt: "QR-код ресторана Yi'Cem",
    data_source: "Источник данных",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (разработка)",
    close: "Закрыть",
    product_details: "Детали продукта",
    ingredients: "Ингредиенты",
    extras: "Опции",
    toggle_theme: "Сменить тему",
    order_now: "Заказать",
    total: "Итого",
    added_to_cart: "Добавлено!",
    whatsapp: "WhatsApp",
  },
  de: {
    select_language: "Sprache wählen",
    hero_title: "Denk nicht darüber nach, was du essen sollst!",
    hero_subtitle: "QR-Menü-App herunterladen!",
    download: "Herunterladen",
    all_categories: "Alle",
    contact: "Kontakt",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "Öffnungszeiten",
    weekdays: "Montag - Samstag: 09:00 - 20:30",
    weekend: "Sonntags geschlossen",
    all_rights: "Alle Rechte vorbehalten.",
    call_now: "Anrufen",
    details: "Details",
    qr_fast_access: "Schneller Zugriff mit QR-Code",
    qr_alt: "Yi'Cem Restaurant QR-Code",
    data_source: "Datenquelle",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (Entwicklung)",
    close: "Schließen",
    product_details: "Produktdetails",
    ingredients: "Zutaten",
    extras: "Optionen",
    toggle_theme: "Design wechseln",
    order_now: "Jetzt bestellen",
    total: "Gesamt",
    added_to_cart: "Hinzugefügt!",
    whatsapp: "WhatsApp",
  },
  fr: {
    select_language: "Choisir la langue",
    hero_title: "Ne pense pas à ce que tu vas manger !",
    hero_subtitle: "Téléchargez l'Application QR Menu!",
    download: "Télécharger",
    all_categories: "Tout",
    contact: "Contact",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "Heures d'ouverture",
    weekdays: "Lundi - Samedi: 09:00 - 20:30",
    weekend: "Fermé le dimanche",
    all_rights: "Tous droits réservés.",
    call_now: "Appeler",
    details: "Détails",
    qr_fast_access: "Accès rapide avec QR Code",
    qr_alt: "QR Code Restaurant Yi'Cem",
    data_source: "Source de données",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (développement)",
    close: "Fermer",
    product_details: "Détails du produit",
    ingredients: "Ingrédients",
    extras: "Options",
    toggle_theme: "Changer le thème",
    order_now: "Commander",
    total: "Total",
    added_to_cart: "Ajouté !",
    whatsapp: "WhatsApp",
  },
  ar: {
    select_language: "اختر اللغة",
    hero_title: "لا تفكر في ماذا تأكل!",
    hero_subtitle: "حمّل تطبيق QR Menu!",
    download: "تحميل",
    all_categories: "الكل",
    contact: "اتصل بنا",
    address: "Fener Mah. 1968 Sk. No: 21/A Muratpaşa/ANTALYA",
    phone: "+90 242 323 1177",
    email: "info@yicem.com",
    hours: "ساعات العمل",
    weekdays: "الاثنين - السبت: 09:00 - 20:30",
    weekend: "مغلق يوم الأحد",
    all_rights: "جميع الحقوق محفوظة.",
    call_now: "اتصل",
    details: "التفاصيل",
    qr_fast_access: "وصول سريع عبر رمز QR",
    qr_alt: "رمز QR لمطعم يجم",
    data_source: "مصدر البيانات",
    data_source_supabase: "Supabase",
    data_source_json: "all.json (تطوير)",
    close: "إغلاق",
    product_details: "تفاصيل المنتج",
    ingredients: "المكونات",
    extras: "الخيارات",
    toggle_theme: "تغيير المظهر",
    order_now: "اطلب الآن",
    total: "الإجمالي",
    added_to_cart: "تمت الإضافة!",
    whatsapp: "واتساب",
  },
};

export function tUi(lang: LangCode, key: UiKey): string {
  return UI[lang][key] ?? UI.tr[key];
}
