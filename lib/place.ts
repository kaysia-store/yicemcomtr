export const place = {
  streetAddress: "Fener Mah. 1968 Sk. No: 21/A",
  district: "Muratpaşa",
  city: "Antalya",
  country: "TR",
  landlineTel: "+902423231177",
  landlineLabel: "0242 323 11 77",
  mobileTel: "+905412429007",
  mobileLabel: "0541 242 90 07",
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Fener Mah. 1968 Sk. No: 21/A Muratpaşa Antalya")}`,
  sameAs: "https://www.yicem.com.tr/",
} as const;

const menuWord: Record<string, string> = {
  tr: "menüsü",
  en: "menu",
  ru: "меню",
  de: "Speisekarte",
  fr: "carte",
  ar: "قائمة",
};

export function placeDescription(name: string, locale: string) {
  const word = menuWord[locale] ?? menuWord.tr;
  const address = `${place.streetAddress}, ${place.district}, ${place.city}`;
  if (locale === "ar") return `${word} ${name}. ${address}.`;
  return `${name} ${word}. ${address}.`;
}

export function placeJsonLd(name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.streetAddress,
      addressLocality: place.district,
      addressRegion: place.city,
      addressCountry: place.country,
    },
    telephone: place.landlineTel,
    contactPoint: [
      { "@type": "ContactPoint", telephone: place.landlineTel, contactType: "customer support" },
      { "@type": "ContactPoint", telephone: place.mobileTel, contactType: "customer support" },
    ],
    hasMap: place.mapsUrl,
    sameAs: place.sameAs,
  };
}
