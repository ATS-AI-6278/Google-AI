"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(10, 10, 11, 0.95)", // forge-surface
      titleColor: "#ffffff",
      bodyColor: "#71717a", // zinc-400
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      cornerRadius: 12,
    },
  },
};

export const chartDefaults = {
  ...baseChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(255, 255, 255, 0.03)",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#52525b", // zinc-600
        font: {
          size: 10,
          weight: "bold" as const,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#52525b", // zinc-600
        font: {
          size: 10,
          weight: "bold" as const,
        },
      },
    },
  },
};
