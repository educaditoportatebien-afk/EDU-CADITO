import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, RotateCcw, Sparkles, Eraser, Paintbrush, Award, Palette, Check } from 'lucide-react';
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

interface ColoringGameProps {
  onAwardStar: () => void;
}

const COLOR_PALETTE = [
  '#ef4444', // Rojo (campera de Edu)
  '#f97316', // Naranja
  '#f59e0b', // Amarillo / Ámbar
  '#10b981', // Verde esmeralda
  '#06b6d4', // Celeste brillante
  '#3b82f6', // Azul (jeans de Edu)
  '#6366f1', // Índigo
  '#a855f7', // Púrpura mágico
  '#ec4899', // Rosa dulce
  '#84cc16', // Verde lima
  '#78350f', // Castaño (pelo de Edu)
  '#fed7aa', // Tono piel suave
  '#0f172a', // Negro / carbón
  '#ffffff', // Blanco
];

export const ColoringGame: React.FC<ColoringGameProps> = ({ onAwardStar }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [selectedStamp, setSelectedStamp] = useState<string>('star');
  const [filterMode, setFilterMode] = useState<'outline' | 'color'>('outline');
  const [selectedTemplateId, setSelectedTemplateId] = useState('edu-hero');
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Check if custom hero image was uploaded
  const customHero = localStorage.getItem('edu_custom_hero_image');

  const TEMPLATES = [
    {
      id: 'edu-hero',
      name: 'Edu Cadito Saludando',
      subtitle: 'Carita Oficial de Edu',
      image: customHero || heroImg,
    },
    {
      id: 'edu-camita',
      name: 'Edu en su Camita',
      subtitle: 'Dormir Solito Bien',
      image: camitaImg,
    },
    {
      id: 'edu-dientes',
      name: 'Edu Cepillándose los Dientes',
      subtitle: 'Dientitos Sanos',
      image: dientesImg,
    },
    {
      id: 'edu-cine',
      name: 'Edu en el Cine',
      subtitle: 'Celular en Silencio',
      image: cineImg,
    },
    {
      id: 'edu-manos',
      name: 'Edu Lavándose las Manos',
      subtitle: 'Agua y Jabón',
      image: manosImg,
    },
    {
      id: 'edu-manzana',
      name: 'Edu y su Manzana Rica',
      subtitle: 'Comer Sano y Rico',
      image: manzanaImg,
    },
    {
      id: 'edu-gracias',
      name: 'Edu: Por Favor y Gracias',
      subtitle: 'Palabras Mágicas',
      image: graciasImg,
    },
    {
      id: 'edu-tablita',
      name: 'Edu en el Baño',
      subtitle: 'La Tablita Arriba',
      image: tablitaImg,
    },
    {
      id: 'edu-tarea',
      name: 'Edu con su Pelota y Tarea',
      subtitle: 'Deberes Escolares',
      image: tareaImg,
    },
    {
      id: 'edu-juguetes',
      name: 'Edu Guardando Juguetes',
      subtitle: 'Habitación Ordenada',
      image: juguetesImg,
    },
    {
      id: 'edu-calle',
      name: 'Edu Cruzando la Calle',
      subtitle: 'De la Mano Seguro',
      image: calleImg,
    },
  ];

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  // Draw real image onto canvas whenever template or filterMode changes
  useEffect(() => {
    initCanvas();
  }, [selectedTemplateId, filterMode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsImageLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentTemplate.image;

    img.onload = () => {
      // 1. Clear background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (filterMode === 'outline') {
        // MODO LÁMINA PARA COLOREAR:
        // Dibujamos la imagen real de Edu en escala suave con contornos claros para rellenar
        ctx.globalAlpha = 0.40;
        ctx.filter = 'grayscale(100%) contrast(150%) brightness(110%)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        ctx.globalAlpha = 1.0;

        // Borde exterior suave estilo marco de libro para colorear
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      } else {
        // MODO FOTO REAL COMPLETA:
        // La imagen oficial de Edu a todo color en alta definición lista para pintar y decorar encima
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      setIsImageLoading(false);
    };

    img.onerror = () => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 20px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentTemplate.name, canvas.width / 2, canvas.height / 2);
      setIsImageLoading(false);
    };
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    if (currentTool === 'stamp') {
      sound.playSound('pop');
      drawStamp(ctx, coords.x, coords.y, selectedStamp);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'stamp') return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else {
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const drawStamp = (ctx: CanvasRenderingContext2D, x: number, y: number, stamp: string) => {
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const STAMP_MAP: Record<string, string> = {
      star: '⭐',
      heart: '❤️',
      apple: '🍎',
      brush: '🪥',
      trophy: '🏆',
      ball: '⚽',
      bear: '🧸',
      rainbow: '🌈',
    };

    const emoji = STAMP_MAP[stamp] || '⭐';
    ctx.fillText(emoji, x, y);
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sound.playSound('applause');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
    });
    onAwardStar();

    const link = document.createElement('a');
    link.download = `dibujo_edu_cadito_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Taller de Pintura y Arte</span>
            <span>·</span>
            <span>Imágenes Reales de Edu Cadito</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-0.5 flex flex-wrap items-center gap-2">
            <span>¡Colorea y Pinta a</span>
            <ColorfulEducadito size="lg" hasSpace={true} variant="inline" animated={true} />
            <span>!</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold">
            Elige una escena real de Edu, colorea con tus colores favoritos y decóralo con sellos mágicos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              sound.playSound('pop');
              initCanvas();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs rounded-2xl transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Borrar Todo</span>
          </button>

          <button
            onClick={handleSaveDrawing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-display font-black text-xs sm:text-sm rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Guardar mi Dibujo</span>
          </button>
        </div>
      </div>

      {/* SELECTOR DE IMÁGENES REALES DE EDU CADITO (Con miniaturas visuales) */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-bold text-amber-950 font-display flex items-center gap-2">
          <span>Elige la imagen de Edu Cadito que quieres pintar:</span>
          <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-sans font-bold">
            {TEMPLATES.length} Imágenes Oficiales
          </span>
        </label>

        {/* Carrusel táctil de miniaturas de Edu */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  sound.playSound('click');
                  setSelectedTemplateId(tmpl.id);
                }}
                className={`flex-shrink-0 w-32 sm:w-36 rounded-2xl overflow-hidden border-3 transition-all cursor-pointer text-left select-none active:scale-95 flex flex-col ${
                  isSelected
                    ? 'border-amber-500 ring-4 ring-amber-300 scale-103 shadow-lg bg-amber-50'
                    : 'border-slate-200 bg-white hover:border-amber-300 shadow-xs'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={tmpl.image}
                    alt={tmpl.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <span className="font-display font-black text-xs text-slate-900 line-clamp-1 block">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold line-clamp-1 block">
                    {tmpl.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio layout: Controls & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Toolbar */}
        <div className="lg:col-span-4 space-y-4 bg-amber-50/80 p-4 sm:p-5 rounded-3xl border-3 border-amber-200">
          
          {/* MODO DE DIBUJO: Lámina para Colorear vs Pintar sobre Edu */}
          <div>
            <label className="text-xs font-bold text-amber-950 block mb-2 font-display">
              Modo de Dibujo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playSound('click');
                  setFilterMode('outline');
                }}
                className={`py-2 px-3 rounded-2xl border-2 font-display text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'outline'
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                    : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                🖍️ Para Colorear
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setFilterMode('color');
                }}
                className={`py-2 px-3 rounded-2xl border-2 font-display text-xs font-bold transition-all cursor-pointer text-center ${
                  filterMode === 'color'
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                    : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                🎨 Foto a Color
              </button>
            </div>
          </div>

          {/* Tool switchers */}
          <div>
            <label className="text-xs font-bold text-amber-950 block mb-2 font-display">
              Herramienta:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sound.playSound('click');
                  setCurrentTool('brush');
                }}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 font-display text-xs font-bold transition-all cursor-pointer ${
                  currentTool === 'brush'
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <Paintbrush className="w-5 h-5 text-amber-800" />
                <span>Pincel</span>
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setCurrentTool('eraser');
                }}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 font-display text-xs font-bold transition-all cursor-pointer ${
                  currentTool === 'eraser'
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <Eraser className="w-5 h-5 text-rose-600" />
                <span>Borrador</span>
              </button>

              <button
                onClick={() => {
                  sound.playSound('click');
                  setCurrentTool('stamp');
                }}
                className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 font-display text-xs font-bold transition-all cursor-pointer ${
                  currentTool === 'stamp'
                    ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Sellos</span>
              </button>
            </div>
          </div>

          {/* Sellos de Edu Cadito */}
          {currentTool === 'stamp' && (
            <div>
              <label className="text-xs font-bold text-amber-900 block mb-1.5 font-display">
                Sellos de Edu:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'star', label: 'Estrella', icon: '⭐' },
                  { id: 'heart', label: 'Corazón', icon: '❤️' },
                  { id: 'apple', label: 'Manzana', icon: '🍎' },
                  { id: 'brush', label: 'Cepillo', icon: '🪥' },
                  { id: 'trophy', label: 'Premio', icon: '🏆' },
                  { id: 'ball', label: 'Pelota', icon: '⚽' },
                  { id: 'bear', label: 'Osito', icon: '🧸' },
                  { id: 'rainbow', label: 'Arcoíris', icon: '🌈' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      sound.playSound('pop');
                      setSelectedStamp(st.id);
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-2xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedStamp === st.id
                        ? 'bg-amber-300 border-amber-600 scale-110 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-amber-100'
                    }`}
                    title={st.label}
                  >
                    {st.icon}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grosor de pincel */}
          <div>
            <label className="text-xs font-bold text-amber-900 block mb-2 font-display">
              Grosor del Trazo:
            </label>
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-amber-200">
              {[8, 16, 28].map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                    brushSize === size
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {size === 8 ? 'Finito' : size === 16 ? 'Medio' : 'Grueso'}
                </button>
              ))}
            </div>
          </div>

          {/* Paleta de colores */}
          <div>
            <label className="text-xs font-bold text-amber-900 block mb-2 font-display">
              Paleta de Colores:
            </label>
            <div className="grid grid-cols-7 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sound.playSound('click');
                    setSelectedColor(c);
                    if (currentTool === 'eraser') setCurrentTool('brush');
                  }}
                  className={`w-9 h-9 rounded-2xl border-3 transition-transform cursor-pointer shadow-xs ${
                    selectedColor === c && currentTool !== 'eraser'
                      ? 'scale-115 border-slate-900 ring-2 ring-amber-300 z-10'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Canvas de Dibujo */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[560px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-400 bg-white touch-none cursor-crosshair relative">
            {isImageLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center font-display font-bold text-amber-900 text-sm z-10">
                <span>Cargando a Edu Cadito...</span>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={560}
              height={420}
              className="w-full h-full block"
              onMouseDown={handleStartDraw}
              onMouseMove={handleMoveDraw}
              onMouseUp={handleEndDraw}
              onMouseLeave={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleMoveDraw}
              onTouchEnd={handleEndDraw}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3 font-semibold text-center flex items-center gap-1.5">
            <span>👆</span>
            <span>Pasa el dedo o el ratón para colorear la escena de Edu Cadito. ¡Al terminar guárdalo o imprímelo!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
