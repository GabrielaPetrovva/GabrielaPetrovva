// =====================
// Custom Cursor Logic
// =====================
const cursor = document.querySelector('.custom-cursor');
const trails = [];

// Create trailing cursor effect
for (let i = 0; i < 5; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({ element: trail, x: 0, y: 0 });
}

// Move cursor and trails on mouse move
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    
    trails.forEach((trail, index) => {
        setTimeout(() => {
            trail.x = e.clientX - 2;
            trail.y = e.clientY - 2;
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
            trail.element.style.opacity = 1 - index * 0.2;
        }, index * 50);
    });
});

// =====================
// Scroll to About Section
// =====================
function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// =====================
// Three.js 3D Background
// =====================
let scene, camera, renderer, particles;

// Initialize Three.js scene and particles
function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create enhanced particle system
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 8000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        
        // Enhanced blue-purple color palette
        const colorVariant = Math.random();
        if (colorVariant < 0.4) {
            // Blue tones
            colors.push(0.2, 0.4, 1.0);
        } else if (colorVariant < 0.8) {
            // Purple tones
            colors.push(0.6, 0.3, 1.0);
        } else {
            // Cyan tones
            colors.push(0.0, 0.8, 1.0);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 500;
}

// Animate the Three.js scene
function animateThree() {
    requestAnimationFrame(animateThree);
    
    particles.rotation.x += 0.0008;
    particles.rotation.y += 0.0012;
    
    const positions = particles.geometry.attributes.position.array;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.2;
        positions[i] += Math.cos(time + positions[i + 2] * 0.01) * 0.1;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

// =====================
// Matrix Rain Effect
// =====================
const matrixCanvas = document.getElementById('matrix');
const matrixCtx = matrixCanvas.getContext('2d');

// Set canvas size to window size
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*(){}[]<>/\\';
const matrixArray = matrixChars.split('');

const fontSize = 12;
const columns = matrixCanvas.width / fontSize;
const drops = [];

// Initialize drops for each column
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Draw the matrix rain animation
function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = '#6366f1';
    matrixCtx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        matrixCtx.globalAlpha = Math.random() * 0.8 + 0.2;
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    matrixCtx.globalAlpha = 1;
}

// =====================
// Scroll Animations for Cards
// =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Intersection Observer to animate cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// =====================
// Initialization on Window Load
// =====================
window.addEventListener('load', () => {
    initThree();
    animateThree();
    setInterval(drawMatrix, 35);
    
    // Observe skill cards for animation
    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });

    // Observe project cards for animation
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});

// =====================
// Responsive Handling
// =====================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});

// =====================
// Interactive Card Hover Effects
// =====================
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-10px) rotateX(0deg)';
    });
});