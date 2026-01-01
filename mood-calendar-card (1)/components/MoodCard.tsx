
import React, { forwardRef } from 'react';
import { CardData } from '../types';

interface MoodCardProps {
  data: CardData;
}

const MoodCard = forwardRef<HTMLDivElement, MoodCardProps>(({ data }, ref) => {
  // Determine if the quote is long to slightly adjust font size
  const isLongQuote = data.quote.length > 40;

  return (
    <div 
      ref={ref}
      className="mood-card relative w-full max-w-[340px] aspect-[1/1.55] shadow-2xl p-8 flex flex-col items-center overflow-hidden border border-white/5"
      style={{ backgroundColor: data.themeColor }}
    >
      {/* Paper Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] z-10" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-10" />
      
      {/* Decorative Border Line - Defines the safe zone */}
      <div className="absolute inset-3 border border-white/10 pointer-events-none" />

      {/* Header: Month and Year */}
      <div className="w-full flex justify-between items-start z-20">
        <div className="flex flex-col">
          <span className="text-white/20 text-[8px] tracking-[0.4em] font-mono leading-none mb-1">
            MONTH / YEAR
          </span>
          <span className="text-white/80 text-xs font-mincho tracking-[0.2em]">
            {data.monthYear}
          </span>
        </div>
        <div className="text-2xl opacity-90 drop-shadow-md">
          {data.mood}
        </div>
      </div>

      {/* Centerpiece: The Large Calendar Day */}
      <div className="relative flex flex-col items-center justify-center pt-8 pb-4 z-20">
        <span className="text-8xl font-black text-white/95 font-song-bold tracking-tighter tabular-nums drop-shadow-2xl">
          {data.day}
        </span>
        <div className="w-8 h-[1px] bg-white/30 mt-2" />
      </div>

      {/* Quote Section: Managed constraints to avoid overflow */}
      <div className="flex-1 w-full flex flex-col items-center justify-center z-20 px-4 overflow-hidden">
        <div className="max-w-full text-center py-4">
          <p 
            className={`text-white/90 font-mincho tracking-wider leading-[1.8] whitespace-pre-wrap break-words text-center transition-all duration-500`}
            style={{ 
              fontSize: isLongQuote ? '0.95rem' : '1.05rem',
              maxWidth: '20ch', // Strict 20 character width constraint for aesthetics
              margin: '0 auto'
            }}
          >
            {data.quote}
          </p>
        </div>
      </div>

      {/* Footer: Metadata and Branding */}
      <div className="w-full flex justify-between items-end text-[8px] tracking-[0.3em] uppercase text-white/25 font-mono mt-auto z-20 pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="opacity-60">RECORDED AT</span>
          <span className="text-white/50 font-bold tracking-widest">{data.date}</span>
        </div>
        <div className="italic opacity-30 text-right">
          FRAGMENTS OF TIME
        </div>
      </div>

      {/* Subtle Grainy Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 pointer-events-none z-15" />
    </div>
  );
});

MoodCard.displayName = 'MoodCard';

export default MoodCard;
