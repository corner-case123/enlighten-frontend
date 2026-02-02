// API Integration Test Suite
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import * as api from '../src/services/newsService';

describe('API Integration Tests', () => {
  let axiosMock;

  beforeEach(() => {
    axiosMock = vi.spyOn(axios, 'get');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('News Service API', () => {
    it('should fetch all news articles', async () => {
      const mockNews = [
        { id: 1, title: 'News 1', content: 'Content 1' },
        { id: 2, title: 'News 2', content: 'Content 2' }
      ];
      
      axiosMock.mockResolvedValue({ data: mockNews });
      const result = await api.fetchNews();
      
      expect(result).toEqual(mockNews);
      expect(axiosMock).toHaveBeenCalledWith('/api/news');
    });

    it('should handle API errors gracefully', async () => {
      axiosMock.mockRejectedValue(new Error('Network error'));
      
      await expect(api.fetchNews()).rejects.toThrow('Network error');
    });

    it('should fetch news by category', async () => {
      const mockNews = [{ id: 1, title: 'Tech News', category: 'technology' }];
      axiosMock.mockResolvedValue({ data: mockNews });
      
      const result = await api.fetchNewsByCategory('technology');
      
      expect(result).toEqual(mockNews);
      expect(axiosMock).toHaveBeenCalledWith('/api/news/category/technology');
    });

    it('should fetch single news article by id', async () => {
      const mockArticle = { id: 1, title: 'News 1', content: 'Full content' };
      axiosMock.mockResolvedValue({ data: mockArticle });
      
      const result = await api.fetchNewsById(1);
      
      expect(result).toEqual(mockArticle);
      expect(axiosMock).toHaveBeenCalledWith('/api/news/1');
    });

    it('should return 404 for non-existent article', async () => {
      axiosMock.mockRejectedValue({ response: { status: 404 } });
      
      await expect(api.fetchNewsById(999)).rejects.toMatchObject({
        response: { status: 404 }
      });
    });
  });

  describe('Authentication API', () => {
    it('should send login request with credentials', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockResolvedValue({
        data: { token: 'jwt-token', user: { id: 1, email: 'test@test.com' } }
      });
      
      const credentials = { email: 'test@test.com', password: 'password123' };
      await api.login(credentials);
      
      expect(mockPostFn).toHaveBeenCalledWith('/api/auth/login', credentials);
    });

    it('should handle invalid login credentials', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockRejectedValue({
        response: { status: 401, data: { message: 'Invalid credentials' } }
      });
      
      await expect(api.login({ email: 'wrong@test.com', password: 'wrong' }))
        .rejects.toMatchObject({ response: { status: 401 } });
    });

    it('should register new user', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockResolvedValue({
        data: { success: true, user: { id: 1, email: 'new@test.com' } }
      });
      
      const userData = {
        email: 'new@test.com',
        password: 'password123',
        username: 'newuser'
      };
      
      await api.register(userData);
      expect(mockPostFn).toHaveBeenCalledWith('/api/auth/register', userData);
    });

    it('should handle duplicate email during registration', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockRejectedValue({
        response: { status: 409, data: { message: 'Email already exists' } }
      });
      
      await expect(api.register({ email: 'existing@test.com' }))
        .rejects.toMatchObject({ response: { status: 409 } });
    });
  });

  describe('Chat API', () => {
    it('should fetch conversation history', async () => {
      const mockMessages = [
        { id: 1, text: 'Hello', sender: 'user1' },
        { id: 2, text: 'Hi', sender: 'user2' }
      ];
      
      axiosMock.mockResolvedValue({ data: mockMessages });
      const result = await api.fetchMessages(1);
      
      expect(result).toEqual(mockMessages);
      expect(axiosMock).toHaveBeenCalledWith('/api/chat/1/messages');
    });

    it('should send new message', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockResolvedValue({
        data: { id: 3, text: 'New message', sender: 'user1' }
      });
      
      const message = { text: 'New message', conversationId: 1 };
      await api.sendMessage(message);
      
      expect(mockPostFn).toHaveBeenCalledWith('/api/chat/messages', message);
    });

    it('should handle rate limiting', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockRejectedValue({
        response: { status: 429, data: { message: 'Too many requests' } }
      });
      
      await expect(api.sendMessage({ text: 'test' }))
        .rejects.toMatchObject({ response: { status: 429 } });
    });
  });

  describe('Profile API', () => {
    it('should fetch user profile', async () => {
      const mockProfile = {
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        bio: 'Test bio'
      };
      
      axiosMock.mockResolvedValue({ data: mockProfile });
      const result = await api.fetchProfile(1);
      
      expect(result).toEqual(mockProfile);
      expect(axiosMock).toHaveBeenCalledWith('/api/profile/1');
    });

    it('should update user profile', async () => {
      const mockPutFn = vi.spyOn(axios, 'put').mockResolvedValue({
        data: { success: true }
      });
      
      const updates = { bio: 'Updated bio' };
      await api.updateProfile(1, updates);
      
      expect(mockPutFn).toHaveBeenCalledWith('/api/profile/1', updates);
    });

    it('should upload profile avatar', async () => {
      const mockPostFn = vi.spyOn(axios, 'post').mockResolvedValue({
        data: { url: '/uploads/avatar.jpg' }
      });
      
      const formData = new FormData();
      formData.append('avatar', new File([''], 'avatar.jpg'));
      
      await api.uploadAvatar(formData);
      expect(mockPostFn).toHaveBeenCalledWith(
        '/api/profile/avatar',
        formData,
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      );
    });
  });
});
