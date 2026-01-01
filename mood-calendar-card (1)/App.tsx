
import React, { useState, useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw } from 'lucide-react';
import MoodCard from './components/MoodCard';
import { AppState, CardData } from './types';
import { MOOD_POOL } from './constants';
import { generateMoodContent } from './aiService';

// Simple hash function for deterministic randomness
const getSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get current date parts
  const dates = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    
    return {
      date: `${year}.${month}.${day}`,
      day: day,
      monthYear: `${monthName} ${year}`,
      fullDateStr: `${year}-${month}-${day}`
    };
  }, []);

  // Deterministically shuffle moods for the day
  const dailyMoods = useMemo(() => {
    const seed = getSeed(dates.fullDateStr);
    const shuffled = [...MOOD_POOL];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (seed + i) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 15);
  }, [dates.fullDateStr]);

  // Deterministically pick a theme color based on date + emoji
  const getDeterministicThemeColor = (emoji: string) => {
    const seed = getSeed(dates.fullDateStr + emoji);
    const hue = seed % 360;
    const saturation = (seed % 15) + 10; 
    const lightness = (seed % 8) + 15; 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleGenerate = async () => {
    if (!selectedEmoji) return;
    
    setAppState(AppState.GENERATING);
    
    try {
      // Start generating content
      const { quote } = await generateMoodContent(selectedEmoji, dates.fullDateStr);
      const themeColor = getDeterministicThemeColor(selectedEmoji);
      
      setCardData({
        date: dates.date,
        day: dates.day,
        monthYear: dates.monthYear,
        mood: selectedEmoji,
        quote: quote,
        themeColor: themeColor
      });
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error('Generation error:', error);
      setAppState(AppState.IDLE);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current === null || !cardData) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, // Reduced from 4 for faster processing while maintaining high quality
        backgroundColor: cardData.themeColor
      });
      const link = document.createElement('a');
      link.download = `mood-${cardData.date}-${cardData.mood}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCardData(null);
    setSelectedEmoji(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-[#fcfaf2]">
      <header className={`transition-all duration-1000 ease-in-out ${appState === AppState.RESULT ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100 mb-12 text-center'}`}>
        <h1 className="text-4xl font-bold text-neutral-800 mb-3 tracking-tight">
          Mood Calendar
        </h1>
        <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase font-light">
          A Ritual of Paper and Ink
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center gap-8 w-full">
              <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold border-b border-neutral-200 pb-2">
                Select Your Present
              </span>
              <div className="grid grid-cols-5 gap-3 md:gap-5">
                {dailyMoods.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => setSelectedEmoji(mood.emoji)}
                    className={`
                      text-2xl md:text-3xl p-4 rounded-2xl transition-all duration-300
                      ${selectedEmoji === mood.emoji 
                        ? 'bg-neutral-800 text-white scale-110 shadow-2xl rotate-3' 
                        : 'bg-white/40 text-neutral-600 hover:bg-white hover:scale-105 shadow-sm border border-transparent hover:border-neutral-100'}
                    `}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!selectedEmoji}
              className={`
                group px-14 py-5 rounded-full font-mincho text-lg transition-all duration-500 flex items-center gap-3
                ${selectedEmoji 
                  ? 'bg-neutral-900 text-white shadow-2xl hover:shadow-neutral-400 translate-y-0 opacity-100' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed translate-y-4 opacity-50'}
              `}
            >
              <RefreshCw className={`w-5 h-5 transition-transform group-hover:rotate-180 duration-1000 ${selectedEmoji ? 'text-white/60' : ''}`} />
              封装今日心情
            </button>
          </div>
        )}

        {appState === AppState.GENERATING && (
          <div className="flex flex-col items-center gap-8 py-20">
            <div className="w-16 h-16 border-t-2 border-stone-800 rounded-full animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-stone-800 font-mincho text-2xl tracking-widest animate-pulse">正在检索你的心情坐标</p>
              <p className="text-stone-400 text-[10px] tracking-[0.3em] uppercase">Locating your emotional coordinates</p>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && cardData && (
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in zoom-in-95 duration-700">
            <MoodCard ref={cardRef} data={cardData} />
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button
                onClick={handleDownload}
                className="group flex items-center gap-3 bg-neutral-900 text-white px-10 py-5 rounded-full hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
              >
                <Download className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                保存卡片
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-3 bg-white border border-stone-200 text-stone-500 px-10 py-5 rounded-full hover:bg-stone-50 transition-all hover:text-stone-800"
              >
                <RefreshCw className="w-4 h-4 opacity-50" />
                重选心情
              </button>
            </div>

            <p className="text-stone-300 text-[9px] tracking-[0.4em] italic font-light">
              「 此刻即是永恒 」
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-stone-300 text-[9px] tracking-[0.6em] uppercase font-mono font-light">
        © {new Date().getFullYear()} MOOD CALENDAR
      </footer>
    </div>
  );
};

export default App;
