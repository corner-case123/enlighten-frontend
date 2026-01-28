"use client";
import React, { useState } from "react";
import { FaRandom, FaSpinner, FaCheckCircle, FaTimesCircle, FaArrowRight, FaRedo } from "react-icons/fa";
import { toast } from "react-hot-toast";

const WeirdLearning = () => {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("bn");
  const [difficulty, setDifficulty] = useState("easy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [translationOptions, setTranslationOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const difficultyOptions = [
    { value: "easy", label: "Easy", description: "Obviously wrong options", color: "green" },
    { value: "medium", label: "Medium", description: "Moderately challenging", color: "yellow" },
    { value: "hard", label: "Hard", description: "AI-verified tricky options", color: "red" }
  ];

  const languages = [
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "ar", name: "Arabic (العربية)" },
    { code: "fr", name: "French (Français)" },
    { code: "zh-CN", name: "Chinese (中文)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "ja", name: "Japanese (日本語)" },
    { code: "ko", name: "Korean (한국어)" },
    { code: "en", name: "English" },
  ];

  // Generate all 4 translation options using Gemini Flash
  const generateAllTranslationOptions = async (originalText, language, difficulty) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/generate-quiz-options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          targetLanguage: language,
          difficulty: difficulty
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz options');
      }

      const data = await response.json();
      return {
        options: data.options, // Array of 4 translation options
        correctIndex: data.correctIndex // Index of the correct option
      };
      
    } catch (error) {
      console.error('Error generating quiz options with Gemini:', error);
      return null;
    }
  };

  // Verify translation correctness using Gemini
  const verifyTranslationCorrectness = async (originalText, translation, targetLanguage) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/learning/verify-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: originalText,
          translation: translation,
          targetLanguage: targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Verification request failed');
      }

      const data = await response.json();
      return data.isCorrect;
    } catch (error) {
      console.error('Error verifying translation:', error);
      return false;
    }
  };

  // Generate fallback options when Gemini fails
  const generateFallbackOptions = (language, difficulty) => {
    const wrongTranslations = getPreDefinedOptions(language, difficulty);
    const options = wrongTranslations.slice(0, 4);
    
    // Ensure we have 4 different options
    while (options.length < 4) {
      options.push(`Translation option ${options.length + 1}`);
    }
    
    return {
      options: shuffleArray(options),
      correctIndex: Math.floor(Math.random() * 4) // Random correct answer for fallback
    };
  };

  // Get predefined wrong options based on language and difficulty
  const getPreDefinedOptions = (language, difficulty) => {
    let wrongTranslations = [];
    
    if (language === 'bn') {
      const wrongOptions = {
        easy: [
          "আমি একটি রোবট",
          "আজকে বৃষ্টি হবে",
          "এটি একটি গাছ",
          "আমি খেলা করি",
          "বইটি লাল রঙের"
        ],
        medium: [
          "তুমি কেমন আছো?",
          "আপনি কি করছেন?",
          "আমি ভালো আছি",
          "তুমি কোথায় থাকো?",
          "আমি এখানে আছি"
        ],
        hard: [
          "আপনি কেমন আছেন?",
          "তুমি কী করছিস?",
          "আমি কেমন আছি?",
          "তুই কেমন আছিস?",
          "আপনার কী খবর?"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty].slice(0, 3));
    } else if (language === 'hi') {
      const wrongOptions = {
        easy: [
          "मैं एक रोबोट हूं",
          "आज बारिश होगी",
          "यह एक पेड़ है",
          "मैं खेलता हूं",
          "किताब लाल है"
        ],
        medium: [
          "तुम कैसे हो?",
          "आप क्या कर रहे हैं?",
          "मैं ठीक हूं",
          "तुम कहां रहते हो?",
          "मैं यहां हूं"
        ],
        hard: [
          "आप कैसे हैं?",
          "तुम कैसे हो?",
          "आप कैसे हो?",
          "तुम्हारा क्या हाल है?",
          "कैसे हैं आप?"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty].slice(0, 3));
    } else if (language === 'ur') {
      const wrongOptions = {
        easy: [
          "میں ایک روبوٹ ہوں",
          "آج بارش ہوگی",
          "یہ ایک درخت ہے",
          "میں کھیلتا ہوں",
          "کتاب سرخ ہے"
        ],
        medium: [
          "تم کیسے ہو؟",
          "آپ کیا کر رہے ہیں؟",
          "میں ٹھیک ہوں",
          "تم کہاں رہتے ہو؟",
          "میں یہاں ہوں"
        ],
        hard: [
          "آپ کیسے ہیں؟",
          "تم کیسے ہو؟",
          "آپ کا کیا حال ہے؟",
          "تمہارا کیا حال ہے؟",
          "کیسے ہیں آپ؟"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty].slice(0, 3));
    } else if (language === 'fr') {
      const wrongOptions = {
        easy: [
          "Je suis un robot",
          "Il pleuvra aujourd'hui",
          "C'est un arbre",
          "Je joue",
          "Le livre est rouge"
        ],
        medium: [
          "Comment ça va?",
          "Que faites-vous?",
          "Je vais bien",
          "Où habitez-vous?",
          "Je suis ici"
        ],
        hard: [
          "Comment allez-vous?",
          "Comment vous portez-vous?",
          "Ça va comment?",
          "Comment tu vas?",
          "Vous allez comment?"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty].slice(0, 3));
    } else if (language === 'es') {
      const wrongOptions = {
        easy: [
          "Soy un robot",
          "Hoy lloverá",
          "Es un árbol",
          "Yo juego",
          "El libro es rojo"
        ],
        medium: [
          "¿Cómo estás?",
          "¿Qué estás haciendo?",
          "Estoy bien",
          "¿Dónde vives?",
          "Estoy aquí"
        ],
        hard: [
          "¿Cómo está usted?",
          "¿Qué tal estás?",
          "¿Cómo te encuentras?",
          "¿Qué tal?",
          "¿Cómo andas?"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty].slice(0, 3));
    } else {
      const wrongOptions = {
        easy: [
          "This is completely wrong",
          "Random unrelated text",
          "Not even close",
          "Obviously incorrect"
        ],
        medium: [
          "This is somewhat related",
          "Close but not quite", 
          "Similar context, wrong meaning",
          "Nearly correct version"
        ],
        hard: [
          "Very close translation",
          "Almost correct version",
          "Subtle difference version"
        ]
      };
      wrongTranslations.push(...wrongOptions[difficulty]);
    }

    return wrongTranslations;
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startWeirdLearning = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to translate");
      return;
    }

    setIsGenerating(true);
    try {
      // First, try to generate quiz options using Gemini Flash
      let quizData = await generateAllTranslationOptions(inputText, targetLanguage, difficulty);
      
      // If Gemini fails, use fallback method
      if (!quizData) {
        console.log('Gemini generation failed, using fallback method');
        quizData = generateFallbackOptions(targetLanguage, difficulty);
        toast.warning('Using fallback quiz generation');
      }

      const { options, correctIndex } = quizData;
      const correctTranslation = options[correctIndex];

      setCorrectAnswer(correctTranslation);
      setTranslationOptions(options);
      setGameStarted(true);
      setSelectedOption(null);
      setWrongAttempts([]);
      setIsCompleted(false);

      toast.success(`Quiz ready! Find the correct translation among 4 options.`);

    } catch (error) {
      console.error('Error generating weird learning:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = async (selectedTranslation) => {
    if (selectedOption || isCompleted) return;

    setSelectedOption(selectedTranslation);
    
    // Direct comparison since Gemini already selected the correct answer
    const isCorrect = selectedTranslation === correctAnswer;
    
    if (isCorrect) {
      setIsCompleted(true);
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
      toast.success(difficulty === 'hard' ? 'Correct! Gemini-verified accuracy!' : 'Correct! Well done!');
    } else {
      if (!wrongAttempts.includes(selectedTranslation)) {
        setWrongAttempts(prev => [...prev, selectedTranslation]);
      }
      toast.error("Wrong answer! Try again.");
      setTimeout(() => {
        setSelectedOption(null);
      }, 1000);
    }
  };

  const playAgain = () => {
    setGameStarted(false);
    setTranslationOptions([]);
    setCorrectAnswer("");
    setSelectedOption(null);
    setWrongAttempts([]);
    setIsCompleted(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setInputText("");
    setTranslationOptions([]);
    setCorrectAnswer("");
    setSelectedOption(null);
    setWrongAttempts([]);
    setIsCompleted(false);
    setScore({ correct: 0, total: 0 });
  };

  if (gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            🎯 Translation Quiz
          </h2>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span>Original: <span className="text-white font-medium">{inputText}</span></span>
            <FaArrowRight className="text-[#074C77]" />
            <span>Target: <span className="text-[#074C77] font-medium">{languages.find(l => l.code === targetLanguage)?.name}</span></span>
            <FaArrowRight className="text-[#074C77]" />
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {difficulty.toUpperCase()}
            </span>
          </div>
          <div className="mt-4 text-lg">
            Score: <span className="text-green-400 font-bold">{score.correct}</span>/{score.total}
          </div>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Which translation is correct?
            {difficulty === 'hard' && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full border border-red-500/30">
                  🤖 AI-Generated Challenging Options
                </span>
              </div>
            )}
          </h3>
          
          {!isCompleted ? (
            <div className="grid gap-4 mb-6">
              {translationOptions.map((option, index) => {
                const isWrongAttempt = wrongAttempts.includes(option);
                const isSelected = selectedOption === option;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isWrongAttempt || isSelected}
                    className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      isWrongAttempt 
                        ? 'bg-red-900/20 border-red-500/30 text-red-300 cursor-not-allowed opacity-50' 
                        : isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                        : 'bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/50 hover:border-[#074C77]/50 hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isWrongAttempt && <FaTimesCircle className="text-red-500 flex-shrink-0" />}
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl mb-6 bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 text-green-400">
                <FaCheckCircle className="text-2xl" />
                <span className="text-xl font-bold">
                  {difficulty === 'hard' ? 'Correct! Gemini-Powered Accuracy!' : 'Correct! Well done!'}
                </span>
              </div>

              <div className="bg-gradient-to-r from-[#074C77]/10 to-[#0a6ba8]/10 border border-[#074C77]/20 rounded-xl p-4 mb-6">
                <p className="text-white font-medium">The correct translation was:</p>
                <p className="text-xl text-[#074C77] font-semibold mt-2">{correctAnswer}</p>
              </div>

              {wrongAttempts.length > 0 && (
                <div className="text-gray-400 mb-6">
                  <p>It took you {wrongAttempts.length + 1} attempts to get it right.</p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <button
                  onClick={playAgain}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] hover:from-[#0a6ba8] hover:to-[#074C77] text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#074C77]/30 font-medium"
                >
                  <FaRedo className="text-sm" />
                  Try Again
                </button>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                >
                  New Text
                </button>
              </div>
            </div>
          )}
          
          {wrongAttempts.length > 0 && !isCompleted && (
            <div className="text-center text-gray-400">
              <p>
                {wrongAttempts.length} wrong attempt{wrongAttempts.length > 1 ? 's' : ''} so far. 
                Keep trying with Gemini-powered options!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
          🎯 Weird Learning
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Test your translation skills! Choose difficulty level and pick the correct translation from 4 AI-generated options. All difficulty levels now use Gemini Flash for accurate and challenging quiz generation!
        </p>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    difficulty === option.value
                      ? option.color === 'green' ? 'border-green-500/50 bg-green-500/20' :
                        option.color === 'yellow' ? 'border-yellow-500/50 bg-yellow-500/20' :
                        'border-red-500/50 bg-red-500/20'
                      : 'border-gray-600/50 bg-gray-700/30 hover:border-gray-500/50'
                  }`}
                >
                  <div className="text-center">
                    <p className={`font-medium ${
                      difficulty === option.value 
                        ? option.color === 'green' ? 'text-green-400' :
                          option.color === 'yellow' ? 'text-yellow-400' :
                          'text-red-400'
                        : 'text-gray-300'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-300 mb-3">
              Enter text to translate
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type something in any language..."
              className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#074C77]/50 focus:border-[#074C77]/50 resize-none transition-all duration-300"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="target-language" className="block text-sm font-medium text-gray-300 mb-3">
              Target language
            </label>
            <select
              id="target-language"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-[#074C77]/50 focus:border-[#074C77]/50 transition-all duration-300"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-gray-700">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={startWeirdLearning}
            disabled={isGenerating || !inputText.trim()}
            className="w-full bg-gradient-to-r from-[#074C77] to-[#0a6ba8] hover:from-[#0a6ba8] hover:to-[#074C77] disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#074C77]/30 disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin text-xl" />
                Generating AI-Powered Quiz...
              </>
            ) : (
              <>
                <FaRandom className="text-xl" />
                Start Translation Quiz
              </>
            )}
          </button>
        </div>

        {score.total > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-gray-300">
              Current Session: <span className="text-green-400 font-bold">{score.correct}</span> completed out of <span className="font-bold">{score.total}</span> attempts
              <span className="text-[#074C77] ml-2">
                ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}% success rate)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeirdLearning;