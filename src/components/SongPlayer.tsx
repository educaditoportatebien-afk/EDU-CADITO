import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, SkipForward, SkipBack, Award, Repeat, CheckCircle2, Heart, Sparkles, Smile, Upload, Film, Mic } from 'lucide-react';
import { Song } from '../types';
import { sound } from '../utils/audio';
import { getVideoUrl } from '../utils/videoStorage';
import { ColorfulEducadito } from './ColorfulEducadito';

interface SongPlayerProps {
  songs: Song[];
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
  onAwardStar: () => void;
  unlockedBadges: string[];
  savedVideoIds: string[];
  onOpenVideoUpload: () => void;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({
  songs,
  selectedSong,
  onSelectSong,
  onAwardStar,
  unlockedBadges,
  savedVideoIds,
  onOpenVideoUpload,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const playTimerRef = useRef<number | null>(null);
  const hoverSpeechTimeoutRef = useRef<number | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const theaterRef = useRef<HTMLDivElement | null>(null);

  const hasOriginalVideo = savedVideoIds.includes(selectedSong.id) || !!videoUrl;

  // Load video URL when song changes
  useEffect(() => {
    let isCurrent = true;
    stopPlayback();
    setActiveLineIndex(0);

    getVideoUrl(selectedSong.id).then((url) => {
      if (isCurrent) {
        setVideoUrl(url);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedSong.id, savedVideoIds]);

  const stopPlayback = () => {
    sound.stopAll();
    if (playTimerRef.current) {
      window.clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    if (hoverSpeechTimeoutRef.current) {
      window.clearTimeout(hoverSpeechTimeoutRef.current);
      hoverSpeechTimeoutRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (videoUrl && videoElementRef.current) {
        videoElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn("Video play error:", err);
          startSingAlong();
        });
      } else {
        startSingAlong();
      }
    }
  };

  const startSingAlong = async () => {
    setIsPlaying(true);
    sound.playSound('pop');

    // First try playing creator's recorded audio if available
    const playedCustomAudio = await sound.playSongAudio(selectedSong.id, () => {
      setIsPlaying(false);
      handleSongCompleted();
    });

    // Play upbeat musical accompaniment in the background
    sound.playMelody(selectedSong.musicalNotes, 420);

    if (playedCustomAudio) {
      return;
    }

    const totalLines = selectedSong.fullLyrics.length;
    const durationPerLineMs = 2800;

    let currentLine = 0;
    setActiveLineIndex(0);

    sound.sing(selectedSong.fullLyrics[0]);

    const stepLyrics = () => {
      currentLine++;
      if (currentLine < totalLines) {
        setActiveLineIndex(currentLine);
        sound.sing(selectedSong.fullLyrics[currentLine]);
        playTimerRef.current = window.setTimeout(stepLyrics, durationPerLineMs);
      } else {
        setIsPlaying(false);
        setActiveLineIndex(0);
        handleSongCompleted();
      }
    };

    playTimerRef.current = window.setTimeout(stepLyrics, durationPerLineMs);
  };

  // Tap or hover over lyric line to sing it out loud for non-reading kids with Edu's authentic friendly voice
  const handleLineClick = (lineText: string, idx: number) => {
    setHoveredLineIndex(idx);
    if (hoverSpeechTimeoutRef.current) {
      window.clearTimeout(hoverSpeechTimeoutRef.current);
    }

    sound.playSound('click');
    const note = selectedSong.musicalNotes[idx % selectedSong.musicalNotes.length] || 329.63;
    sound.playMarimbaNote(note, 0.25);

    sound.sing(lineText, () => {
      setHoveredLineIndex(null);
    });
  };

  const handleSongCompleted = () => {
    sound.playSound('success');
    triggerConfetti();
    onAwardStar();

    if (isContinuousPlay) {
      setTimeout(() => {
        handleNextSong();
      }, 2000);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899']
    });
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    onSelectSong(songs[nextIndex]);
  };

  const handlePrevSong = () => {
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    onSelectSong(songs[prevIndex]);
  };

  const isBadgeUnlocked = unlockedBadges.includes(selectedSong.badge);

  return (
    <div className="space-y-8 pb-16">
      {/* 2. ELIGE EL VIDEO DE EDUCADITO QUE QUIERES VER (Puesto arriba de todo como solicitó el usuario) */}
      <section className="bg-amber-100/70 border-3 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-display font-black text-2xl shadow-md shrink-0">
              🎬
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center gap-2">
                <span>Elige el video de</span>
                <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
                <span>que quieres ver</span>
              </h2>
              <p className="text-amber-900/80 text-xs sm:text-sm font-bold mt-0.5">
                Toca cualquier recuadro para empezar a verlo y cantar con Edu:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => {
                sound.playSound('click');
                setIsContinuousPlay(!isContinuousPlay);
                if (!isContinuousPlay) {
                  onSelectSong(songs[0]);
                  theaterRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2.5 rounded-2xl font-display font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isContinuousPlay
                  ? 'bg-purple-600 text-white ring-4 ring-purple-300 animate-pulse'
                  : 'bg-white hover:bg-purple-50 text-purple-900 border-2 border-purple-300'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>{isContinuousPlay ? 'Modo Bucle Activo' : 'Ver Todos Seguidos'}</span>
            </button>

            <button
              onClick={onOpenVideoUpload}
              className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-display font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Videos Originales ({savedVideoIds.length}/10)</span>
            </button>
          </div>
        </div>

        {/* 3. Y AHÍ TODOS LOS VIDEITOS: Visual-First Card Grid (2 cols en celular, 3 en tablet, 5 en PC) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {songs.map((song) => {
            const isSelected = song.id === selectedSong.id;
            const hasBadge = unlockedBadges.includes(song.badge);
            const hasVideo = savedVideoIds.includes(song.id);

            return (
              <button
                key={song.id}
                onClick={() => {
                  sound.playSound('click');
                  onSelectSong(song);
                  // Auto scroll smoothly to the theater card
                  setTimeout(() => {
                    theaterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`relative rounded-3xl overflow-hidden border-4 transition-all duration-300 cursor-pointer group flex flex-col text-left active:scale-95 select-none ${
                  isSelected
                    ? 'border-amber-500 shadow-2xl ring-4 ring-amber-400 scale-102 bg-amber-50'
                    : 'border-white bg-white shadow-md hover:shadow-xl hover:border-amber-300 hover:scale-102'
                }`}
              >
                {/* Visual Image Showcase: Edu doing that specific good habit */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={song.image}
                    alt={`Edu Cadito - ${song.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Big Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isSelected
                        ? 'bg-amber-400 scale-110 ring-4 ring-white'
                        : 'bg-white/90 group-hover:bg-amber-400 group-hover:scale-115'
                    }`}>
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-950 text-amber-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Song Number Tag */}
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-xs text-white font-display font-black text-xs shadow-xs">
                    #{song.number}
                  </span>

                  {/* Video & Badge markers */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {hasVideo && (
                      <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                        HD
                      </span>
                    )}
                    {hasBadge && (
                      <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-300 drop-shadow-md" />
                    )}
                  </div>
                </div>

                {/* Card Title & Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">
                      {song.title}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-700 mt-1 line-clamp-1">
                      {song.subtitle}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 truncate max-w-[70%]">
                      {song.theme}
                    </span>
                    <span className="text-amber-600 flex items-center gap-1 font-display">
                      <Play className="w-3 h-3 fill-amber-600 shrink-0" />
                      Ver
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* REPRODUCTOR DEL VIDEO SELECCIONADO Y CANTITO INTERACTIVO (Teatro de Edu Cadito) */}
      <div ref={theaterRef} className="relative overflow-hidden rounded-3xl bg-white border-4 border-amber-300 shadow-xl p-4 sm:p-8 transition-all scroll-mt-24">
        {/* Colorful top accent ribbon */}
        <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${selectedSong.color}`} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-2">
          {/* Left: Video Player Scene */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border-4 border-amber-200 shadow-lg group">
              {/* Native HTML5 Video if available */}
              {videoUrl ? (
                <video
                  ref={videoElementRef}
                  src={videoUrl}
                  controls
                  playsInline
                  {...({ 'webkit-playsinline': 'true' } as Record<string, string>)}
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    handleSongCompleted();
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img
                    src={selectedSong.image}
                    alt={`Edu Cadito - ${selectedSong.title}`}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'group-hover:scale-102'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  {/* Big Play / Sing button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handleTogglePlay}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer transform active:scale-95 ${
                        isPlaying
                          ? 'bg-rose-500/90 hover:bg-rose-600 scale-90 ring-4 ring-rose-300'
                          : 'bg-gradient-to-tr from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 scale-100 hover:scale-110 ring-4 ring-amber-300/80 animate-pulse-glow'
                      }`}
                      aria-label={isPlaying ? 'Pausar canción' : 'Cantar con Edu'}
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10 fill-white" />
                      ) : (
                        <Play className="w-10 h-10 fill-white ml-1.5" />
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Badges on Scene */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold pointer-events-none">
                <Smile className="w-4 h-4 text-amber-400" />
                <span>Cantito #{selectedSong.number}</span>
                <span className="text-white/60">·</span>
                <span className="text-amber-300">{selectedSong.theme}</span>
              </div>

              {/* Status flag */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold pointer-events-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{hasOriginalVideo ? 'Video Original Oficial' : 'Cantito de Edu'}</span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 w-full">
              <button
                onClick={handlePrevSong}
                className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all cursor-pointer active:scale-90"
                aria-label="Canción anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-display font-extrabold text-sm sm:text-base shadow-md hover:from-amber-500 hover:to-orange-600 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-amber-950" /> : <Play className="w-5 h-5 fill-amber-950" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir Cantito'}</span>
              </button>

              <button
                onClick={handleNextSong}
                className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all cursor-pointer active:scale-90"
                aria-label="Siguiente canción"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Video upload suggestion if not uploaded yet */}
            {!hasOriginalVideo && (
              <div className="mt-3 text-center">
                <button
                  onClick={onOpenVideoUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-transform active:scale-95 cursor-pointer border border-amber-300"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>¿Tienes este video en tu celu o compu? Toca para cargarlo aquí</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Lyrics Sing-Along & Lesson Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                <span>Lección de</span>
                <ColorfulEducadito size="xs" hasSpace={true} variant="inline" />
                <span>·</span>
                <span>Buenos Modales</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
                {selectedSong.title}
              </h3>
              <p className="text-amber-700 font-bold text-base mt-0.5">
                {selectedSong.subtitle}
              </p>
            </div>

            {/* Karaoke Style Box with Audio on Tap / Hover (Sin voz robótica: Voz Amigable de Edu) */}
            <div className="bg-amber-50/90 rounded-3xl p-4 sm:p-5 border-3 border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                <span className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Mic className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pasa el dedo o el ratón para escuchar a Edu cantar:</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startSingAlong();
                  }}
                  className="px-3 py-1.5 bg-amber-300 hover:bg-amber-400 text-amber-950 font-display font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  title="Cantar todas las frases con la voz de Edu"
                >
                  <span>🎶 Cantar todo</span>
                </button>
              </div>

              {/* Big, touch-friendly lyric rows for fingers on mobile! */}
              <div className="space-y-2.5 font-display text-sm sm:text-base">
                {selectedSong.fullLyrics.map((line, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => handleLineClick(line, idx)}
                    onClick={() => handleLineClick(line, idx)}
                    className={`w-full p-3 sm:p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between cursor-pointer border-2 text-left active:scale-98 select-none ${
                      isPlaying && activeLineIndex === idx
                        ? 'bg-amber-400 text-amber-950 font-bold border-amber-500 shadow-md scale-102 translate-x-1 ring-2 ring-amber-300'
                        : hoveredLineIndex === idx
                        ? 'bg-amber-200 text-amber-950 font-bold border-amber-400 shadow-sm scale-102'
                        : 'bg-white border-amber-100 text-slate-800 hover:bg-amber-100 hover:border-amber-300'
                    }`}
                  >
                    <span className="leading-snug pr-2">{line}</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl shrink-0 font-bold">
                      {hoveredLineIndex === idx ? '🎶 Cantando' : '🔊 Tocar'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Moral Lesson Note */}
            <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-blue-900 block font-display text-sm">
                  ¿Por qué nos enseña esto Edu?
                </span>
                <p className="text-blue-800/90 leading-relaxed mt-0.5">
                  {selectedSong.moralAdvice}
                </p>
              </div>
            </div>

            {/* Reward & Badge Button */}
            <div className="pt-1">
              <button
                onClick={() => {
                  sound.playSound('applause');
                  triggerConfetti();
                  onAwardStar();
                }}
                className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-display font-extrabold text-base flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer active:scale-95 ${
                  isBadgeUnlocked
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/25 hover:from-amber-600 hover:to-orange-600'
                }`}
              >
                <Award className="w-6 h-6 text-amber-200" />
                <span>
                  {isBadgeUnlocked
                    ? `¡Logro Ganado: ${selectedSong.badge}!`
                    : `¡Ya aprendí este buen modal! Ganar Medalla`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
