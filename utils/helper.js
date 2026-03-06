/**
 * Merges class names using a simple space separator.
 * This is a lightweight alternative to clsx/tailwind-merge for simple use cases.
 * @param {...string} classes - The class names to merge.
 * @returns {string} The merged class names.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a phone number string.
 * @param {string} phone - The raw phone number string.
 * @returns {string} The formatted phone number.
 */
export function formatPhone(phone) {
  if (!phone) return "";
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}
