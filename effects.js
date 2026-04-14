// ===== EFFECTS SYSTEM =====

class EffectsManager {
    constructor() {
        this.activeEffects = new Map();
    }

    // ===== PARTICLES CREATION =====
    createParticle(x, y, options = {}) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.position = 'fixed';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        
        const size = options.size || Math.random() * 8 + 4;
        const color = options.color || '#6366f1';
        const duration = options.duration || 1;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.borderRadius = '50%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

        const angle = options.angle || Math.random() * Math.PI * 2;
        const velocity = options.velocity || Math.random() * 5 + 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        const keyframes = `
            @keyframes particleMove_${Date.now()}_${Math.random()} {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(${vx * 50}px, ${vy * 50}px) scale(0);
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        const animationName = `particleMove_${Date.now()}_${Math.random()}`;
        particle.style.animation = `${animationName} ${duration}s ease-out forwards`;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), duration * 1000);
    }

    // ===== FIRE EFFECT =====
    createFireTrail(card, x, y) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createParticle(x + Math.random() * 20 - 10, y, {
                    color: '#f97316',
                    size: Math.random() * 6 + 2,
                    duration: 0.8,
                    angle: -Math.PI / 2 + (Math.random() * Math.PI / 4)
                });
            }, i * 30);
        }
    }

    createFireBurst(x, y) {
        for (let i = 0; i < 15; i++) {
            this.createParticle(x, y, {
                color: ['#f97316', '#fb923c', '#fbbf24'][Math.floor(Math.random() * 3)],
                size: Math.random() * 8 + 4,
                duration: 1.2,
                velocity: Math.random() * 8 + 4
            });
        }

        // Glow effect
        const glow = document.createElement('div');
        glow.style.position = 'fixed';
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.style.width = '100px';
        glow.style.height = '100px';
        glow.style.borderRadius = '50%';
        glow.style.background = 'radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, transparent 70%)';
        glow.style.filter = 'blur(20px)';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '998';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.animation = 'fireBurst 0.5s ease-out forwards';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fireBurst {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1.5);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(glow);

        setTimeout(() => glow.remove(), 500);
    }

    // ===== LIGHTNING EFFECT =====
    createLightningTrail(x, y) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const line = document.createElement('div');
                line.style.position = 'fixed';
                line.style.left = x + 'px';
                line.style.top = y + 'px';
                line.style.width = '2px';
                line.style.height = '40px';
                line.style.background = 'linear-gradient(180deg, #6366f1, transparent)';
                line.style.boxShadow = '0 0 10px #6366f1';
                line.style.pointerEvents = 'none';
                line.style.zIndex = '999';
                line.style.transform = `rotate(${Math.random() * 360}deg)`;
                line.style.animation = 'lightningFade 0.6s ease-out forwards';

                const style = document.createElement('style');
                style.textContent = `
                    @keyframes lightningFade {
                        0% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(line);

                setTimeout(() => line.remove(), 600);
            }, i * 50);
        }
    }

    createLightningBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            this.createParticle(x, y, {
                color: '#6366f1',
                size: Math.random() * 6 + 2,
                duration: 0.6,
                velocity: Math.random() * 10 + 5
            });
        }

        // Flash effect
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.left = x + 'px';
        flash.style.top = y + 'px';
        flash.style.width = '150px';
        flash.style.height = '150px';
        flash.style.borderRadius = '50%';
        flash.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)';
        flash.style.filter = 'blur(15px)';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '998';
        flash.style.transform = 'translate(-50%, -50%)';
        flash.style.animation = 'lightningFlash 0.3s ease-out forwards';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes lightningFlash {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);

        setTimeout(() => flash.remove(), 300);
    }

    // ===== AIR EFFECT =====
    createAirTrail(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createParticle(x + Math.random() * 30 - 15, y, {
                    color: 'rgba(6, 182, 212, 0.5)',
                    size: Math.random() * 4 + 2,
                    duration: 1,
                    angle: Math.random() * Math.PI * 2,
                    velocity: Math.random() * 4 + 2
                });
            }, i * 20);
        }
    }

    createAirBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            this.createParticle(x, y, {
                color: 'rgba(6, 182, 212, 0.7)',
                size: Math.random() * 5 + 3,
                duration: 0.8,
                velocity: Math.random() * 8 + 4
            });
        }

        // Wave effect
        const wave = document.createElement('div');
        wave.style.position = 'fixed';
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        wave.style.width = '80px';
        wave.style.height = '80px';
        wave.style.borderRadius = '50%';
        wave.style.border = '2px solid #06b6d4';
        wave.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.6)';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '998';
        wave.style.transform = 'translate(-50%, -50%)';
        wave.style.animation = 'airWave 0.6s ease-out forwards';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes airWave {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(wave);

        setTimeout(() => wave.remove(), 600);
    }

    // ===== EARTH EFFECT =====
    createEarthTrail(x, y) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.createParticle(x + Math.random() * 25 - 12, y + Math.random() * 10, {
                    color: '#84cc16',
                    size: Math.random() * 5 + 2,
                    duration: 1.2,
                    angle: -Math.PI / 2 + (Math.random() * Math.PI / 6),
                    velocity: Math.random() * 3 + 1
                });
            }, i * 40);
        }
    }

    createEarthBurst(x, y) {
        // Dust particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(x, y, {
                color: ['#84cc16', '#a3e635', '#bfdc08'][Math.floor(Math.random() * 3)],
                size: Math.random() * 6 + 2,
                duration: 1.5,
                velocity: Math.random() * 7 + 3
            });
        }

        // Shake effect
        const card = document.querySelector('.card.active');
        if (card) {
            card.style.animation = 'earthShake 0.4s ease-out';
            const style = document.createElement('style');
            style.textContent = `
                @keyframes earthShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== GENERAL TRAIL EFFECT =====
    createTrail(effectType, x, y) {
        switch (effectType) {
            case 'fire':
                this.createFireTrail(null, x, y);
                break;
            case 'lightning':
                this.createLightningTrail(x, y);
                break;
            case 'air':
                this.createAirTrail(x, y);
                break;
            case 'earth':
                this.createEarthTrail(x, y);
                break;
        }
    }

    // ===== GENERAL BURST EFFECT =====
    createBurst(effectType, x, y) {
        switch (effectType) {
            case 'fire':
                this.createFireBurst(x, y);
                break;
            case 'lightning':
                this.createLightningBurst(x, y);
                break;
            case 'air':
                this.createAirBurst(x, y);
                break;
            case 'earth':
                this.createEarthBurst(x, y);
                break;
        }
    }
}

const effectsManager = new EffectsManager();
