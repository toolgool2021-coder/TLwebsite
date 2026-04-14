// ===== EFFECTS MANAGER =====
const effectsManager = (() => {
    const effectsLayer = document.getElementById('effectsLayer');
    
    const effectTypes = {
        fire: {
            color: '#ff6b35',
            glow: 'rgba(255, 107, 53, 0.6)',
            particles: 12
        },
        lightning: {
            color: '#00d4ff',
            glow: 'rgba(0, 212, 255, 0.6)',
            particles: 8
        },
        wind: {
            color: '#a0e7e5',
            glow: 'rgba(160, 231, 229, 0.6)',
            particles: 15
        },
        earth: {
            color: '#8b7355',
            glow: 'rgba(139, 115, 85, 0.6)',
            particles: 10
        },
        water: {
            color: '#00b4db',
            glow: 'rgba(0, 180, 219, 0.6)',
            particles: 11
        },
        frost: {
            color: '#4dd0e1',
            glow: 'rgba(77, 208, 225, 0.6)',
            particles: 9
        }
    };
    
    function getEffect(effectName) {
        return effectTypes[effectName] || effectTypes.fire;
    }
    
    function createBurst(effectName, x, y) {
        const effect = getEffect(effectName);
        const burstCount = 20;
        
        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const velocity = 200 + Math.random() * 300;
            const endX = x + Math.cos(angle) * velocity;
            const endY = y + Math.sin(angle) * velocity;
            
            const burst = document.createElement('div');
            burst.className = 'burst';
            burst.style.left = x + 'px';
            burst.style.top = y + 'px';
            burst.style.width = '12px';
            burst.style.height = '12px';
            burst.style.background = effect.color;
            burst.style.boxShadow = `0 0 15px ${effect.glow}`;
            burst.style.setProperty('--angle', angle);
            burst.style.setProperty('--distance', velocity);
            
            effectsLayer.appendChild(burst);
            
            setTimeout(() => burst.remove(), 600);
        }
    }
    
    function createTrail(effectName, x, y) {
        const effect = getEffect(effectName);
        const trailCount = 5;
        
        for (let i = 0; i < trailCount; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.className = 'trail';
                trail.style.left = x + 'px';
                trail.style.top = y + 'px';
                trail.style.width = '20px';
                trail.style.height = '20px';
                trail.style.background = effect.color;
                trail.style.boxShadow = `0 0 20px ${effect.glow}`;
                trail.style.opacity = `${0.8 - i * 0.15}`;
                
                effectsLayer.appendChild(trail);
                
                setTimeout(() => trail.remove(), 800);
            }, i * 50);
        }
    }
    
    function createParticles(effectName, x, y) {
        const effect = getEffect(effectName);
        const particleCount = effect.particles;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const distance = 50 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = (4 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = effect.color;
            particle.style.boxShadow = `0 0 10px ${effect.glow}`;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animation = `particleFloat ${0.8 + Math.random() * 0.4}s ease-out forwards`;
            
            effectsLayer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1200);
        }
    }
    
    function createGlow(effectName, element) {
        const effect = getEffect(effectName);
        element.style.boxShadow = `0 0 40px ${effect.glow}, inset 0 0 30px ${effect.glow}`;
    }
    
    return {
        createBurst,
        createTrail,
        createParticles,
        createGlow,
        getEffect
    };
})();
