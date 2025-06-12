import request from 'supertest';
import express from 'express';
import { authController } from '../auth.controller';
import { authService } from '../../services/auth.service';
import { validationMiddleware } from '../../middleware/validation.middleware';

jest.mock('../../services/auth.service');

const app = express();
app.use(express.json());

// Setup routes for testing
app.post('/auth/register', validationMiddleware.register, authController.register);
app.post('/auth/login', validationMiddleware.login, authController.login);
app.post('/auth/refresh', authController.refreshToken);
app.get('/auth/me', authController.getCurrentUser);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      };

      const mockResponse = {
        user: { id: '123', email: newUser.email, name: newUser.name },
        token: 'jwt-token-123',
      };

      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
      });
      expect(authService.register).toHaveBeenCalledWith(newUser);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!@#',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 409 when email already exists', async () => {
      (authService.register as jest.Mock).mockRejectedValue(
        new Error('Email already exists')
      );

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Test123!@#',
          name: 'Test User',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockResponse = {
        user: { id: '123', email: credentials.email },
        token: 'jwt-token-123',
        refreshToken: 'refresh-token-123',
      };

      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
      });
      expect(authService.login).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
    });

    it('should return 401 for invalid credentials', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        token: 'new-jwt-token',
        refreshToken: 'new-refresh-token',
      };

      (authService.refreshToken as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'old-refresh-token' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
      });
    });

    it('should return 401 for invalid refresh token', async () => {
      (authService.refreshToken as jest.Mock).mockRejectedValue(
        new Error('Invalid refresh token')
      );

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});