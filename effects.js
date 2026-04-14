// ===== IMPROVED EFFECTS SYSTEM =====

class EffectsManager {
    constructor() {
        this.activeEffects = [];
        this.effectsLayer = document.getElementById('effectsLayer');
    }

    createParticle(x, y, options = {}) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '51';
        
        const size = options.size || Math.random() * 6 + 3;
        const color = options.color || '#6366f1';
        const duration = options.duration || 1;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.borderRadius = '50%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;

        const angle = options.angle || Math.random() * Math.PI * 2;
        const velocity = options.velocity || Math.random() * 4 + 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        const keyframes = `
            @keyframes particle_${Date.now()}_${Math.random().toString(36).substr(2, 9)} {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(${vx * 100}px, ${vy * 100}px) scale(0);
                }
            }
        `;

        const style = document.createElement('style');
        const animName = `particle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        style.textContent = keyframes.replace(/particle_\d+_\w+/g, animName);
        document.head.appendChild(style);

        particle.style.animation = `${animName} ${duration}s ease-out forwards`;
        this.effectsLayer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            style.remove();
        }, duration * 1000);
    }

    // ===== FIRE EFFECT =====
    createFireBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createParticle(x, y, {
                    color: ['#f97316', '#fb923c', '#fbbf24'][Math.floor(Math.random() * 3)],
                    size: Math.random() * 6 + 3,
                    duration: 1,
                    velocity: Math.random() * 6 + 3
                });
            }, i * 20);
        }
    }

    createFireTrail(x, y) {
        for (let i = 0; i < 4; i++) {
            this.createParticle(x + Math.random() * 30 - 15, y, {
                color: '#f97316',
                size: Math.random() * 5 + 2,
                duration: 0.6,
                angle: -Math.PI / 2 + (Math.random() * Math.PI / 3)
            });
        }
    }

    // ===== LIGHTNING EFFECT =====
    createLightningBurst(x, y) {
        for (let i = 0; i < 10; i++) {
            this.createParticle(x, y, {
                color: '#6366f1',
                size: Math.random() * 5 + 2,
                duration: 0.5,
                velocity: Math.random() * 8 + 4
            });
        }
    }

    createLightningTrail(x, y) {
        for (let i = 0; i < 3; i++) {
            this.createParticle(x + Math.random() * 20 - 10, y, {
                color: '#6366f1',
                size: Math.random() * 4 + 1,
                duration: 0.4,
                angle: -Math.PI / 2
            });
        }
    }

    // ===== AIR EFFECT =====
    createAirBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            this.createParticle(x, y, {
                color: 'rgba(6, 182, 212, 0.8)',
                size: Math.random() * 4 + 2,
                duration: 0.8,
                velocity: Math.random() * 6 + 3
            });
        }
    }

    createAirTrail(x, y) {
        for (let i = 0; i < 3; i++) {
            this.createParticle(x + Math.random() * 25 - 12, y, {
                color: 'rgba(6, 182, 212, 0.7)',
                size: Math.random() * 3 + 1,
                duration: 0.5,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    // ===== EARTH EFFECT =====
    createEarthBurst(x, y) {
        for (let i = 0; i < 14; i++) {
            this.createParticle(x, y, {
                color: ['#84cc16', '#a3e635'][Math.floor(Math.random() * 2)],
                size: Math.random() * 6 + 2,
                duration: 1.2,
                velocity: Math.random() * 5 + 2
            });
        }
    }

    createEarthTrail(x, y) {
        for (let i = 0; i < 3; i++) {
            this.createParticle(x + Math.random() * 20 - 10, y, {
                color: '#84cc16',
                size: Math.random() * 4 + 1,
                duration: 0.7,
                angle: -Math.PI / 2 + (Math.random() * Math.PI / 4)
            });
        }
    }

    // ===== GENERAL METHODS =====
    createTrail(effectType, x, y) {
        switch (effectType) {
            case 'fire':
                this.createFireTrail(x, y);
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
