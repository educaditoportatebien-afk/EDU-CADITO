import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  Check,
  X,
  Star,
  Play,
  RotateCcw,
  Volume2,
  Film,
  Heart,
  Smile,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { ColorfulEducadito } from '../ColorfulEducadito';

import heroImg from '../../assets/images/edu_cadito_hero_1790867623530.jpg';
import dientesImg from '../../assets/images/edu_cadito_dientes_1790867634465.jpg';
import camitaImg from '../../assets/images/edu_cadito_camita_1790867656125.jpg';
import cineImg from '../../assets/images/edu_cadito_cine_1791238657012.jpg';
import manosImg from '../../assets/images/edu_cadito_manos_1791238666343.jpg';
import manzanaImg from '../../assets/images/edu_cadito_manzana_1790867645514.jpg';
import graciasImg from '../../assets/images/edu_cadito_gracias_1791238674679.jpg';
import tablitaImg from '../../assets/images/edu_cadito_tablita_1791238682848.jpg';
import tareaImg from '../../assets/images/edu_cadito_tarea_1791238693550.jpg';
import juguetesImg from '../../assets/images/edu_cadito_juguetes_1791241233580.jpg';
import calleImg from '../../assets/images/edu_cadito_calle_1791241242439.jpg';

interface DecisionGameProps {
  onAwardStar: () => void;
  onSelectSongId?: (songId: string) => void;
}

interface Scenario {
  id: string;
  cantitoNumber: number;
  songId: string;
  songTitle: string;
  question: string;
  moralLesson: string;
  songLyrics: string;
  image: string;
  optionCorrect: {
    text: string;
    icon: string;
    badge: string;
  };
  optionIncorrect: {
    text: string;
    icon: string;
    feedback: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'camita',
    cantitoNumber: 1,
    songId: 'camita',
    songTitle: 'Dormir en mi camita',
    question: 'Llega la hora de ir a dormir en la noche... ¿Qué hace Edu Cadito?',
    moralLesson: 'Dormir en tu propia camita te da un descanso maravilloso y deja que mamá y papá también descansen tranquilos.',
    songLyrics: 'En mi camita yo solito debo descansar. Edu Cadito, dormí solito, bien.',
    image: camitaImg,
    optionCorrect: {
      text: 'Voy a mi propia camita solito y feliz a soñar lindo',
      icon: '🛌',
      badge: '¡Excelente! En su camita descansa feliz',
    },
    optionIncorrect: {
      text: 'Hacer berrinche e ir a la cama de los papis',
      icon: '😫',
      feedback: '¡No! Edu nos enseña que en la cama de los papis no tenemos lugar, en la camita descansamos mejor.',
    },
  },
  {
    id: 'dientitos',
    cantitoNumber: 2,
    songId: 'dientitos',
    songTitle: 'Los dientitos cepillar',
    question: 'Terminamos de cenar antes de ir a acostarnos... ¿Qué hace Edu Cadito?',
    moralLesson: 'Cepillarse los dientes en la mañana y en la noche mantiene tu sonrisa sana, brillante y sin caries.',
    songLyrics: 'Los dientitos cepillar antes de irme a acostar, y volver a repetir al levantarme de dormir.',
    image: dientesImg,
    optionCorrect: {
      text: 'Cepillar bien los dientitos con agua y pasta',
      icon: '🪥',
      badge: '¡Súper! Dientitos blancos y relucientes',
    },
    optionIncorrect: {
      text: 'Ir a dormir sin lavarse los dientes',
      icon: '🥱',
      feedback: '¡Cuidado! Si no nos cepillamos, vienen las caries. ¡Hay que cepillarse siempre!',
    },
  },
  {
    id: 'cine',
    cantitoNumber: 3,
    songId: 'cine-celu',
    songTitle: 'En el cine sin celular',
    question: 'Entramos a la sala de cine a ver una película... ¿Qué hace Edu Cadito?',
    moralLesson: 'Poner el celular en silencio y no hablar fuerte en el cine demuestra respeto y educación por todos.',
    songLyrics: 'El celular lo voy a guardar para que todos puedan disfrutar. Edu Cadito, en silencio estás.',
    image: cineImg,
    optionCorrect: {
      text: 'Poner el celular en silencio y guardarlo en el bolsillo',
      icon: '📴',
      badge: '¡Muy bien! Respetamos a todos en la sala',
    },
    optionIncorrect: {
      text: 'Usar el teléfono con luces y volumen alto',
      icon: '📱',
      feedback: '¡Uy, no! En el cine no se usa el celular para que todos puedan disfrutar de la función.',
    },
  },
  {
    id: 'manos',
    cantitoNumber: 4,
    songId: 'manitos',
    songTitle: 'Las manos limpias',
    question: 'Llegamos de jugar afuera y nos sentamos a comer... ¿Qué hace Edu Cadito?',
    moralLesson: 'Lavarse las manos con agua y jabón quita los gérmenes y nos mantiene fuertes y sanos.',
    songLyrics: 'Agua y jabón en mis manitos para comer bien limpiecito. Edu Cadito, lávate bien.',
    image: manosImg,
    optionCorrect: {
      text: 'Lavarse las manitos con abundante agua y jabón',
      icon: '🧼',
      badge: '¡Bravo! Manitos limpias sin gérmenes',
    },
    optionIncorrect: {
      text: 'Comer directamente con las manos sucias',
      icon: '🤲',
      feedback: '¡No! Con las manos sucias nos podemos enfermar de la pancita. ¡Primero agua y jabón!',
    },
  },
  {
    id: 'manzana',
    cantitoNumber: 5,
    songId: 'manzanita',
    songTitle: 'La manzana rica y sana',
    question: 'Tenemos hambre a la hora de merendar... ¿Qué elige Edu Cadito?',
    moralLesson: 'Comer frutas ricas nos llena de vitaminas, energía sana y hace que crezcamos fuertes.',
    songLyrics: 'Si tienes hambre come fruta rica y sana. Edu Cadito, aliméntate bien.',
    image: manzanaImg,
    optionCorrect: {
      text: 'Comer una manzana dulce, rica y saludable',
      icon: '🍎',
      badge: '¡Riquísimo! Fruta sana llena de energía',
    },
    optionIncorrect: {
      text: 'Comer un paquete de caramelos y golosinas',
      icon: '🍭',
      feedback: '¡Demasiado dulce! Las golosinas hacen mal a los dientes y a la pancita. ¡Mejor una fruta fresca!',
    },
  },
  {
    id: 'gracias',
    cantitoNumber: 6,
    songId: 'por-favor-gracias',
    songTitle: 'Por favor y gracias',
    question: 'Necesitamos pedirle algo a mamá, papá o a un amigo... ¿Qué dice Edu Cadito?',
    moralLesson: 'Las palabras mágicas "Por favor" y "Muchas gracias" abren todas las puertas con una gran sonrisa.',
    songLyrics: 'Por favor y muchas gracias son palabras de oro. Edu Cadito, qué educado sos.',
    image: graciasImg,
    optionCorrect: {
      text: 'Pedir amablemente diciendo "Por favor" y "Gracias"',
      icon: '💖',
      badge: '¡Las palabras mágicas que todos quieren oír!',
    },
    optionIncorrect: {
      text: 'Exigir gritando o sacando las cosas de la mano',
      icon: '😠',
      feedback: '¡No se grita! Siempre pedimos por favor con una sonrisa.',
    },
  },
  {
    id: 'tablita',
    cantitoNumber: 7,
    songId: 'tablita',
    songTitle: 'La tablita hacia arriba levantar',
    question: 'Edu Cadito va al baño a hacer pipí... ¿Qué hace primero?',
    moralLesson: 'Levantar la tablita del inodoro mantiene el baño limpio, seco y ordenado para toda la familia.',
    songLyrics: 'La tablita del inodoro hacia arriba levantar. Edu Cadito, haz bien tu pipí.',
    image: tablitaImg,
    optionCorrect: {
      text: 'Levantar la tablita del inodoro hacia arriba',
      icon: '🚽',
      badge: '¡Exacto! El baño queda limpito y ordenado',
    },
    optionIncorrect: {
      text: 'Hacer pipí con la tabla baja y salpicar todo',
      icon: '💦',
      feedback: '¡Cuidado! Si no levantamos la tablita se ensucia todo el baño.',
    },
  },
  {
    id: 'tarea',
    cantitoNumber: 8,
    songId: 'tarea-pelota',
    songTitle: 'La tarea antes de jugar',
    question: 'Llegamos del colegio con deberes en la mochila... ¿Qué hace Edu Cadito?',
    moralLesson: 'Cumplir con las responsabilidades primero nos deja jugar a la pelota con total tranquilidad y alegría.',
    songLyrics: 'Primero la tarea y después a jugar a la pelota. Edu Cadito, cumple tu deber.',
    image: tareaImg,
    optionCorrect: {
      text: 'Hacer la tarea primero y luego salir a jugar',
      icon: '📚',
      badge: '¡Súper responsable! Después se juega sin preocupaciones',
    },
    optionIncorrect: {
      text: 'Ir a jugar a la pelota y olvidarse de los deberes',
      icon: '⚽',
      feedback: '¡No! Primero se cumple con la escuela y después tenemos todo el tiempo libre para divertirnos.',
    },
  },
  {
    id: 'juguetes',
    cantitoNumber: 9,
    songId: 'guardar-juguetes',
    songTitle: 'Guardar los juguetes',
    question: 'Terminamos de jugar con los autitos y muñecos... ¿Qué hace Edu Cadito?',
    moralLesson: 'Guardar cada juguete en su lugar evita accidentes y mantiene tu habitación hermosa y ordenada.',
    songLyrics: 'Todos los juguetes a su caja van a entrar. Edu Cadito, ordena tu lugar.',
    image: juguetesImg,
    optionCorrect: {
      text: 'Guardar todos los juguetes en su caja o baúl',
      icon: '🧸',
      badge: '¡Gran hábito! Habitación ordenada y segura',
    },
    optionIncorrect: {
      text: 'Dejar todos los juguetes tirados en el suelo',
      icon: '📦',
      feedback: '¡Peligro! Alguien puede pisar un juguete y caerse. ¡A guardar todo con Edu!',
    },
  },
  {
    id: 'calle',
    cantitoNumber: 10,
    songId: 'cruzar-calle',
    songTitle: 'Cruzar la calle seguro',
    question: 'Llegamos a la esquina con mamá o papá para cruzar... ¿Qué hace Edu Cadito?',
    moralLesson: 'De la mano de un adulto y mirando a ambos lados cruzamos la calle seguros y protegidos.',
    songLyrics: 'De la mano de mamá o papá siempre al cruzar. A los dos lados de la calle voy a mirar.',
    image: calleImg,
    optionCorrect: {
      text: 'Darle la mano a un adulto y mirar a los dos lados',
      icon: '🚸',
      badge: '¡Campeón de la seguridad! Cruzamos siempre protegidos',
    },
    optionIncorrect: {
      text: 'Cruzar corriendo solo a la calle sin mirar',
      icon: '🏃',
      feedback: '¡Muy peligroso! Nunca corremos a la calle. Siempre de la mano de un grande.',
    },
  },
];

export const DecisionGame: React.FC<DecisionGameProps> = ({ onAwardStar, onSelectSongId }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'correct' | 'incorrect' | null>(null);
  const [starsWonInGame, setStarsWonInGame] = useState<number>(0);
  const [isSinging, setIsSinging] = useState<boolean>(false);

  const scenario = SCENARIOS[currentIdx];

  const handleSelectOption = (isCorrect: boolean) => {
    if (selectedOption !== null) return; // already picked

    if (isCorrect) {
      sound.playSound('success');
      sound.playSound('applause');
      setSelectedOption('correct');
      setStarsWonInGame(prev => prev + 1);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });

      onAwardStar();

      // Edu sings his authentic song for this lesson
      setIsSinging(true);
      sound.sing(scenario.songLyrics, () => {
        setIsSinging(false);
      });
    } else {
      sound.playSound('pop');
      setSelectedOption('incorrect');
    }
  };

  const handleNext = () => {
    sound.playSound('click');
    setSelectedOption(null);
    setIsSinging(false);
    setCurrentIdx((prev) => (prev + 1) % SCENARIOS.length);
  };

  const handleRetry = () => {
    sound.playSound('pop');
    setSelectedOption(null);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Decisiones y Buenos Modales</span>
            <span>·</span>
            <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>¿Qué Haría</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>?</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            Mira la situación y elige qué buen hábito enseña Edu Cadito en sus cantitos.
          </p>
        </div>

        {/* Level Indicator & Stars */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-900 font-display flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Aciertos:</span>
            <span className="tabular-nums font-black text-amber-700 text-sm">{starsWonInGame}</span>
          </div>

          <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-2xl text-xs font-bold">
            {currentIdx + 1} de {SCENARIOS.length}
          </span>
        </div>
      </div>

      {/* Progress pill indicator for 10 cantitos */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => {
              sound.playSound('click');
              setSelectedOption(null);
              setIsSinging(false);
              setCurrentIdx(i);
            }}
            className={`px-3 py-1 rounded-full text-xs font-display font-bold transition-all cursor-pointer whitespace-nowrap ${
              currentIdx === i
                ? 'bg-amber-500 text-white shadow-xs scale-105 ring-2 ring-amber-300'
                : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'
            }`}
          >
            #{sc.cantitoNumber} {sc.songTitle.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Scenario Card */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50 rounded-3xl p-5 sm:p-7 border-3 border-amber-200 space-y-6">
        {/* Cantito Badge & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white shadow-md bg-amber-200 shrink-0 ring-2 ring-amber-400">
              <img
                src={scenario.image}
                alt={scenario.songTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider">
                <span>🎵 Cantito #{scenario.cantitoNumber}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 mt-0.5">
                {scenario.songTitle}
              </h3>
            </div>
          </div>

          {onSelectSongId && (
            <button
              onClick={() => onSelectSongId(scenario.songId)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-display font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <Film className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver Video #{scenario.cantitoNumber}</span>
            </button>
          )}
        </div>

        {/* The Dilemma Question with Edu */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs flex items-start gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 bg-amber-100 shrink-0 shadow-sm">
            <img src={heroImg} alt="Edu Cadito" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Edu te pregunta:
            </span>
            <p className="text-base sm:text-xl font-display font-black text-slate-900 leading-snug mt-0.5">
              "{scenario.question}"
            </p>
          </div>
        </div>

        {/* 2 Big Visual Option Cards for Kids (Touch-First) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opción A: La correcta (Buen Hábito de Edu) */}
          <button
            onClick={() => handleSelectOption(true)}
            disabled={selectedOption !== null}
            className={`p-5 rounded-3xl border-3 text-left transition-all cursor-pointer active:scale-98 select-none flex flex-col justify-between space-y-4 ${
              selectedOption === 'correct'
                ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 shadow-xl scale-102'
                : selectedOption === 'incorrect'
                ? 'bg-white/80 border-slate-200 opacity-60'
                : 'bg-white hover:bg-emerald-50/50 border-amber-200 hover:border-emerald-400 shadow-md hover:shadow-lg hover:scale-101'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl sm:text-5xl p-2 rounded-2xl bg-emerald-100/80 shadow-xs">
                {scenario.optionCorrect.icon}
              </span>
              {selectedOption === 'correct' && (
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block">
                Opción de Edu Cadito:
              </span>
              <p className="font-display font-black text-base sm:text-lg text-slate-900 leading-snug mt-1">
                {scenario.optionCorrect.text}
              </p>
            </div>
          </button>

          {/* Opción B: La incorrecta */}
          <button
            onClick={() => handleSelectOption(false)}
            disabled={selectedOption !== null}
            className={`p-5 rounded-3xl border-3 text-left transition-all cursor-pointer active:scale-98 select-none flex flex-col justify-between space-y-4 ${
              selectedOption === 'incorrect'
                ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200 shadow-xl'
                : selectedOption === 'correct'
                ? 'bg-white/80 border-slate-200 opacity-60'
                : 'bg-white hover:bg-rose-50/40 border-amber-200 hover:border-rose-300 shadow-md hover:shadow-lg hover:scale-101'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl sm:text-5xl p-2 rounded-2xl bg-rose-100/80 shadow-xs">
                {scenario.optionIncorrect.icon}
              </span>
              {selectedOption === 'incorrect' && (
                <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide block">
                Otra opción:
              </span>
              <p className="font-display font-black text-base sm:text-lg text-slate-900 leading-snug mt-1">
                {scenario.optionIncorrect.text}
              </p>
            </div>
          </button>
        </div>

        {/* Result & Educational Celebration Feedback */}
        {selectedOption === 'correct' && (
          <div className="bg-emerald-500 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-7 h-7 text-amber-200" />
                <h4 className="font-display font-black text-xl sm:text-2xl">
                  ¡EXCELENTE! ¡Así hace Edu Cadito! ⭐
                </h4>
              </div>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                +1 Estrella Ganada
              </span>
            </div>

            <p className="text-emerald-100 text-sm font-semibold leading-relaxed">
              "{scenario.moralLesson}"
            </p>

            <div className="bg-black/20 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-display font-bold text-amber-200 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Edu canta: "{scenario.songLyrics}"</span>
              </span>

              <button
                onClick={() => sound.sing(scenario.songLyrics)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                Volver a escuchar
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-100 text-emerald-950 font-display font-black text-sm sm:text-base shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Siguiente Situación</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {selectedOption === 'incorrect' && (
          <div className="bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-3xl p-5 shadow-md space-y-3 animate-in shake duration-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤔</span>
              <h4 className="font-display font-black text-lg text-rose-900">
                ¡Ups! Intentemos de nuevo con Edu
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-rose-800 font-semibold leading-relaxed">
              {scenario.optionIncorrect.feedback}
            </p>

            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Volver a intentar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
