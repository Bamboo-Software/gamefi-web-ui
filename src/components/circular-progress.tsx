import React from "react";
import { cn } from "@/lib/utils"; 

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number; 
  strokeWidth?: number; 
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 100,
  strokeWidth = 10,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* SVG */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ transformOrigin: "center" }}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--secondary)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
      {/* Label */}
      <div className="absolute text-center">
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round((value / max) * 100)}%
        </span>
      </div>
    </div>
  );
};
