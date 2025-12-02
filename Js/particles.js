class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: 100,
            color: '#e50914',
            minSize: 1,
            maxSize: 3,
            speed: 0.5,
            lineDistance: 100,
            ...options
        };

        this.setup();
        this.animate();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setup() {
        this.resizeCanvas();
        this.createParticles();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
                speedX: (Math.random() - 0.5) * this.options.speed,
                speedY: (Math.random() - 0.5) * this.options.speed
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.lineDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(229, 9, 20, ${1 - distance / this.options.lineDistance})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });
    }

    handleResize() {
        this.resizeCanvas();
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(this.animate.bind(this));
    }
}
