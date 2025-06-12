import { device, element, by, expect as detoxExpect } from 'detox';

describe('Authentication E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Login Flow', () => {
    it('should show login screen on app launch', async () => {
      await detoxExpect(element(by.id('login-screen'))).toBeVisible();
      await detoxExpect(element(by.id('email-input'))).toBeVisible();
      await detoxExpect(element(by.id('password-input'))).toBeVisible();
      await detoxExpect(element(by.id('login-button'))).toBeVisible();
    });

    it('should show validation errors for empty fields', async () => {
      await element(by.id('login-button')).tap();
      
      await detoxExpect(element(by.text('Email is required'))).toBeVisible();
      await detoxExpect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
      await element(by.id('email-input')).typeText('invalid@example.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-button')).tap();

      await detoxExpect(element(by.text('Invalid email or password'))).toBeVisible();
    });

    it('should login successfully with valid credentials', async () => {
      await element(by.id('email-input')).clearText();
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('Test123!@#');
      await element(by.id('login-button')).tap();

      // Should navigate to home screen
      await detoxExpect(element(by.id('home-screen'))).toBeVisible();
      await detoxExpect(element(by.text('Welcome back!'))).toBeVisible();
    });
  });

  describe('Registration Flow', () => {
    it('should navigate to registration screen', async () => {
      await element(by.id('register-link')).tap();
      await detoxExpect(element(by.id('register-screen'))).toBeVisible();
    });

    it('should validate password requirements', async () => {
      await element(by.id('password-input')).typeText('weak');
      await element(by.id('register-button')).tap();

      await detoxExpect(
        element(by.text('Password must be at least 8 characters'))
      ).toBeVisible();
    });

    it('should register new user successfully', async () => {
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      await element(by.id('name-input')).typeText('Test User');
      await element(by.id('email-input')).typeText(email);
      await element(by.id('password-input')).clearText();
      await element(by.id('password-input')).typeText('Test123!@#');
      await element(by.id('confirm-password-input')).typeText('Test123!@#');
      await element(by.id('register-button')).tap();

      // Should show success message and navigate to login
      await detoxExpect(element(by.text('Registration successful!'))).toBeVisible();
      await detoxExpect(element(by.id('login-screen'))).toBeVisible();
    });
  });

  describe('Logout Flow', () => {
    it('should logout successfully', async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('Test123!@#');
      await element(by.id('login-button')).tap();

      // Navigate to settings
      await element(by.id('settings-tab')).tap();
      await element(by.id('logout-button')).tap();

      // Confirm logout
      await element(by.text('Yes, Logout')).tap();

      // Should return to login screen
      await detoxExpect(element(by.id('login-screen'))).toBeVisible();
    });
  });
});