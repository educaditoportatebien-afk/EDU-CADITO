import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Star,
  Play,
  Volume2
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { ColorfulEducadito } from '../ColorfulEducadito';

import heroImg from '../../assets/images/edu_cadito_hero_1790867623530.jpg';
import dientesImg from '../../assets/images/edu_cadito_dientes_1790867634465.jpg';
import camitaImg from '../../assets/images/edu_cadito_camita_1790867656125.jpg';
import tablitaImg from '../../assets/images/edu_cadito_tablita_1791238682848.jpg';
import manzanaImg from '../../assets/images/edu_cadito_manzana_1790867645514.jpg';
import juguetesImg from '../../assets/images/edu_cadito_juguetes_1791241233580.jpg';

interface MazeGameProps {
  onAwardStar: () => void;
  onSelectSongId?: (songId: string) => void;
}

interface MazeLevel {
  id: string;
  title: string;
  subtitle: string;
  mission: string;
  targetIcon: string;
  targetName: string;
  songId: string;
  songLyrics: string;
  image: string;
  accentColor: string;
  bgGradient: string;
  gridSize: { rows: number; cols: number };
  start: { r: number; c: number };
  goal: { r: number; c: number };
  // 0 = camino, 1 = pared, 2 = estrella mágica
  grid: number[][];
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 'cepillo',
    title: 'Edu y su Cepillo de Dientes',
    subtitle: '¡A cepillar los dientitos!',
    mission: 'Ayuda a Edu a encontrar su cepillo para dejar sus dientitos bien sanos y limpios.',
    targetIcon: '🪥',
    targetName: 'Cepillo de Dientes',
    songId: 'dientitos',
    songLyrics: 'Los dientitos cepillar antes de irme a acostar, Edu Cadito, cepíllate bien.',
    image: dientesImg,
    accentColor: 'border-sky-400 bg-sky-100 text-sky-900',
    bgGradient: 'from-sky-100 via-blue-50 to-amber-50',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 1, c: 1 },
    goal: { r: 5, c: 5 },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 2, 1],
      [1, 1, 1, 0, 1, 0, 1],
      [1, 2, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 2, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'camita',
    title: 'Edu y su Camita',
    subtitle: '¡A dormir solito y bien!',
    mission: 'Guía a Edu a través de las nubes y estrellas hasta su propia camita.',
    targetIcon: '🛌',
    targetName: 'Su Propia Camita',
    songId: 'camita',
    songLyrics: 'En mi camita yo solito debo descansar. Edu Cadito, dormí solito, bien.',
    image: camitaImg,
    accentColor: 'border-indigo-400 bg-indigo-100 text-indigo-900',
    bgGradient: 'from-indigo-100 via-purple-50 to-amber-50',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 1, c: 1 },
    goal: { r: 5, c: 5 },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 2, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 2, 1],
      [1, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'tablita',
    title: 'Edu y la Tablita del Baño',
    subtitle: '¡La tablita hacia arriba levantar!',
    mission: 'Acompaña a Edu al baño para levantar la tablita antes de hacer pipí.',
    targetIcon: '🚽',
    targetName: 'El Baño Limpito',
    songId: 'tablita',
    songLyrics: 'La tablita del inodoro hacia arriba levantar. Edu Cadito, haz bien tu pipí.',
    image: tablitaImg,
    accentColor: 'border-amber-400 bg-amber-100 text-amber-900',
    bgGradient: 'from-amber-100 via-orange-50 to-yellow-50',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 1, c: 1 },
    goal: { r: 5, c: 5 },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 2, 1],
      [1, 2, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 2, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'manzana',
    title: 'Edu y su Manzana Rica',
    subtitle: '¡Comer sano y rico!',
    mission: 'Guía a Edu para encontrar su manzana rica y nutritiva para merendar saludable.',
    targetIcon: '🍎',
    targetName: 'Manzanita Rica',
    songId: 'manzanita',
    songLyrics: 'Si tienes hambre come fruta rica y sana. Edu Cadito, aliméntate bien.',
    image: manzanaImg,
    accentColor: 'border-emerald-400 bg-emerald-100 text-emerald-900',
    bgGradient: 'from-emerald-100 via-green-50 to-amber-50',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 1, c: 1 },
    goal: { r: 5, c: 5 },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 2, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 2, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'juguetes',
    title: 'Edu y el Baúl de Juguetes',
    subtitle: '¡A ordenar la habitación!',
    mission: 'Lleva a Edu hasta el baúl para guardar todos los juguetes después de jugar.',
    targetIcon: '🧸',
    targetName: 'Baúl de Juguetes',
    songId: 'guardar-juguetes',
    songLyrics: 'Todos los juguetes a su caja van a entrar. Edu Cadito, ordena tu lugar.',
    image: juguetesImg,
    accentColor: 'border-purple-400 bg-purple-100 text-purple-900',
    bgGradient: 'from-purple-100 via-pink-50 to-amber-50',
    gridSize: { rows: 7, cols: 7 },
    start: { r: 1, c: 1 },
    goal: { r: 5, c: 5 },
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 2, 0, 1],
      [1, 0, 1, 1, 0, 1, 1],
      [1, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1],
      [1, 0, 2, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
  },
];

export const MazeGame: React.FC<MazeGameProps> = ({ onAwardStar, onSelectSongId }) => {
  const [selectedLevelId, setSelectedLevelId] = useState<string>('cepillo');
  const currentLevel = MAZE_LEVELS.find((l) => l.id === selectedLevelId) || MAZE_LEVELS[0];

  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>(currentLevel.start);
  const [collectedStars, setCollectedStars] = useState<number>(0);
  const [gridState, setGridState] = useState<number[][]>(() =>
    currentLevel.grid.map((row) => [...row])
  );
  const [movesCount, setMovesCount] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isSingingGoal, setIsSingingGoal] = useState<boolean>(false);

  // Touch gesture tracking for swiping
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Reset or load level
  const resetLevel = useCallback((level: MazeLevel) => {
    sound.playSound('pop');
    setPlayerPos(level.start);
    setCollectedStars(0);
    setGridState(level.grid.map((row) => [...row]));
    setMovesCount(0);
    setHasWon(false);
    setIsSingingGoal(false);
  }, []);

  useEffect(() => {
    resetLevel(currentLevel);
  }, [selectedLevelId, resetLevel]);

  // Attempt move
  const tryMove = useCallback(
    (dr: number, dc: number) => {
      if (hasWon) return;

      const newR = playerPos.r + dr;
      const newC = playerPos.c + dc;

      // Check bounds
      if (
        newR < 0 ||
        newR >= currentLevel.gridSize.rows ||
        newC < 0 ||
        newC >= currentLevel.gridSize.cols
      ) {
        return;
      }

      // Check wall (1 = wall)
      if (gridState[newR][newC] === 1) {
        sound.playSound('click');
        return;
      }

      // Check star pickup (2 = star)
      if (gridState[newR][newC] === 2) {
        sound.playSound('star');
        setCollectedStars((prev) => prev + 1);
        const newGrid = gridState.map((row) => [...row]);
        newGrid[newR][newC] = 0;
        setGridState(newGrid);
      } else {
        sound.playSound('pop');
      }

      setPlayerPos({ r: newR, c: newC });
      setMovesCount((m) => m + 1);

      // Check goal reached!
      if (newR === currentLevel.goal.r && newC === currentLevel.goal.c) {
        handleWin();
      }
    },
    [playerPos, gridState, hasWon, currentLevel]
  );

  const handleWin = () => {
    setHasWon(true);
    setIsSingingGoal(true);
    sound.playSound('success');
    sound.playSound('applause');

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#34d399', '#a855f7'],
    });

    onAwardStar();

    // Edu sings his authentic song for this lesson
    sound.sing(currentLevel.songLyrics, () => {
      setIsSingingGoal(false);
    });
  };

  const handleNextLevel = () => {
    const currentIndex = MAZE_LEVELS.findIndex((l) => l.id === currentLevel.id);
    const nextLevel = MAZE_LEVELS[(currentIndex + 1) % MAZE_LEVELS.length];
    setSelectedLevelId(nextLevel.id);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        tryMove(1, 0);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, -1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove]);

  // Touch Swipe on maze board
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        if (dx > 0) tryMove(0, 1); // Right
        else tryMove(0, -1); // Left
      } else {
        if (dy > 0) tryMove(1, 0); // Down
        else tryMove(-1, 0); // Up
      }
    }
  };

  // Click on adjacent cell to move
  const handleCellClick = (r: number, c: number) => {
    const dr = r - playerPos.r;
    const dc = c - playerPos.c;
    if (Math.abs(dr) + Math.abs(dc) === 1) {
      tryMove(dr, dc);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Juego Didáctico de Hábitos</span>
            <span>·</span>
            <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>Los Laberintos de</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            Guía a Edu con tu dedo o las flechitas para encontrar su cepillo, camita, tablita y más.
          </p>
        </div>

        {/* Moves & Reset */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-800 font-display flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Estrellas:</span>
            <span className="tabular-nums font-black text-amber-600 text-sm">{collectedStars}</span>
          </div>

          <button
            onClick={() => resetLevel(currentLevel)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Selector de Laberintos con escenas reales de Edu */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-bold text-amber-950 font-display flex items-center gap-2">
          <span>Elige la aventura de Edu Cadito:</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {MAZE_LEVELS.map((level) => {
            const isSelected = level.id === currentLevel.id;
            return (
              <button
                key={level.id}
                onClick={() => {
                  sound.playSound('click');
                  setSelectedLevelId(level.id);
                }}
                className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer text-left select-none active:scale-95 flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300 scale-102'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-200 bg-amber-100 relative">
                  <img src={level.image} alt={level.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 text-xs">{level.targetIcon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-black text-xs text-slate-900 truncate">
                    {level.title}
                  </h4>
                  <span className="text-[10px] text-amber-700 font-bold truncate block">
                    {level.targetName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Mission Card & Edu Dialogue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-amber-50/90 rounded-3xl p-5 border-3 border-amber-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-md bg-amber-200 shrink-0 ring-2 ring-amber-400">
                <img
                  src={heroImg}
                  alt="Edu Cadito"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                  Misión de Edu
                </span>
                <h3 className="text-base sm:text-lg font-display font-black text-slate-900 leading-tight">
                  {currentLevel.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed bg-white/80 p-3 rounded-2xl border border-amber-200/60">
              "{currentLevel.mission}"
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-amber-800 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="text-lg">{currentLevel.targetIcon}</span>
                <span>Objetivo: {currentLevel.targetName}</span>
              </span>
              <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                {movesCount} pasos
              </span>
            </div>
          </div>

          {/* Quick instructions for little kids */}
          <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 space-y-1">
            <span className="font-display font-black block">💡 ¿Cómo jugar?</span>
            <p className="text-[11px] leading-relaxed text-blue-800 font-semibold">
              Desliza tu dedo en la pantalla, toca las celdas del camino o usa los botones de flechas para llevar a Edu hasta su objetivo.
            </p>
          </div>
        </div>

        {/* Center / Right: Interactive Maze Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div
            className="relative p-2.5 sm:p-4 rounded-3xl shadow-2xl border-4 border-amber-400 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-300 select-none touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Maze Grid */}
            <div
              className="grid gap-1 sm:gap-2 bg-white/90 p-2 sm:p-3 rounded-2xl border-2 border-amber-300 shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`,
              }}
            >
              {gridState.map((row, r) =>
                row.map((cellType, c) => {
                  const isPlayer = playerPos.r === r && playerPos.c === c;
                  const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
                  const isWall = cellType === 1;
                  const isStar = cellType === 2;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center relative transition-all duration-150 cursor-pointer ${
                        isWall
                          ? 'bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-800 shadow-md border border-amber-900/20'
                          : 'bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/50'
                      }`}
                    >
                      {/* Wall texture indicator */}
                      {isWall && (
                        <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                      )}

                      {/* Pickup star */}
                      {!isPlayer && isStar && (
                        <div className="animate-pulse">
                          <Star className="w-5 h-5 sm:w-7 sm:h-7 fill-amber-400 text-amber-500 filter drop-shadow-sm" />
                        </div>
                      )}

                      {/* Goal Icon */}
                      {!isPlayer && isGoal && (
                        <div className="flex flex-col items-center justify-center animate-bounce">
                          <span className="text-2xl sm:text-4xl filter drop-shadow-md">
                            {currentLevel.targetIcon}
                          </span>
                        </div>
                      )}

                      {/* Edu Cadito Player Token */}
                      {isPlayer && (
                        <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 sm:border-3 border-white shadow-xl bg-amber-300 ring-2 ring-amber-500 z-20 animate-scale-in">
                          <img
                            src={heroImg}
                            alt="Edu Cadito"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Win Overlay Modal */}
            {hasWon && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white z-30 animate-in zoom-in duration-200">
                <div className="w-20 h-20 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mb-3 shadow-xl animate-bounce">
                  <Trophy className="w-10 h-10" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold mb-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡OBJETIVO ALCANZADO!</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-black">
                  ¡Edu llegó a {currentLevel.targetName}!
                </h3>

                <p className="text-xs sm:text-sm text-amber-200 max-w-sm mt-1 font-semibold leading-relaxed">
                  "{currentLevel.songLyrics}"
                </p>

                {isSingingGoal && (
                  <div className="mt-2 text-xs text-amber-300 flex items-center gap-1.5 font-bold animate-pulse">
                    <Volume2 className="w-4 h-4" />
                    <span>Edu está cantando su cantito... 🎶</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  <button
                    onClick={() => resetLevel(currentLevel)}
                    className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-display font-bold text-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    Jugar de nuevo
                  </button>

                  {onSelectSongId && (
                    <button
                      onClick={() => onSelectSongId(currentLevel.songId)}
                      className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <span>🎬 Ver Video</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextLevel}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-display font-black text-sm shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Siguiente Laberinto</span>
                    <Play className="w-4 h-4 fill-amber-950" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Big Juicy Directional Touch Controls for mobile fingers */}
          <div className="mt-4 flex flex-col items-center gap-2 select-none">
            {/* Up */}
            <button
              onClick={() => tryMove(-1, 0)}
              className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black shadow-md border-2 border-amber-500 flex items-center justify-center transition-transform cursor-pointer"
              aria-label="Mover arriba"
            >
              <ArrowUp className="w-7 h-7 stroke-[3]" />
            </button>

            {/* Left, Down, Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => tryMove(0, -1)}
                className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black shadow-md border-2 border-amber-500 flex items-center justify-center transition-transform cursor-pointer"
                aria-label="Mover izquierda"
              >
                <ArrowLeft className="w-7 h-7 stroke-[3]" />
              </button>

              <button
                onClick={() => tryMove(1, 0)}
                className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black shadow-md border-2 border-amber-500 flex items-center justify-center transition-transform cursor-pointer"
                aria-label="Mover abajo"
              >
                <ArrowDown className="w-7 h-7 stroke-[3]" />
              </button>

              <button
                onClick={() => tryMove(0, 1)}
                className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-90 text-amber-950 font-black shadow-md border-2 border-amber-500 flex items-center justify-center transition-transform cursor-pointer"
                aria-label="Mover derecha"
              >
                <ArrowRight className="w-7 h-7 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
