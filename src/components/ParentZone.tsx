import React, { useState, useEffect } from 'react';
import { Shield, Clock, Heart, Mail, CheckCircle, Play, Pause, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { PARENT_ADVICES } from '../data/songs';
import { sound } from '../utils/audio';
import { ColorfulEducadito } from './ColorfulEducadito';

import heroImg from '../assets/images/edu_cadito_hero_1790867623530.jpg';
import dientesImg from '../assets/images/edu_cadito_dientes_1790867634465.jpg';
import camitaImg from '../assets/images/edu_cadito_camita_1790867656125.jpg';

export const ParentZone: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1] = useState(Math.floor(Math.random() * 5) + 3);
  const [num2] = useState(Math.floor(Math.random() * 4) + 2);
  const [parentAnswer, setParentAnswer] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  // Routine Timers
  const [activeTimerType, setActiveTimerType] = useState<'teeth' | 'toys' | 'sleep'>('teeth');
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 minutes for teeth
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            sound.playSound('applause');
            setIsTimerRunning(false);
            return 0;
          }
          if (s % 30 === 0 && activeTimerType === 'teeth') {
            sound.playSound('star'); // Chime every 30s to switch dental quadrant
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, activeTimerType]);

  const selectTimer = (type: 'teeth' | 'toys' | 'sleep') => {
    setActiveTimerType(type);
    setIsTimerRunning(false);
    if (type === 'teeth') setTimerSeconds(120); // 2 min
    if (type === 'toys') setTimerSeconds(300); // 5 min
    if (type === 'sleep') setTimerSeconds(600); // 10 min
  };

  const handleUnlockCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentAnswer, 10) === num1 + num2) {
      sound.playSound('success');
      setIsUnlocked(true);
      setUnlockError(false);
    } else {
      sound.playSound('click');
      setUnlockError(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Get current Edu visual for the active timer
  const getTimerEduImage = () => {
    if (activeTimerType === 'teeth') return dientesImg;
    if (activeTimerType === 'sleep') return camitaImg;
    return heroImg;
  };

  if (!isUnlocked) {
    return (
      <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-xl p-6 sm:p-10 max-w-md mx-auto text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-black text-slate-900">
            Zona Exclusiva para Padres
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Para entrar, resuelve esta sencilla suma para verificar que eres un adulto:
          </p>
        </div>

        <form onSubmit={handleUnlockCheck} className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
            <span className="font-display font-black text-2xl text-purple-900 tracking-wider">
              ¿Cuánto es {num1} + {num2}?
            </span>
          </div>

          <input
            type="number"
            value={parentAnswer}
            onChange={(e) => {
              setParentAnswer(e.target.value);
              setUnlockError(false);
            }}
            placeholder="Escribe el resultado"
            className="w-full text-center px-4 py-3 rounded-2xl border-2 border-purple-300 font-display font-black text-xl text-slate-900 focus:outline-hidden focus:ring-3 focus:ring-purple-400"
            autoFocus
          />

          {unlockError && (
            <p className="text-xs font-bold text-rose-500">
              Respuesta incorrecta. Inténtalo de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-display font-bold text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Acceder al Rincón de Padres
          </button>
        </form>

        <p className="text-[11px] text-slate-400">
          Diseñado para que los padres puedan descansar y consultar guías prácticas mientras los pequeños aprenden jugando.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-xl p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>Área de Acompañamiento Familiar</span>
            <span>·</span>
            <span>Modo Padres</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>Rincón de Padres con</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Herramientas prácticas, temporizadores de rutina y consejos para transformar berrinches en cooperación.
          </p>
        </div>

        <button
          onClick={() => setIsUnlocked(false)}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto cursor-pointer"
        >
          Bloquear Acceso
        </button>
      </div>

      {/* Routine Timers with Edu Cadito character consistency */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100/70 rounded-3xl p-6 border-2 border-purple-200 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-display font-black text-purple-950">
              Temporizadores Visuales con la Figura de Edu Cadito
            </h3>
            <p className="text-xs text-purple-800">
              El niño se guía por la imagen de Edu cepillándose o durmiendo para seguir la rutina.
            </p>
          </div>
        </div>

        {/* Timer selector buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'teeth', label: 'Dientitos (2 min)', subtitle: 'Edu se cepilla' },
            { id: 'toys', label: 'Ordenar Juguetes (5 min)', subtitle: 'Edu ordena' },
            { id: 'sleep', label: 'Hora de Dormir (10 min)', subtitle: 'Edu en su cama' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => selectTimer(t.id as 'teeth' | 'toys' | 'sleep')}
              className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer font-display text-xs font-bold ${
                activeTimerType === t.id
                  ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-102'
                  : 'bg-white border-purple-200 text-purple-900 hover:bg-purple-100/50'
              }`}
            >
              <div className="text-sm font-black">{t.label}</div>
              <div className="text-[10px] opacity-80 mt-0.5">{t.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Visual Timer with Edu's character */}
        <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 flex flex-col md:flex-row items-center justify-around gap-6 shadow-xs">
          {/* Edu's Character Illustration */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-purple-300 shadow-md shrink-0">
            <img
              src={getTimerEduImage()}
              alt="Edu Cadito en la rutina"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${isTimerRunning ? 'animate-bounce-slow' : ''}`}
            />
            {isTimerRunning && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                ¡En marcha!
              </div>
            )}
          </div>

          {/* Big countdown and controls */}
          <div className="flex flex-col items-center text-center">
            <span className="text-6xl sm:text-7xl font-display font-black text-purple-900 tracking-tight tabular-nums">
              {formatTime(timerSeconds)}
            </span>
            <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs">
              {activeTimerType === 'teeth' && 'Cepilla arriba, abajo y molares junto a Edu. Sonará una campana cada 30 segundos.'}
              {activeTimerType === 'toys' && 'Guardemos los juguetes en su caja antes de que termine el reloj de Edu.'}
              {activeTimerType === 'sleep' && 'Luz tenue, cuento y a descansar solito en la camita como Edu.'}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  sound.playSound('click');
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`px-8 py-3 rounded-2xl font-display font-black text-base text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isTimerRunning
                    ? 'bg-rose-500 hover:bg-rose-600'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700'
                }`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isTimerRunning ? 'Pausar' : 'Iniciar Reloj'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playSound('pop');
                  selectTimer(activeTimerType);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide & Advice for each Good Habit */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-display font-black text-slate-900">
            Guía Pedagógica: ¿Cómo enseñar con Edu Cadito?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARENT_ADVICES.map((advice, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 hover:border-purple-300 transition-colors"
            >
              <h4 className="font-display font-bold text-sm text-purple-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{advice.title}</span>
              </h4>

              <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-slate-700">El desafío común:</strong> {advice.problem}
                </p>
                <p>
                  <strong className="text-emerald-700">La solución Edu:</strong> {advice.solution}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-bold text-purple-700 bg-purple-50/70 p-2 rounded-xl italic">
                Canta con tu hijo: {advice.eduQuote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project & Creator Info */}
      <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-display font-black text-xs">
              EDU CADITO
            </span>
            <span className="text-xs text-amber-800 font-bold">El Niño Que Educa a Niños</span>
          </div>

          <h4 className="text-lg font-display font-black text-slate-900">
            Edu Cadito: El Niño Que Educa a Niños
          </h4>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Una propuesta creada para que los niños de 3 a 8 años incorporen hábitos de respeto, higiene y orden mediante canciones breves, pegadizas y divertidas, permitiendo a los padres descansar con la tranquilidad de que el contenido es 100% positivo y formativo.
          </p>
        </div>

        <div className="flex flex-col items-center shrink-0">
          <a
            href="mailto:educaditoportatebien@gmail.com"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>educaditoportatebien@gmail.com</span>
          </a>
          <span className="text-[11px] text-amber-700 mt-1 font-semibold">
            Contacto y sugerencias
          </span>
        </div>
      </div>
    </div>
  );
};

