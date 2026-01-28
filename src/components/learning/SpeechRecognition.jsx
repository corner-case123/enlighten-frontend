import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";


const systemMessage = {
  role: "system",
  content:
    "You are a helpful language tutor teaching different languages. Help the user with their language learning journey.",
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Ask Enlighten Anything!",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing", // User messages on the right
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setIsTyping(true);
    await processMessageToChatGPT([...messages, newMessage]);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message,
    }));

    const apiRequestBody = {
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/learning/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.error || "An error occurred while connecting to Enlighten.",
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        return;
      }

      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: data.response,
            sender: "ChatGPT",
            direction: "incoming", // ChatGPT messages on the left
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsTyping(false);
  }

  return (
    <div className="App w-full flex justify-center items-center p-4">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden h-[700px] flex flex-col relative bg-gray-900 border border-gray-700 shadow-2xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-wide">Talk to Enlighten</h2>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden bg-gray-950">
          <MainContainer className="!border-none !bg-transparent h-full">
            <ChatContainer className="!bg-transparent">
              <MessageList
                className="!bg-transparent p-4"
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="Enlighten is typing..." className="!bg-transparent !text-gray-400 font-medium" />
                  ) : null
                }
              >
                {messages.map((msg, index) => (
                  <Message key={index} model={msg} className="mb-4 font-medium" />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type your message..."
                onSend={handleSend}
                className="!border-t !border-gray-700 !bg-gray-900 !p-4 !font-medium !text-base"
                style={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  backgroundColor: '#111827 !important',
                  color: '#ffffff !important',
                  border: '1px solid #374151 !important',
                  borderTop: '1px solid #374151 !important'
                }}
              />
            </ChatContainer>
          </MainContainer>
        </div>
        
        {/* Custom CSS to override chat UI kit styles */}
        <style jsx global>{`
          .cs-message-input {
            background-color: #111827 !important;
            border: 1px solid #374151 !important;
            border-top: 1px solid #374151 !important;
          }
          
          .cs-message-input__content-editor {
            background-color: #111827 !important;
            color: #ffffff !important;
            border: none !important;
          }
          
          .cs-message-input__content-editor:focus {
            background-color: #111827 !important;
            color: #ffffff !important;
            outline: none !important;
            border: none !important;
          }
          
          .cs-message-input__content-editor-wrapper {
            background-color: #111827 !important;
            border: none !important;
          }
          
          .cs-message-input__tools {
            background-color: #111827 !important;
          }
          
          .cs-message-input .cs-button {
            color: #ffffff !important;
          }
          
          /* Remove any white borders */
          .cs-message-input * {
            border-color: #374151 !important;
          }
          
          /* Ensure placeholder text is visible */
          .cs-message-input__content-editor::placeholder {
            color: #9CA3AF !important;
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;
