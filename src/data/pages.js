import { siteConfig } from "./siteConfig.js";

const parishSuffix = "Parohia „Sf. Parascheva de la Iași”";

export const pages = [
  {
    slug: "despre-noi",
    route: "/despre-noi/",
    title: "Despre Parohie",
    description: "Istoricul parohiei și începuturile comunității ortodoxe române din Eindhoven–Tilburg.",
    markdownFile: "/assets/media/documents/despre-noi.md",
    heroImage: siteConfig.churchImage,
    icon: siteConfig.logo,
    navGroup: "Despre noi",
    seoTitle: `Despre Parohie | ${parishSuffix}`,
    seoDescription: "Istoricul Parohiei „Sf. Parascheva de la Iași” Eindhoven–Tilburg și informații despre comunitatea ortodoxă română din Noord Brabant."
  },
  {
    slug: "program-liturgic",
    route: "/program-liturgic/",
    title: "Program Liturgic",
    description: "Programul slujbelor este anunțat pe pagina noastră de Facebook și afișat la biserică.",
    markdownFile: "/assets/media/documents/program-liturgic.md",
    heroImage: siteConfig.churchImage,
    icon: "/assets/images/spirituality/Program.png",
    navGroup: "Slujbe",
    seoTitle: `Program Liturgic | ${parishSuffix}`,
    seoDescription: "Programul liturgic al Parohiei „Sf. Parascheva de la Iași” Eindhoven–Tilburg și pagina de Facebook pentru anunțuri."
  },
  {
    slug: "botez",
    route: "/botez/",
    title: "Despre Botez",
    description: "Informații despre Taina Sfântului Botez și pregătirea pentru acest moment binecuvântat.",
    markdownFile: "/assets/media/documents/botez.md",
    heroImage: "/assets/images/hero/Botez 1.png",
    heroImages: [
      "/assets/images/hero/Botez 1.png",
      "/assets/images/hero/Botez 2.png",
      "/assets/images/hero/Botez 3.png"
    ],
    icon: "/assets/images/spirituality/Botez.png",
    navGroup: "Slujbe",
    seoTitle: `Despre Botez | ${parishSuffix}`,
    seoDescription: "Informații despre Taina Sfântului Botez la Parohia „Sf. Parascheva de la Iași” Eindhoven–Tilburg."
  },
  {
    slug: "spovedanie",
    route: "/spovedanie/",
    title: "Despre Spovedanie",
    description: "Spovedania ne aduce iertare, vindecare și pace sufletească.",
    markdownFile: "/assets/media/documents/spovedanie.md",
    heroImage: "/assets/images/hero/Spovedanie 1.png",
    heroImages: [
      "/assets/images/hero/Spovedanie 1.png",
      "/assets/images/hero/Spovedanie 2.png",
      "/assets/images/hero/Spovedanie 3.png"
    ],
    icon: "/assets/images/spirituality/Spovedanie.png",
    navGroup: "Slujbe",
    seoTitle: `Despre Spovedanie | ${parishSuffix}`,
    seoDescription: "Informații despre Spovedanie la Parohia „Sf. Parascheva de la Iași” Eindhoven–Tilburg."
  },
  {
    slug: "donatii",
    route: "/donatii/",
    title: "Donații",
    description: "Informații pentru susținerea financiară a parohiei.",
    markdownFile: "/assets/media/documents/donatii.md",
    heroImage: siteConfig.churchImage,
    icon: "/assets/images/spirituality/Donatii.png",
    navGroup: "Informații",
    seoTitle: `Donații | ${parishSuffix}`,
    seoDescription: "Donații pentru Parohia „Sf. Parascheva de la Iași” Eindhoven–Tilburg. IBAN și informații pentru sprijinirea parohiei."
  },
  {
    slug: "fundatia-noastra",
    route: "/fundatia-noastra/",
    title: "Fundația Noastră",
    description: "Date despre fundație, scop, activități și administrarea fondurilor.",
    markdownFile: "/assets/media/documents/fundatia-noastra.md",
    heroImage: siteConfig.churchImage,
    icon: siteConfig.logo,
    navGroup: "Informații",
    seoTitle: `Fundația Noastră | ${parishSuffix}`,
    seoDescription: "Fundația Romanian Orthodox Church Saint Parascheva, date de identificare, scop, activități și administrarea fondurilor."
  },
  {
    slug: "viata-sfintei-parascheva",
    route: "/viata-sfintei-parascheva/",
    title: "Viața Sfintei Parascheva",
    description: "Viața Sfintei Cuvioase Parascheva, ocrotitoarea parohiei.",
    markdownFile: "/assets/media/documents/viata-sfintei-parascheva.md",
    heroImage: siteConfig.logo,
    icon: siteConfig.logo,
    navGroup: "Informații",
    seoTitle: `Viața Sfintei Parascheva | ${parishSuffix}`,
    seoDescription: "Pagină dedicată Vieții Sfintei Cuvioase Parascheva, ocrotitoarea parohiei Eindhoven–Tilburg."
  },
  {
    slug: "acatistul-sfintei-parascheva",
    route: "/acatistul-sfintei-parascheva/",
    title: "Acatistul Sfintei Parascheva",
    description: "Textul Acatistului Sfintei Cuvioase Parascheva.",
    markdownFile: "/assets/media/documents/acatist.md",
    heroImage: siteConfig.logo,
    icon: siteConfig.logo,
    navGroup: "Informații",
    seoTitle: `Acatistul Sfintei Parascheva | ${parishSuffix}`,
    seoDescription: "Pagină dedicată Acatistului Sfintei Cuvioase Parascheva."
  },
  {
    slug: "parohii-olanda",
    route: "/parohii-olanda/",
    title: "Parohii Olanda",
    description: "Listă de parohii ortodoxe românești din Olanda.",
    markdownFile: "/assets/media/documents/parohii-olanda.md",
    heroImage: siteConfig.churchImage,
    icon: siteConfig.logo,
    navGroup: "Informații",
    seoTitle: `Parohii Olanda | ${parishSuffix}`,
    seoDescription: "Listă structurată pentru parohii ortodoxe românești din Olanda."
  },
  {
    slug: "parohii-belgia",
    route: "/parohii-belgia/",
    title: "Parohii Belgia",
    description: "Listă de parohii ortodoxe românești din Belgia.",
    markdownFile: "/assets/media/documents/parohii-belgia.md",
    heroImage: siteConfig.churchImage,
    icon: siteConfig.logo,
    navGroup: "Informații",
    seoTitle: `Parohii Belgia | ${parishSuffix}`,
    seoDescription: "Listă structurată pentru parohii ortodoxe românești din Belgia."
  },
  {
    slug: "contact",
    route: "/contact/",
    title: "Contact",
    description: "Adresă, email, telefon, WhatsApp și hartă.",
    markdownFile: "/assets/media/documents/contact.md",
    heroImage: siteConfig.churchImage,
    icon: siteConfig.logo,
    navGroup: "Contact",
    seoTitle: `Contact | ${parishSuffix}`,
    seoDescription: "Contact Parohia „Sf. Parascheva de la Iași” Eindhoven–Tilburg: adresă, email, telefon, WhatsApp și hartă."
  }
];

export const getPageBySlug = (slug) => pages.find((page) => page.slug === slug);
