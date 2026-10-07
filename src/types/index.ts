export interface Song {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  theme: string;
  color: string;
  accentColor: string;
  badge: string;
  iconName: string;
  image: string;
  lyrics: {
    chorusStart: string;
    verse1: string;
    verse2: string;
    chorusEnd: string;
  };
  moralAdvice: string;
  fullLyrics: string[];
  musicalNotes: number[]; // melody semitones for Web Audio marimba synth
}

export interface HabitItem {
  id: string;
  title: string;
  songRef: string;
  icon: string;
  completed: boolean;
  timeSlot: 'morning' | 'day' | 'night';
}

export interface ParentAdvice {
  title: string;
  problem: string;
  solution: string;
  eduQuote: string;
  icon: string;
}
