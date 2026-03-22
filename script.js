const form = document.getElementById('music-form');
const statusText = document.getElementById('status');
const trackCard = document.getElementById('track-card');
const trackTitle = document.getElementById('track-title');
const trackMeta = document.getElementById('track-meta');
const audioPlayer = document.getElementById('audio-player');
const generateBtn = document.getElementById('generate-btn');
const publishBtn = document.getElementById('publish-btn');
const publishPanel = document.getElementById('publish-panel');
const publishTitle = document.getElementById('publish-title');
const publishedList = document.getElementById('published-list');

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
  footer: document.getElementById('footer-note'),
  menuHome: document.getElementById('menu-home'),
  menuCreate: document.getElementById('menu-create'),
  menuStudio: document.getElementById('menu-studio'),
  menuExplore: document.getElementById('menu-explore'),
  menuLibrary: document.getElementById('menu-library'),
  menuSettings: document.getElementById('menu-settings'),
  searchLabel: document.getElementById('search-label'),
  searchInput: document.getElementById('search-input')
};

let latestTrack = null;
let publishedTracks = [];

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
    menuHome: 'Home',
    menuCreate: 'Create',
    menuStudio: 'Studio',
    menuExplore: 'Explore',
    menuLibrary: 'Library',
    menuSettings: 'Settings',
    searchLabel: 'Search',
    searchPlaceholder: 'Tìm bài hát, nghệ sĩ...',
    publish: '📢 Publish',
    publishTitle: 'Published songs',
    publishDone: 'Đã đăng bài hát thành công.',
    publishEmpty: 'Chưa có bài nào được đăng.',
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
    publishedAt: 'Đăng lúc',
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
    menuHome: 'Home',
    menuCreate: 'Create',
    menuStudio: 'Studio',
    menuExplore: 'Explore',
    menuLibrary: 'Library',
    menuSettings: 'Settings',
    searchLabel: 'Search',
    searchPlaceholder: 'Search tracks, artists...',
    publish: '📢 Publish',
    publishTitle: 'Published songs',
    publishDone: 'Song published successfully.',
    publishEmpty: 'No published songs yet.',
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
    publishedAt: 'Published at',
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
    menuHome: 'Accueil',
    menuCreate: 'Créer',
    menuStudio: 'Studio',
    menuExplore: 'Explorer',
    menuLibrary: 'Bibliothèque',
    menuSettings: 'Paramètres',
    searchLabel: 'Recherche',
    searchPlaceholder: 'Rechercher des titres, artistes...',
    publish: '📢 Publier',
    publishTitle: 'Morceaux publiés',
    publishDone: 'Morceau publié avec succès.',
    publishEmpty: 'Aucun morceau publié.',
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
    publishedAt: 'Publié à',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinématique', 'Jazz'],
    moods: ['Relax', 'Joyeux', 'Épique', 'Mélancolique', 'Énergique'],
    durations: ['30 secondes', '60 secondes', '90 secondes']
  }
};

function fillSelect(selectNode, values) {
  selectNode.innerHTML = values.map((item) => `<option>${item}</option>`).join('');
}

function createGeneratedAudioUrl(seed = 1) {
  const sampleRate = 22050;
  const seconds = 2.4;
  const samples = Math.floor(sampleRate * seconds);
  const data = new Int16Array(samples);

  const baseFreq = 220 + (seed % 5) * 55;
  for (let i = 0; i < samples; i += 1) {
    const t = i / sampleRate;
    const env = Math.min(1, t * 3) * Math.max(0, 1 - t / seconds);
    const signal =
      Math.sin(2 * Math.PI * baseFreq * t) * 0.55 +
      Math.sin(2 * Math.PI * baseFreq * 1.5 * t) * 0.25;
    data[i] = Math.max(-1, Math.min(1, signal * env)) * 32767;
  }

  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + data.length * 2);
  const view = new DataView(buffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + data.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, data.length * 2, true);

  let offset = 44;
  for (let i = 0; i < data.length; i += 1, offset += 2) {
    view.setInt16(offset, data[i], true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

function renderPublishedTracks(lang) {
  const t = i18n[lang] || i18n.vi;
  publishTitle.textContent = t.publishTitle;

  if (publishedTracks.length === 0) {
    publishedList.innerHTML = `<li>${t.publishEmpty}</li>`;
    return;
  }

  publishedList.innerHTML = publishedTracks
    .map(
      (item) =>
        `<li><strong>${item.title}</strong><br/><small>${t.publishedAt}: ${item.publishedAt}</small></li>`
    )
    .join('');
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
  textNodes.menuHome.textContent = t.menuHome;
  textNodes.menuCreate.textContent = t.menuCreate;
  textNodes.menuStudio.textContent = t.menuStudio;
  textNodes.menuExplore.textContent = t.menuExplore;
  textNodes.menuLibrary.textContent = t.menuLibrary;
  textNodes.menuSettings.textContent = t.menuSettings;
  textNodes.searchLabel.textContent = t.searchLabel;
  textNodes.searchInput.placeholder = t.searchPlaceholder;

  promptInput.placeholder = t.promptPlaceholder;
  generateBtn.textContent = t.generate;
  publishBtn.textContent = t.publish;
  statusText.textContent = trackCard.hidden ? t.idleStatus : t.done;

  fillSelect(genreSelect, t.genres);
  fillSelect(moodSelect, t.moods);
  fillSelect(durationSelect, t.durations);
  renderPublishedTracks(lang);
}

function fakeGenerateMusic({ prompt, genre, mood, duration, model }) {
  return new Promise((resolve) => {
    const seed = prompt.length + genre.length + mood.length + duration.length;

    setTimeout(() => {
      resolve({
        title: `AI Track ${Math.floor(Math.random() * 1000)}`,
        genre,
        mood,
        duration,
        model,
        description: prompt,
        url: createGeneratedAudioUrl(seed)
      });
    }, 1200);
  });
}

languageSelect.addEventListener('change', () => {
  applyLanguage(languageSelect.value);
});

publishBtn.addEventListener('click', () => {
  if (!latestTrack) return;

  const lang = languageSelect.value;
  const t = i18n[lang] || i18n.vi;
  publishedTracks = [
    {
      title: latestTrack.title,
      publishedAt: new Date().toLocaleString()
    },
    ...publishedTracks
  ];

  publishPanel.hidden = false;
  renderPublishedTracks(lang);
  statusText.textContent = t.publishDone;
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

  if (model === 'v1.0 Pro') {
    statusText.textContent = 'Upgrade to Pro to use this model.';
    return;
  }

  if (!prompt) {
    statusText.textContent = t.emptyPrompt;
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = t.generating;
  statusText.textContent = t.running;

  const result = await fakeGenerateMusic({ prompt, genre, mood, duration, model });

  latestTrack = result;
  trackTitle.textContent = result.title;
  trackMeta.textContent = `${t.meta}: ${result.genre} • ${t.mood}: ${result.mood} • ${t.duration}: ${result.duration} • ${t.model}: ${result.model} | ${t.idea}: ${result.description}`;
  audioPlayer.src = result.url;
  trackCard.hidden = false;

  statusText.textContent = t.done;
  generateBtn.disabled = false;
  generateBtn.textContent = t.generate;
});

applyLanguage(languageSelect.value);
