const form = document.getElementById('music-form');
const statusText = document.getElementById('status');
const trackCard = document.getElementById('track-card');
const trackTitle = document.getElementById('track-title');
const trackMeta = document.getElementById('track-meta');
const audioPlayer = document.getElementById('audio-player');
const generateBtn = document.getElementById('generate-btn');

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

function fakeGenerateMusic({ prompt, genre, mood, duration }) {
  return new Promise((resolve) => {
    const randomTrack = demoTracks[Math.floor(Math.random() * demoTracks.length)];
    setTimeout(() => {
      resolve({
        ...randomTrack,
        meta: `Thể loại: ${genre} • Tâm trạng: ${mood} • Độ dài: ${duration}`,
        description: prompt
      });
    }, 1500);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = document.getElementById('prompt').value.trim();
  const genre = document.getElementById('genre').value;
  const mood = document.getElementById('mood').value;
  const duration = document.getElementById('duration').value;

  if (!prompt) {
    statusText.textContent = 'Vui lòng nhập mô tả bài nhạc.';
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Đang tạo...';
  statusText.textContent = 'AI đang phân tích mô tả và tạo âm thanh...';

  const result = await fakeGenerateMusic({ prompt, genre, mood, duration });

  trackTitle.textContent = result.title;
  trackMeta.textContent = `${result.meta} | Ý tưởng: ${result.description}`;
  audioPlayer.src = result.url;
  trackCard.hidden = false;

  statusText.textContent = 'Hoàn tất! Bạn có thể nghe thử bản demo bên dưới.';
  generateBtn.disabled = false;
  generateBtn.textContent = '✨ Tạo nhạc';
});
