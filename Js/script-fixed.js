// Character data - contains both actor and character information
const characters = [
    {
        id: 1,
        name: 'Eleven',
        actor: 'Millie Bobby Brown',
        role: 'The Telekinetic Hero',
        actorRole: 'Portrays Eleven',
        actorDescription: 'Millie Bobby Brown is an English actress and producer. She gained recognition for her role as Eleven in Stranger Things, which earned her two Primetime Emmy Award nominations.',
        characterDescription: 'Eleven, also known as El, is a young girl with psychokinetic abilities. She escaped from Hawkins National Laboratory, where she was experimented on. She becomes close friends with Mike, Dustin, and Lucas, and plays a key role in fighting the creatures from the Upside Down.',
        image: 'images/millie.png',
        upsideDownImage: 'images/eleven.png'
    },
    {
        id: 2,
        name: 'Mike Wheeler',
        actor: 'Finn Wolfhard',
        role: 'The Loyal Leader',
        actorRole: 'Portrays Mike Wheeler',
        actorDescription: 'Finn Wolfhard is a Canadian actor and musician. He is known for his roles in Stranger Things and It. He has also directed and produced several projects.',
        characterDescription: 'Michael "Mike" Wheeler is the leader of the Party and Eleven\'s love interest. He is loyal, brave, and determined to protect his friends from the dangers of the Upside Down.',
        image: 'images/fin.png',
        upsideDownImage: 'images/mike.png'
    },
    {
        id: 3,
        name: 'Jim Hopper',
        actor: 'David Harbour',
        role: 'The Protective Chief',
        actorRole: 'Portrays Jim Hopper',
        actorDescription: 'David Harbour is an American actor known for his roles in Stranger Things, Black Widow, and Hellboy. He has won a Critics\' Choice Award and a Screen Actors Guild Award.',
        characterDescription: 'Chief Jim Hopper is the chief of police in Hawkins. After the death of his daughter, he becomes a father figure to Eleven. He is tough but caring, always putting himself in danger to protect the town and its residents.',
        image: 'images/stranger-things-1.jpg',
        upsideDownImage: 'images/stranger-things-2.jpg'
    },
    {
        id: 4,
        name: 'Max Mayfield',
        actor: 'Sadie Sink',
        role: 'The Skater Girl',
        actorRole: 'Portrays Maxine "Max" Mayfield',
        actorDescription: 'Sadie Sink is an American actress known for her roles in Stranger Things, Fear Street, and The Whale. She began her career on Broadway before transitioning to television and film.',
        characterDescription: 'Maxine "Max" Mayfield is a tough and independent skater who moves to Hawkins with her family. She becomes close with the Party and develops a relationship with Lucas. She has a strong will and isn\'t afraid to stand up for herself.',
        image: 'images/stranger-things-3.jpg',
        upsideDownImage: 'images/stranger-things-1.jpg'
    }
];

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const characterName = document.querySelector('.character-name');
const characterRole = document.querySelector('.character-role');
const characterDescription = document.querySelector('.character-description');
const characterCutout = document.querySelector('.character-cutout');
const prevBtn = document.querySelector('.prev-arrow');
const nextBtn = document.querySelector('.next-arrow');
const dotsContainer = document.querySelector('.slider-dots');

// State
let currentSlide = 0;
let isUpsideDown = false;
let particleSystem;
let scrollAnimationElements;
let lastScrollPosition = 0;

// Initialize particle system
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    document.body.appendChild(canvas);

    // Simple particle system implementation
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 80;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: isUpsideDown ? '#ff0000' : '#e50914'
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize scroll reveal animations
function initScrollAnimations() {
    scrollAnimationElements = document.querySelectorAll('.reveal');
    checkScroll();
    window.addEventListener('scroll', checkScroll);
}

function checkScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;

    scrollAnimationElements.forEach(element => {
        const elementPosition = element.offsetTop + element.offsetHeight;

        if (scrollPosition > element.offsetTop + 100) {
            element.classList.add('active');
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const scrollValue = window.scrollY;
        heroSection.style.backgroundPositionY = scrollValue * 0.5 + 'px';
    }

    lastScrollPosition = window.scrollY;
}

// Add hover effect to all buttons
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, .btn, .slider-btn, .nav-arrow');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });

        button.addEventListener('mouseleave', () => {
            button.style.removeProperty('--x');
            button.style.removeProperty('--y');
        });
    });
}

// Add ripple effect to buttons
function initRippleEffects() {
    const buttons = document.querySelectorAll('.btn, .slider-btn, .nav-arrow');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
}

// Initialize the slider
function initSlider() {
    // Create dots for navigation
    characters.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });

    // Set initial content
    updateContent();

    // Add event listeners
    addEventListeners();
}

// Update slide content based on current theme
function updateContent() {
    const currentCharacter = characters[currentSlide];

    // Use different image based on theme
    const imageSrc = isUpsideDown
        ? (currentCharacter.upsideDownImage || currentCharacter.image)
        : currentCharacter.image;

    // Update character cutout with the appropriate image
    characterCutout.innerHTML = ''; // Clear previous content
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = currentCharacter.name;
    img.className = `character-image ${isUpsideDown ? 'upside-down' : ''}`;
    img.onerror = function () {
        // Fallback in case image fails to load
        console.error(`Failed to load image: ${imageSrc}`);
        this.src = isUpsideDown ? 'images/eleven.png' : 'images/millie.png';
    };
    characterCutout.appendChild(img);

    // Update text content based on theme
    if (isUpsideDown) {
        // Show character info
        characterName.textContent = currentCharacter.name;
        characterRole.textContent = currentCharacter.role;
        characterDescription.textContent = currentCharacter.characterDescription;
    } else {
        // Show actor info
        characterName.textContent = currentCharacter.actor;
        characterRole.textContent = currentCharacter.actorRole;
        characterDescription.textContent = currentCharacter.actorDescription;
    }

    // Update active dot
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Add animation
    animateContent();
}

// Animate content with anime.js or fallback to CSS
function animateContent() {
    // Check if anime.js is available
    if (typeof anime !== 'undefined') {
        // Animate text elements
        anime({
            targets: [characterName, characterRole, characterDescription],
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(100)
        });

        // Animate character cutout
        anime({
            targets: characterCutout,
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
    } else {
        // Fallback to CSS animations
        const elements = [characterName, characterRole, characterDescription, characterCutout];
        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-20px)';
                el.style.transition = 'all 0.8s ease-out';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }
}

// Go to specific slide
function goToSlide(index) {
    if (index >= 0 && index < characters.length) {
        currentSlide = index;
        updateContent();
    }
}

// Go to next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % characters.length;
    updateContent();
}

// Go to previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + characters.length) % characters.length;
    updateContent();
}

// Toggle theme with enhanced effects
function toggleTheme() {
    isUpsideDown = !isUpsideDown;

    // Add transition class for smooth theme change
    body.classList.add('theme-transition');

    // Update theme classes and UI
    if (isUpsideDown) {
        body.classList.remove('normal-theme');
        body.classList.add('upside-down-theme');
        
        // Update theme toggle text
        const themeTexts = themeToggle.querySelectorAll('.theme-text');
        if (themeTexts.length >= 2) {
            themeTexts[0].style.opacity = '0.5';
            themeTexts[1].style.opacity = '1';
        }

        // Add screen shake effect
        body.classList.add('shake-effect');
        setTimeout(() => {
            body.classList.remove('shake-effect');
        }, 1000);

    } else {
        body.classList.remove('upside-down-theme');
        body.classList.add('normal-theme');
        
        // Update theme toggle text
        const themeTexts = themeToggle.querySelectorAll('.theme-text');
        if (themeTexts.length >= 2) {
            themeTexts[0].style.opacity = '1';
            themeTexts[1].style.opacity = '0.5';
        }
    }

    // Update content with animation
    updateContent();

    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 500);
}

// Add event listeners
function addEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Dot navigation
    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.dot');
            if (dot) {
                const index = parseInt(dot.dataset.index);
                goToSlide(index);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 't' || e.key === 'T') toggleTheme();
    });
}

// Initialize the page with all effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initParticles();
    initScrollAnimations();
    initButtonEffects();
    initRippleEffects();
    initSlider();

    // Add animation to hero section on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add hover effect to character cards
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});
