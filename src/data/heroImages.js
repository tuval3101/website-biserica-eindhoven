export const fallbackHeroImage = "/assets/images/hero/Parohie 1.png";

export const heroImages = {
  home: [
    "/assets/images/hero/Parohie 1.png",
    "/assets/images/hero/Parohie 2.png",
    "/assets/images/hero/Parohie 3.png",
    "/assets/images/hero/Parohie 4.png",
    "/assets/images/hero/Parohie 5.png",
    "/assets/images/hero/Parohie 6.png",
    "/assets/images/hero/Parohie 7.png"
  ],
  "despre-noi": [
    "/assets/images/hero/Despre Noi 1.png"
  ],
  botez: [
    "/assets/images/hero/Botez 1.png",
    "/assets/images/hero/Botez 2.png",
    "/assets/images/hero/Botez 3.png"
  ],
  spovedanie: [
    "/assets/images/hero/Spovedanie 1.png",
    "/assets/images/hero/Spovedanie 2.png",
    "/assets/images/hero/Spovedanie 3.png"
  ],
  donatii: [
    "/assets/images/hero/Donatii 0.png",
    "/assets/images/hero/Donatii 1.png",
    "/assets/images/hero/Donatii 2.png"
  ],
  contact: [
    "/assets/images/hero/Contact 1.png",
    "/assets/images/hero/Contact 2.png"
  ],
  "program-liturgic": [
    "/assets/images/hero/Parohie 5.png"
  ],
  "fundatia-noastra": [
    "/assets/images/hero/Parohie 4.png"
  ],
  "viata-sfintei-parascheva": [
    "/assets/images/hero/Contact 1.png"
  ],
  "acatistul-sfintei-parascheva": [
    "/assets/images/hero/Contact 2.png"
  ],
  "parohii-olanda": [
    "/assets/images/hero/Parohie 1.png"
  ],
  "parohii-belgia": [
    "/assets/images/hero/Parohie 2.png"
  ]
};

export const getHeroImages = (slug) => heroImages[slug] || [fallbackHeroImage];

export const getPrimaryHeroImage = (slug) => getHeroImages(slug)[0] || fallbackHeroImage;
