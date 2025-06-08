/**
 * Converts a string to title case (first letter of each word capitalized)
 * @param input The string to convert to title case
 * @returns The input string converted to title case
 */
export function toTitleCase(input: string | null): string {
  if (input === null) return "";
  if (!input) return input;

  return input
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Extracts initials from a name
 * @param input The name to extract initials from
 * @returns The initials (first letter of first name and first letter of last name)
 */
export function getInitials(input: string): string {
  if (!input || input.trim() === "") return "";

  // Split the input by spaces and filter out empty strings
  const parts = input.split(" ").filter((part) => part.length > 0);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    // If there's only one word, return its first letter
    return parts[0].charAt(0).toUpperCase();
  }

  // Get the first letter of the first word and the first letter of the last word
  const firstInitial = parts[0].charAt(0);
  const lastInitial = parts[parts.length - 1].charAt(0);

  return (firstInitial + lastInitial).toUpperCase();
}
