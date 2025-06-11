# Testing Documentation

This directory contains automated tests for the Asset Log application. The tests are written using Jest and React Testing Library.

## Test Structure

The test directory structure mirrors the application structure:

```
__tests__/
├── app/                  # Tests for components and server actions in the app directory
│   └── app/              # Tests for components and server actions in the (app) directory
│       └── asset/        # Tests for asset-related components and actions
│           └── id/       # Tests for asset ID-specific components
├── lib/                  # Tests for utility functions in the lib directory
└── README.md             # This file
```

## Types of Tests

### Unit Tests

Unit tests focus on testing individual functions or components in isolation. Examples:

- `lib/string.test.ts`: Tests for string utility functions like `toTitleCase`, `getInitials`, and `toFormattedNumber`.

### Component Tests

Component tests render React components and test their behavior. Examples:

- `app/app/asset/id/resolve-issue-button.test.tsx`: Tests for the ResolveIssueButton component, including rendering, user interactions, and state changes.

### Integration Tests

Integration tests verify that different parts of the application work together correctly. Examples:

- `app/app/asset/actions.test.ts`: Tests for server actions that interact with the database and other server-side features.

## Running Tests

You can run the tests using the following npm scripts:

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode (useful during development)
- `npm run test:coverage`: Run tests and generate a coverage report

## Mocking

The tests use Jest's mocking capabilities to isolate the code being tested:

- Database operations are mocked to avoid actual database connections
- Next.js features like `revalidatePath` are mocked
- React hooks like `useActionState` are mocked when necessary
- External libraries like `sonner` (toast notifications) are mocked

## Best Practices

1. **Test Structure**: Use `describe` blocks to group related tests and `it` blocks for individual test cases.
2. **Assertions**: Use clear and specific assertions with descriptive error messages.
3. **Mocking**: Mock external dependencies to isolate the code being tested.
4. **Coverage**: Aim for high test coverage, especially for critical paths.
5. **Edge Cases**: Test edge cases like empty inputs, null values, and error conditions.
6. **Readability**: Write clear, readable tests that serve as documentation.

## Adding New Tests

To add a new test:

1. Create a test file in the appropriate directory, mirroring the application structure.
2. Import the code to be tested.
3. Write test cases using `describe` and `it` blocks.
4. Mock external dependencies as needed.
5. Run the tests to verify they pass.

## Example Test

```typescript
import { toTitleCase } from '@/lib/string';

describe('toTitleCase', () => {
  it('should convert a string to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('should handle null values', () => {
    expect(toTitleCase(null)).toBe('');
  });
});
```