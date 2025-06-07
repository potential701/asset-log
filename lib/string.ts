/**
 * Converts a string to title case (first letter of each word capitalized)
 * @param input The string to convert to title case
 * @returns The input string converted to title case
 */
export function toTitleCase(input: string): string {
  if (!input) return input;
  
  return input
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}