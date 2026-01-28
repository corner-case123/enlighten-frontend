"use client";
import React, { useState } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";

const GrammarCorrection = () => {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];

  const checkGrammar = async () => {
    if (!text.trim()) return;

    setIsChecking(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/learning/grammar-correction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            language: selectedLanguage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCorrections({ message: data.error || "Failed to check grammar." });
        return;
      }

      setCorrections({ message: data.message });
    } catch (error) {
      console.error("Error checking grammar:", error);
      setCorrections({ message: "Failed to check grammar. Please try again." });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="w-full max-w-4xl p-8 rounded-3xl flex flex-col gap-6 relative overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">

        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">Grammar & Style Check</h2>
          <p className="text-gray-300">Perfect your writing with AI-powered corrections.</p>
        </div>

        <div className="flex flex-col gap-4 z-10">
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium ml-2">Language</label>
            <select
              className="px-4 py-3 rounded-xl cursor-pointer w-full text-white bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-white bg-gray-800">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-medium ml-2">Your Text</label>
            <textarea
              className="w-full h-40 p-4 rounded-xl text-lg resize-none text-white bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 placeholder-gray-400"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            onClick={checkGrammar}
            disabled={isChecking || !text.trim()}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg flex justify-center items-center gap-2 ${isChecking || !text.trim()
              ? "bg-gray-500/50 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-accent hover:shadow-primary/50"
              }`}
          >
            {isChecking ? (
              <>
                <FaSpinner className="animate-spin" /> Checking...
              </>
            ) : (
              <>
                <FaCheck /> Check Grammar & Style
              </>
            )}
          </button>
        </div>

        {corrections && (
          <div className="mt-4 p-6 rounded-2xl bg-gray-800 border border-gray-700 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-teal-400 mb-2">Feedback</h3>
            {corrections.message.startsWith("This is incorrect.") ? (
              <div className="text-gray-100 leading-relaxed text-lg whitespace-pre-wrap">
                <div className="mb-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                  <span className="text-red-300 block text-sm font-semibold uppercase tracking-wider mb-1">Original</span>
                  <span className="text-white opacity-90 decoration-wavy underline decoration-red-400">
                    {corrections.message.split("Correct is: ")[0].replace("This is incorrect.", "").trim()}
                  </span>
                </div>
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <span className="text-green-400 block text-sm font-semibold uppercase tracking-wider mb-1">Correction</span>
                  <span className="text-white font-bold flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    {corrections.message.split("Correct is: ")[1]}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-green-400 font-medium text-lg flex items-center gap-2 bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                <FaCheck className="bg-green-500/20 p-1 rounded-full w-6 h-6" />
                {corrections.message || "Text looks good!"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarCorrection;
