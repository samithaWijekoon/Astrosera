import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="badge-item bg-white/5 border border-white/5 rounded-3xl relative overflow-hidden pointer-events-none">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

      <div className="w-16 h-16 rounded-full bg-white/10 mb-3" />
      <div className="w-12 h-3 rounded-full bg-white/10" />
    </div>
  );
}
