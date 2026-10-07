/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SONGS_DATA } from './data/songs';
import { Song } from './types';
import { Navbar } from './components/Navbar';
import { SongPlayer } from './components/SongPlayer';
import { PuzzleGame } from './components/games/PuzzleGame';
import { MemoryGame } from './components/games/MemoryGame';
import { ColoringGame } from './components/games/ColoringGame';
import { MazeGame } from './components/games/MazeGame';
import { DecisionGame } from './components/games/DecisionGame';
import { HabitsTracker } from './components/HabitsTracker';
import { ParentZone } from './components/ParentZone';
import { EduBadgeModal } from './components/EduBadgeModal';
import { VideoUploadModal } from './components/VideoUploadModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { ColorfulEducadito } from './components/ColorfulEducadito';
import { sound } from './utils/audio';
import { getAllSavedSongIds } from './utils/videoStorage';

import heroImg from './assets/images/edu_cadito_hero_1790867623530.jpg';
import { Music, Gamepad2, Palette, CalendarCheck2, Shield, Sparkles, Smile, Heart, Film, Smartphone } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'songs' | 'games' | 'color' | 'habits' | 'parents'>('songs');
  const [selectedGameSubTab, setSelectedGameSubTab] = useState<'maze' | 'decisions' | 'puzzle' | 'memory'>('maze');
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS_DATA[0]);
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('edu_cadito_stars');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('edu_cadito_badges');
    return saved ? JSON.parse(saved) : ['Estrella del Buen Dormir'];
  });
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [customHeroImg, setCustomHeroImg] = useState<string | null>(() => {
    return localStorage.getItem('edu_custom_hero_image');
  });

  const checkCustomHeroImage = async () => {
    try {
      const res = await fetch('/api/custom-hero-image');
      if (res.ok) {
        const data = await res.json();
        if (data.hasCustomImage && data.url) {
          setCustomHeroImg(data.url);
          localStorage.setItem('edu_custom_hero_image', data.url);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    localStorage.setItem('edu_cadito_stars', starsCount.toString());
  }, [starsCount]);

  useEffect(() => {
    localStorage.setItem('edu_cadito_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  const refreshSavedVideos = async () => {
    try {
      const ids = await getAllSavedSongIds();
      const serverRes = await fetch('/api/videos');
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.success && data.videos) {
          const serverKeys = Object.keys(data.videos);
          const union = Array.from(new Set([...ids, ...serverKeys]));
          setSavedVideoIds(union);
          return;
        }
      }
      setSavedVideoIds(ids);
    } catch {
      const ids = await getAllSavedSongIds();
      setSavedVideoIds(ids);
    }
  };

  useEffect(() => {
    refreshSavedVideos();
    checkCustomHeroImage();
  }, []);

  const handleAwardStar = () => {
    setStarsCount(prev => prev + 1);
    if (!unlockedBadges.includes(selectedSong.badge)) {
      setUnlockedBadges(prev => [...prev, selectedSong.badge]);
    }
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleTapEdu = () => {
    sound.playSound('star');
    sound.playEduGreeting();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/60 text-slate-800 flex flex-col font-sans pb-24 md:pb-0">
      {/* Top Bar Navigation (Desktop & Tablet) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        starsCount={starsCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* 1. LA PRESENTACIÓN DE EDUCADITO: Visual, Imponente, Amigable y Tierna */}
        <section className="mb-6 sm:mb-8 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-white p-5 sm:p-8 shadow-xl border-4 border-amber-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Main Visual: Gran presencia de Edu Cadito con su carita original oficial */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 z-10 text-center sm:text-left w-full md:w-auto">
            
            {/* Imagen Gigante de Edu Cadito - Más grande, reluciente y con máximo protagonismo */}
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={handleTapEdu}
              role="button"
              tabIndex={0}
              aria-label="Tocar a Edu Cadito para saludar"
            >
              <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-amber-200 ring-6 ring-amber-300/95 transition-transform duration-300 group-hover:scale-105 active:scale-95 group-hover:rotate-1 relative">
                <img
                  src={customHeroImg || heroImg}
                  alt="Edu Cadito - El Niño Que Educa Niños"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter brightness-102 contrast-102"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/15 pointer-events-none" />
              </div>

              {/* Globo interactivo flotante para niños */}
              <div className="absolute -bottom-3 -right-2 bg-white text-slate-900 px-3.5 py-1.5 rounded-full font-display font-black text-xs sm:text-sm shadow-xl border-2 border-amber-400 flex items-center gap-1.5 animate-bounce">
                <span>⭐</span>
                <span>¡Tócame para hablar!</span>
                <span>🔊</span>
              </div>
            </div>

            {/* Texto visual y cálido de bienvenida con tipografía multicolor */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3.5 sm:px-4 py-1.5 rounded-full text-amber-200 text-xs sm:text-sm md:text-base font-display font-black tracking-wider uppercase mb-3 border border-amber-300/40 shadow-sm whitespace-nowrap">
                <span className="text-sm sm:text-base">👦</span>
                <span>EL NIÑO QUE EDUCA NIÑOS</span>
              </div>

              <div className="space-y-1">
                <span className="text-xl sm:text-3xl font-display font-black text-amber-100 tracking-wider block drop-shadow-sm">
                  ¡HOLA! SOY
                </span>
                <div className="pt-1 pb-1">
                  <ColorfulEducadito size="hero" hasSpace={true} variant="hero" animated={true} />
                </div>
              </div>

              <p className="text-base sm:text-xl text-amber-100 font-display font-bold mt-2 sm:mt-3 leading-snug drop-shadow-xs">
                ¡Pórtate bien! Aprende conmigo con 10 cantitos y divertidos juegos.
              </p>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex flex-row md:flex-col gap-2.5 z-10 w-full sm:w-auto shrink-0 justify-center flex-wrap">
            <button
              onClick={handleTapEdu}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white text-amber-950 font-display font-black text-xs sm:text-base shadow-xl hover:bg-amber-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Smile className="w-5 h-5 text-amber-500" />
              <span>¡Salúdame Edu! 🔊</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('pop');
                setIsInstallModalOpen(true);
              }}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/30"
            >
              <Smartphone className="w-4 h-4 text-emerald-100" />
              <span>Instalar en Celu 📲</span>
            </button>

            <button
              onClick={() => {
                sound.playSound('click');
                setIsVideoUploadModalOpen(true);
              }}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-amber-950/80 hover:bg-amber-950 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
            >
              <Film className="w-4 h-4 text-amber-300" />
              <span>Videos ({savedVideoIds.length}/10)</span>
            </button>
          </div>

          {/* Burbujas y brillos decorativos de fondo */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* Tab 1: Canciones y Cantitos (Con los videos arriba y el teatro del cantito interactivo) */}
        {currentTab === 'songs' && (
          <SongPlayer
            songs={SONGS_DATA}
            selectedSong={selectedSong}
            onSelectSong={setSelectedSong}
            onAwardStar={handleAwardStar}
            unlockedBadges={unlockedBadges}
            savedVideoIds={savedVideoIds}
            onOpenVideoUpload={() => setIsVideoUploadModalOpen(true)}
          />
        )}

        {/* Tab 2: Juegos de Edu Cadito */}
        {currentTab === 'games' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-1.5 p-1.5 bg-amber-100/80 rounded-2xl max-w-xl mx-auto border-2 border-amber-300 flex-wrap">
              <button
                onClick={() => {
                  sound.playSound('click');
                  setSelectedGameSubTab('maze');
                }}
                className={`py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedGameSubTab === 'maze'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                🌀 Laberintos
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setSelectedGameSubTab('decisions');
                }}
                className={`py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedGameSubTab === 'decisions'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                💡 ¿Qué Haría Edu?
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setSelectedGameSubTab('puzzle');
                }}
                className={`py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedGameSubTab === 'puzzle'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                🧩 Rompecabezas
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setSelectedGameSubTab('memory');
                }}
                className={`py-2 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedGameSubTab === 'memory'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-amber-200/60'
                }`}
              >
                🃏 Memoria
              </button>
            </div>

            {selectedGameSubTab === 'maze' && (
              <MazeGame
                onAwardStar={handleAwardStar}
                onSelectSongId={(songId) => {
                  const song = SONGS_DATA.find(s => s.id === songId);
                  if (song) {
                    setSelectedSong(song);
                    setCurrentTab('songs');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }
                }}
              />
            )}
            {selectedGameSubTab === 'decisions' && (
              <DecisionGame
                onAwardStar={handleAwardStar}
                onSelectSongId={(songId) => {
                  const song = SONGS_DATA.find(s => s.id === songId);
                  if (song) {
                    setSelectedSong(song);
                    setCurrentTab('songs');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }
                }}
              />
            )}
            {selectedGameSubTab === 'puzzle' && (
              <PuzzleGame onAwardStar={handleAwardStar} />
            )}
            {selectedGameSubTab === 'memory' && (
              <MemoryGame onAwardStar={handleAwardStar} />
            )}
          </div>
        )}

        {/* Tab 3: Colorear */}
        {currentTab === 'color' && (
          <ColoringGame onAwardStar={handleAwardStar} />
        )}

        {/* Tab 4: Rutinas y Buenos Hábitos */}
        {currentTab === 'habits' && (
          <HabitsTracker onAwardStar={handleAwardStar} />
        )}

        {/* Tab 5: Rincón de Padres */}
        {currentTab === 'parents' && (
          <ParentZone />
        )}
      </main>

      {/* Badges Modal */}
      <EduBadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        unlockedBadges={unlockedBadges}
        starsCount={starsCount}
      />

      {/* Video Upload & Management Modal */}
      <VideoUploadModal
        isOpen={isVideoUploadModalOpen}
        onClose={() => setIsVideoUploadModalOpen(false)}
        savedVideoIds={savedVideoIds}
        onVideosUpdated={refreshSavedVideos}
        onImageUpdated={checkCustomHeroImage}
      />

      {/* PWA Phone Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Floating Quick Install Button on Mobile */}
      <div className="md:hidden fixed bottom-18 right-3 z-40">
        <button
          onClick={() => {
            sound.playSound('pop');
            setIsInstallModalOpen(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-2 rounded-full font-display font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 border-2 border-white transition-transform active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar en Celu 📲</span>
        </button>
      </div>

      {/* BARRA DE NAVEGACIÓN MÓVIL INFERIOR (100% Mobile-Friendly para Celular) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-3 border-amber-300 py-1.5 px-3 flex justify-around items-center shadow-2xl safe-area-bottom"
        aria-label="Navegación móvil"
      >
        <button
          onClick={() => {
            sound.playSound('click');
            setCurrentTab('songs');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
            currentTab === 'songs'
              ? 'text-amber-950 font-bold bg-amber-200/80 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Music className={`w-5 h-5 ${currentTab === 'songs' ? 'text-amber-600' : ''}`} />
          <span className="text-[10px] font-display font-bold mt-0.5">Videos</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setCurrentTab('games');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
            currentTab === 'games'
              ? 'text-emerald-950 font-bold bg-emerald-200/80 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Gamepad2 className={`w-5 h-5 ${currentTab === 'games' ? 'text-emerald-600' : ''}`} />
          <span className="text-[10px] font-display font-bold mt-0.5">Juegos</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setCurrentTab('color');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
            currentTab === 'color'
              ? 'text-pink-950 font-bold bg-pink-200/80 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className={`w-5 h-5 ${currentTab === 'color' ? 'text-pink-600' : ''}`} />
          <span className="text-[10px] font-display font-bold mt-0.5">Colorear</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setCurrentTab('habits');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
            currentTab === 'habits'
              ? 'text-blue-950 font-bold bg-blue-200/80 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck2 className={`w-5 h-5 ${currentTab === 'habits' ? 'text-blue-600' : ''}`} />
          <span className="text-[10px] font-display font-bold mt-0.5">Hábitos</span>
        </button>

        <button
          onClick={() => {
            sound.playSound('click');
            setCurrentTab('parents');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer select-none active:scale-90 ${
            currentTab === 'parents'
              ? 'text-purple-950 font-bold bg-purple-200/80 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className={`w-5 h-5 ${currentTab === 'parents' ? 'text-purple-600' : ''}`} />
          <span className="text-[10px] font-display font-bold mt-0.5">Papás</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t-2 border-amber-200 py-6 px-4 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-amber-600">EDU CADITO</span>
            <span>·</span>
            <span className="uppercase font-bold tracking-wider text-[11px] text-slate-500">EL NIÑO QUE EDUCA NIÑOS</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>educaditoportatebien@gmail.com</span>
            <span>·</span>
            <span>Para pequeños de 3 a 8 años y sus familias</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
