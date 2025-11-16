// Responsive utility funkce pro layout a text
// Plain JavaScript funkce (ne React hooks) pro responsive design patterns

/**
 * Responsive spacing pro Layout a Page komponenty
 *
 * Centralizované responsive padding hodnoty pro konzistentní spacing napříč aplikací.
 * Všechny komponenty by měly používat tyto konstanty místo hardcoded hodnot.
 */
export const PAGE_PADDING = {
  px: { xs: 1.75, xsm: 1.875, md: 3 },  // 10px, 15px, 24px
  py: 3,  // 24px všude
};

export const SECTION_PADDING = {
  px: { xs: 0.5, sm: 1, md: 2 },  // 4px, 8px, 16px (navíc k PAGE_PADDING)
};

export const CARD_PADDING = {
       p: { xs: 1.5, sm: 2.5 },    // 12px na mobilu, 20px na desktopu
       pr: { xs: 1.25, sm: 2 },    // 10px na mobilu, 16px na desktopu (right redukováno kvůli ikonám)
};

/**
 * Line clamping s ellipsis (...) - používá WebKit line-clamp
 *
 * Řeší overflow dlouhých textů na malých obrazovkách pomocí ellipsis.
 * Podporuje multi-line ellipsis (ne jen single-line).
 *
 * @param {number} lines - Počet řádků před ellipsis (1, 2, 3, atd.)
 * @returns {object} - MUI sx object
 *
 * @example
 * // 1 řádek s ellipsis (URL, soubor)
 * <Typography sx={{ ...createTextEllipsis(1) }}>
 *
 * // 2 řádky s ellipsis (název)
 * <Typography sx={{ ...createTextEllipsis(2) }}>
 *
 * // 3 řádky s ellipsis (popis)
 * <Typography sx={{ ...createTextEllipsis(3) }}>
 */
export const createTextEllipsis = (lines = 1) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  minWidth: 0,
});

export default {
  PAGE_PADDING,
  SECTION_PADDING,
  CARD_PADDING,
  createTextEllipsis,
};
