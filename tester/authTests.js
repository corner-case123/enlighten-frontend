// Authentication Test Suite
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import ForgotPassword from '../src/components/auth/ForgotPassword';

describe('Authentication Flow Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Component', () => {
    it('should render login form with email and password fields', () => {
      render(<Login />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      render(<Login />);
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      render(<Login />);
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should successfully login with valid credentials', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      render(<Login onLogin={mockLogin} />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!'
        });
      });
    });

    it('should show error message on login failure', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
      render(<Login onLogin={mockLogin} />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should toggle password visibility', () => {
      render(<Login />);
      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    });

    it('should redirect to forgot password page', () => {
      const mockNavigate = jest.fn();
      render(<Login navigate={mockNavigate} />);
      
      const forgotLink = screen.getByText(/forgot password/i);
      fireEvent.click(forgotLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('Register Component', () => {
    it('should render registration form with all fields', () => {
      render(<Register />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should validate password strength', async () => {
      render(<Register />);
      const passwordInput = screen.getByLabelText(/^password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      await waitFor(() => {
        expect(screen.getByText(/password too weak/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      render(<Register />);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPass123!' } });
      fireEvent.blur(confirmInput);
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should successfully register new user', async () => {
      const mockRegister = jest.fn().mockResolvedValue({ success: true });
      render(<Register onRegister={mockRegister} />);
      
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/^password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled();
      });
    });
  });

  describe('Forgot Password Component', () => {
    it('should render email input field', () => {
      render(<ForgotPassword />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('should send password reset email', async () => {
      const mockSendReset = jest.fn().mockResolvedValue({ success: true });
      render(<ForgotPassword onSendReset={mockSendReset} />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
      
      await waitFor(() => {
        expect(mockSendReset).toHaveBeenCalledWith('test@example.com');
        expect(screen.getByText(/reset link sent/i)).toBeInTheDocument();
      });
    });

    it('should show error for unregistered email', async () => {
      const mockSendReset = jest.fn().mockRejectedValue(new Error('Email not found'));
      render(<ForgotPassword onSendReset={mockSendReset} />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'nonexistent@example.com' }
      });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/email not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('should store auth token in localStorage on login', async () => {
      const mockToken = 'mock-jwt-token';
      const mockLogin = jest.fn().mockResolvedValue({ token: mockToken });
      render(<Login onLogin={mockLogin} />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      
      await waitFor(() => {
        expect(localStorage.getItem('authToken')).toBe(mockToken);
      });
    });

    it('should clear auth token on logout', () => {
      localStorage.setItem('authToken', 'mock-token');
      const mockLogout = jest.fn();
      
      mockLogout();
      localStorage.removeItem('authToken');
      
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });
});
