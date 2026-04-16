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

    createParticles(effect, cardRect, count = 40) {
        const colors = this.getParticleColor(effect);
        const particleClass = this.getParticleClass(effect);

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${particleClass}`;
            
            const randomX = Math.random() * cardRect.width;
            const randomY = Math.random() * cardRect.height;
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 60 + Math.random() * 120;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            const size = 5 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.left = (cardRect.left + randomX) + 'px';
            particle.style.top = (cardRect.top + randomY) + 'px';
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
        
        // Определяем класс позиции
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === (currentIndex - 1 + allUsers.length) % allUsers.length) {
            card.classList.add('prev');
        } else if (index === (currentIndex + 1) % allUsers.length) {
            card.classList.add('next');
        }

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
                effectsManager.createParticles(user.effect, rect, 50);
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

    renderIndicators();
}

// ===== NAVIGATION =====
function navigateTo(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Create effect on navigate
    const activeCard = document.querySelector('.card.active');
    const currentUser = userManager.getCurrent();
    if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        effectsManager.createParticles(currentUser.effect, rect, 30);
    }
    
    if (direction === 'next') {
        userManager.next();
    } else {
        userManager.prev();
    }
    
    currentIndex = userManager.currentIndex;
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
    
    // Create effect
    const currentUser = userManager.getCurrent();
    const activeCard = document.querySelector('.card.active');
    if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        effectsManager.createParticles(currentUser.effect, rect, 25);
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
    renderCards();
});
