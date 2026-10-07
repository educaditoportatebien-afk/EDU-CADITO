import React from 'react';
import { Award, Sparkles, Check, Lock, X } from 'lucide-react';
import { SONGS_DATA } from '../data/songs';
import { sound } from '../utils/audio';
import { ColorfulEducadito } from './ColorfulEducadito';

interface EduBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadges: string[];
  starsCount: number;
}

export const EduBadgeModal: React.FC<EduBadgeModalProps> = ({
  isOpen,
  onClose,
  unlockedBadges,
  starsCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Cerrar álbum"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-md animate-bounce-slow">
            <Award className="w-9 h-9" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 flex flex-wrap items-center justify-center gap-2">
            <span>¡Álbum de Medallas de</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>!</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold">
            Tienes <span className="text-amber-600 font-black text-base">{starsCount}</span> Estrellas mágicas ganadas.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {SONGS_DATA.map((song) => {
            const isUnlocked = unlockedBadges.includes(song.badge);

            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-400 shadow-sm scale-102'
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl overflow-hidden relative mb-2 shadow-xs border-2 ${
                    isUnlocked
                      ? 'border-amber-400 ring-2 ring-amber-300 shadow-md'
                      : 'border-slate-300 grayscale opacity-50'
                  }`}
                >
                  <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                  {isUnlocked ? (
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white/90" />
                    </div>
                  )}
                </div>

                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">
                  {song.badge}
                </h4>

                <span className="text-[10px] text-slate-400 mt-0.5">
                  Cantito #{song.number}
                </span>

                <div className="mt-2">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" /> Conseguida
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Por aprender
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-amber-100/70 p-4 rounded-2xl border border-amber-300 text-center text-xs text-amber-900 font-bold">
          <p>
            ¡Sigue cantando los 10 cantitos y jugando para completar todas las medallas con Edu Cadito!
          </p>
        </div>
      </div>
    </div>
  );
};
