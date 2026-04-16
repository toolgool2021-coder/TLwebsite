// ===== CAROUSEL SYSTEM =====
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isAnimating = false;

// ===== DOM ELEMENTS =====
const cardsTrack = document.getElementById('cardsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const effectsLayer = document.getElementById('effectsLayer');
const indicatorsContainer = document.getElementById('indicators');

// ===== USER MANAGER =====
const userManager = {
    currentIndex: 0,

    getAll() {
        return users;
    },

    getCurrent() {
        return users[this.currentIndex];
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % users.length;
        return this.getCurrent();
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + users.length) % users.length;
        return this.getCurrent();
    },

    jumpTo(index) {
        if (index >= 0 && index < users.length) {
            this.currentIndex = index;
            return this.getCurrent();
        }
        return null;
    }
};

// ===== EFFECTS MANAGER =====
const effectsManager = {
    getParticleColor(effect) {
        const colors = {
            fire: ['#ff4500', '#ff6347', '#ffa500', '#ffd700'],
            ice: ['#00ffff', '#00bfff', '#87ceeb', '#b0e0e6'],
            lightning: ['#ffff00', '#00ffff', '#ffffff', '#ff00ff'],
            stars: ['#ffff00', '#ffd700', '#ffffff', '#87ceeb'],
            rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
        };
        return colors[effect] || colors.fire;
    },

    createParticles(effect, x, y, count = 15) {
        const colors = this.getParticleColor(effect);
        const particleClass = this.getParticleClass(effect);

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${particleClass}`;
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            const size = 4 + Math.random() * 8;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.backgroundColor = color;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            effectsLayer.appendChild(particle);

            setTimeout(() => particle.remove(), 1500);
        }
    },

    getParticleClass(effect) {
        const classes = {
            fire: 'fire-particle',
            ice: 'ice-particle',
            lightning: 'lightning-particle',
            stars: 'stars-particle',
            rainbow: 'rainbow-particle'
        };
        return classes[effect] || 'particle';
    }
};

// ===== RENDER CARDS =====
function renderCards() {
    cardsTrack.innerHTML = '';
    const allUsers = userManager.getAll();
    
    allUsers.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (user.id === 'toolgool') card.classList.add('toolgool-card');
        // Центральная карточка всегда в центре (активна)
        if (index === currentIndex) card.classList.add('active');

        const badgesHTML = user.socials.map(social => `
            <div class="badge" onclick="window.open('${social.link}', '_blank')" title="${social.name}" style="pointer-events: auto; cursor: pointer;">
                <i class="${social.icon}"></i>
            </div>
        `).join('');

        const isClickableUsername = user.username.includes('@');
        const usernameClass = isClickableUsername ? 'clickable' : '';

        card.innerHTML = `
            <div class="card-content">
                <div class="card-avatar-container">
                    <img src="${user.avatar}" alt="${user.name}" class="card-avatar">
                </div>
                <div class="card-header">
                    <h2 class="card-name">${user.name}</h2>
                    <p class="card-username ${usernameClass}">${user.username}</p>
                </div>
                <p class="card-description">${user.description}</p>
                ${badgesHTML ? `<div class="card-badges">${badgesHTML}</div>` : ''}
            </div>
        `;

        // Click for effect burst
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.badge')) {
                const rect = card.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                effectsManager.createParticles(user.effect, x, y, 25);
            }
        });

        // Username click to Telegram
        const usernameElement = card.querySelector('.card-username');
        if (isClickableUsername) {
            usernameElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const telegramHandle = user.username.replace('@', '');
                window.open(`https://t.me/${telegramHandle}`, '_blank');
            });
        }

        cardsTrack.appendChild(card);
    });

    updateCarouselPosition();
    renderIndicators();
}

// ===== UPDATE CAROUSEL POSITION =====
function updateCarouselPosition() {
    if (isAnimating) return;
    
    const cardWidth = getCardWidth();
    const gap = 32;
    // Смещение чтобы центральная карточка была в центре экрана
    const offset = -currentIndex * (cardWidth + gap);
    cardsTrack.style.transform = `translateX(calc(50vw - ${cardWidth / 2}px + ${offset}px))`;
    
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
    });
}

function getCardWidth() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
}

// ===== NAVIGATION =====
function navigateTo(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    let user;
    
    if (direction === 'next') {
        user = userManager.next();
    } else {
        user = userManager.prev();
    }
    
    currentIndex = userManager.currentIndex;
    
    // Create effect on navigate
    const oldCard = document.querySelector('.card.active');
    if (oldCard) {
        const rect = oldCard.getBoundingClientRect();
        effectsManager.createParticles(user.effect, rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    }
    
    renderCards();
    
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

prevBtn.addEventListener('click', () => navigateTo('prev'));
nextBtn.addEventListener('click', () => navigateTo('next'));

// ===== TOUCH SWIPE =====
cardsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

cardsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            navigateTo('next');
        } else {
            navigateTo('prev');
        }
    }
}

// ===== INDICATORS =====
function renderIndicators() {
    indicatorsContainer.innerHTML = '';
    const allUsers = userManager.getAll();
    
    allUsers.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === currentIndex) indicator.classList.add('active');
        indicator.addEventListener('click', () => jumpToCard(index));
        indicatorsContainer.appendChild(indicator);
    });
}

function jumpToCard(index) {
    if (index === currentIndex || isAnimating) return;
    
    isAnimating = true;
    
    // Create effect on jump
    const currentUser = userManager.getCurrent();
    const oldCard = document.querySelector('.card.active');
    if (oldCard) {
        const rect = oldCard.getBoundingClientRect();
        effectsManager.createParticles(currentUser.effect, rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    }
    
    currentIndex = index;
    userManager.currentIndex = index;
    renderCards();
    
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    currentIndex = 0;
    userManager.currentIndex = 0;
    renderCards();
});

// ===== HANDLE WINDOW RESIZE =====
window.addEventListener('resize', () => {
    updateCarouselPosition();
});
