/**
 * Czech grammar utilities
 */

/**
 * Convert name to vocative case (5. pád - oslovení)
 *
 * @param {string} fullName - Full name (e.g., "Lenka Penka Podkolenka")
 * @returns {string} First name in vocative case (e.g., "Lenko")
 *
 * @example
 * getVocative("Jana Nováková") // "Jano"
 * getVocative("Lenka Roubalová") // "Lenko"
 * getVocative("Petr Novák") // "Petr" (unchanged)
 */
export const getVocative = (fullName) => {
  if (!fullName) return '';

  // Extract ONLY first name (Lenka Penka Podkolenka → Lenka)
  const firstName = fullName.trim().split(' ')[0];

  // Ženská jména končící na -a → -o (Jana → Jano, Lenka → Lenko)
  if (firstName.endsWith('a') && firstName.length > 1) {
    return firstName.slice(0, -1) + 'o';
  }

  return firstName;
};

export default {
  getVocative,
};
