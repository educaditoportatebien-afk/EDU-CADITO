import React, { useState } from 'react';
import { Download, X, Copy, Check, Smartphone, Share, PlusSquare, MoreVertical, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/audio';
import heroImg from '../assets/images/edu_cadito_hero_1790867623530.jpg';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  // The active URL where the app is running
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-zaru3aj6xvmsfulfz7qnde-722698693069.us-east1.run.app';

  const handleCopyLink = async () => {
    sound.playSound('pop');
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallClick = async () => {
    sound.playSound('click');
    const success = await install();
    if (success) {
      sound.playSound('applause');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-lg w-full p-5 sm:p-7 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Cerrar ventana de instalación"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Edu Cadito App Icon */}
        <div className="flex items-center gap-4 border-b border-amber-100 pb-4 pr-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-md bg-amber-100 shrink-0">
            <img src={heroImg} alt="Edu Cadito" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-600 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aplicación Oficial</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 leading-tight">
              Instalar Edu Cadito en tu Celular
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Ten a Edu siempre en tu pantalla de inicio como una app real
            </p>
          </div>
        </div>

        {/* If browser directly supports beforeinstallprompt */}
        {isInstallable && (
          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="font-display font-black text-sm text-amber-950">
                ¡Tu navegador permite instalación directa!
              </p>
              <p className="text-xs text-amber-800">
                Pulsa el botón para agregarlo automáticamente a tu escritorio.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-black text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Ya</span>
            </button>
          </div>
        )}

        {/* QR Code Section for instant camera scanning from PC to phone */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-300 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-28 h-28 bg-white p-1.5 rounded-xl shadow-md border-2 border-amber-200 shrink-0 flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`}
              alt="Código QR de Edu Cadito"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <p className="font-display font-black text-sm text-amber-950 flex items-center gap-1.5 justify-center sm:justify-start">
              <span>📷 Escanea con la cámara de tu celular</span>
            </p>
            <p className="text-xs text-amber-900 leading-relaxed">
              Si estás en tu computadora, abre la cámara de tu celular, apunta a este código QR y toca la notificación para abrirla al instante en Chrome sin escribir.
            </p>
          </div>
        </div>

        {/* Notice for In-App AI Studio viewers */}
        <div className="bg-blue-50/80 rounded-2xl p-3.5 border border-blue-200 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-display font-bold text-xs sm:text-sm">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Cómo abrir directamente en Chrome (sin buscar en Google):</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Pega el enlace en la <strong>barra de direcciones de arriba del todo</strong> (donde dice la URL junto a la casita 🏠), no en el buscador de Google.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="bg-white border border-blue-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 font-mono flex-1 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Platform Selector Tabs: Android vs iPhone */}
        <div>
          <div className="flex rounded-xl bg-slate-100 p-1 mb-3">
            <button
              onClick={() => {
                sound.playSound('pop');
                setActiveTab('android');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🤖 Celular Android (Google Chrome)
            </button>
            <button
              onClick={() => {
                sound.playSound('pop');
                setActiveTab('ios');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all cursor-pointer ${
                activeTab === 'ios'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🍏 Celular iPhone (Safari)
            </button>
          </div>

          {/* Android Steps */}
          {activeTab === 'android' && (
            <div className="space-y-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-900">Abre el enlace en Google Chrome</p>
                  <p className="text-slate-600 text-[11px]">
                    Pega el enlace que copiaste arriba en Chrome en tu celular.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Toca los 3 puntitos</span>
                    <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />
                    <span>arriba a la derecha</span>
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    En el menú de Chrome de tu celular.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Elige &quot;Instalar aplicación&quot; o &quot;Agregar a la pantalla principal&quot;
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    ¡Y listo! Se creará el ícono con la carita de Edu Cadito en el escritorio de tu celular.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* iPhone Steps */}
          {activeTab === 'ios' && (
            <div className="space-y-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-900">Abre el enlace en el navegador Safari</p>
                  <p className="text-slate-600 text-[11px]">
                    Pega el enlace que copiaste arriba en Safari en tu iPhone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Toca el botón Compartir</span>
                    <Share className="w-3.5 h-3.5 inline text-blue-600" />
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Es el cuadradito con la flechita hacia arriba en la barra inferior de Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Elige &quot;Agregar al inicio&quot;</span>
                    <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Baja un poco en las opciones y toca &quot;Agregar a la pantalla de inicio&quot;.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Done / Close Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sound.playSound('click');
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer text-center"
          >
            Entendido 👍
          </button>
        </div>

      </div>
    </div>
  );
};
