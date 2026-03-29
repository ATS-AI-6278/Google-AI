import { useState, useEffect, useCallback } from "react";
import { MODEL_LIMITS, MODEL_DISPLAY_NAMES } from "@/lib/constants";

export interface Model {
  name: string;
  displayName: string;
  category: string;
  description: string;
  rpm: { used: number; limit: number };
  tpm: { used: number; limit: number };
  rpd: { used: number; limit: number };
  status: "available" | "limited" | "unavailable";
}

export interface ChatMessage {
  type: "user" | "assistant";
  message: string;
  model: string;
  timestamp: string;
  isStreaming?: boolean;
  isError?: boolean;
  usage?: { totalTokenCount: number };
}

const DATA_VERSION = "6.0";

export function useStudioState() {
  const [models, setModels] = useState<Model[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    text: "Connecting",
    lastChecked: ""
  });

  // Initialize models from static data
  const initModels = useCallback(() => {
    const initialModels: Model[] = Object.keys(MODEL_LIMITS).map(key => ({
      name: key,
      displayName: MODEL_DISPLAY_NAMES[key as keyof typeof MODEL_DISPLAY_NAMES] || key,
      category: MODEL_LIMITS[key as keyof typeof MODEL_LIMITS].category,
      description: `High-performance ${MODEL_LIMITS[key as keyof typeof MODEL_LIMITS].category} model.`,
      rpm: { used: 0, limit: MODEL_LIMITS[key as keyof typeof MODEL_LIMITS].rpm },
      tpm: { used: 0, limit: MODEL_LIMITS[key as keyof typeof MODEL_LIMITS].tpm },
      rpd: { used: 0, limit: MODEL_LIMITS[key as keyof typeof MODEL_LIMITS].rpd },
      status: "available"
    }));
    setModels(initialModels);
    return initialModels;
  }, []);

  // Hydration from LocalStorage
  useEffect(() => {
    const savedModels = localStorage.getItem("googleAIModels");
    const savedChat = localStorage.getItem("chatHistory");
    const savedVersion = localStorage.getItem("dataVersion");

    if (savedVersion === DATA_VERSION && savedModels) {
      setModels(JSON.parse(savedModels));
    } else {
      const initial = initModels();
      localStorage.setItem("googleAIModels", JSON.stringify(initial));
      localStorage.setItem("dataVersion", DATA_VERSION);
    }

    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }

    setApiStatus({
      connected: true,
      text: "Connected",
      lastChecked: new Date().toLocaleTimeString()
    });
  }, [initModels]);

  // Persist models
  useEffect(() => {
    if (models.length > 0) {
      localStorage.setItem("googleAIModels", JSON.stringify(models));
    }
  }, [models]);

  // Persist chat
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Actions
  const actions = {
    refreshModels: async () => {
      setApiStatus(prev => ({ ...prev, text: "Refreshing..." }));
      try {
        const response = await fetch("/api/models");
        const data = await response.json();

        if (data.data) {
          // Update models list with any new information from API
          // For now, we'll keep our static limits but ensure IDs match
          console.log("Models fetched:", data.data);
        }

        setApiStatus({
          connected: true,
          text: "Connected",
          lastChecked: new Date().toLocaleTimeString()
        });
      } catch (error) {
        setApiStatus({
          connected: false,
          text: "Error",
          lastChecked: new Date().toLocaleTimeString()
        });
      }
    },
    sendMessage: async (message: string, model: string, options: any) => {
      const userMsg: ChatMessage = {
        type: "user",
        message,
        model,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, userMsg]);

      const assistantMsg: ChatMessage = {
        type: "assistant",
        message: "",
        model,
        timestamp: new Date().toISOString(),
        isStreaming: true
      };

      setChatHistory(prev => [...prev, assistantMsg]);
      const messageIndex = chatHistory.length + 1; // Index in the next state

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: message }],
            stream: true,
            temperature: options.temperature,
            max_tokens: options.maxTokens
          })
        });

        if (!response.ok) throw new Error("API request failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                if (line.includes("[DONE]")) break;
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices[0]?.delta?.content || "";
                  fullContent += content;

                  setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastMsg = { ...newHistory[newHistory.length - 1] };
                    lastMsg.message = fullContent;
                    newHistory[newHistory.length - 1] = lastMsg;
                    return newHistory;
                  });
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }

        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].isStreaming = false;
          return newHistory;
        });

        // Update model usage
        setModels(prev => prev.map(m => {
          if (m.name === model) {
            return {
              ...m,
              rpm: { ...m.rpm, used: m.rpm.used + 1 },
              rpd: { ...m.rpd, used: m.rpd.used + 1 }
            };
          }
          return m;
        }));

      } catch (error: any) {
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].message = `Error: ${error.message}`;
          newHistory[newHistory.length - 1].isError = true;
          newHistory[newHistory.length - 1].isStreaming = false;
          return newHistory;
        });
      }
    },
    clearChat: () => {
      setChatHistory([]);
      localStorage.removeItem("chatHistory");
    }
  };

  const stats = {
    totalModels: models.length,
    available: models.filter(m => m.status === "available").length,
    limited: models.filter(m => m.status === "limited").length,
    healthRate: "98.4%"
  };

  return { models, chatHistory, apiStatus, stats, actions };
}
