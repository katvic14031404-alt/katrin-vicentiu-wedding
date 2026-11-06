/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING DETAILS — edit everything factual here.
 *  Wording (per language) lives in src/i18n/translations.js
 *  Colours & fonts live in src/styles/tokens.css
 * ─────────────────────────────────────────────────────────────
 */
export const wedding = {
  couple: {
    first: 'Katrin',
    second: 'Vicentiu',
    initials: ['K', 'V'],
  },

  // ISO date — formatted automatically in each language
  date: '2027-07-30',

  // RSVP page (your wedding website with the story, details and reply form)
  rsvpUrl: 'https://withjoy.com/katrin-and-vicentiu-are-getting-married',
  rsvpDeadline: '2027-05-01',

  venue: {
    name: 'Pădurile Regale',
    place: 'România',
  },

  // Programme on the day (labels per language in translations)
  programme: {
    ceremony: '18:30', // ceremony in the forest
    party: '20:00',
    shuttle: { from: '17:00', to: '17:30' }, // shuttle buses from Universitate Square
  },

  // Godparents (nași)
  godparents: ['Marina', 'Gabriel-Alexandru Matei'],

  /**
   * The three points on the map. [longitude, latitude].
   * Swap for meaningful places (hometown, where you met, your Dutch city).
   * `label` = where the country name sits relative to the pin.
   */
  places: [
    { key: 'de', coords: [10.45, 51.17], label: 'right' },
    { key: 'ro', coords: [26.1, 44.43], label: 'below' },
    { key: 'nl', coords: [4.9, 52.37], label: 'left' },
  ],

  // Route drawn on the map, in story order (keys from `places`)
  route: [
    ['de', 'ro'], // Katrin comes to Romania — we meet
    ['ro', 'nl'], // we move to the Netherlands together
    ['nl', 'ro'], // and fly back to Romania to get married
  ],

  postmark: { city: 'ROMÂNIA', date: '30 · VII · 2027' },
};

export const languages = [
  { code: 'ro', label: 'Română', short: 'RO', locale: 'ro-RO' },
  { code: 'de', label: 'Deutsch', short: 'DE', locale: 'de-DE' },
  { code: 'en', label: 'English', short: 'EN', locale: 'en-GB' },
];

export const defaultLanguage = 'en';
