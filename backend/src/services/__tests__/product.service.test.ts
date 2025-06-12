import { PrismaClient } from '@prisma/client';
import { productService } from '../product.service';
import { linkParserService } from '../link-parser.service';

jest.mock('../link-parser.service');

const prisma = new PrismaClient();

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product from URL', async () => {
      const mockProductData = {
        title: 'Test Product',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test description',
        availability: 'in_stock',
      };

      (linkParserService.parseProductUrl as jest.Mock).mockResolvedValue(mockProductData);
      
      const mockCreatedProduct = {
        id: '123',
        ...mockProductData,
        url: 'https://example.com/product',
        wishlistId: 'wishlist-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);

      const result = await productService.createProduct(
        'https://example.com/product',
        'wishlist-123'
      );

      expect(linkParserService.parseProductUrl).toHaveBeenCalledWith(
        'https://example.com/product'
      );
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          ...mockProductData,
          url: 'https://example.com/product',
          wishlistId: 'wishlist-123',
        },
      });
      expect(result).toEqual(mockCreatedProduct);
    });

    it('should throw error when URL parsing fails', async () => {
      (linkParserService.parseProductUrl as jest.Mock).mockRejectedValue(
        new Error('Failed to parse URL')
      );

      await expect(
        productService.createProduct('https://invalid-url.com', 'wishlist-123')
      ).rejects.toThrow('Failed to parse URL');

      expect(prisma.product.create).not.toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updateData = {
        title: 'Updated Product',
        price: 149.99,
      };

      const mockUpdatedProduct = {
        id: '123',
        ...updateData,
        url: 'https://example.com/product',
        wishlistId: 'wishlist-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.product.update as jest.Mock).mockResolvedValue(mockUpdatedProduct);

      const result = await productService.updateProduct('123', updateData);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should throw error when product not found', async () => {
      (prisma.product.update as jest.Mock).mockRejectedValue(
        new Error('Product not found')
      );

      await expect(
        productService.updateProduct('non-existent', { title: 'New Title' })
      ).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue({ id: '123' });

      await productService.deleteProduct('123');

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });
  });

  describe('checkPriceChanges', () => {
    it('should detect and update price changes', async () => {
      const mockProducts = [
        {
          id: '123',
          url: 'https://example.com/product1',
          price: 99.99,
          title: 'Product 1',
        },
        {
          id: '456',
          url: 'https://example.com/product2',
          price: 149.99,
          title: 'Product 2',
        },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      // Mock price changes
      (linkParserService.parseProductUrl as jest.Mock)
        .mockResolvedValueOnce({ price: 79.99 }) // Price drop for product 1
        .mockResolvedValueOnce({ price: 149.99 }); // No change for product 2

      const priceChanges = await productService.checkPriceChanges();

      expect(priceChanges).toHaveLength(1);
      expect(priceChanges[0]).toEqual({
        productId: '123',
        oldPrice: 99.99,
        newPrice: 79.99,
        changePercent: -20,
      });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { price: 79.99 },
      });
    });
  });
});