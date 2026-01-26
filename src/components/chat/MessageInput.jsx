"use client";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage } from "@/features/user/chatSlice";
import {
  FiImage,
  FiMic,
  FiSmile,
  FiSend,
  FiX,
  FiPaperclip,
} from "react-icons/fi";
import { FaStackExchange } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";

const Modal = ({ closeModal, selectedLanguage, setSelectedLanguage, translationMode, setTranslationMode }) => {
  const [tempLanguage, setTempLanguage] = useState(selectedLanguage || "none");
  const [tempMode, setTempMode] = useState(translationMode || "neutral");
  
  const handleLanguageChange = (e) => {
    setTempLanguage(e.target.value);
  };
  
  const handleModeChange = (e) => {
    setTempMode(e.target.value);
  };
  
  const handleSave = () => {
    setSelectedLanguage(tempLanguage);
    setTranslationMode(tempMode);
    localStorage.setItem('chatTranslationLanguage', tempLanguage);
    localStorage.setItem('chatTranslationMode', tempMode);
    toast.success(`Translation set to ${tempLanguage === 'none' ? 'None (disabled)' : tempLanguage} with ${tempMode} mode`);
    closeModal();
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="glass-card rounded-3xl p-8 relative w-full max-w-lg mx-4 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors hover:scale-110"
          onClick={closeModal}
        >
          <FiX className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-2 gradient-text">
          Translation Settings
        </h2>
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          Your messages will be automatically translated to the selected language and tone style.
        </p>
        
        {/* Translation Mode Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Translation Mode</h3>
          <div className="space-y-3">
            <div>
              <input 
                type="radio" 
                id="neutral" 
                name="mode" 
                value="neutral" 
                checked={tempMode === "neutral"}
                onChange={handleModeChange}
              />
              <label htmlFor="neutral" className="ml-2 text-gray-300">
                <span className="font-medium text-blue-400">Neutral</span> - Standard, natural translation
              </label>
            </div>
            <div>
              <input 
                type="radio" 
                id="polite" 
                name="mode" 
                value="polite" 
                checked={tempMode === "polite"}
                onChange={handleModeChange}
              />
              <label htmlFor="polite" className="ml-2 text-gray-300">
                <span className="font-medium text-green-400">Polite</span> - Formal, respectful tone with honorifics
              </label>
            </div>
            <div>
              <input 
                type="radio" 
                id="aggressive" 
                name="mode" 
                value="aggressive" 
                checked={tempMode === "aggressive"}
                onChange={handleModeChange}
              />
              <label htmlFor="aggressive" className="ml-2 text-gray-300">
                <span className="font-medium text-red-400">Aggressive</span> - Casual, direct tone (e.g., "কেমন আছিস" vs "কেমন আছেন")
              </label>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Language</h3>
          <ul className="space-y-3">
            <li>
              <input 
                type="radio" 
                id="none" 
                name="language" 
                value="none" 
                checked={tempLanguage === "none"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="none" className="ml-2 text-gray-300">
                None (No translation)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="chinese" 
                name="language" 
                value="zh-CN" 
                checked={tempLanguage === "zh-CN"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="chinese" className="ml-2 text-gray-300">
                Chinese (中文)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="french" 
                name="language" 
                value="fr" 
                checked={tempLanguage === "fr"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="french" className="ml-2 text-gray-300">
                French (Français)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="english" 
                name="language" 
                value="en" 
                checked={tempLanguage === "en"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="english" className="ml-2 text-gray-300">
                English (English)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="bangla" 
                name="language" 
                value="bn" 
                checked={tempLanguage === "bn"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="bangla" className="ml-2 text-gray-300">
                Bangla (বাংলা)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="arabic" 
                name="language" 
                value="ar" 
                checked={tempLanguage === "ar"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="arabic" className="ml-2 text-gray-300">
                Arabic (العربية)
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                id="urdu" 
                name="language" 
                value="ur" 
                checked={tempLanguage === "ur"}
                onChange={handleLanguageChange}
              />
              <label htmlFor="urdu" className="ml-2 text-gray-300">
                Urdu (اردو)
              </label>
            </li>
          </ul>
        </div>
        <button 
          onClick={handleSave}
          className="mt-6 w-full btn-primary"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

// Helper function to translate text using Gemini Flash 2.5 via backend API
const translateText = async (text, targetLanguage, mode = 'neutral') => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLanguage: targetLanguage,
        mode: mode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Re-throw to be handled by calling function
  }
};

const MessageInput = ({ scrollToBottom }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef(null);

  // Get the saved translation language and mode from localStorage or default to 'none' and 'neutral'
  const [selectedLanguage, setSelectedLanguage] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('chatTranslationLanguage') || 'none' : 'none'
  );
  const [translationMode, setTranslationMode] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('chatTranslationMode') || 'neutral' : 'neutral'
  );

  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || !selectedUser || !currentUser)
      return;

    try {
      // Show translating indicator if translation is enabled
      if (selectedLanguage !== 'none' && message.trim()) {
        setIsTranslating(true);
      }
      
      const formData = new FormData();
      
      // Translate the message if a language is selected and it's not 'none'
      let finalMessage = message.trim();
      let originalMessage = '';
      
      if (selectedLanguage !== 'none' && finalMessage) {
        try {
          // Store the original message
          originalMessage = finalMessage;
          
          // Translate the message with the selected mode
          const translatedText = await translateText(finalMessage, selectedLanguage, translationMode);
          
          // Use only the translated text (no original message display)
          finalMessage = translatedText;
          
        } catch (error) {
          console.error('Translation failed:', error);
          toast.error('Translation failed, sending original message');
          // Use original message if translation fails
          finalMessage = originalMessage;
        } finally {
          setIsTranslating(false);
        }
      }
      
      // Add the final message content to the form data
      if (finalMessage) {
        formData.append("content", finalMessage);
      }
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      
      formData.append("receiverId", selectedUser._id);
      formData.append("senderId", currentUser._id);
      formData.append(
        "participants",
        JSON.stringify([currentUser._id, selectedUser._id])
      );

      await dispatch(createNewMessage(formData)).unwrap();
      setMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      if (scrollToBottom) {
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setIsTranslating(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="relative border-t border-gray-700/50 glass-card-light backdrop-blur-xl rounded-br-3xl p-6">
        {/* Translation Status Indicator */}
        {selectedLanguage !== 'none' && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#074C77]/10 to-[#0a6ba8]/10 rounded-2xl flex items-center justify-between border border-[#074C77]/20 shadow-lg shadow-[#074C77]/10">
            <div className="flex items-center">
              <span className="text-sm text-[#074C77] font-medium">
                Translation: <span className="font-bold">{selectedLanguage}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  translationMode === 'polite' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  translationMode === 'aggressive' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {translationMode.toUpperCase()}
                </span>
                {isTranslating && <span className="ml-2 animate-pulse text-[#0a6ba8]">Translating...</span>}
              </span>
            </div>
          </div>
        )}
        
        {/* File Preview */}
        {selectedFile && (
          <div className="mb-4 p-4 glass-card rounded-2xl flex items-center justify-between border border-gray-600/30">
            <div className="flex items-center">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-xl border border-gray-600/50"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 rounded-xl flex items-center justify-center">
                  <FiPaperclip className="w-6 h-6 text-[#074C77]" />
                </div>
              )}
              <span className="ml-3 text-sm text-gray-300 font-medium">{selectedFile.name}</span>
            </div>
            <button
              onClick={removeSelectedFile}
              className="ml-2 text-gray-400 hover:text-red-400 transition-colors hover:scale-110"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 text-gray-400 hover:text-[#074C77] transition-all duration-300 hover:scale-110 hover:bg-[#074C77]/10 rounded-2xl"
            >
              <FiSmile className="w-6 h-6" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-[#407023] transition-all duration-300 hover:scale-110 hover:bg-[#407023]/10 rounded-2xl"
          >
            <FiPaperclip className="w-6 h-6" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 glass-input p-4 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#074C77]/50 focus:border-[#074C77]/50"
            onFocus={() => setShowEmojiPicker(false)}
          />

          <button
            type="submit"
            disabled={!message.trim() && !selectedFile || isTranslating}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              (message.trim() || selectedFile) && !isTranslating
                ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white hover:from-[#0a6ba8] hover:to-[#074C77] hover:scale-110 shadow-lg shadow-[#074C77]/30 hover:shadow-[#074C77]/50"
                : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isTranslating ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-[#074C77] rounded-full animate-spin"></div>
            ) : (
              <IoSend className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>

      {/* Translation Settings Button */}
      <div className="flex items-center pl-4">
        <button
          type="button"
          className={`p-3 rounded-2xl text-white transition-all duration-300 hover:scale-110 ${
            selectedLanguage !== 'none' 
              ? 'bg-gradient-to-r from-[#407023] to-[#5a9e32] hover:from-[#5a9e32] hover:to-[#407023] shadow-lg shadow-[#407023]/30' 
              : 'bg-gradient-to-r from-[#074C77] to-[#0a6ba8] hover:from-[#0a6ba8] hover:to-[#074C77] shadow-lg shadow-[#074C77]/30'
          }`}
          onClick={openModal}
          title="Translation Settings"
        >
          <FaStackExchange size={20} />
        </button>
        {selectedLanguage !== 'none' && (
          <div className="ml-3 flex items-center space-x-2">
            <span className="text-xs text-[#5a9e32] font-semibold px-2 py-1 bg-[#407023]/20 rounded-full border border-[#407023]/30">
              {selectedLanguage}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
              translationMode === 'polite' ? 'text-green-400 bg-green-500/20 border-green-500/30' :
              translationMode === 'aggressive' ? 'text-red-400 bg-red-500/20 border-red-500/30' :
              'text-blue-400 bg-blue-500/20 border-blue-500/30'
            }`}>
              {translationMode.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Modal for Changing Conversation Language */}
      {isModalOpen && (
        <Modal 
          closeModal={closeModal} 
          selectedLanguage={selectedLanguage} 
          setSelectedLanguage={setSelectedLanguage}
          translationMode={translationMode}
          setTranslationMode={setTranslationMode}
        />
      )}
    </>
  );
};

export default MessageInput;
