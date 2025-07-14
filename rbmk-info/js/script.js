        // Enhanced Dosimeter Simulation
        function updateDosimeter() {
            const base = 0.12;
            const random = Math.random() * 0.05;
            const value = (base + random).toFixed(2);
            const display = document.querySelector('.dosimeter-display');

            if (display) {
                // Add flicker effect during update
                display.style.opacity = '0.5';
                setTimeout(() => {
                    display.textContent = value;
                    display.style.opacity = '1';

                    // Change color based on radiation level
                    if (value > 0.15) {
                        display.style.color = '#ff6666';
                    } else if (value > 0.13) {
                        display.style.color = '#ffcc00';
                    } else {
                        display.style.color = '#ff3333';
                    }
                }, 100);
            }

            setTimeout(updateDosimeter, 2000);
        }

        // Scroll Animation Observer
        function createScrollObserver() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all sections and cards
            const elementsToAnimate = document.querySelectorAll(
                '.feature-box, .timeline-item, .radiation-card, .spec-card, .zone-stat, .rbmk-spec'
            );

            elementsToAnimate.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }

        // Parallax Effect for Hero Section
        function initParallax() {
            const hero = document.querySelector('.hero');
            if (!hero) return;

            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }

        // Enhanced Navigation Highlighting
        function initNavHighlight() {
            const navLinks = document.querySelectorAll('.nav-links a');
            const sections = document.querySelectorAll('section[id]');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }



        // Radiation Scale Animation
        function animateRadiationScale() {
            const scaleMarkers = document.querySelectorAll('.scale-marker');

            scaleMarkers.forEach((marker, index) => {
                marker.style.opacity = '0';
                marker.style.transform = 'translateY(20px)';
                marker.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                setTimeout(() => {
                    marker.style.opacity = '1';
                    marker.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }

        // Page Loading Animation
        function initPageLoading() {
            // Add loading class to body
            document.body.classList.add('page-loading');

            // Remove loading class after a short delay
            setTimeout(() => {
                document.body.classList.remove('page-loading');
                document.body.classList.add('page-loaded');
            }, 500);
        }

        // Add smooth stagger animation to feature boxes
        function staggerFeatureBoxes() {
            const featureBoxes = document.querySelectorAll('.feature-box');
            featureBoxes.forEach((box, index) => {
                box.style.animationDelay = `${index * 0.2}s`;
                box.classList.add('fade-in-up');
            });
        }

        // Mobile Menu Functionality
        function initMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

            if (!mobileMenuBtn || !mobileNav) return;

            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                mobileNav.classList.toggle('active');

                // Prevent body scroll when menu is open
                if (mobileNav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking on a link
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            mobileNav.addEventListener('click', (e) => {
                if (e.target === mobileNav) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Initialize all effects when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            initPageLoading();
            updateDosimeter();
            createScrollObserver();
            initParallax();
            initNavHighlight();
            staggerFeatureBoxes();
            initMobileMenu();

            // Animate radiation scale when it comes into view
            const radiationScale = document.querySelector('.radiation-scale');
            if (radiationScale) {
                const scaleObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateRadiationScale();
                            scaleObserver.unobserve(entry.target);
                        }
                    });
                });
                scaleObserver.observe(radiationScale);
            }
        });