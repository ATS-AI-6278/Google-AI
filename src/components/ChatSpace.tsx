"use client";

import { useState, useRef, useEffect } from "react";
import { Model, ChatMessage } from "@/hooks/useStudioState";
import { Send, ArrowUp, Sparkles, Sliders, Square, Trash2, Bot, User } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "@/components/ui/animated-border";

interface ChatSpaceProps {
  models: Model[];
  history: ChatMessage[];
  onSendMessage: (message: string, model: string, options: any) => Promise<void>;
  onClearChat: () => void;
}

export default function ChatSpace({ models, history, onSendMessage, onClearChat }: ChatSpaceProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]?.name || "");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const message = input.trim();
    setInput("");
    setIsGenerating(true);

    await onSendMessage(message, selectedModel, { temperature, maxTokens });

    setIsGenerating(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-4 gap-5">
      {/* Parameters Panel */}
      <div className="lg:col-span-1 space-y-4">
        <SpotlightCard className="p-5 border-white/5 bg-white/[0.03] backdrop-blur-xl">
          <h3 className="font-bold mb-4 text-xs flex items-center text-white">
            <Sliders className="w-3.5 h-3.5 mr-2 text-blue-400" /> Parameters
          </h3>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50 text-[13px] font-semibold text-white appearance-none cursor-pointer hover:bg-zinc-800 transition-all"
              >
                {models.filter(m => m.status === "available").map(m => (
                  <option key={m.name} value={m.name} className="bg-[#0a0a0b]">{m.displayName}</option>
                ))}
              </select>
            </div>

            <div className="group/range">
              <div className="flex justify-between mb-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Temperature</label>
                <span className="text-[11px] font-bold text-blue-400">{temperature}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Max Tokens</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50 text-[13px] font-semibold text-white hover:bg-zinc-800 transition-all"
              />
            </div>

            <button
              onClick={onClearChat}
              className="w-full mt-2 p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[9px] font-bold hover:bg-red-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Workshop
            </button>
          </div>
        </SpotlightCard>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col h-full">
        <div className="relative flex-1 mb-2 overflow-hidden flex flex-col bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[24px]">
          <BorderBeam size={300} duration={20} colorFrom="#3b82f6" colorTo="#60a5fa" />

          <div className="p-4.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center space-x-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[13px] font-bold tracking-tight text-zinc-100">Live AI Stream</span>
            </div>
            {isGenerating && (
              <button className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-full text-[9px] font-bold tracking-widest uppercase transition-all flex items-center">
                <Square className="w-2.5 h-2.5 mr-2 fill-current" /> Terminate
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
            <AnimatePresence>
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                    <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-xl font-bold tracking-tight text-white mb-2">Forge Workspace</h3>
                    <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">The studio is primed. Initialize a model to begin the generation process.</p>
                  </div>
                </motion.div>
              ) : (
                history.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3.5", msg.type === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
                      msg.type === "user" ? "bg-zinc-800 border-zinc-700" : "bg-blue-500/10 border-blue-500/20"
                    )}>
                      {msg.type === "user" ? <User className="w-3.5 h-3.5 text-zinc-400" /> : <Bot className="w-3.5 h-3.5 text-blue-400" />}
                    </div>

                    <div className={cn(
                      "max-w-[85%] p-3.5 rounded-2xl group relative",
                      msg.type === "user"
                        ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "bg-white/[0.03] border border-white/10 text-zinc-200 backdrop-blur-md"
                    )}>
                      <div
                        className="markdown-content text-[13px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.message) as string }}
                      />
                      <div className="mt-2 flex items-center gap-2 opacity-30 text-[8px] font-bold uppercase tracking-widest transition-opacity group-hover:opacity-60">
                        <span>{msg.model}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 bg-black/40 backdrop-blur-3xl border-t border-white/5">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-[22px] opacity-20 blur-lg group-focus-within:opacity-40 transition-opacity" />
              <div className="relative flex items-end space-x-3 bg-zinc-900/90 p-3.5 rounded-[20px] border border-white/10 shadow-2xl transition-all group-focus-within:border-blue-500/50">
                <textarea
                  placeholder="Type your command..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                  rows={1}
                  className="flex-1 px-3 py-1 bg-transparent border-0 resize-none focus:ring-0 text-[13px] font-semibold text-white placeholder:text-zinc-600"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isGenerating}
                  className="p-3 bg-zinc-100 text-black rounded-[16px] shadow-lg hover:bg-white transition-all disabled:opacity-50"
                >
                  <ArrowUp className="w-4.5 h-4.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
