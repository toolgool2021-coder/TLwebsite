/* =========================
   INTRO ANIMATION LOGIC
========================= */

const intro = document.getElementById("intro");
const introName = document.getElementById("intro-name");
const explosion = document.getElementById("explosion");
const shockwave = document.getElementById("shockwave");
const flash = document.getElementById("flash");
const introParticles = document.getElementById("intro-particles");

let introStarted = false;
const startTime = performance.now();

// Create particles on explosion
function createIntroParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'intro-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 300 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animationDelay = (Math.random() * 0.1) + 's';
        
        introParticles.appendChild(particle);
    }
    
    // Clean up particles after animation
    setTimeout(() => {
        introParticles.innerHTML = '';
    }, 1000);
}

// Start intro on page load
window.addEventListener("load", () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, 2500 - elapsed);
    setTimeout(startIntro, remaining);
});

function startIntro() {
    if (introStarted) return;
    introStarted = true;

    // 1. Name appears in center
    introName.classList.add("appear");

    // 2. After ~1.3 sec - explosion
    setTimeout(() => {
        introName.classList.remove("appear");
        introName.classList.add("explode");
        explosion.classList.add("active");
        shockwave.classList.add("active");
        flash.classList.add("active");
        createIntroParticles();
    }, 1300);

    // 3. After explosion - name reappears
    setTimeout(() => {
        introName.classList.remove("explode");
        explosion.classList.remove("active");
        shockwave.classList.remove("active");
        flash.classList.remove("active");
        
        void introName.offsetWidth; // Reflow trigger for animation reset
        introName.classList.add("return");
    }, 2050);

    // 4. Name moves up
    setTimeout(() => {
        introName.classList.remove("return");
        introName.classList.add("move-up");
    }, 2900);

    // 5. Hide intro screen
    setTimeout(() => {
        intro.classList.add("hidden");
    }, 3700);
}

// Optional: Allow skipping intro with any key
document.addEventListener('keydown', () => {
    if (!introStarted) {
        startIntro();
    }
}, { once: true });