"use client";

import { Line, Bar, Doughnut } from "react-chartjs-2";
import { baseChartOptions, chartDefaults } from "@/lib/charts";
import { Model } from "@/hooks/useStudioState";
import { ShieldCheck, TrendingUp, Cpu, PieChart, Activity, Zap, BarChart3 } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BorderBeam } from "@/components/ui/animated-border";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
  stats: { totalModels: number; available: number; limited: number; healthRate: string };
  models: Model[];
}

export default function AnalyticsDashboard({ stats, models }: AnalyticsDashboardProps) {
  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "API Activity",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      borderColor: "#3b82f6", // blue-500
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    }]
  };

  const efficiencyData = {
    labels: models.slice(0, 5).map(m => m.displayName),
    datasets: [{
      label: "RPM Efficiency",
      data: models.slice(0, 5).map(m => m.rpm.used),
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderRadius: 6,
    }]
  };

  const typeMixData = {
    labels: ["Text", "Multi-modal", "Other"],
    datasets: [{
      data: [12, 19, 3],
      backgroundColor: ["#3b82f6", "#60a5fa", "#2563eb"],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Usage Insights</h2>
        <p className="text-sm text-zinc-500 font-medium">Real-time performance metrics and architectural resource analytics.</p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        
        {/* Health Stats */}
        <SpotlightCard className="md:col-span-2 lg:col-span-2 p-5 bg-blue-600/10 border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] min-h-[160px]">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Health Rate</p>
              <ShieldCheck className="w-4 h-4 text-blue-400/50" />
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white tracking-tighter">{stats.healthRate}</h4>
              <p className="text-[10px] text-blue-400/60 font-medium mt-1">System wide stability</p>
            </div>
          </div>
        </SpotlightCard>

        {/* Peak RPM */}
        <SpotlightCard className="md:col-span-2 lg:col-span-2 p-5 bg-white/[0.03] border-white/5 min-h-[160px]">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Peak Throughput</p>
              <Zap className="w-4 h-4 text-amber-500/50" />
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white tracking-tight">
                42 <span className="text-sm font-bold text-zinc-600">RPM</span>
              </h4>
              <p className="text-[10px] text-zinc-600 font-medium mt-1">Recorded at 14:00 UTC</p>
            </div>
          </div>
        </SpotlightCard>

        {/* Type Mix (Donut) */}
        <SpotlightCard className="md:col-span-4 lg:col-span-2 p-5 bg-white/[0.03] border-white/5 min-h-[160px]">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Protocol Mix</p>
              <PieChart className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="h-[120px] flex items-center justify-center">
              <Doughnut data={typeMixData} options={{ ...baseChartOptions, cutout: "75%" }} />
            </div>
          </div>
        </SpotlightCard>

        {/* Activity Pulse (Main Chart) */}
        <SpotlightCard className="md:col-span-4 lg:col-span-4 p-6 bg-black/40 backdrop-blur-md border border-white/5 min-h-[380px]">
          <BorderBeam size={300} duration={15} delay={5} colorFrom="#3b82f6" colorTo="#60a5fa" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">Activity Pulse</h3>
                <p className="text-[11px] text-zinc-500 font-medium">Forge network request density (Last 7 days)</p>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-h-[220px]">
              <Line data={trendData} options={{ ...chartDefaults, maintainAspectRatio: false }} />
            </div>
          </div>
        </SpotlightCard>

        {/* Model Versatility */}
        <SpotlightCard className="md:col-span-2 lg:col-span-2 p-6 bg-white/[0.03] border-white/5 min-h-[380px]">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-white">Versatility</h3>
              <Cpu className="w-4 h-4 text-blue-500/50" />
            </div>
            <div className="flex-1 min-h-[220px]">
              <Bar data={efficiencyData} options={{ ...chartDefaults, maintainAspectRatio: false }} />
            </div>
          </div>
        </SpotlightCard>

        {/* Active Agents (Large Text Card) */}
        <SpotlightCard className="md:col-span-2 lg:col-span-3 p-6 bg-white/[0.03] border-white/5 min-h-[200px]">
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">Orchestrating Agents</p>
              <h4 className="text-5xl font-bold text-white tracking-tighter mt-1">12</h4>
            </div>
          </div>
        </SpotlightCard>

        {/* Status Log */}
        <SpotlightCard className="md:col-span-2 lg:col-span-3 p-0 overflow-hidden bg-white/[0.03] border-white/5 min-h-[200px]">
          <div className="relative z-10 h-full flex flex-col">
            <div className="p-4.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> System Integrity
              </h3>
              <span className="text-[9px] font-bold text-zinc-600 tracking-widest uppercase">24H Window</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 opacity-40">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-zinc-500" />
              </div>
              <p className="text-[11px] font-semibold text-zinc-500 tracking-tight">No anomalies detected</p>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
