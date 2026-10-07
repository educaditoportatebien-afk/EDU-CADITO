import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Trophy, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';
import heroImg from '../../assets/images/edu_cadito_hero_1790867623530.jpg';

interface HabitCatcherProps {
  onAwardStar: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'good' | 'bad';
  icon: string;
  name: string;
  points: number;
}

export const HabitCatcherGame: React.FC<HabitCatcherProps> = ({ onAwardStar }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState(50); // percentage (0 to 100)
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const gameLoopRef = useRef<number | null>(null);
  const itemSpawnerRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const GOOD_ITEMS = [
    { icon: '🍎', name: 'Manzanita', points: 10 },
    { icon: '🪥', name: 'Cepillo', points: 10 },
    { icon: '🧼', name: 'Jabón', points: 10 },
    { icon: '📚', name: 'Libro', points: 10 },
  ];

  const BAD_ITEMS = [
    { icon: '🍭', name: 'Mucho Caramelo', points: -5 },
    { icon: '📱', name: 'Celular en Cine', points: -5 },
  ];

  const startGame = () => {
    sound.playSound('pop');
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setPlayerPosition(50);
    setItems([]);
    setIsGameOver(false);
    setFeedbackMsg('¡Atrapa los buenos hábitos!');

    // Countdown timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawner
    itemSpawnerRef.current = window.setInterval(() => {
      spawnItem();
    }, 900);
  };

  const spawnItem = () => {
    const isGood = Math.random() > 0.3;
    const template = isGood
      ? GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)]
      : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];

    const newItem: FallingItem = {
      id: Date.now() + Math.random(),
      x: 10 + Math.random() * 80, // 10% to 90%
      y: 0,
      speed: 2 + Math.random() * 2,
      type: isGood ? 'good' : 'bad',
      icon: template.icon,
      name: template.name,
      points: template.points,
    };

    setItems(prev => [...prev, newItem]);
  };

  // Main animation frame for falling objects
  useEffect(() => {
    if (!isPlaying) return;

    const updateLoop = () => {
      setItems(prevItems => {
        const nextItems: FallingItem[] = [];

        prevItems.forEach(item => {
          const nextY = item.y + item.speed;

          // Check collision with Edu at the bottom (y between 78 and 92)
          if (nextY >= 78 && nextY <= 92) {
            const distance = Math.abs(item.x - playerPosition);
            if (distance < 14) {
              // Caught!
              if (item.type === 'good') {
                sound.playSound('jump');
                setScore(s => s + item.points);
                setFeedbackMsg(`¡Bien! ${item.name}`);
              } else {
                sound.playSound('click');
                setScore(s => Math.max(0, s + item.points));
                setFeedbackMsg(`¡Ojo! ${item.name}`);
              }
              return; // Do not keep this item
            }
          }

          if (nextY < 100) {
            nextItems.push({ ...item, y: nextY });
          }
        });

        return nextItems;
      });

      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    gameLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, playerPosition]);

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (itemSpawnerRef.current) clearInterval(itemSpawnerRef.current);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    sound.playSound('applause');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onAwardStar();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (itemSpawnerRef.current) clearInterval(itemSpawnerRef.current);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setPlayerPosition(p => Math.max(10, p - 8));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition(p => Math.min(90, p + 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Juego de Reflejos</span>
            <span>·</span>
            <span>Atrapa los Buenos Hábitos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5">
            ¡Ayuda a Edu a Atrapar lo Bueno!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Mueve a Edu con las flechas o tocando la pantalla para atrapar manzanas, cepillos y jabón.
          </p>
        </div>

        {/* Score & Time */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-800 font-display">
            Puntos: <span className="text-amber-600 font-black text-sm tabular-nums">{score}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-blue-800 font-display">
            Tiempo: <span className="text-blue-600 font-black text-sm tabular-nums">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative w-full aspect-[16/10] max-w-[640px] mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 shadow-inner select-none">
        {/* Clouds & Sun in background */}
        <div className="absolute top-4 left-6 text-3xl opacity-60">☁️</div>
        <div className="absolute top-8 right-16 text-3xl opacity-60">☁️</div>
        <div className="absolute top-3 right-5 text-4xl animate-pulse">☀️</div>

        {/* Grass ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-emerald-500 border-t-4 border-emerald-600" />

        {/* Falling objects */}
        {items.map(item => (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 text-3xl sm:text-4xl filter drop-shadow-md transition-transform"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {item.icon}
          </div>
        ))}

        {/* Edu Cadito character avatar at bottom */}
        <div
          className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
          style={{ left: `${playerPosition}%` }}
        >
          {/* Feedback speech bubble */}
          {feedbackMsg && isPlaying && (
            <div className="text-[10px] bg-white font-bold px-2 py-0.5 rounded-full shadow-md text-amber-900 border border-amber-200 mb-1 whitespace-nowrap animate-bounce">
              {feedbackMsg}
            </div>
          )}

          {/* Edu Basket / Catcher with Real Edu Cadito Face */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-200 ring-2 ring-amber-400 -mb-2 z-10">
              <img
                src={heroImg}
                alt="Edu Cadito"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-amber-400 border-3 border-amber-600 shadow-lg flex items-center justify-center text-2xl font-display font-black text-white">
              🧺
            </div>
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            {isGameOver ? (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mb-3 shadow-lg animate-bounce">
                  <Trophy className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-display font-black">
                  ¡Misión Cumplida!
                </h3>
                <p className="text-base font-bold text-amber-300 mt-1">
                  Atrapaste {score} puntos de buenos hábitos.
                </p>
                <button
                  onClick={startGame}
                  className="mt-4 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-base shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Jugar Otra Vez</span>
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mb-3 shadow-lg">
                  <Play className="w-8 h-8 fill-amber-950 ml-1" />
                </div>
                <h3 className="text-2xl font-display font-black">
                  ¡Atrapa los Hábitos Saludables!
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-sm mt-1">
                  Atrapa manzanas 🍎, cepillos 🪥 y jabones 🧼. ¡Evita demasiados dulces!
                </p>
                <button
                  onClick={startGame}
                  className="mt-5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-display font-black text-lg shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  ¡Empezar a Jugar!
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Touch Screen Controls for Kids */}
      {isPlaying && (
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={() => setPlayerPosition(p => Math.max(10, p - 12))}
            className="w-20 h-16 rounded-2xl bg-amber-400 active:bg-amber-500 text-amber-950 font-black text-xl flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            aria-label="Mover a la izquierda"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>

          <span className="text-xs font-bold text-slate-400 font-display">
            Toca las flechas o usa el teclado
          </span>

          <button
            onClick={() => setPlayerPosition(p => Math.min(90, p + 12))}
            className="w-20 h-16 rounded-2xl bg-amber-400 active:bg-amber-500 text-amber-950 font-black text-xl flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            aria-label="Mover a la derecha"
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};
