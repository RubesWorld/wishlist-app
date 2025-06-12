import { authService } from '../auth';
import { supabase } from '../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../supabase');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should successfully sign in with email and password', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authService.signIn('test@example.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should throw error when sign in fails', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(
        authService.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should clear session and storage on sign out', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
      
      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await authService.getCurrentUser();
      
      expect(user).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await authService.getCurrentUser();
      
      expect(user).toBeNull();
    });
  });
});