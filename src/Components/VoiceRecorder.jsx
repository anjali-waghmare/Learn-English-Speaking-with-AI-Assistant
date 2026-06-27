import React, { useState, useEffect, useRef } from 'react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [backendReply, setBackendReply] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);

      // Send question to NestJS
      await askTheAI(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorMessage('');
      setBackendReply('');
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const askTheAI = async (textToSend) => {
    try {
      const response = await fetch('http://localhost:3000/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });

      const data = await response.json();
      setBackendReply(data.reply);

      // Pass the AI text reply to the Speaker function
      speakOutLoud(data.reply);
    } catch (err) {
      setErrorMessage('Failed to get a response from the server.');
    }
  };

  const speakOutLoud = (textToSpeak) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Google') && v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-[450px] my-10 mx-auto p-6 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-center font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Voice Assistant</h2>

      <div className="mb-6">
        <div
          className={`w-[90px] h-[90px] flex items-center justify-center rounded-full text-4xl mx-auto mb-4 transition-all duration-300 ${
            isListening
              ? 'bg-emerald-100 shadow-[0_0_0_15px_rgba(16,185,129,0.2)] animate-pulse-listen'
              : isSpeaking
              ? 'bg-blue-100 shadow-[0_0_0_15px_rgba(59,130,246,0.2)] animate-pulse-talk'
              : 'bg-gray-100'
          }`}
        >
          {isListening ? '🎙️' : isSpeaking ? '🗣️' : '🤖'}
        </div>
        
        {isListening && <p className="text-emerald-600 font-medium">Listening to you...</p>}
        {isSpeaking && <p className="text-blue-600 font-medium">AI is talking...</p>}
        {!isListening && !isSpeaking && <p className="text-gray-500">Click below to talk</p>}
      </div>

      <button
        onClick={toggleListening}
        className={`w-4/5 py-3.5 px-6 font-bold text-base rounded-full border-none cursor-pointer transition-all ${
          isListening
            ? 'bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
            : 'bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
        }`}
      >
        {isListening ? 'Listening...' : 'Push to Talk'}
      </button>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-4 font-medium">{errorMessage}</p>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left">
        <p className="text-gray-600 mb-3">
          <strong>You:</strong> {transcript || '...'}
        </p>
        <p className="text-blue-800 font-medium">
          <strong>AI:</strong> {backendReply || '...'}
        </p>
      </div>
    </div>
  );
}