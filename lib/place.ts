export const place = {
  streetAddress: "Fener Mah. 1968 Sk. No: 21/A",
  district: "Muratpaşa",
  city: "Antalya",
  country: "TR",
  landlineTel: "+902423231177",
  landlineLabel: "0242 323 11 77",
  mobileTel: "+905412429007",
  mobileLabel: "0541 242 90 07",
  mapsUrl:
    "https://www.google.com/maps/place/Yicem+Cafe+%26+Bistro/@36.85307,30.7603213,18.5z/data=!4m14!1m7!3m6!1s0x14c39ae19407ffbb:0x293f413ca8b4d3bb!2sFener,+1968.+Sk.+2%2F1+D:a,+07160+Muratpa%C5%9Fa%2FAntalya!3b1!8m2!3d36.853313!4d30.756232!3m5!1s0x14c39b1ef85787cd:0x144d717288522d90!8m2!3d36.85308!4d30.7609919!16s%2Fg%2F11h9zjrn33?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
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
