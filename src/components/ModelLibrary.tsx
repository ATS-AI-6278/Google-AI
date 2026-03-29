"use client";

import { useState } from "react";
import { Model } from "@/hooks/useStudioState";
import { Search, RefreshCw, Layers, Activity } from "lucide-react";
import ModelCard from "./ModelCard";
import { SpotlightCard } from "./ui/spotlight-card";
import { ShimmerButton } from "./ui/shimmer-button";
import { cn } from "@/lib/utils";

interface ModelLibraryProps {
  models: Model[];
  onRefresh: () => Promise<void>;
}

export default function ModelLibrary({ models, onRefresh }: ModelLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || model.category === categoryFilter;
    const matchesStatus = !statusFilter || model.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const categories = Array.from(new Set(models.map(m => m.category)));

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Model Library</h2>
        <p className="text-sm text-zinc-500 font-medium">Explore and manage your high-performance Google AI deployments.</p>
      </header>

      <SpotlightCard className="p-4.5 bg-white/[0.02] border border-white/5 rounded-[20px]">
        <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-9 py-2 bg-zinc-900 border border-white/10 rounded-xl text-[13px] font-semibold text-zinc-300 appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-zinc-800"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <Layers className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-focus-within:text-blue-500" />
            </div>
            
            <div className="relative group">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-9 py-2 bg-zinc-900 border border-white/10 rounded-xl text-[13px] font-semibold text-zinc-300 appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-zinc-800"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <Activity className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-focus-within:text-blue-500" />
            </div>

            <button 
              onClick={handleRefresh}
              className={cn(
                "p-2 bg-zinc-900 border border-white/10 text-zinc-400 rounded-xl hover:text-blue-400 hover:border-blue-500/30 transition-all",
                isRefreshing && "animate-spin text-blue-500 border-blue-500"
              )}
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-[13px] font-semibold text-white focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-zinc-800 placeholder:text-zinc-600"
            />
          </div>
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map(model => (
          <ModelCard key={model.name} model={model} />
        ))}
      </div>
    </div>
  );
}
