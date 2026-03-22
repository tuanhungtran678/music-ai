const form = document.getElementById('music-form');
const statusText = document.getElementById('status');
const trackCard = document.getElementById('track-card');
const trackTitle = document.getElementById('track-title');
const trackMeta = document.getElementById('track-meta');
const audioPlayer = document.getElementById('audio-player');
const generateBtn = document.getElementById('generate-btn');

const languageSelect = document.getElementById('language');
const modelSelect = document.getElementById('model');
const promptInput = document.getElementById('prompt');
const genreSelect = document.getElementById('genre');
const moodSelect = document.getElementById('mood');
const durationSelect = document.getElementById('duration');

const textNodes = {
  title: document.getElementById('title'),
  subtitle: document.getElementById('subtitle'),
  panelLabel: document.getElementById('generator-panel'),
  languageLabel: document.getElementById('language-label'),
  modelLabel: document.getElementById('model-label'),
  promptLabel: document.getElementById('prompt-label'),
  genreLabel: document.getElementById('genre-label'),
  moodLabel: document.getElementById('mood-label'),
  durationLabel: document.getElementById('duration-label'),
  resultTitle: document.getElementById('result-title'),
  footer: document.getElementById('footer-note')
};

const demoTracks = [
  {
    title: 'Neon Rain Lo-fi',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_9f5f46b5e7.mp3?filename=chill-lofi-hip-hop-beat-127465.mp3'
  },
  {
    title: 'Skyline Pop Drive',
    url: 'https://cdn.pixabay.com/download/audio/2021/12/24/audio_d6f892d11d.mp3?filename=future-bass-beat-12538.mp3'
  },
  {
    title: 'Night Jazz Echo',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_eb7ca6f7d6.mp3?filename=chill-jazz-lofi-vibes-21257.mp3'
  }
];

const i18n = {
  vi: {
    title: 'Tạo nhạc bằng AI trong vài giây',
    subtitle: 'Nhập ý tưởng, chọn phong cách và để AI tạo bản demo nhạc phù hợp cho bạn.',
    panelLabel: 'Trình tạo nhạc',
    languageLabel: 'Ngôn ngữ giao diện',
    modelLabel: 'Model AI',
    promptLabel: 'Mô tả bài nhạc',
    promptPlaceholder: 'Ví dụ: Bài lo-fi chill cho buổi tối mưa, nhịp nhẹ, piano mềm',
    genreLabel: 'Thể loại',
    moodLabel: 'Tâm trạng',
    durationLabel: 'Độ dài',
    resultTitle: 'Bản nhạc AI của bạn',
    footer: 'Demo giao diện tạo nhạc AI. Tích hợp API thật bằng cách thay phần mô phỏng trong script.js.',
    generate: '✨ Tạo nhạc',
    generating: 'Đang tạo...',
    idleStatus: 'Chưa có bản nhạc nào. Hãy nhập mô tả để bắt đầu.',
    emptyPrompt: 'Vui lòng nhập mô tả bài nhạc.',
    running: 'AI đang phân tích mô tả và tạo âm thanh...',
    done: 'Hoàn tất! Bạn có thể nghe thử bản demo bên dưới.',
    meta: 'Thể loại',
    mood: 'Tâm trạng',
    duration: 'Độ dài',
    model: 'Model',
    idea: 'Ý tưởng',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinematic', 'Jazz'],
    moods: ['Thư giãn', 'Vui tươi', 'Hùng tráng', 'Sâu lắng', 'Năng lượng cao'],
    durations: ['30 giây', '60 giây', '90 giây']
  },
  en: {
    title: 'Create AI music in seconds',
    subtitle: 'Describe your idea, choose a style, and let AI generate a matching music demo.',
    panelLabel: 'Music generator',
    languageLabel: 'Interface language',
    modelLabel: 'AI model',
    promptLabel: 'Music prompt',
    promptPlaceholder: 'Example: A chill lo-fi track for a rainy evening with soft piano',
    genreLabel: 'Genre',
    moodLabel: 'Mood',
    durationLabel: 'Duration',
    resultTitle: 'Your AI track',
    footer: 'AI music generator UI demo. Integrate a real API by replacing the mock logic in script.js.',
    generate: '✨ Generate music',
    generating: 'Generating...',
    idleStatus: 'No track generated yet. Enter a prompt to begin.',
    emptyPrompt: 'Please enter a music prompt.',
    running: 'AI is analyzing your prompt and generating audio...',
    done: 'Done! You can listen to the demo track below.',
    meta: 'Genre',
    mood: 'Mood',
    duration: 'Duration',
    model: 'Model',
    idea: 'Idea',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinematic', 'Jazz'],
    moods: ['Relaxed', 'Happy', 'Epic', 'Melancholic', 'High energy'],
    durations: ['30 seconds', '60 seconds', '90 seconds']
  },
  fr: {
    title: 'Créez de la musique IA en quelques secondes',
    subtitle: 'Décrivez votre idée, choisissez un style, puis laissez l’IA créer une démo musicale.',
    panelLabel: 'Générateur de musique',
    languageLabel: 'Langue de l’interface',
    modelLabel: 'Modèle IA',
    promptLabel: 'Description musicale',
    promptPlaceholder: 'Exemple : Une piste lo-fi chill pour une soirée pluvieuse avec piano doux',
    genreLabel: 'Genre',
    moodLabel: 'Ambiance',
    durationLabel: 'Durée',
    resultTitle: 'Votre morceau IA',
    footer: 'Démo d’interface de génération musicale IA. Intégrez une vraie API en remplaçant la logique simulée dans script.js.',
    generate: '✨ Générer de la musique',
    generating: 'Génération...',
    idleStatus: 'Aucun morceau généré. Saisissez une description pour commencer.',
    emptyPrompt: 'Veuillez saisir une description musicale.',
    running: 'L’IA analyse votre description et génère l’audio...',
    done: 'Terminé ! Vous pouvez écouter la démo ci-dessous.',
    meta: 'Genre',
    mood: 'Ambiance',
    duration: 'Durée',
    model: 'Modèle',
    idea: 'Idée',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinématique', 'Jazz'],
    moods: ['Relax', 'Joyeux', 'Épique', 'Mélancolique', 'Énergique'],
    durations: ['30 secondes', '60 secondes', '90 secondes']
  }
};

function fillSelect(selectNode, values) {
  selectNode.innerHTML = values.map((item) => `<option>${item}</option>`).join('');
}

function applyLanguage(lang) {
  const t = i18n[lang] || i18n.vi;

  textNodes.title.textContent = t.title;
  textNodes.subtitle.textContent = t.subtitle;
  textNodes.panelLabel.setAttribute('aria-label', t.panelLabel);
  textNodes.languageLabel.textContent = t.languageLabel;
  textNodes.modelLabel.textContent = t.modelLabel;
  textNodes.promptLabel.textContent = t.promptLabel;
  textNodes.genreLabel.textContent = t.genreLabel;
  textNodes.moodLabel.textContent = t.moodLabel;
  textNodes.durationLabel.textContent = t.durationLabel;
  textNodes.resultTitle.textContent = t.resultTitle;
  textNodes.footer.innerHTML = `${t.footer.replace('script.js', '<code>script.js</code>')}`;

  promptInput.placeholder = t.promptPlaceholder;
  generateBtn.textContent = t.generate;
  statusText.textContent = t.idleStatus;

  fillSelect(genreSelect, t.genres);
  fillSelect(moodSelect, t.moods);
  fillSelect(durationSelect, t.durations);
}

function fakeGenerateMusic({ prompt, genre, mood, duration, model }) {
  return new Promise((resolve) => {
    const randomTrack = demoTracks[Math.floor(Math.random() * demoTracks.length)];
    setTimeout(() => {
      resolve({
        ...randomTrack,
        genre,
        mood,
        duration,
        model,
        description: prompt
      });
    }, 1500);
  });
}

languageSelect.addEventListener('change', () => {
  applyLanguage(languageSelect.value);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const lang = languageSelect.value;
  const t = i18n[lang] || i18n.vi;

  const prompt = promptInput.value.trim();
  const genre = genreSelect.value;
  const mood = moodSelect.value;
  const duration = durationSelect.value;
  const model = modelSelect.value;

  if (!prompt) {
    statusText.textContent = t.emptyPrompt;
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = t.generating;
  statusText.textContent = t.running;

  const result = await fakeGenerateMusic({ prompt, genre, mood, duration, model });

  trackTitle.textContent = result.title;
  trackMeta.textContent = `${t.meta}: ${result.genre} • ${t.mood}: ${result.mood} • ${t.duration}: ${result.duration} • ${t.model}: ${result.model} | ${t.idea}: ${result.description}`;
  audioPlayer.src = result.url;
  trackCard.hidden = false;

  statusText.textContent = t.done;
  generateBtn.disabled = false;
  generateBtn.textContent = t.generate;
});

applyLanguage(languageSelect.value);
