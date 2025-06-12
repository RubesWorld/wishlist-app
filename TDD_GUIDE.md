# Test-Driven Development Guide

## Overview

This project follows Test-Driven Development (TDD) practices. All features should be developed using the Red-Green-Refactor cycle:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

## Project Structure

```
wishlist-app/
├── src/
│   ├── components/
│   │   └── __tests__/      # Component tests
│   ├── services/
│   │   └── __tests__/      # Service tests
│   └── utils/
│       └── __tests__/      # Utility tests
├── e2e/                    # End-to-end tests
├── jest.config.js          # Jest configuration
└── jest.setup.js           # Test setup

backend/
├── src/
│   ├── controllers/
│   │   └── __tests__/      # Controller tests
│   ├── services/
│   │   └── __tests__/      # Service tests
│   └── middleware/
│       └── __tests__/      # Middleware tests
├── e2e/                    # API integration tests
├── jest.config.js          # Jest configuration
└── jest.setup.js           # Test setup
```

## Testing Stack

### Frontend (React Native)
- **Jest**: Test runner and assertion library
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing for mobile apps

### Backend (Node.js)
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **ts-jest**: TypeScript support for Jest

## Running Tests

### Frontend Tests
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e:build  # Build app for testing
npm run test:e2e        # Run E2E tests
```

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e
```

## Writing Tests

### Component Test Example
```typescript
// src/components/__tests__/Button.test.tsx
describe('Button Component', () => {
  it('should render with text', () => {
    const { getByText } = render(<Button title="Click" onPress={() => {}} />);
    expect(getByText('Click')).toBeTruthy();
  });
});
```

### Service Test Example
```typescript
// backend/src/services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  it('should hash password correctly', async () => {
    const password = 'Test123!';
    const hash = await authService.hashPassword(password);
    expect(hash).not.toBe(password);
  });
});
```

### API Test Example
```typescript
// backend/e2e/api.e2e.test.ts
describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Test123!' })
      .expect(201);
    
    expect(response.body.success).toBe(true);
  });
});
```

## TDD Workflow

1. **Start with a test**: Before implementing any feature, write a test that describes the expected behavior
2. **Run the test**: Verify it fails (Red phase)
3. **Write minimal code**: Implement just enough to make the test pass
4. **Run tests again**: Ensure the test passes (Green phase)
5. **Refactor**: Clean up the code while keeping tests green
6. **Repeat**: Continue with the next test

## Best Practices

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Keep tests simple**: Each test should verify one behavior
3. **Use descriptive names**: Test names should clearly describe what they're testing
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Mock external dependencies**: Use mocks for APIs, databases, etc.
6. **Maintain test isolation**: Tests should not depend on each other
7. **Aim for high coverage**: Target 80%+ code coverage

## Common Testing Patterns

### Testing Async Code
```typescript
it('should fetch user data', async () => {
  const userData = await userService.getUser('123');
  expect(userData.id).toBe('123');
});
```

### Testing Errors
```typescript
it('should throw error for invalid input', async () => {
  await expect(service.process(null)).rejects.toThrow('Invalid input');
});
```

### Testing UI Updates
```typescript
it('should show loading state', () => {
  const { getByTestId } = render(<LoadingComponent loading={true} />);
  expect(getByTestId('loading-spinner')).toBeTruthy();
});
```

## Continuous Integration

Tests are automatically run on:
- Every commit
- Pull request creation
- Before deployment

Ensure all tests pass before merging code.