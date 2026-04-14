// ===== INITIALIZATION =====

let currentIndex = 0;

// ===== DOM ELEMENTS =====
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginClose = document.querySelector('.login-close');
const cardsTrack = document.getElementById('cardsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const rankOverlay = document.getElementById('rankOverlay');

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
            <div class="badge" onclick="window.open('${badge.link}', '_blank')">
                <img src="${badge.image}" alt="badge">
            </div>
        `).join('');

        card.innerHTML = `
            <div class="card-avatar">
                <img src="${user.avatar}" alt="${user.name}">
            </div>
            <h2 class="card-name">${user.name}</h2>
            <div class="card-username ${user.username.includes('@') ? 'data-link' : ''}" 
                 onclick="user.username.includes('@') && window.open('https://t.me/${user.username.substring(1)}', '_blank')">
                ${user.username}
            </div>
            <p class="card-description">${user.description}</p>
            <div class="card-badges">${badgesHTML}</div>
        `;

        // Click на карточку = burst effect
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.badge') && !e.target.closest('.card-username')) {
                const rect = card.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                effectsManager.createBurst(user.effect, x, y);
            }
        });

        cardsTrack.appendChild(card);
    });

    updateCarouselPosition();
}

// ===== UPDATE CAROUSEL POSITION =====
function updateCarouselPosition() {
    const offset = -currentIndex * (320 + 32); // 320px card + 32px gap
    cardsTrack.style.transform = `translateX(calc(50vw - 150px + ${offset}px))`;
    
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
    });
}

// ===== NAVIGATION =====
prevBtn.addEventListener('click', () => {
    const user = userManager.prev();
    currentIndex = userManager.currentIndex;
    
    // Trail effect
    const card = document.querySelector('.card.active');
    if (card) {
        const rect = card.getBoundingClientRect();
        effectsManager.createTrail(user.effect, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    
    renderCards();
});

nextBtn.addEventListener('click', () => {
    const user = userManager.next();
    currentIndex = userManager.currentIndex;
    
    // Trail effect
    const card = document.querySelector('.card.active');
    if (card) {
        const rect = card.getBoundingClientRect();
        effectsManager.createTrail(user.effect, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    
    renderCards();
});

// ===== LOGIN LOGIC =====
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

loginClose.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const account = accountManager.login(username, password);
    
    if (account) {
        loginModal.classList.remove('active');
        showRankAnimation(account);
    } else {
        alert('Invalid credentials');
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
    
    // Animate через все уровни
    let currentRank = 1;
    const targetRank = account.rankLevel;
    const totalFrames = 30;
    let frame = 0;
    
    const animationInterval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        // Acceleration
        const acceleratedProgress = Math.pow(progress, 1.5);
        currentRank = Math.floor(1 + (targetRank - 1) * acceleratedProgress);
        
        rankNumber.textContent = currentRank;
        rankNumber.style.color = accountManager.getRankColor(currentRank);
        
        if (frame >= totalFrames) {
            clearInterval(animationInterval);
            
            // Final impact
            rankNumber.style.animation = 'none';
            setTimeout(() => {
                rankNumber.style.animation = 'rankFinalImpact 0.5s ease';
            }, 10);
            
            rankType.textContent = account.rankType;
            rankBar.style.width = '100%';
        }
    }, 30);
    
    // Close after animation
    setTimeout(() => {
        rankOverlay.classList.remove('active');
        setTimeout(() => rankOverlay.classList.add('hidden'), 300);
    }, 4000);
}

// Add final impact animation
const finalImpactStyle = document.createElement('style');
finalImpactStyle.textContent = `
    @keyframes rankFinalImpact {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(finalImpactStyle);

// ===== INITIAL RENDER =====
renderCards();

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
});
