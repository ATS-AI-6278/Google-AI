"use client";

import { Model } from "@/hooks/useStudioState";
import { Layers, Type, Activity, Zap, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { motion } from "framer-motion";

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  const rpmPercent = model.rpm.limit > 0 ? (model.rpm.used / model.rpm.limit) * 100 : 0;
  const tpmPercent = model.tpm.limit > 0 ? (model.tpm.used / model.tpm.limit) * 100 : 0;

  const statusColors = {
    available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    limited: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    unavailable: "text-red-400 bg-red-500/10 border-red-500/20"
  };

  const formatLimit = (val: number) => val >= 1000 ? (val / 1000).toFixed(1) + "K" : val;

  return (
    <SpotlightCard className="h-full border-white/5 bg-white/[0.03] backdrop-blur-md group/card">
      <div className="p-4.5 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover/card:scale-110 transition-transform duration-500">
            {model.category.includes("Multi-modal") ? (
              <Layers className="w-5 h-5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            ) : (
              <Type className="w-5 h-5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            )}
          </div>
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
            statusColors[model.status] || statusColors.available
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              model.status === "available" ? "bg-emerald-500 animate-pulse" : "bg-current"
            )} />
            {model.status}
          </span>
        </div>

        <h3 className="text-base font-bold text-white mb-1 truncate" title={model.displayName}>
          {model.displayName}
        </h3>
        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
          {model.category}
        </p>

        <div className="space-y-3">
          <div className="group/metric">
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-zinc-500 flex items-center gap-1.5 uppercase tracking-tight">
                <Activity className="w-3 h-3 text-emerald-400/50" /> RPM
              </span>
              <span className={cn(
                "transition-colors",
                rpmPercent > 80 ? "text-red-400" : "text-zinc-200"
              )}>
                {model.rpm.used} <span className="text-zinc-600">/</span> {model.rpm.limit}
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(rpmPercent, 100)}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1004",
                  rpmPercent > 80 ? "bg-red-500" : "bg-emerald-500"
                )} 
              />
            </div>
          </div>

          <div className="group/metric">
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-zinc-500 flex items-center gap-1.5 uppercase tracking-tight">
                <BarChart2 className="w-3 h-3 text-blue-400/50" /> TPM
              </span>
              <span className={cn(
                "transition-colors",
                tpmPercent > 80 ? "text-red-400" : "text-zinc-200"
              )}>
                {formatLimit(model.tpm.used)} <span className="text-zinc-600">/</span> {formatLimit(model.tpm.limit)}
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(tpmPercent, 100)}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  tpmPercent > 80 ? "bg-red-500" : "bg-blue-500"
                )} 
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[9px] font-bold text-zinc-600 border-t border-white/5 uppercase tracking-widest">
            <span>DAILY RPD</span>
            <span className="text-zinc-400">{model.rpd.used} <span className="text-zinc-600">/</span> {model.rpd.limit}</span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
