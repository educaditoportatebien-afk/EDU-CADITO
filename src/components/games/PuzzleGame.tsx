import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Eye, Trophy, Sparkles, Check, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/audio';
import { ColorfulEducadito } from '../ColorfulEducadito';

import heroImg from '../../assets/images/edu_cadito_hero_1790867623530.jpg';
import dientesImg from '../../assets/images/edu_cadito_dientes_1790867634465.jpg';
import manzanaImg from '../../assets/images/edu_cadito_manzana_1790867645514.jpg';
import camitaImg from '../../assets/images/edu_cadito_camita_1790867656125.jpg';
import cineImg from '../../assets/images/edu_cadito_cine_1791238657012.jpg';
import manosImg from '../../assets/images/edu_cadito_manos_1791238666343.jpg';
import graciasImg from '../../assets/images/edu_cadito_gracias_1791238674679.jpg';
import tablitaImg from '../../assets/images/edu_cadito_tablita_1791238682848.jpg';
import tareaImg from '../../assets/images/edu_cadito_tarea_1791238693550.jpg';
import juguetesImg from '../../assets/images/edu_cadito_juguetes_1791241233580.jpg';
import calleImg from '../../assets/images/edu_cadito_calle_1791241242439.jpg';

interface PuzzleGameProps {
  onAwardStar: () => void;
}

const PUZZLE_IMAGES = [
  {
    id: 'hero',
    name: 'Edu Cadito Campeón',
    cantito: 'Presentación Oficial',
    cantitoNumber: 0,
    moral: 'Aprende los buenos modales cantando con Edu.',
    lyrics: '¡Hola! Soy Edu Cadito. ¡Pórtate bien y cantemos juntos!',
    src: heroImg,
  },
  {
    id: 'camita',
    name: 'Dormir en su Camita',
    cantito: 'Cantito #1',
    cantitoNumber: 1,
    moral: 'En mi camita yo solito debo descansar.',
    lyrics: 'En mi camita yo solito debo descansar. Edu Cadito, dormí solito, bien.',
    src: camitaImg,
  },
  {
    id: 'dientes',
    name: 'Cepillando los Dientes',
    cantito: 'Cantito #2',
    cantitoNumber: 2,
    moral: 'Los dientitos cepillar antes de irme a acostar.',
    lyrics: 'Los dientitos cepillar antes de irme a acostar, Edu Cadito, cepíllate bien.',
    src: dientesImg,
  },
  {
    id: 'cine',
    name: 'Edu en el Cine',
    cantito: 'Cantito #3',
    cantitoNumber: 3,
    moral: 'En el cine sin celular para que todos disfruten.',
    lyrics: 'El celular lo voy a guardar para que todos puedan disfrutar.',
    src: cineImg,
  },
  {
    id: 'manos',
    name: 'Lavarse las Manos',
    cantito: 'Cantito #4',
    cantitoNumber: 4,
    moral: 'Agua y jabón en las manitos antes de comer.',
    lyrics: 'Agua y jabón en mis manitos para comer bien limpiecito.',
    src: manosImg,
  },
  {
    id: 'manzana',
    name: 'Comiendo Rico y Sano',
    cantito: 'Cantito #5',
    cantitoNumber: 5,
    moral: 'Si tienes hambre come fruta rica y sana.',
    lyrics: 'Si tienes hambre come fruta rica y sana. Edu Cadito, aliméntate bien.',
    src: manzanaImg,
  },
  {
    id: 'gracias',
    name: 'Por Favor y Gracias',
    cantito: 'Cantito #6',
    cantitoNumber: 6,
    moral: 'Por favor y gracias son las palabras de oro.',
    lyrics: 'Por favor y muchas gracias son palabras de oro. Edu Cadito, qué educado sos.',
    src: graciasImg,
  },
  {
    id: 'tablita',
    name: 'La Tablita Arriba',
    cantito: 'Cantito #7',
    cantitoNumber: 7,
    moral: 'La tablita del inodoro hacia arriba levantar.',
    lyrics: 'La tablita del inodoro hacia arriba levantar. Edu Cadito, haz bien tu pipí.',
    src: tablitaImg,
  },
  {
    id: 'tarea',
    name: 'Tarea y Pelota',
    cantito: 'Cantito #8',
    cantitoNumber: 8,
    moral: 'Primero la tarea y después a jugar a la pelota.',
    lyrics: 'Primero la tarea y después a jugar a la pelota. Edu Cadito, cumple tu deber.',
    src: tareaImg,
  },
  {
    id: 'juguetes',
    name: 'Guardar Juguetes',
    cantito: 'Cantito #9',
    cantitoNumber: 9,
    moral: 'Todos los juguetes a su caja van a entrar.',
    lyrics: 'Todos los juguetes a su caja van a entrar. Edu Cadito, ordena tu lugar.',
    src: juguetesImg,
  },
  {
    id: 'calle',
    name: 'Cruzar la Calle Seguro',
    cantito: 'Cantito #10',
    cantitoNumber: 10,
    moral: 'De la mano de mamá o papá siempre al cruzar.',
    lyrics: 'De la mano de mamá o papá siempre al cruzar. A los dos lados de la calle voy a mirar.',
    src: calleImg,
  },
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onAwardStar }) => {
  const [selectedImage, setSelectedImage] = useState(PUZZLE_IMAGES[0]);
  const [gridSize, setGridSize] = useState<number>(3); // 2, 3 or 4
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize or shuffle puzzle
  useEffect(() => {
    resetPuzzle();
  }, [selectedImage, gridSize]);

  const resetPuzzle = () => {
    sound.playSound('pop');
    const totalTiles = gridSize * gridSize;
    const initial = Array.from({ length: totalTiles }, (_, i) => i);

    // Shuffle tiles ensuring it's not already solved
    let shuffled = [...initial];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Edge case: if accidentally sorted, swap first two
    if (shuffled.every((val, idx) => val === idx)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }

    setTiles(shuffled);
    setSelectedTile(null);
    setIsCompleted(false);
    setMoves(0);
  };

  const handleTileClick = (index: number) => {
    if (isCompleted) return;

    if (selectedTile === null) {
      sound.playSound('click');
      setSelectedTile(index);
    } else {
      // Swap tiles
      sound.playSound('jump');
      const newTiles = [...tiles];
      const temp = newTiles[selectedTile];
      newTiles[selectedTile] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedTile(null);
      setMoves(m => m + 1);

      // Check win condition
      const won = newTiles.every((val, idx) => val === idx);
      if (won) {
        setIsCompleted(true);
        sound.playSound('success');
        sound.playSound('applause');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        onAwardStar();
        sound.sing(selectedImage.lyrics);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-8 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Juego Educativo</span>
            <span>·</span>
            <span>Rompecabezas de</span>
            <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>¡Arma el Rompecabezas de</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>!</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Toca una pieza y luego toca otra para intercambiarlas y completar la imagen de Edu.
          </p>
        </div>

        {/* Moves & Reset */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-800 font-display">
            Movimientos: <span className="tabular-nums font-black text-amber-600 text-sm">{moves}</span>
          </div>

          <button
            onClick={resetPuzzle}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-2xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mezclar</span>
          </button>
        </div>
      </div>

      {/* Selectors: Image and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Choose image */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
            1. Elige la imagen de Edu:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PUZZLE_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedImage(img);
                }}
                className={`relative aspect-square rounded-2xl overflow-hidden border-3 transition-all cursor-pointer ${
                  selectedImage.id === img.id
                    ? 'border-amber-500 ring-2 ring-amber-300 scale-102 shadow-md'
                    : 'border-slate-200 opacity-75 hover:opacity-100'
                }`}
                title={img.name}
              >
                <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                {selectedImage.id === img.id && (
                  <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white bg-amber-500 rounded-full p-0.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Choose level */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
            2. Elige la dificultad:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { size: 2, label: 'Fácil', age: '3-4 años', color: 'border-emerald-400' },
              { size: 3, label: 'Medio', age: '5-6 años', color: 'border-amber-400' },
              { size: 4, label: 'Desafío', age: '7-8 años', color: 'border-rose-400' },
            ].map((lvl) => (
              <button
                key={lvl.size}
                onClick={() => setGridSize(lvl.size)}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  gridSize === lvl.size
                    ? 'bg-amber-100 border-amber-500 font-bold text-amber-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="font-display font-extrabold text-sm">{lvl.label}</div>
                <div className="text-[11px] text-slate-500">{lvl.size}x{lvl.size} piezas</div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{lvl.age}</div>
              </button>
            ))}
          </div>

          {/* Helpers: Show numbers & guide */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showNumbers
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showNumbers ? 'Ocultar Números' : 'Mostrar Números de Ayuda'}</span>
            </button>

            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showPreview
                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Ocultar Guía' : 'Ver Imagen Completa'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main puzzle board area */}
      <div className="flex flex-col items-center justify-center pt-2">
        {/* Preview popup if requested */}
        {showPreview && (
          <div className="mb-4 p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center gap-4">
            <img
              src={selectedImage.src}
              alt="Guía de rompecabezas"
              className="w-28 h-28 object-cover rounded-xl shadow-md border border-amber-300"
            />
            <div className="text-xs text-amber-900 font-bold">
              <p>Así debe quedar la imagen completa de Edu.</p>
              <p className="text-slate-500 font-normal mt-1">¡Sigue armando pieza por pieza!</p>
            </div>
          </div>
        )}

        {/* Puzzle Board Container */}
        <div
          className="relative aspect-square w-full max-w-[420px] sm:max-w-[460px] p-2 bg-amber-200 rounded-3xl shadow-inner border-4 border-amber-400"
        >
          <div
            className="w-full h-full grid gap-1.5 rounded-2xl overflow-hidden bg-slate-900"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((tileIndex, slotIndex) => {
              const isSelected = selectedTile === slotIndex;
              const isCorrectPosition = tileIndex === slotIndex;

              // Calculate background position
              const col = tileIndex % gridSize;
              const row = Math.floor(tileIndex / gridSize);
              const xPercent = (col / (gridSize - 1)) * 100;
              const yPercent = (row / (gridSize - 1)) * 100;

              return (
                <button
                  key={slotIndex}
                  onClick={() => handleTileClick(slotIndex)}
                  className={`relative rounded-xl overflow-hidden transition-all duration-150 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'ring-4 ring-yellow-400 z-10 scale-105 shadow-2xl brightness-110'
                      : 'hover:opacity-90'
                  } ${isCorrectPosition && isCompleted ? 'ring-2 ring-emerald-400' : ''}`}
                  style={{
                    backgroundImage: `url(${selectedImage.src})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${xPercent}% ${yPercent}%`,
                  }}
                  aria-label={`Pieza ${slotIndex + 1}`}
                >
                  {/* Number hint badge */}
                  {showNumbers && !isCompleted && (
                    <span
                      className={`absolute top-1 left-1 w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shadow-md ${
                        isCorrectPosition
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/60 text-white backdrop-blur-xs'
                      }`}
                    >
                      {tileIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300 space-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg animate-bounce">
                <Trophy className="w-9 h-9 text-amber-950" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-white text-xs font-black uppercase">
                <span>🎵 {selectedImage.cantito}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900">
                ¡Armaste {selectedImage.name}!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-800 max-w-sm">
                "{selectedImage.moral}"
              </p>
              <div className="bg-amber-100/80 px-3 py-1.5 rounded-2xl text-xs font-display font-bold text-amber-950 border border-amber-300 flex items-center gap-2">
                <span>Edu canta: "{selectedImage.lyrics}"</span>
                <button
                  onClick={() => sound.sing(selectedImage.lyrics)}
                  className="px-2 py-0.5 bg-amber-400 hover:bg-amber-500 rounded-lg text-[10px] font-black cursor-pointer"
                >
                  🔊 Oír
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetPuzzle}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
                >
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
