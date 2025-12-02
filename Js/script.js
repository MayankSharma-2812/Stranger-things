// script.js
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----------------------------
    // Character / Actor Data
    // ----------------------------
    const slides = [
        {
            id: 'eleven',
            characterName: 'Eleven',
            actorName: 'Millie Bobby Brown',
            characterSubtitle: 'The Telekinetic Hero',
            actorSubtitle: 'Actor • Eleven',
            characterDescription:
                'A young girl with psychokinetic abilities who escaped from Hawkins Lab and becomes the key to fighting the Upside Down.',
            actorDescription:
                'Millie Bobby Brown portrays Eleven, blending vulnerability and raw power at the heart of Stranger Things.',
            images: {
                normal: 'images/millie.png',      // actor
                upsideDown: 'images/eleven.png'   // character
            }
        },
        {
            id: 'mike',
            characterName: 'Mike Wheeler',
            actorName: 'Finn Wolfhard',
            characterSubtitle: 'The Loyal Leader',
            actorSubtitle: 'Actor • Mike Wheeler',
            characterDescription:
                'Mike Wheeler is the loyal leader of the Party and Eleven’s closest friend, always willing to risk everything for his friends.',
            actorDescription:
                'Finn Wolfhard plays Mike Wheeler, bringing sincerity and determination to the role of the Party’s de facto leader.',
            images: {
                normal: 'images/fin.png',         // actor
                upsideDown: 'images/mike.png'     // character
            }
        },
        {
            id: 'hopper',
            characterName: 'Jim Hopper',
            actorName: 'David Harbour',
            characterSubtitle: 'The Chief of Police',
            actorSubtitle: 'Actor • Jim Hopper',
            characterDescription:
                "Jim Hopper is Hawkins' gruff but big-hearted police chief who becomes a father figure to Eleven and a key defender of the town.",
            actorDescription:
                "David Harbour brings depth to Chief Hopper, balancing his tough exterior with a deeply caring nature.",
            images: {
                normal: 'images/david.png',
                upsideDown: 'images/Hopper.png'
            }
        },
        {
            id: 'max',
            characterName: 'Max Mayfield',
            actorName: 'Sadie Sink',
            characterSubtitle: 'The Skater Girl',
            actorSubtitle: 'Actor • Max Mayfield',
            characterDescription:
                'Max Mayfield is a tough, independent skater who joins the Party and becomes an integral part of the group.',
            actorDescription:
                'Sadie Sink delivers a powerful performance as Max, capturing her strength and vulnerability.',
            images: {
                normal: 'images/sadie.png',
                upsideDown: 'images/max.png'
            }
        }
    ];

    // ----------------------------
    // DOM Elements
    // ----------------------------
    const body = document.body;

    const characterNameEl = document.querySelector('.character-name');
    const characterRoleEl = document.querySelector('.character-role');
    const characterDescriptionEl = document.querySelector('.character-description');
    const characterImageEl = document.querySelector('.character-image');

    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    const dotsContainer = document.querySelector('.slider-dots');

    const themeToggleBtn = document.getElementById('upsideDownToggle');

    // Guard: if hero elements are missing, exit gracefully
    if (
        !characterNameEl ||
        !characterRoleEl ||
        !characterDescriptionEl ||
        !characterImageEl ||
        !prevBtn ||
        !nextBtn ||
        !dotsContainer
    ) {
        console.warn('[Hero Slider] Required DOM elements not found.');
        return;
    }

    // ----------------------------
    // State
    // ----------------------------
    let currentSlideIndex = 0;
    let isUpsideDown = body.classList.contains('upside-down-theme');

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----------------------------
    // Theme Helpers
    // ----------------------------
    const applyThemeClasses = () => {
        body.classList.toggle('upside-down-theme', isUpsideDown);
        body.classList.toggle('normal-theme', !isUpsideDown);

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', String(isUpsideDown));
        }
    };

    const toggleTheme = async () => {
        const music = document.getElementById('upsideDownMusic');
        
        // Create transition overlay if it doesn't exist
        let overlay = document.querySelector('.theme-transition');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'theme-transition';
            document.body.appendChild(overlay);
        }

        // Show overlay
        overlay.style.display = 'block';
        void overlay.offsetWidth; // Trigger reflow
        overlay.classList.add('active');

        // Wait for the fade in to complete
        await new Promise(resolve => setTimeout(resolve, 400));

        // Toggle theme
        const wasUpsideDown = isUpsideDown;
        isUpsideDown = !isUpsideDown;
        
        // Handle music based on the new state
        if (music) {
            if (isUpsideDown && !wasUpsideDown) {
                // Fade in music when going to Upside Down
                try {
                    music.volume = 0;
                    await music.play();
                    // Fade in volume
                    const fadeIn = setInterval(() => {
                        if (music.volume < 0.5) {
                            music.volume += 0.05;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            } else if (!isUpsideDown && wasUpsideDown) {
                // Fade out music when returning to normal
                const fadeOut = setInterval(() => {
                    if (music.volume > 0.1) {
                        music.volume -= 0.05;
                    } else {
                        music.pause();
                        music.currentTime = 0;
                        clearInterval(fadeOut);
                    }
                }, 100);
            }
        }
        
        applyThemeClasses();
        updateSlideContent();

        // Wait for theme changes to apply
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Fade out overlay
        overlay.classList.remove('active');
        
        // Remove overlay after animation completes
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 800);
    };

    // ----------------------------
    // Slider Rendering
    // ----------------------------
    const preloadImage = (src, onLoad) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            if (typeof onLoad === 'function') onLoad();
        };
    };

    const updateSlideContent = () => {
        const slide = slides[currentSlideIndex];
        if (!slide) return;

        // Add loading class to indicate transition
        characterImageEl.classList.add('loading');
        
        // Fade out current content
        const textElements = [characterNameEl, characterRoleEl, characterDescriptionEl];
        textElements.forEach(el => el.style.opacity = '0');
        characterImageEl.style.opacity = '0.5';
        
        // Decide which text + image to show based on theme
        const titleText = isUpsideDown ? slide.characterName : slide.actorName;
        const subtitleText = isUpsideDown ? slide.characterSubtitle : slide.actorSubtitle;
        const descriptionText = isUpsideDown ? slide.characterDescription : slide.actorDescription;

        const imageSrc = isUpsideDown
            ? (slide.images.upsideDown || slide.images.normal)
            : (slide.images.normal || slide.images.upsideDown);

        // Update text content (initially hidden)
        characterNameEl.textContent = titleText;
        characterRoleEl.textContent = subtitleText;
        characterDescriptionEl.textContent = descriptionText;

        // Preload image and handle transition
        preloadImage(imageSrc, () => {
            // Fade in new image
            characterImageEl.src = imageSrc;
            characterImageEl.alt = slide.characterName;
            characterImageEl.classList.toggle('upside-down', isUpsideDown);
            
            // Fade in elements with staggered delay
            setTimeout(() => {
                characterImageEl.style.transition = 'opacity 0.5s ease-out';
                characterImageEl.style.opacity = '1';
                characterImageEl.classList.remove('loading');
                
                textElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.5s ease-out';
                        el.style.opacity = '1';
                    }, 100 * (index + 1));
                });
            }, 50);
        });

        // Update active dot
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
            dot.setAttribute('aria-current', index === currentSlideIndex ? 'true' : 'false');
        });

        animateContent();
    };

    const animateContent = () => {
        // If Anime.js is not loaded or user prefers reduced motion, skip animation
        if (typeof anime === 'undefined' || prefersReducedMotion) return;

        anime({
            targets: [characterNameEl, characterRoleEl, characterDescriptionEl, characterImageEl],
            opacity: [0, 1],
            translateX: [30, 0],
            duration: 700,
            easing: 'easeOutExpo',
            delay: anime.stagger(80)
        });
    };

    // ----------------------------
    // Navigation
    // ----------------------------
    let isAnimating = false;
    const TRANSITION_DURATION = 500; // Match this with CSS transition duration

    const goToSlide = (index, direction = 'next') => {
        if (isAnimating || index < 0 || index >= slides.length) return;
        
        isAnimating = true;
        currentSlideIndex = index;
        updateSlideContent(direction);
        
        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, TRANSITION_DURATION);
    };

    const nextSlide = () => {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(nextIndex, 'next');
    };

    const prevSlide = () => {
        const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex, 'prev');
    };

    // ----------------------------
    // Dots
    // ----------------------------
    const createDots = () => {
        dotsContainer.innerHTML = '';

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = String(index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1} (${slide.characterName})`);
            dotsContainer.appendChild(dot);
        });
    };

    // ----------------------------
    // Event Listeners
    // ----------------------------
    const addEventListeners = () => {
        // Arrow buttons
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Dots (event delegation)
        dotsContainer.addEventListener('click', (event) => {
            const dot = event.target.closest('.dot');
            if (!dot) return;
            const index = Number(dot.dataset.index);
            if (!Number.isNaN(index)) goToSlide(index);
        });

        // Theme toggle button
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
        }

        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();

            if (key === 'arrowleft') prevSlide();
            if (key === 'arrowright') nextSlide();
            // Shortcut: press "t" to toggle Upside Down mode
            if (key === 't') toggleTheme();
        });
    };

    // ----------------------------
    // Init
    // ----------------------------
    const init = () => {
        createDots();
        applyThemeClasses();
        updateSlideContent();
        addEventListeners();
        
        // Initialize audio and handle autoplay restrictions
        const music = document.getElementById('upsideDownMusic');
        if (music) {
            // Try to unlock audio on first user interaction
            const unlockAudio = () => {
                // Set volume to 0 and try to play
                music.volume = 0;
                const playPromise = music.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Immediately pause and reset
                        music.pause();
                        music.currentTime = 0;
                    }).catch(error => {
                        console.log('Audio autoplay prevention:', error);
                    });
                }
                // Remove event listeners after first interaction
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            };
            
            // Add event listeners for first user interaction
            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('keydown', unlockAudio, { once: true });
        }
    };

    init();
});