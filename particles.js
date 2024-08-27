// Generate particles dynamically
const particleContainer = document.querySelector('.particle-container');

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Randomize starting position and animation duration
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = Math.random() * 5 + 5 + 's';

    // Remove the particle after animation completes
    particle.addEventListener('animationend', () => {
        particle.remove();
    });

    particleContainer.appendChild(particle);
}

// Continuously create particles every 300ms
setInterval(createParticle, 300);
