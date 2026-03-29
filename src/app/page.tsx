"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ModelLibrary from "@/components/ModelLibrary";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ChatSpace from "@/components/ChatSpace";
import { useStudioState } from "@/hooks/useStudioState";

export default function Home() {
  const { models, chatHistory, apiStatus, stats, actions } = useStudioState();
  const [activeTab, setActiveTab] = useState("models");

  return (
    <main className="flex min-h-screen bg-forge-surface text-white antialiased overflow-x-hidden selection:bg-blue-500/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiStatus={apiStatus}
        modelsCount={models.length}
      />
      
      <div className="flex-1 ml-[250px] p-6 transition-all duration-400 min-h-screen relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 pt-4">
          {activeTab === "models" && (
            <ModelLibrary 
              models={models} 
              onRefresh={actions.refreshModels}
            />
          )}
          
          {activeTab === "analytics" && (
            <AnalyticsDashboard 
              stats={stats}
              models={models}
            />
          )}
          
          {activeTab === "chat" && (
            <ChatSpace 
              models={models}
              history={chatHistory}
              onSendMessage={actions.sendMessage}
              onClearChat={actions.clearChat}
            />
          )}
        </div>
      </div>
    </main>
  );
}
