// Profile Management Test Suite
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Profile from '../src/components/profile/Profile';
import ProfileDetails from '../src/components/profile/ProfileDetails';

describe('Profile Feature Tests', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    bio: 'Test bio',
    avatar: '/images/avatar.jpg',
    language: 'English',
    nativeLanguage: 'Bengali'
  };

  describe('Profile Display', () => {
    it('should render user profile information', () => {
      render(<Profile user={mockUser} />);
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });

    it('should display user avatar', () => {
      render(<Profile user={mockUser} />);
      const avatar = screen.getByRole('img', { name: /avatar/i });
      expect(avatar).toHaveAttribute('src', '/images/avatar.jpg');
    });

    it('should show default avatar when none provided', () => {
      const userWithoutAvatar = { ...mockUser, avatar: null };
      render(<Profile user={userWithoutAvatar} />);
      const avatar = screen.getByRole('img', { name: /avatar/i });
      expect(avatar).toHaveAttribute('src', expect.stringContaining('default'));
    });

    it('should display language preferences', () => {
      render(<ProfileDetails user={mockUser} />);
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Bengali')).toBeInTheDocument();
    });
  });

  describe('Profile Editing', () => {
    it('should enable edit mode on edit button click', () => {
      render(<Profile user={mockUser} editable={true} />);
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should update profile information', async () => {
      const mockUpdateProfile = vi.fn().mockResolvedValue({ success: true });
      render(<Profile user={mockUser} onUpdate={mockUpdateProfile} editable={true} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const bioInput = screen.getByLabelText(/bio/i);
      fireEvent.change(bioInput, { target: { value: 'Updated bio' } });
      
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith(
          expect.objectContaining({ bio: 'Updated bio' })
        );
      });
    });

    it('should validate required fields', async () => {
      render(<Profile user={mockUser} editable={true} />);
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      });
    });

    it('should cancel edit mode without saving', () => {
      render(<Profile user={mockUser} editable={true} />);
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const bioInput = screen.getByLabelText(/bio/i);
      fireEvent.change(bioInput, { target: { value: 'Temporary change' } });
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });
  });

  describe('Avatar Upload', () => {
    it('should open file picker on avatar click', () => {
      render(<Profile user={mockUser} editable={true} />);
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const avatarUpload = screen.getByLabelText(/upload avatar/i);
      expect(avatarUpload).toBeInTheDocument();
    });

    it('should upload and preview new avatar', async () => {
      const mockUpload = vi.fn().mockResolvedValue({ url: '/images/new-avatar.jpg' });
      render(<Profile user={mockUser} onAvatarUpload={mockUpload} editable={true} />);
      
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      const input = screen.getByLabelText(/upload avatar/i);
      
      Object.defineProperty(input, 'files', {
        value: [file]
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalled();
      });
    });

    it('should validate file type', async () => {
      render(<Profile user={mockUser} editable={true} />);
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const file = new File(['document'], 'doc.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/upload avatar/i);
      
      Object.defineProperty(input, 'files', {
        value: [file]
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
      });
    });

    it('should validate file size', async () => {
      render(<Profile user={mockUser} maxFileSize={1000000} editable={true} />);
      fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      
      const largeFile = new File(['x'.repeat(2000000)], 'large.png', { type: 'image/png' });
      const input = screen.getByLabelText(/upload avatar/i);
      
      Object.defineProperty(input, 'files', {
        value: [largeFile]
      });
      
      fireEvent.change(input);
      
      await waitFor(() => {
        expect(screen.getByText(/file too large/i)).toBeInTheDocument();
      });
    });
  });

  describe('Profile Settings', () => {
    it('should display privacy settings', () => {
      render(<Profile user={mockUser} showSettings={true} />);
      expect(screen.getByText(/privacy settings/i)).toBeInTheDocument();
    });

    it('should toggle profile visibility', async () => {
      const mockUpdateSettings = vi.fn();
      render(<Profile user={mockUser} onUpdateSettings={mockUpdateSettings} showSettings={true} />);
      
      const visibilityToggle = screen.getByRole('checkbox', { name: /public profile/i });
      fireEvent.click(visibilityToggle);
      
      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith(
          expect.objectContaining({ isPublic: expect.any(Boolean) })
        );
      });
    });

    it('should update notification preferences', async () => {
      const mockUpdateSettings = vi.fn();
      render(<Profile user={mockUser} onUpdateSettings={mockUpdateSettings} showSettings={true} />);
      
      const emailNotif = screen.getByRole('checkbox', { name: /email notifications/i });
      fireEvent.click(emailNotif);
      
      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalled();
      });
    });
  });
});
