import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, Sparkles } from 'lucide-react';
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

interface MemoryCard {
  id: number;
  pairKey: string;
  title: string;
  image: string;
  theme: string;
  color: string;
  cantitoNumber: number;
  lyrics: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARDS_DATA = [
  {
    pairKey: 'dientes',
    title: 'Edu Cepillándose',
    cantitoNumber: 2,
    lyrics: 'Los dientitos cepillar antes de irme a acostar, Edu Cadito, cepíllate bien.',
    image: dientesImg,
    theme: 'Higiene',
    color: 'border-sky-400',
  },
  {
    pairKey: 'manzana',
    title: 'Edu y su Manzana',
    cantitoNumber: 5,
    lyrics: 'Si tienes hambre come fruta rica y sana. Edu Cadito, aliméntate bien.',
    image: manzanaImg,
    theme: 'Salud',
    color: 'border-emerald-400',
  },
  {
    pairKey: 'camita',
    title: 'Edu en su Camita',
    cantitoNumber: 1,
    lyrics: 'En mi camita yo solito debo descansar. Edu Cadito, dormí solito, bien.',
    image: camitaImg,
    theme: 'Descanso',
    color: 'border-indigo-400',
  },
  {
    pairKey: 'cine',
    title: 'Edu en el Cine',
    cantitoNumber: 3,
    lyrics: 'El celular lo voy a guardar para que todos puedan disfrutar.',
    image: cineImg,
    theme: 'Respeto',
    color: 'border-amber-400',
  },
  {
    pairKey: 'manos',
    title: 'Edu Lava sus Manos',
    cantitoNumber: 4,
    lyrics: 'Agua y jabón en mis manitos para comer bien limpiecito.',
    image: manosImg,
    theme: 'Limpieza',
    color: 'border-teal-400',
  },
  {
    pairKey: 'magicas',
    title: 'Por Favor y Gracias',
    cantitoNumber: 6,
    lyrics: 'Por favor y muchas gracias son palabras de oro.',
    image: graciasImg,
    theme: 'Cortesía',
    color: 'border-pink-400',
  },
  {
    pairKey: 'tablita',
    title: 'La Tablita Arriba',
    cantitoNumber: 7,
    lyrics: 'La tablita del inodoro hacia arriba levantar. Edu Cadito, haz bien tu pipí.',
    image: tablitaImg,
    theme: 'Orden',
    color: 'border-orange-400',
  },
  {
    pairKey: 'tarea',
    title: 'Tarea y Pelota',
    cantitoNumber: 8,
    lyrics: 'Primero la tarea y después a jugar a la pelota.',
    image: tareaImg,
    theme: 'Deberes',
    color: 'border-blue-400',
  },
];

interface MemoryGameProps {
  onAwardStar: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onAwardStar }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy'); // easy = 6 pairs, medium = 8 pairs

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const startNewGame = () => {
    sound.playSound('pop');
    const selectedPairs = difficulty === 'easy' ? CARDS_DATA.slice(0, 6) : CARDS_DATA;
    const duplicated: MemoryCard[] = [];

    selectedPairs.forEach((item, index) => {
      duplicated.push({
        ...item,
        id: index * 2,
        isFlipped: false,
        isMatched: false,
      });
      duplicated.push({
        ...item,
        id: index * 2 + 1,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    for (let i = duplicated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
    }

    setCards(duplicated);
    setFlippedCards([]);
    setMoves(0);
    setMatchesFound(0);
    setIsWon(false);
  };

  const handleCardClick = (cardId: number) => {
    const cardIndex = cards.findIndex(c => c.id === cardId);
    const card = cards[cardIndex];

    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    sound.playSound('click');

    const updatedCards = [...cards];
    updatedCards[cardIndex].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const firstCard = cards.find(c => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairKey === secondCard.pairKey) {
        // MATCH!
        setTimeout(() => {
          sound.playSound('success');
          sound.sing(firstCard.lyrics);
          setCards(prev =>
            prev.map(c =>
              c.pairKey === firstCard.pairKey
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          const nextMatches = matchesFound + 1;
          setMatchesFound(nextMatches);

          const totalPairs = difficulty === 'easy' ? 6 : 8;
          if (nextMatches >= totalPairs) {
            setIsWon(true);
            sound.playSound('applause');
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 }
            });
            onAwardStar();
          }
        }, 500);
      } else {
        // NO MATCH -> Flip back
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const totalPairs = difficulty === 'easy' ? 6 : 8;

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-8 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Identidad Edu Cadito</span>
            <span>·</span>
            <span>Juego de Coincidencias</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>¡Encuentra las Parejas de</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>!</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Encuentra las dos imágenes iguales de Edu Cadito en cada una de sus lecciones.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-emerald-800 font-display">
            Parejas: <span className="text-emerald-600 font-black text-sm tabular-nums">{matchesFound} / {totalPairs}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-800 font-display">
            Intentos: <span className="text-amber-600 font-black text-sm tabular-nums">{moves}</span>
          </div>
          <button
            onClick={startNewGame}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-2xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Difficulty buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600 uppercase">Dificultad:</span>
        <button
          onClick={() => setDifficulty('easy')}
          className={`px-3.5 py-2 rounded-xl font-display text-xs font-bold transition-all cursor-pointer ${
            difficulty === 'easy'
              ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Infantil (6 parejas)
        </button>
        <button
          onClick={() => setDifficulty('medium')}
          className={`px-3.5 py-2 rounded-xl font-display text-xs font-bold transition-all cursor-pointer ${
            difficulty === 'medium'
              ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Avanzado (8 parejas)
        </button>
      </div>

      {/* Cards Grid: Visual images of Edu */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          difficulty === 'easy'
            ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
            : 'grid-cols-4 sm:grid-cols-4 md:grid-cols-8'
        }`}
      >
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all duration-300 transform cursor-pointer ${
                card.isMatched
                  ? 'border-emerald-400 ring-2 ring-emerald-200 opacity-80 scale-95'
                  : isRevealed
                  ? `${card.color} shadow-lg scale-102 ring-4 ring-amber-300`
                  : 'border-amber-300 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              {isRevealed ? (
                <div className="w-full h-full flex flex-col justify-between bg-white">
                  <div className="relative w-full h-3/4 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      {card.theme}
                    </div>
                  </div>

                  <div className="p-1.5 text-center bg-amber-50 h-1/4 flex items-center justify-center">
                    <span className="text-[10px] sm:text-[11px] font-display font-black leading-tight text-slate-900 line-clamp-1">
                      {card.title}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
                  <img
                    src={heroImg}
                    alt="Reverso Edu Cadito"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md mb-1"
                  />
                  <span className="text-[11px] font-display font-black text-white uppercase tracking-wider">
                    EDU
                  </span>
                  <span className="text-[9px] font-bold text-amber-100">
                    CADITO
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xl animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-9 h-9" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black">
            ¡Felicitaciones, Campeón!
          </h3>
          <p className="text-sm font-bold max-w-md mx-auto text-emerald-100">
            ¡Encontraste todas las parejas de Edu Cadito en {moves} intentos!
          </p>
          <div className="pt-2">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-display font-black text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              ¡Jugar Otra Vez!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

