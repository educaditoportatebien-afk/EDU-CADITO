const phrases = [
  '¡Hola, soy Educadito! ¿Cómo estás?',
  '¡Hola! Soy Edu Cadito. ¡Pórtate bien y cantemos juntos!',
  'Educadito, pórtate bien.',
  'De la mano de mamá o papá siempre al cruzar. A los dos lados de la calle voy a mirar. Educadito, cuídate bien.',
  'En la cama de los papis no tengo lugar.',
  'En mi camita yo solito debo descansar.',
  'Edu Cadito, dormí solito, bien.',
  'Los dientitos cepillar antes de irme a acostar,',
  'y volver a repetir al levantarme de dormir.',
  'Edu Cadito, cepíllate bien.',
  'Ya comienza la función, pon tu celu en modo avión.',
  'Si algo tienes que decir, espera a que termine el film.',
  'Antes de sentarme a comer, mis manitos debo yo lavar,',
  'y si al baño voy a ir, lavadita debo repetir.',
  'La pancita con dulces no debo llenar.',
  'Una manzanita no me viene nada mal.',
  'Edu Cadito, alimentate bien.',
  'Por favor y gracias siempre debo yo decir.',
  'Esas dos palabras muchas puertas van a abrir.',
  'Cuando vas a hacer pipí la tablita debes levantar,',
  'para que mamá no se moje al sentar.',
  'La tarea rapidito debo terminar,',
  'y después a la pelota irme a jugar.',
  'Cuando termino de jugar, mis juguetes a guardar.',
  'Ordenadito mi cuarto va a quedar.',
  'Edu Cadito, ordená muy bien.',
  'De la mano de mamá o papá siempre al cruzar,',
  'a los dos lados de la calle voy a mirar.',
  'Edu Cadito, cuídate bien.'
];

async function precache() {
  console.log(`Pre-caching ${phrases.length} Edu Cadito phrases...`);

  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    try {
      const res = await fetch('http://localhost:3000/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: phrase, isSinging: true }),
      });
      const data = await res.json();
      console.log(`[${i + 1}/${phrases.length}] "${phrase.substring(0, 30)}...":`, data.cached ? 'cached' : 'generated');
    } catch (err) {
      console.error(`Error on "${phrase}":`, err);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log('ALL PHRASES CACHED SUCCESSFULLY!');
}

precache();
