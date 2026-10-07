import React from 'react';

interface ColorfulEducaditoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  hasSpace?: boolean; // 'EDUCADITO' vs 'EDU CADITO'
  className?: string;
  variant?: 'inline' | 'hero' | 'badge' | 'title';
  animated?: boolean;
}

interface LetterConfig {
  char: string;
  color: string;
  shadowColor: string;
  tilt: string; // slight rotation for bouncy toy look
}

const LETTERS_SINGLE: LetterConfig[] = [
  { char: 'E', color: '#ff2a2a', shadowColor: '#b30000', tilt: '-rotate-2' },
  { char: 'D', color: '#3b82f6', shadowColor: '#1d4ed8', tilt: 'rotate-3' },
  { char: 'U', color: '#f59e0b', shadowColor: '#b45309', tilt: '-rotate-1' },
  { char: 'C', color: '#10b981', shadowColor: '#047857', tilt: 'rotate-2' },
  { char: 'A', color: '#8b5cf6', shadowColor: '#6d28d9', tilt: '-rotate-3' },
  { char: 'D', color: '#ec4899', shadowColor: '#be185d', tilt: 'rotate-1' },
  { char: 'I', color: '#06b6d4', shadowColor: '#0e7490', tilt: '-rotate-2' },
  { char: 'T', color: '#f97316', shadowColor: '#c2410c', tilt: 'rotate-3' },
  { char: 'O', color: '#e11d48', shadowColor: '#9f1239', tilt: '-rotate-1' },
];

const LETTERS_WITH_SPACE: (LetterConfig | { char: ' '; isSpace: true })[] = [
  { char: 'E', color: '#ff2a2a', shadowColor: '#b30000', tilt: '-rotate-2' },
  { char: 'D', color: '#3b82f6', shadowColor: '#1d4ed8', tilt: 'rotate-3' },
  { char: 'U', color: '#f59e0b', shadowColor: '#b45309', tilt: '-rotate-1' },
  { char: ' ', isSpace: true },
  { char: 'C', color: '#10b981', shadowColor: '#047857', tilt: 'rotate-2' },
  { char: 'A', color: '#8b5cf6', shadowColor: '#6d28d9', tilt: '-rotate-3' },
  { char: 'D', color: '#ec4899', shadowColor: '#be185d', tilt: 'rotate-1' },
  { char: 'I', color: '#06b6d4', shadowColor: '#0e7490', tilt: '-rotate-2' },
  { char: 'T', color: '#f97316', shadowColor: '#c2410c', tilt: 'rotate-3' },
  { char: 'O', color: '#e11d48', shadowColor: '#9f1239', tilt: '-rotate-1' },
];

export const ColorfulEducadito: React.FC<ColorfulEducaditoProps> = ({
  size = 'md',
  hasSpace = true,
  className = '',
  variant = 'inline',
  animated = true,
}) => {
  const letters = hasSpace ? LETTERS_WITH_SPACE : LETTERS_SINGLE;

  const sizeClasses: Record<string, string> = {
    xs: 'text-xs tracking-normal',
    sm: 'text-sm tracking-normal',
    md: 'text-lg sm:text-xl tracking-tight',
    lg: 'text-2xl sm:text-3xl tracking-tight',
    xl: 'text-3xl sm:text-4xl lg:text-5xl tracking-tight',
    '2xl': 'text-4xl sm:text-5xl lg:text-6xl tracking-tight',
    hero: 'text-4xl sm:text-6xl lg:text-7xl tracking-normal',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  // Subtle, natural space widths per size
  const spaceWidths: Record<string, string> = {
    xs: 'w-1 inline-block',
    sm: 'w-1.5 inline-block',
    md: 'w-1.5 sm:w-2 inline-block',
    lg: 'w-2 sm:w-2.5 inline-block',
    xl: 'w-2 sm:w-3 inline-block',
    '2xl': 'w-2.5 sm:w-3.5 inline-block',
    hero: 'w-2.5 sm:w-4 inline-block',
  };

  const selectedSpaceClass = spaceWidths[size] || 'w-2 inline-block';

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xs shadow-md border-2 border-amber-300 ${className}`}
      >
        <span
          className={`font-display font-black inline-flex items-center select-none ${selectedSizeClass}`}
        >
          {letters.map((item, idx) => {
            if ('isSpace' in item) {
              return <span key={idx} className={selectedSpaceClass} aria-hidden="true" />;
            }
            return (
              <span
                key={idx}
                className={`inline-block transition-transform duration-200 ${
                  animated ? 'hover:scale-125 hover:-translate-y-1' : ''
                } ${item.tilt}`}
                style={{
                  color: item.color,
                  textShadow: `0 2px 0 ${item.shadowColor}, 0 3px 6px rgba(0,0,0,0.15)`,
                }}
              >
                {item.char}
              </span>
            );
          })}
        </span>
      </span>
    );
  }

  if (variant === 'hero') {
    return (
      <span
        className={`inline-flex items-center font-display font-black select-none ${selectedSizeClass} ${className}`}
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
        }}
      >
        {letters.map((item, idx) => {
          if ('isSpace' in item) {
            return <span key={idx} className={selectedSpaceClass} aria-hidden="true" />;
          }
          return (
            <span
              key={idx}
              className={`inline-block transition-all duration-300 ${item.tilt} ${
                animated ? 'hover:scale-125 hover:-translate-y-2 cursor-pointer' : ''
              }`}
              style={{
                color: item.color,
                // Cartoon 3D letter effect with white border stroke and solid colored extrusion
                WebkitTextStroke: size === 'hero' ? '2px #ffffff' : '1.5px #ffffff',
                textShadow: `
                  0 3px 0 ${item.shadowColor},
                  0 6px 0 ${item.shadowColor},
                  0 7px 4px rgba(0,0,0,0.35)
                `,
              }}
            >
              {item.char}
            </span>
          );
        })}
      </span>
    );
  }

  // Default inline / title variant
  return (
    <span
      className={`inline-flex items-center font-display font-black select-none leading-none ${selectedSizeClass} ${className}`}
    >
      {letters.map((item, idx) => {
        if ('isSpace' in item) {
          return <span key={idx} className={selectedSpaceClass} aria-hidden="true" />;
        }
        return (
          <span
            key={idx}
            className={`inline-block transition-transform duration-200 ${item.tilt} ${
              animated ? 'hover:scale-125 hover:-translate-y-1 cursor-pointer' : ''
            }`}
            style={{
              color: item.color,
              textShadow: `0 1.5px 0 ${item.shadowColor}, 0 2px 4px rgba(0,0,0,0.12)`,
            }}
          >
            {item.char}
          </span>
        );
      })}
    </span>
  );
};
