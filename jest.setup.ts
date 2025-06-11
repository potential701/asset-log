import "@testing-library/jest-dom";

// Mock React hooks
import React from "react";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useActionState: jest.fn().mockImplementation((action, initialState) => {
      return [initialState, jest.fn(), false];
    }),
  };
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
  redirect: jest.fn(),
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

// Mock next/form
jest.mock("next/form", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children, action, ...props }) => {
      return React.createElement(
        "form",
        {
          ...props,
          onSubmit: (e: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
            e.preventDefault();
            if (action) action(new FormData(e.currentTarget));
          },
        },
        children,
      );
    }),
  };
});
