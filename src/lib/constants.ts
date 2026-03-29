export const MODEL_LIMITS = {
  // The Gemini Core Family
  "gemini-2.5-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.5-pro": { category: "Text-out models", rpm: 2, tpm: 32000, rpd: 50 },
  "gemini-2.0-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.0-flash-exp": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.0-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.5-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-3-flash": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-3.1-pro": { category: "Text-out models", rpm: 2, tpm: 32000, rpd: 50 },
  "gemini-3.1-flash-lite": { category: "Text-out models", rpm: 15, tpm: 1000000, rpd: 1500 },

  // Audio / TTS
  "gemini-2.5-flash-tts": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.5-pro-tts": { category: "Multi-modal generative models", rpm: 2, tpm: 32000, rpd: 50 },
  "gemini-2.5-flash-native-audio": { category: "Live API", rpm: 15, tpm: 1000000, rpd: 1500 },

  // The Gemma 3 Family (Open Weights)
  "gemma-3-1b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemma-3-4b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemma-3-12b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemma-3-27b-it": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },

  // Image Generation
  "imagen-4": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "imagen-4-ultra": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "imagen-4-fast": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "nano-banana": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "nano-banana-pro": { category: "Multi-modal generative models", rpm: 2, tpm: 32000, rpd: 50 },
  "nano-banana-2": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },

  // Video
  "veo-3": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "veo-3-fast": { category: "Multi-modal generative models", rpm: 15, tpm: 1000000, rpd: 1500 },

  // Specialty Tools
  "text-embedding-001": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "text-embedding-2": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-robotics-er-1.5-preview": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "gemini-2.5-computer-use": { category: "Other models", rpm: 15, tpm: 1000000, rpd: 1500 },
  "deep-research-pro-preview": { category: "Agents", rpm: 2, tpm: 32000, rpd: 50 }
};

export const MODEL_DISPLAY_NAMES = {
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  "gemini-2.5-pro": "Gemini 2.5 Pro",
  "gemini-2.0-flash": "Gemini 2 Flash",
  "gemini-2.0-flash-exp": "Gemini 2 Flash Exp",
  "gemini-2.0-flash-lite": "Gemini 2 Flash Lite",
  "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
  "gemini-3-flash": "Gemini 3 Flash",
  "gemini-3.1-pro": "Gemini 3.1 Pro",
  "gemini-3.1-flash-lite": "Gemini 3.1 Flash Lite",
  "gemini-2.5-flash-tts": "Gemini 2.5 Flash TTS",
  "gemini-2.5-pro-tts": "Gemini 2.5 Pro TTS",
  "gemini-2.5-flash-native-audio": "Gemini 2.5 Flash Native Audio",
  "gemma-3-1b-it": "Gemma 3 1B",
  "gemma-3-2b-it": "Gemma 3 2B",
  "gemma-3-4b-it": "Gemma 3 4B",
  "gemma-3-12b-it": "Gemma 3 12B",
  "gemma-3-27b-it": "Gemma 3 27B",
  "imagen-4": "Imagen 4 Generate",
  "imagen-4-ultra": "Imagen 4 Ultra Generate",
  "imagen-4-fast": "Imagen 4 Fast Generate",
  "nano-banana": "Nano Banana",
  "nano-banana-pro": "Nano Banana Pro",
  "nano-banana-2": "Nano Banana 2",
  "veo-3": "Veo 3 Generate",
  "veo-3-fast": "Veo 3 Fast Generate",
  "text-embedding-001": "Gemini Embedding 1",
  "text-embedding-2": "Gemini Embedding 2",
  "gemini-robotics-er-1.5-preview": "Gemini Robotics ER 1.5 Preview",
  "gemini-2.5-computer-use": "Computer Use Preview",
  "deep-research-pro-preview": "Deep Research Pro Preview"
};
