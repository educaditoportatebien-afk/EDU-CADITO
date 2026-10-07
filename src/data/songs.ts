import { Song, ParentAdvice } from '../types';

import heroImg from '../assets/images/edu_cadito_hero_1790867623530.jpg';
import dientesImg from '../assets/images/edu_cadito_dientes_1790867634465.jpg';
import manzanaImg from '../assets/images/edu_cadito_manzana_1790867645514.jpg';
import camitaImg from '../assets/images/edu_cadito_camita_1790867656125.jpg';
import cineImg from '../assets/images/edu_cadito_cine_1791238657012.jpg';
import manosImg from '../assets/images/edu_cadito_manos_1791238666343.jpg';
import graciasImg from '../assets/images/edu_cadito_gracias_1791238674679.jpg';
import tablitaImg from '../assets/images/edu_cadito_tablita_1791238682848.jpg';
import tareaImg from '../assets/images/edu_cadito_tarea_1791238693550.jpg';
import juguetesImg from '../assets/images/edu_cadito_juguetes_1791241233580.jpg';
import calleImg from '../assets/images/edu_cadito_calle_1791241242439.jpg';

export const SONGS_DATA: Song[] = [
  {
    id: 'camita',
    number: 1,
    title: 'Dormir en mi camita',
    subtitle: 'Dormí solito bien',
    theme: 'Sueño y descanso',
    color: 'from-indigo-500 to-purple-600',
    accentColor: 'bg-indigo-500',
    badge: 'Estrella del Buen Dormir',
    iconName: 'Moon',
    image: camitaImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'En la cama de los papis no tengo lugar,',
      verse2: 'en mi camita yo solito debo descansar.',
      chorusEnd: 'Edu Cadito, ¡dormí solito, bien!'
    },
    moralAdvice: 'Tener tu propia camita te ayuda a descansar feliz y deja que mamá y papá también duerman tranquilos.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'En la cama de los papis no tengo lugar.',
      'En mi camita yo solito debo descansar.',
      'Edu Cadito, dormí solito, bien.'
    ],
    musicalNotes: [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 261.63]
  },
  {
    id: 'dientitos',
    number: 2,
    title: 'Los dientitos cepillar',
    subtitle: 'Cepíllate bien',
    theme: 'Higiene dental',
    color: 'from-sky-400 to-blue-600',
    accentColor: 'bg-sky-500',
    badge: 'Sonrisa Brillante',
    iconName: 'Sparkles',
    image: dientesImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Los dientitos cepillar antes de irme a acostar,',
      verse2: 'y volver a repetir al levantarme de dormir.',
      chorusEnd: 'Edu Cadito, ¡cepíllate bien!'
    },
    moralAdvice: 'Cepillar los dientitos en la mañana y en la noche mantiene tu sonrisa sana, brillante y sin caries.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Los dientitos cepillar antes de irme a acostar,',
      'y volver a repetir al levantarme de dormir.',
      'Edu Cadito, cepíllate bien.'
    ],
    musicalNotes: [329.63, 392.00, 440.00, 523.25, 392.00, 329.63, 392.00, 523.25]
  },
  {
    id: 'cine-celu',
    number: 3,
    title: 'En el cine y espectáculos',
    subtitle: 'Celu en modo avión',
    theme: 'Respeto en público',
    color: 'from-amber-500 to-red-600',
    accentColor: 'bg-amber-500',
    badge: 'Espectador Respetuoso',
    iconName: 'Clapperboard',
    image: cineImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Ya comienza la función, pon tu celu en modo avión.',
      verse2: 'Si algo tienes que decir, espera a que termine el film.',
      chorusEnd: 'Edu Cadito, ¡pórtate bien!'
    },
    moralAdvice: 'En el cine o en el teatro guardamos silencio y apagamos pantallas para que todos disfruten la función.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Ya comienza la función, pon tu celu en modo avión.',
      'Si algo tienes que decir, espera a que termine el film.',
      'Edu Cadito, pórtate bien.'
    ],
    musicalNotes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25]
  },
  {
    id: 'manitos',
    number: 4,
    title: 'Mis manitos lavar',
    subtitle: 'Agua y jabón siempre',
    theme: 'Higiene personal',
    color: 'from-teal-400 to-emerald-600',
    accentColor: 'bg-teal-500',
    badge: 'Manitas Impecables',
    iconName: 'Droplets',
    image: manosImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Antes de sentarme a comer, mis manitos debo yo lavar,',
      verse2: 'y si al baño voy a ir, lavadita debo repetir.',
      chorusEnd: 'Edu Cadito, ¡pórtate bien!'
    },
    moralAdvice: 'Lavarse las manos con agua y jabón elimina bacterias y nos cuida antes de cada comida y después del baño.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Antes de sentarme a comer, mis manitos debo yo lavar,',
      'y si al baño voy a ir, lavadita debo repetir.',
      'Edu Cadito, pórtate bien.'
    ],
    musicalNotes: [392.00, 440.00, 392.00, 329.63, 261.63, 293.66, 329.63]
  },
  {
    id: 'manzanita',
    number: 5,
    title: 'Comer rico y sano',
    subtitle: 'Alimentate bien',
    theme: 'Alimentación saludable',
    color: 'from-emerald-400 to-green-600',
    accentColor: 'bg-emerald-500',
    badge: 'Campeón Nutritivo',
    iconName: 'Apple',
    image: manzanaImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'La pancita con dulces no debo llenar,',
      verse2: 'una manzanita no me viene nada mal.',
      chorusEnd: 'Edu Cadito, ¡alimentate bien!'
    },
    moralAdvice: 'Las frutas y comidas saludables te dan súper energía para jugar y crecer fuerte y veloz.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'La pancita con dulces no debo llenar.',
      'Una manzanita no me viene nada mal.',
      'Edu Cadito, alimentate bien.'
    ],
    musicalNotes: [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63]
  },
  {
    id: 'por-favor-gracias',
    number: 6,
    title: 'Las palabras mágicas',
    subtitle: 'Por favor y Gracias',
    theme: 'Amabilidad y Cortesía',
    color: 'from-pink-500 to-rose-600',
    accentColor: 'bg-pink-500',
    badge: 'Corazón Amable',
    iconName: 'HeartHandshake',
    image: graciasImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Por favor y gracias siempre debo yo decir,',
      verse2: 'esas dos palabras muchas puertas van a abrir.',
      chorusEnd: 'Edu Cadito, ¡pórtate bien!'
    },
    moralAdvice: 'Decir "Por favor" al pedir algo y "Gracias" al recibirlo demuestra tu gran corazón y cariño por los demás.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Por favor y gracias siempre debo yo decir.',
      'Esas dos palabras muchas puertas van a abrir.',
      'Edu Cadito, pórtate bien.'
    ],
    musicalNotes: [440.00, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63]
  },
  {
    id: 'tablita',
    number: 7,
    title: 'En el baño de casa',
    subtitle: 'La tablita levantar',
    theme: 'Orden e Higiene',
    color: 'from-orange-400 to-amber-600',
    accentColor: 'bg-orange-500',
    badge: 'Caballero del Baño',
    iconName: 'Smile',
    image: tablitaImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Cuando vas a hacer pipí la tablita debes levantar,',
      verse2: 'para que mamá no se moje al sentar.',
      chorusEnd: 'Edu Cadito, ¡pórtate bien!'
    },
    moralAdvice: 'Levantar la tablita y dejar el baño limpio es un gesto de amor y consideración para toda la familia.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Cuando vas a hacer pipí la tablita debes levantar,',
      'para que mamá no se moje al sentar.',
      'Edu Cadito, pórtate bien.'
    ],
    musicalNotes: [261.63, 293.66, 329.63, 392.00, 329.63, 293.66, 261.63]
  },
  {
    id: 'tarea-pelota',
    number: 8,
    title: 'Primero la tarea',
    subtitle: 'Luego a jugar a la pelota',
    theme: 'Responsabilidad y Deberes',
    color: 'from-blue-500 to-indigo-700',
    accentColor: 'bg-blue-600',
    badge: 'Estudiante Estrella',
    iconName: 'BookOpen',
    image: tareaImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'La tarea rapidito debo terminar,',
      verse2: 'y después a la pelota irme a jugar.',
      chorusEnd: 'Edu Cadito, ¡pórtate bien!'
    },
    moralAdvice: 'Cumplir primero con los deberes escolares te permite jugar con la pelota libre de preocupaciones.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'La tarea rapidito debo terminar,',
      'y después a la pelota irme a jugar.',
      'Edu Cadito, pórtate bien.'
    ],
    musicalNotes: [329.63, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00]
  },
  {
    id: 'guardar-juguetes',
    number: 9,
    title: 'Guardar los juguetes',
    subtitle: 'Ordenar muy bien',
    theme: 'Orden y Cooperación',
    color: 'from-violet-500 to-purple-700',
    accentColor: 'bg-violet-600',
    badge: 'Rey del Orden',
    iconName: 'Shapes',
    image: juguetesImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'Cuando termino de jugar, mis juguetes a guardar,',
      verse2: 'ordenadito mi cuarto va a quedar.',
      chorusEnd: 'Edu Cadito, ¡ordená muy bien!'
    },
    moralAdvice: 'Cuidar tus juguetes y ponerlos en su lugar evita accidentes y hace que tu cuarto sea un lugar feliz.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'Cuando termino de jugar, mis juguetes a guardar.',
      'Ordenadito mi cuarto va a quedar.',
      'Edu Cadito, ordená muy bien.'
    ],
    musicalNotes: [261.63, 329.63, 392.00, 523.25, 392.00, 261.63]
  },
  {
    id: 'cruzar-calle',
    number: 10,
    title: 'Cruzar la calle seguro',
    subtitle: 'De la mano siempre',
    theme: 'Seguridad y Cuidado',
    color: 'from-emerald-500 to-teal-700',
    accentColor: 'bg-emerald-600',
    badge: 'Peatón Seguro',
    iconName: 'ShieldCheck',
    image: calleImg,
    lyrics: {
      chorusStart: '¡Edu Cadito, pórtate bien!',
      verse1: 'De la mano de mamá o papá siempre al cruzar,',
      verse2: 'a los dos lados de la calle voy a mirar.',
      chorusEnd: 'Edu Cadito, ¡cuídate bien!'
    },
    moralAdvice: 'En la calle siempre vamos de la mano de un adulto y miramos a ambos lados antes de cruzar.',
    fullLyrics: [
      'Edu Cadito, pórtate bien.',
      'De la mano de mamá o papá siempre al cruzar.',
      'A los dos lados de la calle voy a mirar.',
      'Edu Cadito, cuídate bien.'
    ],
    musicalNotes: [392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00]
  }
];

export const PARENT_ADVICES: ParentAdvice[] = [
  {
    title: 'Transición a dormir en su propia cama',
    problem: 'El niño insiste en meterse a la cama de los padres toda la noche o se resiste a acostarse solo.',
    solution: 'Crea una rutina predecible: baño tibio, cuento corto y luz tenue. Acompaña al niño los primeros 5 minutos en su camita y celébralo por la mañana con la canción de Edu Cadito.',
    eduQuote: '"En mi camita yo solito debo descansar"',
    icon: 'Moon'
  },
  {
    title: 'Hábito de cepillado dental sin batallas',
    problem: 'Se niega a cepillarse o lo hace durante 5 segundos sin limpiar molares.',
    solution: 'Usa el temporizador visual de 2 minutos de la app. Pónganse frente al espejo juntos haciendo caras graciosas mientras suena la tonada de Edu Cadito.',
    eduQuote: '"Los dientitos cepillar antes de irme a acostar"',
    icon: 'Sparkles'
  },
  {
    title: 'Uso de pantallas y modales en lugares públicos',
    problem: 'Hace berrinches en el cine, restaurante o salas de espera cuando se le pide apagar el teléfono.',
    solution: 'Anticipa la regla antes de entrar: "Modo avión como Edu". Lleva juguetes sensoriales o libretas de dibujo de Edu para colorear en silencio.',
    eduQuote: '"Ya comienza la función, pon tu celu en modo avión"',
    icon: 'Smartphone'
  },
  {
    title: 'Alimentación balanceada vs. antojos de dulces',
    problem: 'Pide golosinas o snacks ultraprocesados antes del almuerzo o la cena.',
    solution: 'Ten a mano frutas coloridas cortadas de forma divertida. Cuando pida dulce, recuérdale: "¿Qué decía Edu de la manzanita?" y dale opciones nutritivas.',
    eduQuote: '"La pancita con dulces no debo llenar, una manzanita no me viene nada mal"',
    icon: 'Apple'
  },
  {
    title: 'Magia de decir "Por Favor" y "Gracias"',
    problem: 'Exige las cosas con órdenes o gritos ("¡Dame el agua!").',
    solution: 'Modela el comportamiento en casa siempre. Cuando olvide las palabras mágicas, sonríe con cariño y pregunta: "¿Cuál era la palabra mágica que abría puertas?"',
    eduQuote: '"Esas dos palabras muchas puertas van a abrir"',
    icon: 'HeartHandshake'
  },
  {
    title: 'Responsabilidad con la tarea escolar',
    problem: 'Posterga las tareas o llora cuando debe sentarse a escribir o leer.',
    solution: 'Aplica el principio de Edu: "Primero la tarea rapidito, y después a la pelota a jugar". Segmenta la tarea en bloques de 10-15 minutos seguidos de recreo activo.',
    eduQuote: '"La tarea rapidito debo terminar, y después a la pelota irme a jugar"',
    icon: 'BookOpen'
  }
];
