"use client";

import { useState, useEffect } from "react";
import { LucideIcon, Sparkles, Grid3x3, BarChart3, MessageSquare, Settings, Download, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiStatus: { connected: boolean; text: string; lastChecked: string };
  modelsCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, apiStatus, modelsCount }: SidebarProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navItems = [
    { id: "models", label: "Models", icon: Grid3x3, count: modelsCount },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "chat", label: "Chat Space", icon: MessageSquare },
  ];

  return (
    <aside className="w-[250px] h-screen fixed left-0 top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 overflow-hidden group">
      {/* Background Spotlight */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`,
        }}
      />

      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <motion.div 
          whileHover={{ rotate: 0, scale: 1.1 }}
          initial={{ rotate: 3 }}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.34)]"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Studio AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Forge Workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 relative z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "group/nav w-full flex items-center justify-between px-3 py-2.5 rounded-forge-xl transition-all duration-300",
              activeTab === item.id 
                ? "bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            )}
          >
            <div className="flex items-center">
              <item.icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                activeTab === item.id ? "text-blue-400" : "text-zinc-500 group-hover/nav:text-zinc-400"
              )} />
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
            {item.count !== undefined && (
              <span className="ml-auto text-[10px] font-bold bg-zinc-800/50 px-2 py-0.5 rounded-full text-zinc-500">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 gap-4 flex flex-col relative z-10">
        <div className="bg-white/[0.02] rounded-forge-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connect Status</span>
            <div className="flex items-center">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full mr-2",
                apiStatus.connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 animate-pulse"
              )} />
              <span className={cn(
                "text-[11px] font-bold",
                apiStatus.connected ? "text-emerald-400" : "text-zinc-500"
              )}>
                {apiStatus.text}
              </span>
            </div>
          </div>
          
          <ShimmerButton 
            className="w-full text-xs font-bold py-2 shadow-2xl"
            background="rgba(255, 255, 255, 0.05)"
            shimmerColor="rgba(59, 130, 246, 0.3)"
            borderRadius="12px"
          >
            <Settings className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <span>Forge Settings</span>
          </ShimmerButton>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button className="flex items-center justify-center p-2 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/10 transition-colors group/btn">
              <Download className="w-4 h-4 text-zinc-600 group-hover/btn:text-zinc-300" />
            </button>
            <button className="flex items-center justify-center p-2 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/10 transition-colors group/btn">
              <Upload className="w-4 h-4 text-zinc-600 group-hover/btn:text-zinc-300" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
