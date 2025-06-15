import { create } from "@/app/(app)/asset/actions";
import { db } from "@/db/drizzle";
import { revalidatePath } from "next/cache";

// Mock the database
jest.mock("@/db/drizzle", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockResolvedValue({}),
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock lib/session
jest.mock("@/lib/session", () => ({
  getSession: jest.fn().mockResolvedValue({ id: 1, email: "test@example.com" }),
}));

describe("Asset Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new asset with valid data", async () => {
      // Create a mock FormData
      const formData = new FormData();
      formData.append("name", "Test Asset");
      formData.append("type", "laptop");
      formData.append("serial_number", "SN12345");
      formData.append("status", "available");

      // Call the "create" action
      const result = await create(undefined, formData);

      // Check that the database insert was called
      expect(db.insert).toHaveBeenCalled();
      // @ts-expect-error method chaining
      expect(db.values).toHaveBeenCalledWith({
        name: "Test Asset",
        type: "laptop",
        serial_number: "SN12345",
        status: "available",
      });

      // Check that the path was revalidated
      expect(revalidatePath).toHaveBeenCalledWith("/asset");

      // Check the result
      expect(result).toEqual({
        message: "New asset created successfully. You can now view it in assets.",
        success: true,
      });
    });

    it("should return validation errors with invalid data", async () => {
      // Create a mock FormData with invalid data (missing required fields)
      const formData = new FormData();
      formData.append("name", ""); // Empty name should fail validation

      // Call the "create" action
      const result = await create(undefined, formData);

      // Check that the database insert was not called
      expect(db.insert).not.toHaveBeenCalled();
      // @ts-expect-error method chaining
      expect(db.values).not.toHaveBeenCalled();

      // Check that the path was not revalidated
      expect(revalidatePath).not.toHaveBeenCalled();

      // Check the result contains validation errors
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it("should handle database errors", async () => {
      // Create a mock FormData
      const formData = new FormData();
      formData.append("name", "Test Asset");
      formData.append("type", "laptop");
      formData.append("serial_number", "SN12345");
      formData.append("status", "available");

      // Mock a database error
      // @ts-expect-error method chaining
      (db.values as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

      // Call the "create" action
      const result = await create(undefined, formData);

      // Check the result
      expect(result).toEqual({
        message: "There was an error adding a new asset. Please ensure it does not exist already.",
      });
    });
  });
});
