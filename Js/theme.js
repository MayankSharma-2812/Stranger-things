// theme.js
document.addEventListener('DOMContentLoaded', () => {
    // Theme state
    let isUpsideDown = localStorage.getItem('isUpsideDown') === 'true';
    let isAnimating = false;

    // Elements
    const body = document.body;
    const themeToggle = document.getElementById('upsideDownToggle');
    const music = document.getElementById('upsideDownMusic');
    const overlay = document.querySelector('.theme-transition');

    // Initialize theme
    function initTheme() {
        // Set initial theme
        if (isUpsideDown) {
            body.classList.add('upside-down-theme');
            body.classList.remove('normal-theme');
            if (music) music.volume = 0.5;
        } else {
            body.classList.remove('upside-down-theme');
            body.classList.add('normal-theme');
            if (music) music.volume = 0;
        }

        // Update toggle button
        updateToggleButton();
    }

    // Update toggle button state
    function updateToggleButton() {
        if (!themeToggle) return;
        themeToggle.setAttribute('aria-pressed', isUpsideDown);
        themeToggle.textContent = isUpsideDown ? 'Normal World' : 'Upside Down';
    }

    // Toggle theme
    async function toggleTheme() {
        if (isAnimating) return;
        isAnimating = true;

        // Show overlay
        overlay.style.display = 'block';
        void overlay.offsetWidth; // Trigger reflow
        overlay.classList.add('active');

        // Wait for fade in
        await new Promise(resolve => setTimeout(resolve, 400));

        // Toggle theme
        isUpsideDown = !isUpsideDown;
        localStorage.setItem('isUpsideDown', isUpsideDown);

        // Update body classes
        if (isUpsideDown) {
            body.classList.add('upside-down-theme');
            body.classList.remove('normal-theme');
        } else {
            body.classList.remove('upside-down-theme');
            body.classList.add('normal-theme');
        }

        // Handle music
        if (music) {
            if (isUpsideDown) {
                try {
                    music.currentTime = 0;
                    await music.play();
                    // Fade in music
                    const fadeIn = setInterval(() => {
                        if (music.volume < 0.5) {
                            music.volume += 0.05;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                    startBloodEffect();
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            } else {
                // Fade out music
                const fadeOut = setInterval(() => {
                    if (music.volume > 0.1) {
                        music.volume -= 0.05;
                    } else {
                        music.pause();
                        clearInterval(fadeOut);
                    }
                }, 100);
                stopBloodEffect();
            }
        }

        // Update UI
        updateToggleButton();

        // Wait for theme changes to apply
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Fade out overlay
        overlay.classList.remove('active');

        // Remove overlay after animation completes
        setTimeout(() => {
            overlay.style.display = 'none';
            isAnimating = false;
        }, 800);
    }

    // Blood effect functions
    let bloodDropInterval;

    function createBloodDrop() {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';

        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        drop.style.width = `${size}px`;
        drop.style.height = `${size * 1.5}px`;

        // Random position across the viewport width
        const posX = Math.random() * window.innerWidth;
        drop.style.left = `${posX}px`;

        // Random animation duration between 2s and 4s
        const duration = Math.random() * 2 + 2;
        drop.style.animationDuration = `${duration}s`;

        // Add to body
        document.body.appendChild(drop);

        // Create splatter when drop hits bottom
        setTimeout(() => {
            createBloodSplatter(posX, window.innerHeight - 10);
        }, duration * 1000 - 100);

        // Remove element after animation completes
        setTimeout(() => {
            if (drop.parentNode) {
                drop.remove();
            }
        }, duration * 1000);
    }

    function createBloodSplatter(x, y) {
        const splatter = document.createElement('div');
        splatter.className = 'blood-splatter';

        // Random size between 20px and 50px
        const size = Math.random() * 30 + 20;
        splatter.style.width = `${size}px`;
        splatter.style.height = `${size}px`;

        // Position at drop impact point
        splatter.style.left = `${x - size / 2}px`;
        splatter.style.top = `${y - size / 2}px`;

        // Add to body
        document.body.appendChild(splatter);

        // Remove element after animation completes
        setTimeout(() => {
            if (splatter.parentNode) {
                splatter.remove();
            }
        }, 1000);
    }

    function startBloodEffect() {
        // Clear any existing interval
        if (bloodDropInterval) {
            clearInterval(bloodDropInterval);
        }

        // Create a new blood drop every 300-800ms
        bloodDropInterval = setInterval(() => {
            if (isUpsideDown) {
                createBloodDrop();
            }
        }, Math.random() * 500 + 300);
    }

    function stopBloodEffect() {
        clearInterval(bloodDropInterval);
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize
    initTheme();

    // Export functions for other scripts
    window.theme = {
        toggle: toggleTheme,
        isUpsideDown: () => isUpsideDown
    };
});
