const form = document.getElementById('music-form');
const statusText = document.getElementById('status');
const trackCard = document.getElementById('track-card');
const trackTitle = document.getElementById('track-title');
const trackMeta = document.getElementById('track-meta');
const trackArt = document.getElementById('track-art');
const audioPlayer = document.getElementById('audio-player');
const generateBtn = document.getElementById('generate-btn');
const publishBtn = document.getElementById('publish-btn');
const publishPanel = document.getElementById('publish-panel');
const publishTitle = document.getElementById('publish-title');
const publishedList = document.getElementById('published-list');
const suggestionPanel = document.getElementById('suggestion-panel');
const suggestionTitle = document.getElementById('suggestion-title');
const suggestionText = document.getElementById('suggestion-text');
const copySuggestionBtn = document.getElementById('copy-suggestion-btn');
const creditsBig = document.getElementById('credits-big');

const languageSelect = document.getElementById('language');
const modelSelect = document.getElementById('model');
const promptInput = document.getElementById('prompt');
const genreSelect = document.getElementById('genre');
const moodSelect = document.getElementById('mood');
const durationSelect = document.getElementById('duration');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');


const requiredNodes = [form, statusText, trackCard, trackTitle, trackMeta, audioPlayer, generateBtn, publishBtn, publishedList, suggestionPanel, suggestionText, copySuggestionBtn, languageSelect, modelSelect, promptInput, genreSelect, moodSelect, durationSelect, usernameInput, passwordInput, registerBtn, loginBtn, logoutBtn, authStatus, creditsBig];
if (requiredNodes.some((node) => !node)) {
  throw new Error('UI is not fully loaded. Please open through http://localhost:8080');
}

let latestTrack = null;
let token = localStorage.getItem('music_ai_token') || '';
let currentUser = localStorage.getItem('music_ai_user') || '';
let credits = Number(localStorage.getItem('music_ai_credits') || 50);

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
  searchInput: document.getElementById('search-input'),
  authTitle: document.getElementById('auth-title')
};

const i18n = {
  vi: {
    title: 'Tạo nhạc bằng AI trong vài giây', subtitle: 'Đăng nhập tài khoản, nhập ý tưởng và tạo bài hát thật từ server.',
    panelLabel: 'Trình tạo nhạc', languageLabel: 'Ngôn ngữ giao diện', modelLabel: 'Model AI', promptLabel: 'Mô tả bài nhạc',
    promptPlaceholder: 'Ví dụ: Bài lo-fi chill cho buổi tối mưa, nhịp nhẹ, piano mềm', genreLabel: 'Thể loại', moodLabel: 'Tâm trạng', durationLabel: 'Độ dài',
    resultTitle: 'Bản nhạc AI của bạn', footer: 'Demo có server + tài khoản. API chạy trong server.js.',
    menuHome: 'Home', menuCreate: 'Create', menuStudio: 'Studio', menuExplore: 'Explore', menuLibrary: 'Library', menuSettings: 'Settings',
    searchLabel: 'Search', searchPlaceholder: 'Tìm bài hát, nghệ sĩ...', authTitle: 'Tài khoản', login: 'Login', register: 'Register', logout: 'Logout',
    publish: '📢 Publish', publishTitle: 'Published songs', publishDone: 'Đã đăng bài hát thành công.', publishEmpty: 'Chưa có bài nào được đăng.',
    suggestionTitle: 'Đề xuất thay đổi', copySuggestion: '📋 Copy đề xuất', copyDone: 'Đã copy đề xuất vào clipboard.', copyFail: 'Không thể copy tự động. Hãy copy thủ công.',
    credits: 'Credits', registerOk: 'Đăng ký thành công. Hãy đăng nhập.',
    generate: '✨ Tạo nhạc', generating: 'Đang tạo...', idleStatus: 'Chưa có bản nhạc nào. Hãy nhập mô tả để bắt đầu.',
    emptyPrompt: 'Vui lòng nhập mô tả bài nhạc.', running: 'Server đang tạo nhạc...', done: 'Hoàn tất! Bạn có thể nghe thử bài hát.',
    loginRequired: 'Vui lòng đăng nhập trước.', authLoggedOut: 'Chưa đăng nhập.', authLoggedIn: 'Đã đăng nhập:',
    meta: 'Thể loại', mood: 'Tâm trạng', duration: 'Độ dài', model: 'Model', idea: 'Ý tưởng', publishedAt: 'Đăng lúc',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinematic', 'Jazz'], moods: ['Thư giãn', 'Vui tươi', 'Hùng tráng', 'Sâu lắng', 'Năng lượng cao'], durations: ['30 giây', '60 giây', '90 giây']
  },
  en: {
    title: 'Create AI music in seconds', subtitle: 'Login to your account and generate real songs from the server.',
    panelLabel: 'Music generator', languageLabel: 'Interface language', modelLabel: 'AI model', promptLabel: 'Music prompt',
    promptPlaceholder: 'Example: A chill lo-fi track for a rainy evening with soft piano', genreLabel: 'Genre', moodLabel: 'Mood', durationLabel: 'Duration',
    resultTitle: 'Your AI track', footer: 'Demo now includes server + accounts. API runs in server.js.',
    menuHome: 'Home', menuCreate: 'Create', menuStudio: 'Studio', menuExplore: 'Explore', menuLibrary: 'Library', menuSettings: 'Settings',
    searchLabel: 'Search', searchPlaceholder: 'Search tracks, artists...', authTitle: 'Account', login: 'Login', register: 'Register', logout: 'Logout',
    publish: '📢 Publish', publishTitle: 'Published songs', publishDone: 'Song published successfully.', publishEmpty: 'No published songs yet.',
    suggestionTitle: 'Suggested changes', copySuggestion: '📋 Copy suggestion', copyDone: 'Suggestion copied to clipboard.', copyFail: 'Cannot auto-copy. Please copy manually.',
    credits: 'Credits', registerOk: 'Registered successfully. Please login.',
    generate: '✨ Generate music', generating: 'Generating...', idleStatus: 'No track generated yet. Enter a prompt to begin.',
    emptyPrompt: 'Please enter a music prompt.', running: 'Server is generating your song...', done: 'Done! You can listen to the song.',
    loginRequired: 'Please login first.', authLoggedOut: 'Not logged in.', authLoggedIn: 'Logged in as',
    meta: 'Genre', mood: 'Mood', duration: 'Duration', model: 'Model', idea: 'Idea', publishedAt: 'Published at',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinematic', 'Jazz'], moods: ['Relaxed', 'Happy', 'Epic', 'Melancholic', 'High energy'], durations: ['30 seconds', '60 seconds', '90 seconds']
  },
  fr: {
    title: 'Créez de la musique IA en quelques secondes', subtitle: 'Connectez-vous à votre compte pour générer de vraies chansons via le serveur.',
    panelLabel: 'Générateur de musique', languageLabel: 'Langue de l’interface', modelLabel: 'Modèle IA', promptLabel: 'Description musicale',
    promptPlaceholder: 'Exemple : Une piste lo-fi chill pour une soirée pluvieuse avec piano doux', genreLabel: 'Genre', moodLabel: 'Ambiance', durationLabel: 'Durée',
    resultTitle: 'Votre morceau IA', footer: 'La démo inclut maintenant serveur + comptes. API dans server.js.',
    menuHome: 'Accueil', menuCreate: 'Créer', menuStudio: 'Studio', menuExplore: 'Explorer', menuLibrary: 'Bibliothèque', menuSettings: 'Paramètres',
    searchLabel: 'Recherche', searchPlaceholder: 'Rechercher des titres, artistes...', authTitle: 'Compte', login: 'Connexion', register: 'Inscription', logout: 'Déconnexion',
    publish: '📢 Publier', publishTitle: 'Morceaux publiés', publishDone: 'Morceau publié avec succès.', publishEmpty: 'Aucun morceau publié.',
    suggestionTitle: 'Suggestions de modification', copySuggestion: '📋 Copier la suggestion', copyDone: 'Suggestion copiée dans le presse-papiers.', copyFail: 'Copie automatique impossible. Copiez manuellement.',
    credits: 'Crédits', registerOk: 'Inscription réussie. Connectez-vous.',
    generate: '✨ Générer de la musique', generating: 'Génération...', idleStatus: 'Aucun morceau généré. Saisissez une description.',
    emptyPrompt: 'Veuillez saisir une description musicale.', running: 'Le serveur génère votre morceau...', done: 'Terminé ! Vous pouvez écouter le morceau.',
    loginRequired: 'Veuillez vous connecter.', authLoggedOut: 'Non connecté.', authLoggedIn: 'Connecté en tant que',
    meta: 'Genre', mood: 'Ambiance', duration: 'Durée', model: 'Modèle', idea: 'Idée', publishedAt: 'Publié à',
    genres: ['Lo-fi', 'Pop', 'EDM', 'Cinématique', 'Jazz'], moods: ['Relax', 'Joyeux', 'Épique', 'Mélancolique', 'Énergique'], durations: ['30 secondes', '60 secondes', '90 secondes']
  }
};

function t() { return i18n[languageSelect.value] || i18n.vi; }

const API_BASE = (() => {
  if (window.location.protocol === 'file:') return 'http://localhost:8080';
  if (window.location.hostname === 'localhost' && window.location.port === '8080') return window.location.origin;
  return 'http://localhost:8080';
})();

function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE}${path}`;
}

async function api(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(apiUrl(path), { method, headers, body: body ? JSON.stringify(body) : undefined });
  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();

  if (!contentType.includes('application/json')) {
    const hint = raw.slice(0, 40).replace(/\s+/g, ' ');
    throw new Error(`API ${path} returned non-JSON response (${hint}). Hãy chạy: node server.js`);
  }

  const data = JSON.parse(raw);
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function fillSelect(selectNode, values) {
  selectNode.innerHTML = values.map((item) => `<option>${item}</option>`).join('');
}

function updateCreditView() {
  creditsBig.textContent = String(credits);
}

function updateAuthStatus() {
  authStatus.textContent = currentUser ? `${t().authLoggedIn} ${currentUser}` : t().authLoggedOut;
  updateCreditView();
}

async function loadPublished() {
  if (!token) {
    publishedList.innerHTML = `<li>${t().publishEmpty}</li>`;
    publishPanel.hidden = false;
    return;
  }
  try {
    const data = await api('/api/published');
    if (typeof data.credits === 'number') {
      credits = data.credits;
      localStorage.setItem('music_ai_credits', String(credits));
      updateCreditView();
    }
    const items = data.items || [];
    if (items.length === 0) {
      publishedList.innerHTML = `<li>${t().publishEmpty}</li>`;
      publishPanel.hidden = false;
      return;
    }
    publishedList.innerHTML = items.map((item) => `<li><strong>${item.title}</strong><br/><small>${t().publishedAt}: ${new Date(item.publishedAt).toLocaleString()}</small></li>`).join('');
    publishPanel.hidden = false;
  } catch {
    publishedList.innerHTML = `<li>${t().publishEmpty}</li>`;
    publishPanel.hidden = false;
  }
}

async function syncSession() {
  if (!token) return;
  try {
    const me = await api('/api/me');
    currentUser = me.username || currentUser;
    credits = Number(me.credits || credits);
    localStorage.setItem('music_ai_user', currentUser);
    localStorage.setItem('music_ai_credits', String(credits));
  } catch {
    token = '';
    currentUser = '';
    credits = 0;
    localStorage.removeItem('music_ai_token');
    localStorage.removeItem('music_ai_user');
    localStorage.removeItem('music_ai_credits');
  }
}

async function applyLanguage() {
  const L = t();
  textNodes.title.textContent = L.title;
  textNodes.subtitle.textContent = L.subtitle;
  textNodes.panelLabel.setAttribute('aria-label', L.panelLabel);
  textNodes.languageLabel.textContent = L.languageLabel;
  textNodes.modelLabel.textContent = L.modelLabel;
  textNodes.promptLabel.textContent = L.promptLabel;
  textNodes.genreLabel.textContent = L.genreLabel;
  textNodes.moodLabel.textContent = L.moodLabel;
  textNodes.durationLabel.textContent = L.durationLabel;
  textNodes.resultTitle.textContent = L.resultTitle;
  textNodes.footer.innerHTML = L.footer.replace('server.js', '<code>server.js</code>');
  textNodes.menuHome.textContent = L.menuHome;
  textNodes.menuCreate.textContent = L.menuCreate;
  textNodes.menuStudio.textContent = L.menuStudio;
  textNodes.menuExplore.textContent = L.menuExplore;
  textNodes.menuLibrary.textContent = L.menuLibrary;
  textNodes.menuSettings.textContent = L.menuSettings;
  textNodes.searchLabel.textContent = L.searchLabel;
  textNodes.searchInput.placeholder = L.searchPlaceholder;
  textNodes.authTitle.textContent = L.authTitle;

  registerBtn.textContent = L.register;
  loginBtn.textContent = L.login;
  logoutBtn.textContent = L.logout;
  publishBtn.textContent = L.publish;
  publishTitle.textContent = L.publishTitle;
  suggestionTitle.textContent = L.suggestionTitle;
  copySuggestionBtn.textContent = L.copySuggestion;
  generateBtn.textContent = L.generate;

  promptInput.placeholder = L.promptPlaceholder;
  fillSelect(genreSelect, L.genres);
  fillSelect(moodSelect, L.moods);
  fillSelect(durationSelect, L.durations);

  statusText.textContent = trackCard.hidden ? L.idleStatus : L.done;
  updateAuthStatus();
  await loadPublished();
}

function buildSuggestion(track) {
  return `Thử tăng dynamics cho phần drop, thêm lớp pad ở nền và tăng độ dài outro cho track "${track.title}".`;
}

copySuggestionBtn.addEventListener('click', async () => {
  const text = suggestionText.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    statusText.textContent = t().copyDone;
  } catch {
    statusText.textContent = t().copyFail;
  }
});

registerBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    authStatus.textContent = 'Username/password is required.';
    return;
  }

  try {
    await api('/api/register', 'POST', { username, password });
    authStatus.textContent = t().registerOk;
  } catch (err) {
    authStatus.textContent = err.message;
  }
});

loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    authStatus.textContent = 'Username/password is required.';
    return;
  }

  try {
    const data = await api('/api/login', 'POST', { username, password });
    token = data.token;
    currentUser = data.username;
    credits = Number(data.credits || credits);
    localStorage.setItem('music_ai_token', token);
    localStorage.setItem('music_ai_user', currentUser);
    localStorage.setItem('music_ai_credits', String(credits));
    updateAuthStatus();
    await loadPublished();
  } catch (err) {
    authStatus.textContent = err.message;
  }
});

logoutBtn.addEventListener('click', () => {
  token = '';
  currentUser = '';
  credits = 0;
  localStorage.removeItem('music_ai_token');
  localStorage.removeItem('music_ai_user');
  localStorage.removeItem('music_ai_credits');
  updateAuthStatus();
});

publishBtn.addEventListener('click', async () => {
  if (!token || !latestTrack) {
    statusText.textContent = t().loginRequired;
    return;
  }

  try {
    await api('/api/publish', 'POST', { title: latestTrack.title, url: latestTrack.url, imageUrl: latestTrack.imageUrl });
    statusText.textContent = t().publishDone;
    await loadPublished();
  } catch (err) {
    statusText.textContent = err.message;
  }
});

languageSelect.addEventListener('change', () => {
  applyLanguage();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const L = t();

  if (!token) {
    statusText.textContent = L.loginRequired;
    return;
  }

  const prompt = promptInput.value.trim();
  if (!prompt) {
    statusText.textContent = L.emptyPrompt;
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = L.generating;
  statusText.textContent = L.running;

  try {
    const data = await api('/api/generate', 'POST', {
      prompt,
      genre: genreSelect.value,
      mood: moodSelect.value,
      duration: durationSelect.value,
      model: modelSelect.value
    });

    latestTrack = data.track;
    if (typeof data.credits === 'number') {
      credits = data.credits;
      localStorage.setItem('music_ai_credits', String(credits));
      updateCreditView();
    }

    trackTitle.textContent = latestTrack.title;
    trackMeta.textContent = `${L.meta}: ${latestTrack.genre} • ${L.mood}: ${latestTrack.mood} • ${L.duration}: ${latestTrack.duration} • ${L.model}: ${latestTrack.model} | ${L.idea}: ${latestTrack.description}`;
    audioPlayer.src = latestTrack.url;
    trackArt.src = latestTrack.imageUrl;
    trackCard.hidden = false;
    suggestionText.textContent = buildSuggestion(latestTrack);
    suggestionPanel.hidden = false;
    statusText.textContent = L.done;
  } catch (err) {
    statusText.textContent = err.message;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = L.generate;
  }
});

(async () => {
  await syncSession();
  await applyLanguage();
})();
