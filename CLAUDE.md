# Claude Development Guidelines

## Test-Driven Development (TDD) Process

This project follows strict TDD practices. When implementing any new feature or fixing bugs, follow this process:

### 1. Red Phase - Write Failing Test First
Before writing any implementation code, create a test that describes the expected behavior:
```typescript
// Example: Write test for new user registration
it('should register a new user with valid data', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'Test123!' });
  
  expect(response.status).toBe(201);
  expect(response.body.user.email).toBe('test@example.com');
});
```

### 2. Green Phase - Write Minimal Code
Implement just enough code to make the test pass:
```typescript
// Implement only what's needed to pass the test
async register(email: string, password: string) {
  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  });
  return user;
}
```

### 3. Refactor Phase - Improve Code Quality
Once tests pass, refactor for clarity and maintainability while keeping tests green:
- Extract constants
- Improve naming
- Remove duplication
- Add error handling

### 4. Repeat
Continue with the next test case, building functionality incrementally.

## Testing Commands

### Frontend Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for TDD
npm run test:coverage # Check coverage (must be >80%)
```

### Backend Testing
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode for TDD
npm run test:unit     # Unit tests only
npm run test:e2e      # Integration tests
npm run test:coverage # Check coverage (must be >80%)
```

## Testing Rules

1. **No code without tests**: Every new feature must have tests written first
2. **Coverage threshold**: Maintain minimum 80% code coverage
3. **Test isolation**: Each test must be independent
4. **Mock external services**: Use mocks for Supabase, AWS, etc.
5. **Descriptive test names**: Test names should clearly describe the scenario

## Test File Locations

- Component tests: `src/components/__tests__/`
- Service tests: `src/services/__tests__/`
- API tests: `backend/src/controllers/__tests__/`
- E2E tests: `e2e/` directories

## Before Committing

Always run these commands before committing:
```bash
# Frontend
npm test
npm run lint
npm run type-check

# Backend
cd backend
npm test
npm run lint
npm run build
```

## Example TDD Workflow

When asked to implement a new feature:

1. First, ask for the requirements and acceptance criteria
2. Write failing tests that cover all requirements
3. Show the failing tests to confirm understanding
4. Implement code to make tests pass
5. Refactor and ensure all tests still pass
6. Run linting and type checking
7. Confirm all tests pass with coverage report

Remember: Red → Green → Refactor → Repeat