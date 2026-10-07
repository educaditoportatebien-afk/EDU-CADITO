import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Trophy, Award, Sun, Sunset, Moon, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';
import heroImg from '../assets/images/edu_cadito_hero_1790867623530.jpg';
import { ColorfulEducadito } from './ColorfulEducadito';

interface Habit {
  id: string;
  title: string;
  cantitoRef: string;
  icon: string;
  completed: boolean;
  timeSlot: 'morning' | 'day' | 'night';
}

const INITIAL_HABITS: Habit[] = [
  {
    id: 'dientes-morning',
    title: 'Cepillarme los dientitos al levantarme',
    cantitoRef: 'Cantito #2',
    icon: '🪥',
    completed: false,
    timeSlot: 'morning',
  },
  {
    id: 'manos-morning',
    title: 'Lavar mis manitos antes del desayuno',
    cantitoRef: 'Cantito #4',
    icon: '🧼',
    completed: false,
    timeSlot: 'morning',
  },
  {
    id: 'fruta-day',
    title: 'Comer una fruta rica y sana',
    cantitoRef: 'Cantito #5',
    icon: '🍎',
    completed: false,
    timeSlot: 'day',
  },
  {
    id: 'palabras-day',
    title: 'Decir "Por favor" y "Gracias"',
    cantitoRef: 'Cantito #6',
    icon: '💖',
    completed: false,
    timeSlot: 'day',
  },
  {
    id: 'tarea-day',
    title: 'Terminar la tarea antes de jugar a la pelota',
    cantitoRef: 'Cantito #8',
    icon: '📚',
    completed: false,
    timeSlot: 'day',
  },
  {
    id: 'juguetes-day',
    title: 'Guardar mis juguetes al terminar de jugar',
    cantitoRef: 'Cantito #9',
    icon: '🧸',
    completed: false,
    timeSlot: 'day',
  },
  {
    id: 'dientes-night',
    title: 'Cepillar los dientitos antes de acostarme',
    cantitoRef: 'Cantito #2',
    icon: '✨',
    completed: false,
    timeSlot: 'night',
  },
  {
    id: 'camita-night',
    title: 'Dormir en mi propia camita solito y bien',
    cantitoRef: 'Cantito #1',
    icon: '🛌',
    completed: false,
    timeSlot: 'night',
  },
];

interface HabitsTrackerProps {
  onAwardStar: () => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({ onAwardStar }) => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [childName, setChildName] = useState('');
  const [showDiploma, setShowDiploma] = useState(false);

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        if (nextState) {
          sound.playSound('star');
          onAwardStar();
        } else {
          sound.playSound('click');
        }
        return { ...h, completed: nextState };
      }
      return h;
    });

    setHabits(updated);

    // If all completed, celebrate!
    if (updated.every(h => h.completed)) {
      sound.playSound('applause');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      setShowDiploma(true);
    }
  };

  const handleResetDay = () => {
    sound.playSound('pop');
    setHabits(habits.map(h => ({ ...h, completed: false })));
    setShowDiploma(false);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Rutina y Modales</span>
            <span>·</span>
            <span>Tabla Diaria de</span>
            <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>¡Buenos Hábitos con</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>!</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Marca cada acción cumplida para ganar estrellas y desbloquear tu Diploma de Edu Cadito.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDay}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nuevo Día</span>
          </button>
        </div>
      </div>

      {/* Progress card */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 rounded-3xl p-5 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h3 className="font-display font-black text-lg text-amber-950">
              Progreso de Buenos Modales: {completedCount} de {habits.length}
            </h3>
          </div>
          <p className="text-xs font-bold text-amber-800">
            {completedCount === habits.length
              ? '🎉 ¡Completaste todos los hábitos! ¡Eres un súper campeón!'
              : 'Sigue sumando estrellas con los cantitos de Edu.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 bg-white/80 rounded-full h-5 p-1 border border-amber-300 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Habits by time slot */}
      <div className="space-y-6">
        {/* Morning */}
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-sm text-amber-800 mb-2.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Por la Mañana</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits
              .filter(h => h.timeSlot === 'morning')
              .map(habit => (
                <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} />
              ))}
          </div>
        </div>

        {/* Afternoon / Day */}
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-sm text-sky-800 mb-2.5">
            <Sunset className="w-4 h-4 text-sky-500" />
            <span>Durante el Día</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits
              .filter(h => h.timeSlot === 'day')
              .map(habit => (
                <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} />
              ))}
          </div>
        </div>

        {/* Night */}
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-sm text-indigo-800 mb-2.5">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>Por la Noche</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits
              .filter(h => h.timeSlot === 'night')
              .map(habit => (
                <HabitCard key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} />
              ))}
          </div>
        </div>
      </div>

      {/* Diploma Trigger / Preview */}
      {completedCount >= 5 && (
        <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-7 h-7" />
          </div>
          <h4 className="font-display font-black text-lg text-slate-900">
            ¡Ya puedes reclamar el Diploma de Edu Cadito!
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Escribe el nombre del pequeño para ver y celebrar su diploma oficial de buen comportamiento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Nombre del niño/a (ej: Mateo)"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => {
                sound.playSound('applause');
                setShowDiploma(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-display font-bold text-sm shadow-md hover:from-amber-600 transition-all cursor-pointer whitespace-nowrap"
            >
              Ver Diploma
            </button>
          </div>
        </div>
      )}

      {/* Diploma Modal */}
      {showDiploma && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-8 border-amber-400 p-6 sm:p-10 max-w-lg w-full text-center space-y-4 shadow-2xl relative animate-in zoom-in duration-200">
            <button
              onClick={() => setShowDiploma(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-amber-400 shadow-md bg-amber-100 ring-2 ring-amber-300 shrink-0">
                <img src={heroImg} alt="Edu Cadito" className="w-full h-full object-cover object-top" />
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Award className="w-10 h-10" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-600 font-display">
              <span>Certificado Oficial de</span>
              <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
              ¡DIPLOMA DE BUENOS MODALES!
            </h3>

            <p className="text-sm text-slate-600">
              Se certifica con orgullo que el súper campeón/a:
            </p>

            <div className="py-2 px-6 border-b-4 border-amber-400 inline-block font-display font-black text-2xl sm:text-3xl text-red-500">
              {childName || 'Súper Campeón/a'}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              Ha demostrado que sabe cepillarse bien, dormir en su camita, comer sano, usar las palabras mágicas y portarse súper bien como Edu Cadito.
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <span>Firmado:</span>
                <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
                <span>👦</span>
              </span>
              <span>¡Pórtate Bien! ⭐</span>
            </div>

            <button
              onClick={() => {
                sound.playSound('applause');
                window.print();
              }}
              className="mt-2 px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Imprimir / Guardar Diploma 🖨️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HabitCard: React.FC<{ habit: Habit; onToggle: () => void }> = ({ habit, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-98 ${
        habit.completed
          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
          : 'bg-white hover:bg-amber-50/60 border-slate-200 text-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl sm:text-3xl p-1 rounded-xl bg-white shadow-xs">
          {habit.icon}
        </span>
        <div>
          <span className="font-display font-bold text-sm block leading-tight">
            {habit.title}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
            Inspirado en {habit.cantitoRef}
          </span>
        </div>
      </div>

      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          habit.completed
            ? 'bg-emerald-500 text-white shadow-xs'
            : 'border-2 border-slate-300 bg-slate-50'
        }`}
      >
        {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
      </div>
    </button>
  );
};
