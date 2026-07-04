export const business = {
  businessName: "OftaLife",
  tagline: "Optica y consulta oftalmologica",
  city: "Bulnes",
  address: "O'Higgins 296, Bulnes, Chile",
  hours: "Lunes a viernes: 09:30-19:00",
  whatsapp: "+56961779170",
  whatsappLabel: "+56 9 6177 9170",
  phone: "+56961779170",
  phoneLabel: "+56 9 6177 9170",
  instagramUrl: "https://www.instagram.com/oftalife.cl/",
  googleMapsQuery: "OftaLife O'Higgins 296, Bulnes, Chile",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=OftaLife+O%27Higgins+296+Bulnes+Chile",
  googleReviewsUrl: "https://www.google.com/search?q=OftaLife+Bulnes+rese%C3%B1as",
  googleMapsEmbedUrl: "https://www.google.com/maps?q=OftaLife%20O%27Higgins%20296%2C%20Bulnes%2C%20Chile&output=embed",
};

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.googleMapsQuery)}`;

export const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hola OftaLife, quiero agendar una consulta.")}`;
