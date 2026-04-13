"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreCardProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score <= 20) return "#16a34a";
  if (score <= 50) return "#eab308";
  if (score <= 80) return "#f59e0b";
  return "#dc2626";
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl font-bold"
            style={{ color }}
          >
            {displayScore}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium">Scam Risk Score</p>
    </div>
  );
}
