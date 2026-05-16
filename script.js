const teamMembers = [
    {
        id: 1,
        name: "༒ПoНчИк༒",
        relationship: "💎 Girlfriend",
        emoji: "🪷",
        avatar: "./images/icon_5.jpg",
        description: "Та самая, с кем спокойно и тепло ✨",
        color: "#ffd700",
        socials: { telegram: "https://t.me/" }
    },
    {
        id: 2,
        name: "Alex's",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_2.jpg",
        description: "Проверенный человек 🫂",
        color: "#808080",
        socials: { telegram: "tg://user?id=5300151185" }
    },
    {
        id: 3,
        name: "Nver",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_3.jpg",
        description: "Надёжный и спокойный 💯",
        color: "#808080",
        socials: { telegram: "https://t.me/NverDavtyan0" }
    },
    {
        id: 4,
        name: "𝙵𝙻𝚄𝙾𝚁𝙸𝚃𝙴",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_4.jpg",
        description: "Своя атмосфера и стиль 🔥",
        color: "#FFFFFF",
        socials: { telegram: "https://t.me/" }
    }
];

const playlist = [
    { title: "Тестовая песня 1", url: "./music/song1.mp3" },
    { title: "Тестовая песня 2", url: "./music/song2.mp3" },
    { title: "Тестовая песня 3", url: "./music/song3.mp3" }
];

let currentTrack = 0;
let isPlaying = false;
let playerMinimized = false;

const audioElement = document.getElementById('audioElement');
const musicPlayer = document.getElementById('musicPlayer');
const playerToggleBtn = document.getElementById('playerToggleBtn');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function initMusicPlayer() {
    loadTrack(currentTrack);
    setTimeout(() => { minimizePlayer(); }, 4000);
}

function loadTrack(index) {
    currentTrack = index;
    const track = playlist[currentTrack];
    audioElement.src = track.url;
    songTitle.textContent = track.title;
}

function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    } else {
        audioElement.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioElement.play();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioElement.play();
}

function minimizePlayer() {
    playerMinimized = true;
    musicPlayer.classList.add('minimized');
    playerToggleBtn.style.display = 'flex';
}

function maximizePlayer() {
    playerMinimized = false;
    musicPlayer.classList.remove('minimized');
    playerToggleBtn.style.display = 'none';
}

audioElement.addEventListener('timeupdate', () => {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    durationEl.textContent = formatTime(audioElement.duration);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audioElement.addEventListener('ended', () => { nextTrack(); });

document.querySelector('.music-progress').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * audioElement.duration;
});

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
minimizeBtn.addEventListener('click', minimizePlayer);
playerToggleBtn.addEventListener('click', maximizePlayer);

function initializeTeam() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';
    teamMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.style.setProperty('--card-color', member.color || '#a855f7');
        card.innerHTML = `<div class="team-card-inner"><img src="${member.avatar}" alt="${member.name}" class="team-avatar"><h3 class="team-name">${member.name}</h3><span class="team-relationship">${member.relationship}</span></div>`;
        card.addEventListener('click', () => openProfile(member));
        teamGrid.appendChild(card);
    });
}

function openProfile(member) {
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    let socialsHtml = '';
    for (const [platform, link] of Object.entries(member.socials || {})) {
        const icons = { telegram: 'fab fa-telegram', instagram: 'fab fa-instagram', tiktok: 'fab fa-tiktok' };
        if (link && icons[platform]) {
            socialsHtml += `<a href="javascript:void(0)" data-href="${link}" target="_blank" class="modal-social"><i class="${icons[platform]}"></i></a>`;
        }
    }
    modalBody.innerHTML = `<div class="profile-card"><img src="${member.avatar}" alt="${member.name}" class="profile-avatar"><h2>${member.name}</h2><p class="relationship-tag">${member.relationship}</p><p class="profile-description">${member.description}</p><div class="modal-socials">${socialsHtml}</div></div>`;
    modal.style.setProperty('--card-color', member.color || '#a855f7');
    modal.style.display = 'flex';
    attachModalSocialLinks();
}

function attachModalSocialLinks() {
    const modalSocials = document.querySelectorAll('.modal-social');
    modalSocials.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('data-href');
            if (href) window.open(href, '_blank');
        });
    });
}

function closeModal() {
    document.getElementById('profileModal').style.display = 'none';
}

document.getElementById('profileModal').addEventListener('click', (e) => {
    if (e.target.id === 'profileModal') closeModal();
});

document.querySelector('.modal-close').addEventListener('click', closeModal);

const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
for (let i = 0; i < 120; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    for (let f of snowflakes) {
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    updateSnow();
}

function updateSnow() {
    for (let f of snowflakes) {
        f.y += f.speed;
        f.x += Math.sin(f.y / height * Math.PI * 2) * 0.5;
        if (f.y > height) f.y = 0;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
    }
    requestAnimationFrame(drawSnow);
}

drawSnow();

document.addEventListener('DOMContentLoaded', () => {
    initializeTeam();
    initMusicPlayer();
});
