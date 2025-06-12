import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app';

const prisma = new PrismaClient();

describe('API E2E Tests', () => {
  let authToken: string;
  let userId: string;
  let wishlistId: string;

  beforeAll(async () => {
    // Clean database
    await prisma.product.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'e2e@example.com',
          password: 'Test123!@#',
          name: 'E2E Test User',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('e2e@example.com');
      expect(response.body.data.token).toBeDefined();
      
      userId = response.body.data.user.id;
    });

    it('should login with registered user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'Test123!@#',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
      authToken = response.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('e2e@example.com');
    });
  });

  describe('Wishlist Management', () => {
    it('should create a new wishlist', async () => {
      const response = await request(app)
        .post('/api/wishlists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Birthday Wishlist',
          description: 'Items I want for my birthday',
          isPublic: true,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Birthday Wishlist');
      
      wishlistId = response.body.data.id;
    });

    it('should get user wishlists', async () => {
      const response = await request(app)
        .get('/api/wishlists')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(wishlistId);
    });

    it('should update wishlist', async () => {
      const response = await request(app)
        .put(`/api/wishlists/${wishlistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Birthday Wishlist',
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Birthday Wishlist');
    });
  });

  describe('Product Management', () => {
    let productId: string;

    it('should add product to wishlist', async () => {
      const response = await request(app)
        .post(`/api/wishlists/${wishlistId}/products`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://www.amazon.com/dp/B08N5WRWNW',
          customTitle: 'Echo Dot (4th Gen)',
          customPrice: 49.99,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.url).toBe('https://www.amazon.com/dp/B08N5WRWNW');
      
      productId = response.body.data.id;
    });

    it('should get products in wishlist', async () => {
      const response = await request(app)
        .get(`/api/wishlists/${wishlistId}/products`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(productId);
    });

    it('should update product', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customPrice: 39.99,
          notes: 'On sale now!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.customPrice).toBe(39.99);
      expect(response.body.data.notes).toBe('On sale now!');
    });

    it('should delete product from wishlist', async () => {
      await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deletion
      const response = await request(app)
        .get(`/api/wishlists/${wishlistId}/products`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('Public Wishlist Access', () => {
    it('should access public wishlist without authentication', async () => {
      const response = await request(app)
        .get(`/api/wishlists/${wishlistId}/public`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Birthday Wishlist');
      expect(response.body.data.user).toBeUndefined(); // User info should be excluded
    });

    it('should not access private wishlist without authentication', async () => {
      // First, make wishlist private
      await request(app)
        .put(`/api/wishlists/${wishlistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isPublic: false })
        .expect(200);

      // Try to access without auth
      await request(app)
        .get(`/api/wishlists/${wishlistId}/public`)
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for unauthorized requests', async () => {
      await request(app)
        .get('/api/wishlists')
        .expect(401);
    });

    it('should return 404 for non-existent resources', async () => {
      await request(app)
        .get('/api/wishlists/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/wishlists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required field 'name'
          description: 'Invalid wishlist',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});