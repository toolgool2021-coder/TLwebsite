// НИЗКИЙ РЕЖИМ (LOW DETAIL)
let lowDetailMode = localStorage.getItem('lowDetailMode') === 'true';

// ДАННЫЕ ЛЮДЕЙ - РЕДАКТИРУЙ ЗДЕСЬ!
const teamMembers = [
    {
        id: 1,
        name: "",
        relationship: "",
        emoji: "",
        avatar: "./images/icon_5.jpg",
        description: "",
        color: "#a855f7",
        socials: {}
    },
    {
        id: 2,
        name: "Alex's",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_2.jpg",
        description: "Проверенный человек. Можно угарать, можно серьёзно поговорить — всегда на одной волне 🫂",
        color: "#808080",
        socials: {
            telegram: "tg://user?id=5300151185"
        }
    },
    {
        id: 3,
        name: "Nver",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_3.jpg",
        description: "Надёжный и спокойный. Не кидает на словах и держит своё слово 💯",
        color: "#808080",
        socials: {
            telegram: "https://t.me/NverDavtyan0"
        }
    },
    {
        id: 4,
        name: "𝙵𝙻𝚄𝙾𝚁𝙸𝚃𝙴 [#𝙻𝚇𝚁]",
        relationship: "🎭 Best Friend",
        emoji: "👑",
        avatar: "./images/icon_4.jpg",
        description: "Своя атмосфера и стиль. Человек с вайбом, который не перепутаешь 🔥",
        color: "#FFFFFF",
        socials: {
            telegram: "https://t.me/"
        }
    },
    {
        id: 5,
        name: "أوكسي",
        relationship: "🫠 Female friend",
        emoji: "🎭",
        avatar: "./images/icon_6.jpg",
        description: "Весёлая и немного хаотичная, но в этом весь кайф. С ней не бывает скучно 😅",
        color: "#c110bc",
        socials: {
            telegram: "https://t.me/Ok_si112"
        }
    },
    {
        id: 6,
        name: "✿",
        relationship: "✨ Female friend",
        emoji: "⚜️",
        avatar: "./images/icon_7.jpg",
        description: "Лёгкая в общении и уютная. Идеальный напарник для Minecraft и ламповых вечеров 🎮",
        color: "#827382",
        socials: {
            telegram: "https://t.me/Fl0rlet"
        }
    }
];

// ПЛЕЙЛИСТ ПЕСЕН - ВСЕ ПЕСНИ ИЗ ПАПКИ!
const playlist = [
    {
        title: "Montagem Uranium (Super Slowed) - ZAYLO",
        url: "./Music/Montagem Uranium (Super Slowed) - ZAYLO.mp3"
    },
    {
        title: "MONTAGEM ENIGMA (Ultra Slowed)",
        url: "./Music/MONTAGEM ENIGMA (Ultra Slowed).mp3"
    },
    {
        title: "ЭКСПОНАТ",
        url: "./Music/ЭКСПОНАТ.mp3"
    },
    {
        title: "Track 4",
        url: "./Music/2_5190803538715904020.m4a"
    },
    {
        title: "Track 5",
        url: "./Music/2_5226618940284779690.m4a"
    },
    {
        title: "Track 6",
        url: "./Music/2_5235580346598202344.m4a"
    },
    {
        title: "Track 7",
        url: "./Music/2_5346101906802504103.m4a"
    },
    {
        title: "Track 8",
        url: "./Music/2_5397758474903915744.m4a"
    }
];

// ПЕРЕМЕННЫЕ ПЛЕЕРА
let currentTrack = 0;
let isPlaying = false;
let playerMinimized = false;
let isPlayerAnimating = false;

// ЭЛЕМЕНТЫ ПЛЕЕРА
const audioElement = document.getElementById('audioElement');
const musicPlayer = document.getElementById('musicPlayer');
const playerToggleBtn = document.getElementById('playerToggleBtn');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn') || document.getElementById('prevBtnPlayer');
const nextBtn = document.getElementById('nextBtn') || document.getElementById('nextBtnPlayer');
const minimizeBtn = document.getElementById('minimizeBtn');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ПЛЕЕРА
function initMusicPlayer() {
    loadTrack(currentTrack);
    
    setTimeout(() => {
        minimizePlayer();
    }, 4000);

    audioElement.addEventListener('error', () => {
        songTitle.textContent = '❌ Ошибка загрузки';
    });
}

// ЗАГРУЗИТЬ ТРЕК
function loadTrack(index) {
    currentTrack = index;
    const track = playlist[currentTrack];
    audioElement.src = track.url;
    songTitle.textContent = track.title;
}

// ПЕРЕКЛЮЧЕНИЕ PLAY/PAUSE
function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    } else {
        audioElement.play().catch(() => {
            songTitle.textContent = '❌ Невозможно воспроизвести';
        });
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }
}

// СЛЕДУЮЩИЙ ТРЕК
function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioElement.play().catch(() => {});
    createPlayerParticles();
}

// ПРЕДЫДУЩИЙ ТРЕК
function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) audioElement.play().catch(() => {});
    createPlayerParticles();
}

// МИНИМИЗИРОВАТЬ ПЛЕЕР
function minimizePlayer() {
    if (isPlayerAnimating) return;
    
    isPlayerAnimating = true;
    playerMinimized = true;
    musicPlayer.classList.add('minimized');
    
    setTimeout(() => {
        playerToggleBtn.style.display = 'flex';
        isPlayerAnimating = false;
    }, 500);
}

// РАЗВЕРНУТЬ ПЛЕЕР
function maximizePlayer() {
    if (isPlayerAnimating) return;
    
    isPlayerAnimating = true;
    playerMinimized = false;
    playerToggleBtn.style.display = 'none';
    musicPlayer.classList.remove('minimized');
    
    setTimeout(() => {
        isPlayerAnimating = false;
    }, 500);
}

// ПАРТИКЛЫ ДЛЯ ПЛЕЕРА
function createPlayerParticles() {
    if (lowDetailMode) return;
    
    const rect = musicPlayer.getBoundingClientRect();
    const particleCount = 4;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = '#a855f7';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '989';
        particle.style.boxShadow = '0 0 8px #a855f7';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'playerParticleBurst 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// ОБНОВЛЕНИЕ ПРОГРЕССА
audioElement.addEventListener('timeupdate', () => {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = percent + '%';
    
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    durationEl.textContent = formatTime(audioElement.duration);
});

// ФОРМАТИРОВАНИЕ ВРЕМЕНИ
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// АВТОПЕРЕХОД НА СЛЕДУЮЩИЙ ТРЕК
audioElement.addEventListener('ended', () => {
    nextTrack();
});

// КЛИК ПО ПРОГРЕСС-БАРУ
document.querySelector('.music-progress').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * audioElement.duration;
});

// ОБРАБОТЧИКИ КНОПОК
playBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);
minimizeBtn.addEventListener('click', minimizePlayer);
playerToggleBtn.addEventListener('click', maximizePlayer);

// ФУНКЦИЯ СОЗДАНИЯ ПАРТИКЛЕЙ ПРИ ОТКРЫТИИ
function createModalParticles(color) {
    if (lowDetailMode) return;
    
    const particleCount = 8;
    const modal = document.getElementById('profileModal');
    const modalContent = modal.querySelector('.modal-content');
    const rect = modalContent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = Math.random() * 150 + 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = Math.random() * 6 + 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = `0 0 ${Math.random() * 8 + 4}px ${color}`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'modalParticleBurst 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}

// Функция для инициализации команды (только на index.html)
function initializeTeam() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    teamGrid.innerHTML = '';

    teamMembers.forEach(member => {
        if (!member.name) return;
        
        const card = document.createElement('div');
        card.className = 'team-card';
        card.style.setProperty('--card-color', member.color || '#a855f7');
        card.innerHTML = `
            <div class="team-card-inner">
                <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                <h3 class="team-name">${member.name}</h3>
                <span class="team-relationship">${member.relationship}</span>
            </div>
        `;
        
        card.addEventListener('click', () => openProfile(member));
        teamGrid.appendChild(card);
    });
}

// Функция открытия профиля в модалке
function openProfile(member) {
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    
    let socialsHtml = '';
    for (const [platform, link] of Object.entries(member.socials || {})) {
        const icons = {
            telegram: 'fab fa-telegram',
            instagram: 'fab fa-instagram',
            tiktok: 'fab fa-tiktok',
            discord: 'fab fa-discord',
            twitch: 'fab fa-twitch',
            youtube: 'fab fa-youtube'
        };
        
        if (link && icons[platform]) {
            socialsHtml += `
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="modal-social">
                    <i class="${icons[platform]}"></i>
                </a>
            `;
        }
    }

    modalBody.innerHTML = `
        <div class="profile-card">
            <img src="${member.avatar}" alt="${member.name}" class="profile-avatar">
            <h2>${member.name}</h2>
            <p class="relationship-tag">${member.relationship}</p>
            <p class="profile-description">${member.description}</p>
            <div class="modal-socials">
                ${socialsHtml || '<p>Соцсети скоро добавят...</p>'}
            </div>
        </div>
    `;
    
    modal.style.setProperty('--card-color', member.color || '#a855f7');
    modal.style.display = 'flex';
    
    setTimeout(() => createModalParticles(member.color || '#a855f7'), 150);
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

const profileModal = document.getElementById('profileModal');
if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') closeModal();
    });

    const modalClose = profileModal.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
        modalClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') closeModal();
        });
    }
}

// АНИМАЦИЯ СНЕГА
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const snowflakes = [];
const maxFlakes = lowDetailMode ? 20 : 50;

for (let i = 0; i < maxFlakes; i++) {
    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();

    for (let f of snowflakes) {
        ctx.moveTo(f.x, f.y);
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

// ПАРТИКЛЫ ПРИ ДВИЖЕНИИ МЫШИ
let mouseParticleThrottle = 0;
document.addEventListener('mousemove', (e) => {
    mouseParticleThrottle++;
    if (mouseParticleThrottle > 5) {
        createMouseParticles(e.clientX, e.clientY);
        mouseParticleThrottle = 0;
    }
});

function createMouseParticles(x, y) {
    if (lowDetailMode) return;
    
    if (Math.random() > 0.85) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '3';
        particle.style.boxShadow = '0 0 10px #a855f7';
        particle.style.animation = 'particleFloat 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(${Math.random() * 100 - 50}px, -50px) scale(0);
        }
    }

    @keyframes floatingGradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes iconParticleDrift {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
        }
    }

    @keyframes modalParticleBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
        }
    }

    @keyframes playerParticleBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
        }
    }

    @keyframes ripple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }

    @keyframes clickParticleBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
        }
    }
`;
document.head.appendChild(style);

function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.insertBefore(starsContainer, document.body.firstChild);
    
    const starCount = lowDetailMode ? 15 : 30;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'fixed';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 50 + '%';
        star.style.backgroundColor = '#fff';
        star.style.opacity = Math.random() * 0.5 + 0.3;
        star.style.zIndex = '0';
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(168, 85, 247, 0.8)`;
        
        starsContainer.appendChild(star);
    }
}

const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(twinkleStyle);

createStars();

// ОБРАБОТЧИК ДЛЯ СОЦИАЛЬНЫХ ССЫЛОК
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const href = link.getAttribute('data-href');
        
        createClickWave(e.clientX, e.clientY);
        createClickParticles(e.clientX, e.clientY);
        
        setTimeout(() => {
            if (href.startsWith('mailto:')) {
                window.location.href = href;
            } else {
                window.open(href, '_blank');
            }
        }, 600);
    });

    link.addEventListener('mouseenter', () => {
        createIconParticles(link);
    });

    link.addEventListener('mouseleave', () => {
        link.style.filter = 'none';
    });
});

// СОЗДАНИЕ ЧАСТИЦ ПРИ КЛИКЕ
function createClickParticles(x, y) {
    if (lowDetailMode) return;
    
    const particleCount = 6;
    const colors = ['#a855f7', '#00ffff', '#ff006e', '#00ff88', '#ffbe0b', '#fb5607'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[i];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = `0 0 8px ${colors[i]}`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'clickParticleBurst 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// СОЗДАНИЕ ЧАСТИЦ ВОКРУГ ИКОНКИ
function createIconParticles(iconElement) {
    if (lowDetailMode) return;
    
    const rect = iconElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 4;
    const colors = ['#a855f7', '#00ffff', '#ff006e', '#00ff88'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[i];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.boxShadow = `0 0 8px ${colors[i]}`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'iconParticleDrift 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 900);
    }
}

function createClickWave(x, y) {
    if (lowDetailMode) return;
    
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    wave.style.width = '10px';
    wave.style.height = '10px';
    wave.style.borderRadius = '50%';
    wave.style.border = '2px solid #a855f7';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '3';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.animation = 'ripple 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    
    document.body.appendChild(wave);
    
    setTimeout(() => wave.remove(), 700);
}

// FOOTER SOCIAL LINKS
const socialLinksFooter = document.querySelectorAll('.social-link-footer');

socialLinksFooter.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const href = link.getAttribute('data-href');
        
        createClickWave(e.clientX, e.clientY);
        createClickParticles(e.clientX, e.clientY);
        
        setTimeout(() => {
            window.open(href, '_blank');
        }, 600);
    });
});

// FOOTER LEGAL LINKS
const legalLinks = document.querySelectorAll('.legal-link');

legalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const href = link.getAttribute('data-href');
        
        createClickWave(e.clientX, e.clientY);
        createClickParticles(e.clientX, e.clientY);
        
        setTimeout(() => {
            window.open(href, '_blank');
        }, 600);
    });

    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        link.style.setProperty('--x', x + 'px');
        link.style.setProperty('--y', y + 'px');
    });
});

// НАВИГАЦИЯ МОБИЛЬНАЯ
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Закрытие меню при нажатии на пункт меню
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Закрытие меню при нажатии вне его
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// TOGGLE LOW DETAIL MODE
function toggleLowDetail() {
    lowDetailMode = !lowDetailMode;
    localStorage.setItem('lowDetailMode', lowDetailMode);
    
    // Перезагружаем страницу для применения изменений
    location.reload();
}

// Добавляем кнопку LOW DETAIL в навбар
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar-container');
    if (navbar) {
        const lowDetailBtn = document.createElement('button');
        lowDetailBtn.className = 'low-detail-btn';
        lowDetailBtn.title = 'Низкий уровень деталей';
        lowDetailBtn.innerHTML = lowDetailMode ? '⚡ NORMAL' : '⚡ LOW';
        lowDetailBtn.addEventListener('click', toggleLowDetail);
        navbar.appendChild(lowDetailBtn);
    }
    
    initializeTeam();
    initMusicPlayer();
});
