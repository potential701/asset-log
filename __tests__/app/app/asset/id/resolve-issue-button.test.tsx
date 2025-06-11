import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResolveIssueButton from "@/app/(app)/asset/[id]/resolve-issue-button";
import { toast } from "sonner";

// Mock the toast library
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock the resolve action
jest.mock("@/app/(app)/asset/actions", () => ({
  resolve: jest.fn(),
}));

// Mock the Alert component
jest.mock("@/components/ui/alert", () => {
  return {
    Alert: jest.fn(({ children, open, onClose }) => {
      if (!open) return null;
      return (
        <div data-testid="alert-dialog">
          {children}
          <button data-testid="mock-close-button" onClick={() => onClose(false)}>
            Mock Close
          </button>
        </div>
      );
    }),
    AlertTitle: jest.fn(({ children }) => <h2>{children}</h2>),
    AlertDescription: jest.fn(({ children }) => <p>{children}</p>),
    AlertActions: jest.fn(({ children }) => <div>{children}</div>),
  };
});

describe("ResolveIssueButton", () => {
  const mockIssueId = 123;
  const mockAssetId = 456;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a resolve button", () => {
    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    const resolveButton = screen.getByText("Resolve");
    expect(resolveButton).toBeInTheDocument();
  });

  it("opens the alert dialog when the resolve button is clicked", () => {
    // Don't mock useState for this test so we can test the actual state changes
    jest.spyOn(React, "useState").mockRestore();

    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    // Initially, the alert should not be visible
    expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();

    // Click the resolve button
    fireEvent.click(screen.getByText("Resolve"));

    // Now the alert should be visible
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you would like to resolve this issue?")).toBeInTheDocument();
    expect(screen.getByText("The issue will be resolved and the asset will become available.")).toBeInTheDocument();
  });

  it("closes the alert dialog when the cancel button is clicked", () => {
    // Don't mock useState for this test so we can test the actual state changes
    jest.spyOn(React, "useState").mockRestore();

    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    // Open the alert
    fireEvent.click(screen.getByText("Resolve"));
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();

    // Click the cancel button (which is now a button inside the Alert component)
    fireEvent.click(screen.getByText("Cancel"));

    // The alert should be closed
    expect(screen.queryByTestId("alert-dialog")).not.toBeInTheDocument();
  });

  it("submits the form with correct data when the resolve button in the alert is clicked", async () => {
    // Don't mock useState for this test so we can test the actual state changes
    jest.spyOn(React, "useState").mockRestore();

    // Mock the action state hook
    const mockActionState = [
      undefined, // initial state
      jest.fn(), // action function
      false, // pending state
    ];

    jest.spyOn(React, "useEffect").mockImplementation(() => {});

    // @ts-expect-error - mocking the hook
    jest.spyOn(React, "useActionState").mockReturnValue(mockActionState);

    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    // Open the alert
    fireEvent.click(screen.getByText("Resolve"));

    // The alert should be visible
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();

    // The form should have hidden inputs with the correct values
    const idInput = screen.getByDisplayValue(mockIssueId.toString());
    const assetIdInput = screen.getByDisplayValue(mockAssetId.toString());

    expect(idInput).toHaveAttribute("name", "id");
    expect(assetIdInput).toHaveAttribute("name", "asset_id");

    // Submit the form
    fireEvent.submit(screen.getByDisplayValue(mockIssueId.toString()).closest("form")!);

    // The action function should be called with the form data
    expect(mockActionState[1]).toHaveBeenCalled();
  });

  it("shows an error toast when the action returns an error", async () => {
    // Mock the toast.error function
    jest.clearAllMocks();

    // Don't mock useState for this test
    jest.spyOn(React, "useState").mockRestore();

    // Don't mock useEffect for this test
    jest.spyOn(React, "useEffect").mockRestore();

    // Mock the action state hook with an error state
    const mockActionState = [
      { message: "Error message", success: false }, // error state
      jest.fn(), // action function
      false, // pending state
    ];

    // @ts-expect-error hook mocking
    jest.spyOn(React, "useActionState").mockReturnValue(mockActionState);

    // Render the component - this should trigger the useEffect
    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    // Wait for the useEffect to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error message");
    });
  });

  it('shows "Resolving..." text when the action is pending', () => {
    // Don't mock useState for this test
    jest.spyOn(React, "useState").mockRestore();

    // Mock the action state hook with a pending state
    const mockActionState = [
      undefined, // initial state
      jest.fn(), // action function
      true, // pending state
    ];

    jest.spyOn(React, "useEffect").mockImplementation(() => {});

    // @ts-expect-error - mocking the hook
    jest.spyOn(React, "useActionState").mockReturnValue(mockActionState);

    render(<ResolveIssueButton issueId={mockIssueId} assetId={mockAssetId} />);

    // Open the alert
    fireEvent.click(screen.getByText("Resolve"));

    // The alert should be visible
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();

    // The button should show "Resolving..." text
    expect(screen.getByText("Resolving...")).toBeInTheDocument();
  });
});
