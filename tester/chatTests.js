// Chat Feature Test Suite
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ChatWindow from '../src/components/chat/ChatWindow';
import MessageInput from '../src/components/chat/MessageInput';
import Conversation from '../src/components/chat/Conversation';

describe('Chat Feature Tests', () => {
  const mockMessages = [
    { id: 1, text: 'Hello!', sender: 'user1', timestamp: '2026-01-01T10:00:00Z' },
    { id: 2, text: 'Hi there!', sender: 'user2', timestamp: '2026-01-01T10:01:00Z' },
    { id: 3, text: 'How are you?', sender: 'user1', timestamp: '2026-01-01T10:02:00Z' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ChatWindow Component', () => {
    it('should render chat window with messages', () => {
      render(<ChatWindow messages={mockMessages} />);
      expect(screen.getByText('Hello!')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
      expect(screen.getByText('How are you?')).toBeInTheDocument();
    });

    it('should display empty state when no messages', () => {
      render(<ChatWindow messages={[]} />);
      expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    });

    it('should scroll to bottom on new message', async () => {
      const { rerender } = render(<ChatWindow messages={mockMessages} />);
      const scrollIntoViewMock = vi.fn();
      window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
      
      const newMessages = [...mockMessages, {
        id: 4, text: 'New message', sender: 'user2', timestamp: '2026-01-01T10:03:00Z'
      }];
      
      rerender(<ChatWindow messages={newMessages} />);
      
      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    });

    it('should display user avatars', () => {
      render(<ChatWindow messages={mockMessages} showAvatars={true} />);
      const avatars = screen.getAllByRole('img', { name: /avatar/i });
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('should format timestamps correctly', () => {
      render(<ChatWindow messages={mockMessages} showTimestamps={true} />);
      expect(screen.getByText(/10:00/)).toBeInTheDocument();
      expect(screen.getByText(/10:01/)).toBeInTheDocument();
    });
  });

  describe('MessageInput Component', () => {
    it('should render message input field', () => {
      render(<MessageInput />);
      expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('should send message on button click', async () => {
      const mockSendMessage = vi.fn();
      render(<MessageInput onSendMessage={mockSendMessage} />);
      
      const input = screen.getByPlaceholderText(/type a message/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
      
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Test message');
      });
    });

    it('should send message on Enter key press', async () => {
      const mockSendMessage = vi.fn();
      render(<MessageInput onSendMessage={mockSendMessage} />);
      
      const input = screen.getByPlaceholderText(/type a message/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Test message');
      });
    });

    it('should not send empty messages', () => {
      const mockSendMessage = vi.fn();
      render(<MessageInput onSendMessage={mockSendMessage} />);
      
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should clear input after sending', async () => {
      const mockSendMessage = vi.fn();
      render(<MessageInput onSendMessage={mockSendMessage} />);
      
      const input = screen.getByPlaceholderText(/type a message/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));
      
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should show character count', () => {
      render(<MessageInput maxLength={200} showCharCount={true} />);
      const input = screen.getByPlaceholderText(/type a message/i);
      fireEvent.change(input, { target: { value: 'Hello' } });
      expect(screen.getByText('5/200')).toBeInTheDocument();
    });

    it('should disable send button when max length exceeded', () => {
      render(<MessageInput maxLength={10} />);
      const input = screen.getByPlaceholderText(/type a message/i);
      fireEvent.change(input, { target: { value: 'This is a very long message' } });
      expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    });
  });

  describe('Conversation Component', () => {
    const mockConversations = [
      { id: 1, name: 'John Doe', lastMessage: 'Hey!', unreadCount: 2 },
      { id: 2, name: 'Jane Smith', lastMessage: 'See you later', unreadCount: 0 },
      { id: 3, name: 'Bob Wilson', lastMessage: 'Thanks!', unreadCount: 5 }
    ];

    it('should render list of conversations', () => {
      render(<Conversation conversations={mockConversations} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should display unread message count', () => {
      render(<Conversation conversations={mockConversations} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should highlight active conversation', () => {
      render(<Conversation conversations={mockConversations} activeId={1} />);
      const activeConv = screen.getByText('John Doe').closest('div');
      expect(activeConv).toHaveClass('active');
    });

    it('should call onSelect when conversation is clicked', () => {
      const mockOnSelect = vi.fn();
      render(<Conversation conversations={mockConversations} onSelect={mockOnSelect} />);
      
      fireEvent.click(screen.getByText('Jane Smith'));
      expect(mockOnSelect).toHaveBeenCalledWith(2);
    });

    it('should show search bar', () => {
      render(<Conversation conversations={mockConversations} showSearch={true} />);
      expect(screen.getByPlaceholderText(/search conversations/i)).toBeInTheDocument();
    });

    it('should filter conversations by search query', () => {
      render(<Conversation conversations={mockConversations} showSearch={true} />);
      const searchInput = screen.getByPlaceholderText(/search conversations/i);
      
      fireEvent.change(searchInput, { target: { value: 'Jane' } });
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Real-time Chat Features', () => {
    it('should connect to WebSocket on mount', () => {
      const mockConnect = vi.fn();
      render(<ChatWindow onConnect={mockConnect} />);
      expect(mockConnect).toHaveBeenCalled();
    });

    it('should display typing indicator', () => {
      render(<ChatWindow isTyping={true} typingUser="John" />);
      expect(screen.getByText(/john is typing/i)).toBeInTheDocument();
    });

    it('should show online status', () => {
      const conversations = [
        { id: 1, name: 'John Doe', online: true },
        { id: 2, name: 'Jane Smith', online: false }
      ];
      render(<Conversation conversations={conversations} showOnlineStatus={true} />);
      expect(screen.getAllByTestId('online-indicator')).toHaveLength(1);
    });
  });
});
