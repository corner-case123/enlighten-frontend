import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [translationLanguage, setTranslationLanguage] = useState("english");
  const chatContainerRef = useRef(null);

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "bn", label: "Bengali" },
    { value: "zh", label: "Chinese" },
    { value: "hi", label: "Hindi" },
    { value: "ar", label: "Arabic" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "nl", label: "Dutch" },
    { value: "tr", label: "Turkish" },
    { value: "pl", label: "Polish" },
    { value: "vi", label: "Vietnamese" },
    { value: "th", label: "Thai" },
    { value: "uk", label: "Ukrainian" },
    { value: "el", label: "Greek" },
    { value: "cs", label: "Czech" },
    { value: "sv", label: "Swedish" },
    { value: "da", label: "Danish" },
    { value: "fi", label: "Finnish" },
    { value: "no", label: "Norwegian" },
    { value: "hu", label: "Hungarian" },
    { value: "ro", label: "Romanian" },
    { value: "id", label: "Indonesian" },
    { value: "ms", label: "Malay" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "ur", label: "Urdu" },
    { value: "fa", label: "Persian" },
    { value: "sw", label: "Swahili" },
    { value: "zu", label: "Zulu" },
    { value: "xh", label: "Xhosa" },
    { value: "af", label: "Afrikaans" },
    { value: "sq", label: "Albanian" },
    { value: "hy", label: "Armenian" },
    { value: "az", label: "Azerbaijani" },
    { value: "eu", label: "Basque" },
    { value: "be", label: "Belarusian" },
    { value: "bg", label: "Bulgarian" },
    { value: "ca", label: "Catalan" },
    { value: "hr", label: "Croatian" },
    { value: "et", label: "Estonian" },
    { value: "tl", label: "Filipino" },
    { value: "gl", label: "Galician" },
    { value: "ka", label: "Georgian" },
    { value: "gu", label: "Gujarati" },
    { value: "ht", label: "Haitian Creole" },
    { value: "ha", label: "Hausa" },
    { value: "iw", label: "Hebrew" },
    { value: "is", label: "Icelandic" },
    { value: "ga", label: "Irish" },
    { value: "jw", label: "Javanese" },
    { value: "kn", label: "Kannada" },
    { value: "kk", label: "Kazakh" },
    { value: "km", label: "Khmer" },
    { value: "lo", label: "Lao" },
    { value: "la", label: "Latin" },
    { value: "lv", label: "Latvian" },
    { value: "lt", label: "Lithuanian" },
    { value: "mk", label: "Macedonian" },
    { value: "mg", label: "Malagasy" },
    { value: "ml", label: "Malayalam" },
    { value: "mt", label: "Maltese" },
    { value: "mi", label: "Maori" },
    { value: "mr", label: "Marathi" },
    { value: "mn", label: "Mongolian" },
    { value: "ne", label: "Nepali" },
    { value: "ps", label: "Pashto" },
    { value: "pa", label: "Punjabi" },
    { value: "sm", label: "Samoan" },
    { value: "gd", label: "Scottish Gaelic" },
    { value: "sr", label: "Serbian" },
    { value: "st", label: "Sesotho" },
    { value: "sn", label: "Shona" },
    { value: "sd", label: "Sindhi" },
    { value: "si", label: "Sinhala" },
    { value: "sk", label: "Slovak" },
    { value: "sl", label: "Slovenian" },
    { value: "so", label: "Somali" },
    { value: "su", label: "Sundanese" },
    { value: "tg", label: "Tajik" },
    { value: "tt", label: "Tatar" },
    { value: "cy", label: "Welsh" },
    { value: "yi", label: "Yiddish" },
    { value: "yo", label: "Yoruba" },
    { value: "zu", label: "Zulu" },
  ];

  const topics = [
    { value: "general", label: "General Conversation" },
    { value: "business", label: "Business" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food & Dining" },
    { value: "culture", label: "Culture" },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const translateText = async (text, sourceLanguage, targetLanguage) => {
    try {
      // Use Google's translation API directly
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Extract the translated text from the response
      const translatedText = data[0].map(item => item[0]).join('');
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
      // Fallback to the backend API if direct translation fails
      try {
        const backupResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/learning/translate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              sourceLanguage,
              targetLanguage,
            }),
          }
        );

        if (!backupResponse.ok) {
          throw new Error(`HTTP error! status: ${backupResponse.status}`);
        }

        const backupData = await backupResponse.json();
        return backupData.translatedText;
      } catch (backupError) {
        console.error("Backup translation also failed:", backupError);
        return text; // Return original text if both translation methods fail
      }
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    try {
      // Translate the user's message to the selected translation language
      const translatedUserMessage = await translateText(
        inputText,
        selectedLanguage,
        translationLanguage
      );

      // Simulate a bot response (you can replace this with an actual API call)
      const botResponse = `Translated: ${translatedUserMessage}`;

      setMessages((prev) => [
        ...prev,
        {
          text: botResponse,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col relative bg-gray-900 border border-gray-700 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-bold text-white tracking-wide">Translate Your Thoughts</h2>
          <p className="text-gray-300 mt-2">Express yourself in any language with AI-powered translation</p>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-800/50 border-b border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Language */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                From Language:
              </label>
              <select
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-[#074C77] focus:ring-1 focus:ring-[#074C77] transition-colors"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-800">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Topic:
              </label>
              <select
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-[#074C77] focus:ring-1 focus:ring-[#074C77] transition-colors"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value} className="bg-gray-800">
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Language */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Translate to:
              </label>
              <select
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-[#074C77] focus:ring-1 focus:ring-[#074C77] transition-colors"
                value={translationLanguage}
                onChange={(e) => setTranslationLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-800">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-gray-950 overflow-hidden">
          <div
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Start a conversation to see translations here</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-6 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                    <div
                      className={`p-4 rounded-2xl shadow-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white rounded-br-md"
                          : "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 px-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 p-4 bg-gray-900 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-[#074C77] focus:ring-1 focus:ring-[#074C77] focus:outline-none transition-colors"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="px-6 py-4 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white rounded-full hover:from-[#0a6ba8] hover:to-[#074C77] transition-all duration-200 transform hover:scale-105 shadow-lg shadow-[#074C77]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputText.trim()}
            >
              <FaPaperPlane className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
