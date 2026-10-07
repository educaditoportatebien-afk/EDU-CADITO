import React from 'react';
import { Volume2, VolumeX, Sparkles, Shield, Music, Gamepad2, Palette, CalendarCheck2, Smartphone } from 'lucide-react';
import { sound } from '../utils/audio';
import { ColorfulEducadito } from './ColorfulEducadito';

interface NavbarProps {
  currentTab: 'songs' | 'games' | 'color' | 'habits' | 'parents';
  onSelectTab: (tab: 'songs' | 'games' | 'color' | 'habits' | 'parents') => void;
  starsCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBadges: () => void;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  starsCount,
  isMuted,
  onToggleMute,
  onOpenBadges,
  onOpenInstall,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2">
        {/* Zone 1: Brand title */}
        <button
          onClick={() => {
            sound.playSound('click');
            onSelectTab('songs');
          }}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
          aria-label="Ir al inicio de Edu Cadito"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 p-1 shadow-md shadow-orange-500/20 group-hover:rotate-6 transition-transform flex items-center justify-center text-white font-extrabold text-2xl font-display">
            ⭐
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center leading-none">
              <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-amber-800 tracking-wider uppercase block mt-1 whitespace-nowrap">
              EL NIÑO QUE EDUCA NIÑOS
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Buttons (large, child-friendly tap targets) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              sound.playSound('click');
              onSelectTab('songs');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'songs'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-105'
                : 'text-slate-600 hover:bg-amber-100/70 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            <span>Canciones</span>
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              onSelectTab('games');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'games'
                ? 'bg-emerald-400 text-emerald-950 shadow-md scale-105'
                : 'text-slate-600 hover:bg-emerald-100/70 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            <span>Juegos</span>
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              onSelectTab('color');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'color'
                ? 'bg-pink-400 text-pink-950 shadow-md scale-105'
                : 'text-slate-600 hover:bg-pink-100/70 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-700" />
            <span className="hidden xs:inline">Colorear</span>
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              onSelectTab('habits');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'habits'
                ? 'bg-sky-400 text-sky-950 shadow-md scale-105'
                : 'text-slate-600 hover:bg-sky-100/70 hover:text-slate-900'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-700" />
            <span className="hidden md:inline">Rutinas</span>
          </button>

          <button
            onClick={() => {
              sound.playSound('click');
              onSelectTab('parents');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'parents'
                ? 'bg-purple-500 text-white shadow-md scale-105'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Papás</span>
          </button>
        </nav>

        {/* Zone 3: Stars, Install and Mute Button */}
        <div className="flex items-center gap-2">
          {/* Install on phone button */}
          {onOpenInstall && (
            <button
              onClick={() => {
                sound.playSound('pop');
                onOpenInstall();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-black text-xs px-3 py-1.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              title="Instalar Edu Cadito en tu celular"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">Instalar</span>
            </button>
          )}

          {/* Star counter & medals modal button */}
          <button
            onClick={() => {
              sound.playSound('star');
              onOpenBadges();
            }}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 px-3 py-1.5 rounded-full font-display font-black text-amber-800 text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Ver medallas y estrellas de Edu"
          >
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="tabular-nums">{starsCount}</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
