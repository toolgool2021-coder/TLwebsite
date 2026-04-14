// ===== CAROUSEL SYSTEM =====
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isAnimating = false;

// ===== DOM ELEMENTS =====
const cardsTrack = document.getElementById('cardsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const rankOverlay = document.getElementById('rankOverlay');
const effectsLayer = document.getElementById('effectsLayer');
const indicatorsContainer = document.getElementById('indicators');

// ===== FIND TOOLGOOL USER =====
function findToolGoolIndex() {
    const users = userManager.getAll();
    return users.findIndex(u => u.id === 'toolgool');
}

// ===== RENDER CARDS =====
function renderCards() {
    cardsTrack.innerHTML = '';
    const users = userManager.getAll();
    
    users.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (user.id === 'toolgool') card.classList.add('toolgool-card');
        if (index === currentIndex) card.classList.add('active');

        const badges = badgeManager.getBadgesByUserId(user.id);
        const badgesHTML = badges.map(badge => `
            <div class="badge" onclick="window.open('${badge.link}', '_blank')" title="Open link">
                <img src="${badge.image}" alt="badge">
            </div>
        `).join('');

        const isClickableUsername = user.username.includes('@');
        const usernameClass = isClickableUsername ? 'clickable' : '';
        const usernameDisplay = isClickableUsername ? user.username : user.username;

        card.innerHTML = `
            <div class="card-content">
                <div class="card-avatar-container">
                    <img src="${user.avatar}" alt="${user.name}" class="card-avatar">
                </div>
                <div class="card-header">
                    <h2 class="card-name">${user.name}</h2>
                    <p class="card-username ${usernameClass}">${usernameDisplay}</p>
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
                effectsManager.createBurst(user.effect, x, y);
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
    
    const offset = -currentIndex * (getCardWidth() + 32);
    cardsTrack.style.transform = `translateX(calc(50vw - 190px + ${offset}px))`;
    
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
    
    const users = userManager.getAll();
    let user;
    
    if (direction === 'next') {
        user = userManager.next();
    } else {
        user = userManager.prev();
    }
    
    currentIndex = userManager.currentIndex;
    
    // Create trail effect
    const card = document.querySelector('.card.active');
    if (card) {
        const rect = card.getBoundingClientRect();
        effectsManager.createTrail(user.effect, rect.left + rect.width / 2, rect.top + rect.height / 2);
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
    const users = userManager.getAll();
    
    users.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === currentIndex) indicator.classList.add('active');
        indicator.addEventListener('click', () => jumpToCard(index));
        indicatorsContainer.appendChild(indicator);
    });
}

function jumpToCard(index) {
    if (index === currentIndex || isAnimating) return;
    
    currentIndex = index;
    userManager.currentIndex = index;
    renderCards();
}

// ===== LOGIN SYSTEM =====
loginBtn.addEventListener('click', () => {
    loginModal.open();
});

logoutBtn.addEventListener('click', () => {
    userSession.logout();
    updateAuthUI();
    toastManager.success('Logged out successfully');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const account = accountManager.login(username, password);
    
    if (account) {
        userSession.login(account);
        updateAuthUI();
        loginModal.close();
        toastManager.success('Welcome back!');
        showRankAnimation(account);
    } else {
        toastManager.error('Invalid username or password');
    }
});

// ===== RANK ANIMATION =====
function showRankAnimation(account) {
    rankOverlay.classList.remove('hidden');
    rankOverlay.classList.add('active');
    
    const avatarImg = document.getElementById('rankAvatarImg');
    const rankNumber = document.getElementById('rankNumber');
    const rankType = document.getElementById('rankType');
    const rankBar = document.getElementById('rankBar');
    
    avatarImg.src = account.avatar;
    
    let currentRank = 1;
    const targetRank = account.rankLevel;
    const totalFrames = 30;
    let frame = 0;
    
    const animationInterval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const acceleratedProgress = Math.pow(progress, 1.5);
        currentRank = Math.floor(1 + (targetRank - 1) * acceleratedProgress);
        
        rankNumber.textContent = currentRank;
        rankNumber.style.color = accountManager.getRankColor(currentRank);
        
        if (frame >= totalFrames) {
            clearInterval(animationInterval);
            rankNumber.style.animation = 'none';
            setTimeout(() => {
                rankNumber.style.animation = 'rankFinalImpact 0.5s ease';
            }, 10);
            rankType.textContent = account.rankType;
            rankBar.style.width = '100%';
        }
    }, 30);
    
    setTimeout(() => {
        rankOverlay.classList.remove('active');
        setTimeout(() => rankOverlay.classList.add('hidden'), 300);
    }, 4000);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    // Set to toolgool as first card
    currentIndex = findToolGoolIndex();
    userManager.currentIndex = currentIndex;
    
    renderCards();
    
    // Auto-login if session exists
    if (userSession.isLoggedIn()) {
        updateAuthUI();
        toastManager.info('Welcome back, ' + userSession.currentUser.username);
    }
});
