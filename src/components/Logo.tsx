import React from 'react';

export const Logo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 10L90 30V70L50 90L10 70V30L50 10Z"
      fill="currentColor"
      className="text-emerald-500"
    />
    <path
      d="M50 15L85 32.5V67.5L50 85L15 67.5V32.5L50 15Z"
      fill="currentColor"
      className="text-emerald-600"
    />
    <path
      d="M50 45L65 52.5V67.5L50 75L35 67.5V52.5L50 45Z"
      fill="white"
    />
  </svg>
);