import React, { useState, useRef, useEffect } from 'react';
import { Upload, Film, CheckCircle2, X, Trash2, Mic, Volume2, Image as ImageIcon, Music } from 'lucide-react';
import { SONGS_DATA } from '../data/songs';
import { saveVideoBlob, removeVideo } from '../utils/videoStorage';
import { sound } from '../utils/audio';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedVideoIds: string[];
  onVideosUpdated: () => void;
  onImageUpdated?: () => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  savedVideoIds,
  onVideosUpdated,
  onImageUpdated,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [hasCustomGreeting, setHasCustomGreeting] = useState(false);
  const [hasCustomHeroImage, setHasCustomHeroImage] = useState(false);
  const [customHeroImageUrl, setCustomHeroImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const singleInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const songAudioInputRef = useRef<HTMLInputElement | null>(null);
  const [targetSongId, setTargetSongId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkCustomGreeting();
      checkCustomHeroImage();
    }
  }, [isOpen]);

  const checkCustomHeroImage = async () => {
    const local = localStorage.getItem('edu_custom_hero_image');
    if (local) {
      setHasCustomHeroImage(true);
      setCustomHeroImageUrl(local);
      return;
    }
    try {
      const res = await fetch('/api/custom-hero-image');
      if (res.ok) {
        const data = await res.json();
        setHasCustomHeroImage(!!data.hasCustomImage);
        setCustomHeroImageUrl(data.url || null);
      }
    } catch {
      setHasCustomHeroImage(false);
    }
  };

  const checkCustomGreeting = async () => {
    const local = localStorage.getItem('edu_custom_greeting_data');
    if (local) {
      setHasCustomGreeting(true);
      return;
    }
    try {
      const res = await fetch('/api/custom-greeting');
      if (res.ok) {
        const data = await res.json();
        setHasCustomGreeting(!!data.hasCustomGreeting);
      }
    } catch {
      setHasCustomGreeting(false);
    }
  };

  if (!isOpen) return null;

  // Smart song matcher from filename
  const detectSongId = (filename: string): string | null => {
    const f = filename.toLowerCase();
    if (f.includes('cama') || f.includes('dormi')) return 'camita';
    if (f.includes('diente') || f.includes('cepill')) return 'dientitos';
    if (f.includes('cine') || f.includes('celu') || f.includes('avion')) return 'cine-celu';
    if (f.includes('mano') || f.includes('lavad') || f.includes('lavar')) return 'manitos';
    if (f.includes('manzana') || f.includes('dulce') || f.includes('alimenta')) return 'manzanita';
    if (f.includes('gracia') || f.includes('favor') || f.includes('palabra')) return 'por-favor-gracias';
    if (f.includes('tablita') || f.includes('pipi') || f.includes('baño') || f.includes('bano')) return 'tablita';
    if (f.includes('tarea') || f.includes('pelota')) return 'tarea-pelota';
    if (f.includes('juguete') || f.includes('ordena')) return 'guardar-juguetes';
    if (f.includes('calle') || f.includes('cruzar')) return 'cruzar-calle';

    return null;
  };

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadMessage('Guardando videos originales...');

    let matchedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const songId = detectSongId(file.name);
      if (songId) {
        await saveVideoBlob(songId, file, file.name);
        matchedCount++;
      }
    }

    setIsUploading(false);
    sound.playSound('success');
    setUploadMessage(`¡Se guardaron ${matchedCount} videos con su música y voz original!`);
    onVideosUpdated();
  };

  const handleSingleSongUpload = (songId: string) => {
    setTargetSongId(songId);
    singleInputRef.current?.click();
  };

  const handleSingleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !targetSongId) return;

    const file = files[0];
    setIsUploading(true);
    await saveVideoBlob(targetSongId, file, file.name);
    setIsUploading(false);
    sound.playSound('success');
    onVideosUpdated();
  };

  const handleDelete = async (songId: string) => {
    await removeVideo(songId);
    sound.playSound('pop');
    onVideosUpdated();
  };

  // Image Upload handler (SOY EDU.png or eduuuu2222.png)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadMessage('Guardando la imagen oficial de Edu Cadito...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/custom-hero-image', {
        method: 'POST',
        body: formData,
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          localStorage.setItem('edu_custom_hero_image', base64);
          setCustomHeroImageUrl(base64);
          setHasCustomHeroImage(true);
          if (onImageUpdated) onImageUpdated();
        }
      };
      reader.readAsDataURL(file);

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setCustomHeroImageUrl(data.url);
        }
      }

      sound.playSound('success');
      setHasCustomHeroImage(true);
      setUploadMessage('¡Imagen oficial de Edu guardada con éxito! Ya se ve en la portada de la app.');
      if (onImageUpdated) onImageUpdated();
    } catch (err) {
      console.error("Image upload error:", err);
      setUploadMessage('Error al guardar la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCustomImage = async () => {
    try {
      localStorage.removeItem('edu_custom_hero_image');
      await fetch('/api/custom-hero-image', { method: 'DELETE' });
      setHasCustomHeroImage(false);
      setCustomHeroImageUrl(null);
      sound.playSound('pop');
      setUploadMessage('Se restauró la imagen predeterminada.');
      if (onImageUpdated) onImageUpdated();
    } catch {
      // ignore
    }
  };

  // Audio Greeting Upload handler
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadMessage('Guardando tu audio de voz para Edu...');

    try {
      const formData = new FormData();
      formData.append('audio', file);
      await fetch('/api/custom-greeting', {
        method: 'POST',
        body: formData,
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          localStorage.setItem('edu_custom_greeting_data', base64);
        }
      };
      reader.readAsDataURL(file);

      sound.playSound('success');
      setHasCustomGreeting(true);
      setUploadMessage('¡Audio de voz cargado con éxito! Ahora Edu saludará con tu voz real.');
    } catch (err) {
      console.error("Audio upload error:", err);
      setUploadMessage('Error al subir el audio.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCustomAudio = () => {
    localStorage.removeItem('edu_custom_greeting_data');
    setHasCustomGreeting(false);
    sound.playSound('pop');
    setUploadMessage('Se restauró el saludo con la voz predeterminada.');
  };

  const handlePlayGreetingTest = () => {
    sound.playSound('star');
    sound.playEduGreeting();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border-4 border-amber-400 max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={handleMultipleFiles}
        />
        <input
          type="file"
          ref={singleInputRef}
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={handleSingleFileSelected}
        />
        <input
          type="file"
          ref={audioInputRef}
          accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg,audio/*"
          className="hidden"
          onChange={handleAudioUpload}
        />
        <input
          type="file"
          ref={imageInputRef}
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Film className="w-4 h-4 text-amber-500" />
            <span>Identidad Original de Edu Cadito</span>
            <span>·</span>
            <span>Imagen, Voz y Videos</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-1">
            Centro de Medios Oficiales de Edu
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Aquí puedes subir la imagen original de Edu Cadito con su carita auténtica, tus grabaciones de voz en MP3 y los videos originales.
          </p>
        </div>

        {/* 1. SECCIÓN: SUBIR LA IMAGEN ORIGINAL DE EDU CADITO */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                {customHeroImageUrl ? (
                  <img src={customHeroImageUrl} alt="Edu Oficial" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-7 h-7" />
                )}
              </div>
              <div>
                <h4 className="font-display font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <span>Carita Oficial de Edu Cadito</span>
                  {hasCustomHeroImage && (
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Imagen Oficial Activa
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {hasCustomHeroImage
                    ? '¡Tu imagen oficial está colocada! Es la que se muestra en grande en la portada.'
                    : 'Sube tu archivo original (SOY EDU.png o eduuuu2222.png) para que Edu tenga siempre su carita exacta.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>{hasCustomHeroImage ? 'Cambiar Imagen' : 'Subir Imagen Oficial (.png)'}</span>
              </button>

              {hasCustomHeroImage && (
                <button
                  type="button"
                  onClick={handleDeleteCustomImage}
                  className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                  title="Restaurar imagen predeterminada"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN: SUBIR TU PROPIO AUDIO PARA EL SALUDO DE EDU */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-base sm:text-lg text-amber-950 flex items-center gap-2">
                  <span>Tu Voz Real en el "¡Salúdame Edu!"</span>
                  {hasCustomGreeting && (
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Voz Oficial Activa
                    </span>
                  )}
                </h4>
                <p className="text-xs text-amber-900/80 font-medium">
                  {hasCustomGreeting
                    ? '¡Tu grabación de voz está activa! Al tocar a Edu o en "Salúdame", suena tu propia voz.'
                    : 'Sube tu archivo de audio (MP3, WAV o nota de voz) para que Edu salude con tu voz original.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handlePlayGreetingTest}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Probar Saludo</span>
              </button>

              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>{hasCustomGreeting ? 'Cambiar mi Audio' : 'Subir mi Audio (MP3/WAV)'}</span>
              </button>

              {hasCustomGreeting && (
                <button
                  type="button"
                  onClick={handleDeleteCustomAudio}
                  className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                  title="Restaurar saludo predeterminado"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. SECCIÓN: GESTIÓN DE VIDEOS ORIGINALES */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100/60 rounded-3xl p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Seleccionar los videos de Edu Cadito
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Puedes seleccionar los 8 o 10 videos a la vez. La app los guardará de forma permanente.
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all pointer-events-none"
          >
            {isUploading ? 'Cargando...' : 'Elegir Archivos de Video (.mp4)'}
          </button>
        </div>

        {uploadMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {/* Song by Song Video Status List */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-500">
            Lista de Cantitos ({savedVideoIds.length}/10 con video original)
          </h4>

          <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {SONGS_DATA.map((song) => {
              const hasVideo = savedVideoIds.includes(song.id);
              return (
                <div
                  key={song.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-colors ${
                    hasVideo
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white shadow-xs flex items-center justify-center font-display font-black text-xs text-amber-700">
                      #{song.number}
                    </span>
                    <div>
                      <div className="font-display font-bold text-sm flex items-center gap-1.5">
                        <span>{song.title}</span>
                        {hasVideo && (
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-sans font-bold">
                            Voz y Música Original Activa
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 truncate block">
                        "{song.lyrics.chorusStart} {song.lyrics.verse1}"
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSingleSongUpload(song.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-xs"
                    >
                      {hasVideo ? 'Cambiar Video' : 'Subir Video'}
                    </button>

                    {hasVideo && (
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                        title="Quitar video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
