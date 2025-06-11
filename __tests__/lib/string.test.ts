import { toTitleCase, getInitials, toFormattedNumber } from "@/lib/string";

describe("String Utility Functions", () => {
  // Tests for toTitleCase function
  describe("toTitleCase", () => {
    it("should convert a string to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
      expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
      expect(toTitleCase("hello WORLD")).toBe("Hello World");
    });

    it("should handle empty strings", () => {
      expect(toTitleCase("")).toBe("");
    });

    it("should handle null values", () => {
      expect(toTitleCase(null)).toBe("");
    });

    it("should handle strings with multiple spaces", () => {
      expect(toTitleCase("hello  world")).toBe("Hello  World");
      expect(toTitleCase(" hello world ")).toBe(" Hello World ");
    });

    it("should handle single word strings", () => {
      expect(toTitleCase("hello")).toBe("Hello");
      expect(toTitleCase("HELLO")).toBe("Hello");
    });
  });

  // Tests for getInitials function
  describe("getInitials", () => {
    it("should extract initials from a full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("jane smith")).toBe("JS");
    });

    it("should handle single names", () => {
      expect(getInitials("John")).toBe("J");
      expect(getInitials("jane")).toBe("J");
    });

    it("should handle empty strings", () => {
      expect(getInitials("")).toBe("");
    });

    it("should handle strings with multiple spaces", () => {
      expect(getInitials("John  Doe")).toBe("JD");
      expect(getInitials(" John Doe ")).toBe("JD");
    });

    it("should handle names with more than two parts", () => {
      expect(getInitials("John Middle Doe")).toBe("JD");
      expect(getInitials("John van der Doe")).toBe("JD");
    });
  });

  // Tests for toFormattedNumber function
  describe("toFormattedNumber", () => {
    it("should format numbers with commas", () => {
      expect(toFormattedNumber(1000)).toBe("1,000");
      expect(toFormattedNumber(1000000)).toBe("1,000,000");
      expect(toFormattedNumber(1234.56)).toBe("1,234.56");
    });

    it("should handle string numbers", () => {
      expect(toFormattedNumber("1000")).toBe("1,000");
      expect(toFormattedNumber("1234.56")).toBe("1,234.56");
    });

    it("should handle null and undefined values", () => {
      expect(toFormattedNumber(null)).toBe("");
      expect(toFormattedNumber(undefined)).toBe("");
    });

    it("should handle invalid number strings", () => {
      expect(toFormattedNumber("not-a-number")).toBe("");
    });

    it("should use the provided locale", () => {
      // Different locales format numbers differently,
      // For example, in German, 1,000.00 is formatted as 1.000,00
      expect(toFormattedNumber(1000.5, "de-DE")).toBe("1.000,5");
    });

    it("should apply number format options", () => {
      expect(toFormattedNumber(1234.56, "en-US", { style: "currency", currency: "USD" })).toMatch(/\$1,234\.56/); // The exact format might vary slightly by environment

      expect(toFormattedNumber(0.5, "en-US", { style: "percent" })).toMatch(/50%/); // The exact format might vary slightly by environment
    });
  });
});
