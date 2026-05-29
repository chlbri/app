/**
 * @file Auto-generated file containing all asset paths from the public folder
 * @see .github/prompts/codegen-assets.prompt.md for regeneration instructions
 * @generated 2025-10-17T12:02:14.736Z
 */

/**
 * All asset paths available in the public folder
 * These paths are relative to the root URL of the application
 */
export const ASSETS = {
  favicon: '/favicon.ico',

  /** img */
  img: {
    /** Accordion horizontal */
    accordionHorizontal: {
      onglet1: '/img/Accordion horizontal/Onglet 1.jpeg',
      onglet2: '/img/Accordion horizontal/Onglet 2.jpeg',
      onglet3: '/img/Accordion horizontal/Onglet 3.jpeg',
      onglet4: '/img/Accordion horizontal/Onglet 4.jpeg',
      onglet5: '/img/Accordion horizontal/Onglet 5.jpeg',
    },
    blueprint: '/img/blueprint.jpg',
    'building.jpg': '/img/building.jpg',
    'building.png': '/img/building.png',
    draftChart: '/img/draft-chart.jpeg',
    logoTexteNoBackground: '/img/logo-texte.no-background.png',
    logoTexte: '/img/logo-texte.png',
    logo: '/img/logo.png',
  },

  /** svg */
  svg: {
    iconEnseignant: '/svg/icon-enseignant.svg',
    iconProgression: '/svg/icon-progression.svg',
    iconSuivi: '/svg/icon-suivi.svg',
  },
} as const;

/**
 * Type representing all available asset paths
 */
export type AssetPath =
  | typeof ASSETS.favicon
  | typeof ASSETS.img.accordionHorizontal.onglet1
  | typeof ASSETS.img.accordionHorizontal.onglet2
  | typeof ASSETS.img.accordionHorizontal.onglet3
  | typeof ASSETS.img.accordionHorizontal.onglet4
  | typeof ASSETS.img.accordionHorizontal.onglet5
  | typeof ASSETS.img.blueprint
  | (typeof ASSETS.img)['building.jpg']
  | (typeof ASSETS.img)['building.png']
  | typeof ASSETS.img.draftChart
  | typeof ASSETS.img.logoTexteNoBackground
  | typeof ASSETS.img.logoTexte
  | typeof ASSETS.img.logo
  | typeof ASSETS.svg.iconEnseignant
  | typeof ASSETS.svg.iconProgression
  | typeof ASSETS.svg.iconSuivi;
