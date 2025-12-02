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
    // Blood Drop Effect
    // ----------------------------
    let bloodDropInterval;
    
    const createBloodDrop = () => {
        const bloodDrop = document.createElement('div');
        bloodDrop.className = 'blood-drop';
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        bloodDrop.style.width = `${size}px`;
        bloodDrop.style.height = `${size * 1.5}px`;
        
        // Random position across the viewport width
        const posX = Math.random() * window.innerWidth;
        bloodDrop.style.left = `${posX}px`;
        
        // Random animation duration between 2s and 4s
        const duration = Math.random() * 2 + 2;
        bloodDrop.style.animationDuration = `${duration}s`;
        
        // Add to body
        document.body.appendChild(bloodDrop);
        
        // Create splatter when drop hits bottom
        setTimeout(() => {
            createBloodSplatter(posX, window.innerHeight - 10);
        }, duration * 1000 - 100);
        
        // Remove element after animation completes
        setTimeout(() => {
            if (bloodDrop.parentNode) {
                bloodDrop.remove();
            }
        }, duration * 1000);
    };
    
    const createBloodSplatter = (x, y) => {
        const splatter = document.createElement('div');
        splatter.className = 'blood-splatter';
        
        // Random size between 20px and 50px
        const size = Math.random() * 30 + 20;
        splatter.style.width = `${size}px`;
        splatter.style.height = `${size}px`;
        
        // Position at drop impact point
        splatter.style.left = `${x - size/2}px`;
        splatter.style.top = `${y - size/2}px`;
        
        // Add to body
        document.body.appendChild(splatter);
        
        // Remove element after animation completes
        setTimeout(() => {
            if (splatter.parentNode) {
                splatter.remove();
            }
        }, 1000);
    };
    
    const startBloodEffect = () => {
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
    };
    
    const stopBloodEffect = () => {
        clearInterval(bloodDropInterval);
    };

    // ----------------------------
    // Theme Helpers
    // ----------------------------
    const createThemeOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition';
        document.body.appendChild(overlay);
        return overlay;
    };

    const updateThemeDependentElements = (isUpsideDown) => {
        // Update theme toggle button
        const themeToggle = document.getElementById('upsideDownToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', isUpsideDown);
            themeToggle.textContent = isUpsideDown ? 'Normal World' : 'Upside Down';
        }
        
        // Update any other theme-dependent elements here
        const themeDependentElements = document.querySelectorAll('[data-theme-dependent]');
        themeDependentElements.forEach(el => {
            if (isUpsideDown) {
                el.classList.add('upside-down-theme');
                el.classList.remove('normal-theme');
            } else {
                el.classList.remove('upside-down-theme');
                el.classList.add('normal-theme');
            }
        });
    };
    
    const applyThemeClasses = () => {
        if (isUpsideDown) {
            body.classList.add('upside-down-theme');
            body.classList.remove('normal-theme');
        } else {
            body.classList.remove('upside-down-theme');
            body.classList.add('normal-theme');
        }

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', String(isUpsideDown));
            themeToggleBtn.textContent = isUpsideDown ? 'Normal World' : 'Upside Down';
        }
    };

    const toggleTheme = async () => {
        if (isAnimating) return;
        isAnimating = true;
        
        const body = document.body;
        const music = document.getElementById('upsideDownMusic');
        const overlay = document.querySelector('.theme-transition') || createThemeOverlay();
        
        // Show overlay and start transition
        overlay.style.display = 'block';
        void overlay.offsetWidth; // Trigger reflow
        overlay.classList.add('active');
        
        // Wait for fade in
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Toggle theme
        const wasUpsideDown = isUpsideDown;
        isUpsideDown = !isUpsideDown;
        
        // Update body class
        if (isUpsideDown) {
            body.classList.add('upside-down-theme');
            body.classList.remove('normal-theme');
        } else {
            body.classList.remove('upside-down-theme');
            body.classList.add('normal-theme');
        }
        
        // Update theme state in localStorage
        localStorage.setItem('isUpsideDown', isUpsideDown);
        
        // Handle music based on theme
        if (music) {
            if (isUpsideDown && !wasUpsideDown) {
                // Fade in music when going to Upside Down
                try {
                    music.volume = 0;
                    await music.play();
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
                startBloodEffect();
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
                stopBloodEffect();
            }
        }
        
        // Update UI elements
        updateThemeDependentElements(isUpsideDown);
        updateSlideContent();
        
        // Wait for theme changes to apply
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Fade out overlay
        overlay.classList.remove('active');
        
        // Remove overlay after animation completes
        setTimeout(() => {
            overlay.style.display = 'none';
            isAnimating = false;
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
        // Initialize theme from localStorage or default to normal
        const savedTheme = localStorage.getItem('isUpsideDown');
        if (savedTheme !== null) {
            isUpsideDown = savedTheme === 'true';
        }
        
        // Apply initial theme
        applyThemeClasses();
        
        // Start or stop blood effect based on initial theme
        if (isUpsideDown) {
            startBloodEffect();
        } else {
            stopBloodEffect();
        }
        
        createDots();
        updateSlideContent();
        addEventListeners();
        
        // Initialize audio and handle autoplay restrictions
        const music = document.getElementById('upsideDownMusic');
        if (music) {
            // Set initial volume based on theme
            music.volume = isUpsideDown ? 0.5 : 0;
            
            // Try to unlock audio on first user interaction
            const unlockAudio = () => {
                // Set volume to 0 and try to play
                music.volume = isUpsideDown ? 0.5 : 0;
                if (isUpsideDown) {
                    music.play().catch(error => {
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
// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send this to your server
            console.log('Subscribed with email:', email);
            
            // Show success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thanks for subscribing!';
            successMessage.style.color = '#4CAF50';
            successMessage.style.marginTop = '10px';
            
            // Remove any existing messages
            const existingMessage = this.querySelector('p');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            this.appendChild(successMessage);
            this.reset();
        });
    }

    // Add animation to gallery items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.character-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});