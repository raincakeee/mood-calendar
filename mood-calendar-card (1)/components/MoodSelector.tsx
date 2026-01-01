
import React from 'react';
import { Mood } from '../types';

interface MoodSelectorProps {
  moods: Mood[];
  selectedEmoji: string | null;
  onSelect: (emoji: string) => void;
  disabled?: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ moods, selectedEmoji, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-5 gap-4 md:gap-6 w-full max-w-sm">
      {moods.map((mood) => (
        <button
          key={mood.emoji}
          onClick={() => onSelect(mood.emoji)}
          disabled={disabled}
          className={`
            text-3xl p-3 rounded-xl transition-all duration-300
            ${selectedEmoji === mood.emoji 
              ? 'bg-neutral-800 text-white scale-110 shadow-lg' 
              : 'bg-white/50 text-neutral-600 hover:bg-neutral-100 hover:scale-105'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={mood.label}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
