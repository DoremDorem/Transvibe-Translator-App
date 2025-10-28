import { useState } from "react";
import { Copy, Mic, Volume2, ArrowLeft, Globe } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("hi");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const languages = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    ar: "Arabic",
    zh: "Chinese",
  };

  // 🧠 Translate function (MyMemory API)
  const translateText = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    setError("");
    setLoading(true);
    setTranslatedText("");

    try {
      const res = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          inputText
        )}&langpair=${fromLang}|${toLang}`,
        { timeout: 10000 }
      );

      const translated = res.data?.responseData?.translatedText || "";
      setTranslatedText(translated);
    } catch (err) {
      console.error("translate error:", err);
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🎙 Speech Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = fromLang;
    recognition.start();
    setListening(true);

    recognition.onresult = (e) => {
      setInputText(e.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };

  // 🔊 Voice Output
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = toLang;
    window.speechSynthesis.speak(utterance);
  };

  // 📋 Copy text
  const copyText = () => {
    navigator.clipboard.writeText(translatedText);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-white drop-shadow-lg">
          <Globe size={26} /> TransVibe
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl transition-all hover:shadow-blue-600/30">
        {/* Language Select */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="p-3 rounded-xl text-gray-900 w-full bg-white focus:ring-4 focus:ring-blue-300 outline-none"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="p-3 rounded-xl text-gray-900 w-full bg-white focus:ring-4 focus:ring-blue-300 outline-none"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or speak something..."
          className="w-full p-4 rounded-xl text-gray-900 bg-white min-h-[120px] resize-none focus:ring-4 focus:ring-indigo-400 outline-none placeholder-gray-500"
        />

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <button
            onClick={translateText}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-2.5 rounded-full font-semibold shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Translating..." : "Translate"}
          </button>

          <button
            onClick={startListening}
            className={`${
              listening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } px-8 py-2.5 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all`}
          >
            <Mic size={18} /> {listening ? "Listening..." : "Speak"}
          </button>
        </div>

        {/* Output */}
        {error && (
          <p className="text-red-400 text-center mt-4 font-medium">{error}</p>
        )}

        {translatedText && (
          <div className="mt-8 p-5 bg-white/20 backdrop-blur-lg rounded-2xl relative animate-fade-in">
            <p className="text-lg leading-relaxed">{translatedText}</p>
            <div className="flex gap-4 mt-4 justify-end">
              <button
                onClick={copyText}
                className="hover:text-gray-200 transition"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => speak(translatedText)}
                className="hover:text-gray-200 transition"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-10">
        🌍 Traslate With <span className="text-blue-400">TransVibe.</span>
      </p>
    </div>
  );
}
