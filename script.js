document.addEventListener('DOMContentLoaded', () => {
    initSitePreloader();
    initManifestoReveal();
    initWorksAnimation();
    initWorkExpansion();
    initImageSliders();
    initServicesFunctionality();
    initTypewriterEffect();
    initContactSection();
    initCursorTrail();
    initMobileMenu();
    initScrollReveals();
    initMagneticLinks();
});

function initSitePreloader() {
    const preloader = document.querySelector('.site-preloader');
    if (!preloader) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.addEventListener('load', () => {
        if (reduceMotion) {
            preloader.style.display = 'none';
            return;
        }

        preloader.classList.add('is-hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 550);
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    const setMenuState = (open) => {
        mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    };

    const toggleMenu = () => {
        const willOpen = !mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');

        // Toggle hamburger animation
        const hamburgerSpans = mobileMenuBtn.querySelectorAll('.hamburger');
        hamburgerSpans.forEach(span => {
            span.classList.toggle('active');
        });

        setMenuState(willOpen);
    };

    setMenuState(mobileMenu.classList.contains('active'));

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');

            setMenuState(false);

            // Remove active class from hamburger spans
            const hamburgerSpans = mobileMenuBtn.querySelectorAll('.hamburger');
            hamburgerSpans.forEach(span => {
                span.classList.remove('active');
            });
        });
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (event) => {
        if (
            !mobileMenu.contains(event.target) &&
            !mobileMenuBtn.contains(event.target) &&
            mobileMenu.classList.contains('active')
        ) {
            mobileMenu.classList.remove('active');

            setMenuState(false);

            // Remove active class from hamburger spans
            const hamburgerSpans = mobileMenuBtn.querySelectorAll('.hamburger');
            hamburgerSpans.forEach(span => {
                span.classList.remove('active');
            });
        }
    });
}

function initCursorTrail() {
    if (document.body && document.body.classList.contains('page')) return;

    // Track mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let requestAnimationFrameId;
    let isMoving = false;
    let lastMoveTime = 0;
    const trailElements = [];
    const MAX_TRAILS = 45;

    const clearTrails = () => {
        for (let i = trailElements.length - 1; i >= 0; i--) {
            trailElements[i].element.remove();
            trailElements.splice(i, 1);
        }
    };

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        lastMoveTime = Date.now();
    });

    // Animation function for smooth trail effect
    const animateTrail = () => {
        // Check if mouse has stopped moving (for more than 500ms)
        if (Date.now() - lastMoveTime > 500) {
            isMoving = false;
        }

        // Only create trail elements when mouse is moving
        const dx = Math.abs(mouseX - lastMouseX);
        const dy = Math.abs(mouseY - lastMouseY);
        if (isMoving && (dx > 2 || dy > 2)) {
            // Create a new trail element
            const trailElement = document.createElement('div');
            trailElement.classList.add('cursor-trail');
            trailElement.style.left = `${mouseX}px`;
            trailElement.style.top = `${mouseY}px`;
            document.body.appendChild(trailElement);

            // Add to our tracking array
            trailElements.push({
                element: trailElement,
                life: 1.0, // Start with full opacity
                size: 30 // Start with base size
            });

            // Cap to prevent buildup (especially over footer clicks/hover)
            while (trailElements.length > MAX_TRAILS) {
                const oldest = trailElements.shift();
                if (oldest && oldest.element) oldest.element.remove();
            }

            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }

        // Update existing trail elements
        for (let i = trailElements.length - 1; i >= 0; i--) {
            const trail = trailElements[i];

            // Reduce life (opacity and size) over time
            trail.life -= 0.02;
            trail.size = 30 * trail.life; // Size decreases as life decreases

            // Update the element's appearance based on its life
            trail.element.style.opacity = trail.life * 0.2; // Max opacity is 0.2
            trail.element.style.width = `${trail.size}px`;
            trail.element.style.height = `${trail.size}px`;
            trail.element.style.borderRadius = '50%';

            // Remove the element when life is depleted
            if (trail.life <= 0) {
                trail.element.remove();
                trailElements.splice(i, 1);
            }
        }

        // Continue the animation
        requestAnimationFrameId = requestAnimationFrame(animateTrail);
    };

    // Start the animation
    animateTrail();

    // Add event listeners for interactive elements to make the trail more visible
    const interactiveElements = document.querySelectorAll('a, button, .work-item, .script-title');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (!isMoving) return;
            // Add more trail elements when hovering over interactive elements
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const trailElement = document.createElement('div');
                    trailElement.classList.add('cursor-trail');
                    trailElement.style.left = `${mouseX}px`;
                    trailElement.style.top = `${mouseY}px`;
                    document.body.appendChild(trailElement);

                    trailElements.push({
                        element: trailElement,
                        life: 1.0,
                        size: 30
                    });

                    while (trailElements.length > MAX_TRAILS) {
                        const oldest = trailElements.shift();
                        if (oldest && oldest.element) oldest.element.remove();
                    }
                }, i * 50);
            }
        });
    });

    // Clicking (esp. in footer links) should not leave blobs behind
    document.addEventListener('mousedown', clearTrails, true);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearTrails();
    });

    // Clean up function to cancel animation when needed
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(requestAnimationFrameId);
        // Remove all trail elements
        clearTrails();
    });
}

function initManifestoReveal() {
    const manifestoHeader = document.getElementById('manifesto-text');
    if (!manifestoHeader) return;

    const text = manifestoHeader.innerText;
    // Разбиваем текст на слова, сохраняя пробелы
    const words = text.split(/(\s+)/); // Регулярное выражение сохраняет пробелы как отдельные элементы

    // Очищаем существующий текст
    manifestoHeader.innerHTML = '';

    // Воссоздаем с span-ами
    words.forEach((part, index) => {
        if (part.trim() === '') {
            // Если это пробел, добавляем его как текстовый узел
            manifestoHeader.appendChild(document.createTextNode(part));
        } else {
            // Если это слово, оборачиваем в span
            const span = document.createElement('span');
            span.textContent = part;
            span.classList.add('manifesto-word');
            // Устанавливаем начальное состояние - прозрачный
            span.style.opacity = '0';
            span.style.transition = 'opacity 0.5s ease';
            manifestoHeader.appendChild(span);
        }
    });

    // Используем Intersection Observer API для отслеживания появления элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Находим все слова внутри manifesto
                const words = document.querySelectorAll('.manifesto-word');
                words.forEach((word, i) => {
                    // Задержка для создания эффекта "печатной машинки"
                    setTimeout(() => {
                        word.style.opacity = '1';
                    }, i * 100); // 100ms задержка между словами
                });
                observer.unobserve(entry.target); // Перестаем следить за этим элементом
            }
        });
    }, {
        threshold: 0.1 // Срабатывает, когда 10% элемента видно
    });

    // Наблюдаем за заголовком manifesto
    observer.observe(manifestoHeader);
}

function initWorksAnimation() {
    const worksSection = document.querySelector('.works');
    const manifestoSection = document.querySelector('.manifesto');
    if (!worksSection || !manifestoSection) return;

    // Respect reduced motion preferences
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        worksSection.style.transform = 'translate3d(0, 0, 0)';
        return;
    }

    // Smooth scroll-driven overlay without touching layout/DOM
    worksSection.style.willChange = 'transform';
    worksSection.style.marginBottom = '0px';

    let maxOffset = Math.round(manifestoSection.offsetHeight * 0.7);
    let currentOffset = 0;
    let targetOffset = 0;
    let rafId = null;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const smoothstep = (t) => t * t * (3 - 2 * t);

    function computeTarget() {
        const worksRect = worksSection.getBoundingClientRect();
        // 0 when Works is below viewport; 1 when Works reaches the top
        const raw = (window.innerHeight - worksRect.top) / window.innerHeight;
        const t = smoothstep(clamp01(raw));
        targetOffset = -t * maxOffset;
    }

    function animate() {
        rafId = null;
        computeTarget();

        // Lerp to avoid jitter on trackpads
        currentOffset += (targetOffset - currentOffset) * 0.12;

        // Snap tiny values to 0 to prevent subpixel wobble
        if (Math.abs(currentOffset) < 0.01) currentOffset = 0;

        worksSection.style.transform = `translate3d(0, ${currentOffset}px, 0)`;

        // Compensate the reserved layout space so the next section doesn't get pushed down.
        // currentOffset is negative when overlapping, so margin-bottom becomes negative.
        worksSection.style.marginBottom = `${currentOffset}px`;
    }

    function requestAnimate() {
        if (rafId != null) return;
        rafId = requestAnimationFrame(animate);
    }

    function handleResize() {
        maxOffset = Math.round(manifestoSection.offsetHeight * 0.7);
        requestAnimate();
    }

    window.addEventListener('scroll', requestAnimate, { passive: true });
    window.addEventListener('resize', handleResize);

    requestAnimate();
}

function initWorkExpansion() {
    const workItems = document.querySelectorAll('.work-item');

    workItems.forEach(item => {
        const link = item.querySelector('.work-link');
        if (!link) return;

        const workNumEl = item.querySelector('.work-num');
        if (!workNumEl) return;

        const workNum = workNumEl.textContent;
        const expandedItem = document.getElementById(`work-${workNum}`);
        if (!expandedItem) return;

        const linkText = link.querySelector('.link-text');
        const linkTextHover = link.querySelector('.link-text-hover');
        const slider = expandedItem.querySelector('.work-slider');
        const content = expandedItem.querySelector('.work-content');
        if (!linkText || !linkTextHover || !slider || !content) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Toggle the expanded state
            const isActive = expandedItem.classList.contains('active');
            expandedItem.classList.toggle('active');

            // Update the link text based on the state
            if (isActive) {
                linkText.textContent = 'Explore ↘';
                linkTextHover.textContent = 'Просмотреть';

                // Remove slide-in classes when closing
                slider.classList.remove('slide-in', 'work-slider-delay');
                content.classList.remove('slide-in', 'work-content-delay');
            } else {
                linkText.textContent = 'Close ↗';
                linkTextHover.textContent = 'Закрыть';

                // Add slide-in classes with delay when opening
                setTimeout(() => {
                    // Apply slide-in animations for all screen sizes
                    // On mobile, the CSS handles the layout differently
                    slider.classList.add('slide-in', 'work-slider-delay');
                    content.classList.add('slide-in', 'work-content-delay');
                }, 50); // Small delay to ensure the element is visible before animation
            }
        });
    });
}

function initImageSliders() {
    const sliders = document.querySelectorAll('.work-slider');

    sliders.forEach(slider => {
        // Find all images in the slider, including those in the bottom container
        const images = Array.from(slider.querySelectorAll('.slider-image'));
        let currentIndex = 0;

        // Set the first image as active
        if (images.length > 0) {
            images[0].classList.add('active');
        }

        // Function to move to the next image
        function showNextImage() {
            // Check if we're on mobile view (600px breakpoint matches CSS)
            if (window.innerWidth <= 600) {
                // On mobile, don't cycle images since they're all displayed
                return;
            }

            if (images.length <= 1) return; // Don't cycle if there's only one image

            // Remove active class from current image
            images[currentIndex].classList.remove('active');

            // Move to next image (or loop back to first)
            currentIndex = (currentIndex + 1) % images.length;

            // Add active class to new current image
            images[currentIndex].classList.add('active');
        }

        // Set up automatic cycling every 3 seconds
        setInterval(showNextImage, 2000);
    });
}

function initServicesFunctionality() {
    const scriptTitles = document.querySelectorAll('.script-title');

    scriptTitles.forEach(title => {
        const serviceImage = title.querySelector('.service-image');
        const serviceContent = title.closest('.service-content');
        const serviceList = serviceContent ? serviceContent.querySelector('.service-list') : null;

        // Add hover functionality (only for non-mobile)
        if (window.innerWidth > 600) {
            title.addEventListener('mouseenter', () => {
                title.style.color = 'var(--black)';
                if (serviceImage) {
                    serviceImage.classList.add('active');
                }
            });

            title.addEventListener('mouseleave', () => {
                if (!title.classList.contains('active-clicked')) {
                    title.style.color = title.classList.contains('pink') ? 'var(--pink)' : '#999';
                }
                if (serviceImage) {
                    serviceImage.classList.remove('active');
                }
            });
        }

        // Add click functionality
        title.addEventListener('click', () => {
            // Toggle active class for the clicked title
            title.classList.toggle('active-clicked');

            // Update color based on active state
            if (title.classList.contains('active-clicked')) {
                title.style.color = 'var(--pink)';
            } else {
                title.style.color = title.classList.contains('pink') ? 'var(--pink)' : '#999';
            }

            // For mobile devices, handle image and list display differently
            if (window.innerWidth <= 600) {
                // On mobile, show/hide the image and list based on active state
                if (serviceImage) {
                    if (title.classList.contains('active-clicked')) {
                        serviceImage.style.display = 'block';
                    } else {
                        serviceImage.style.display = 'none';
                    }
                }

                if (serviceList && serviceList.classList.contains('service-list')) {
                    if (title.classList.contains('active-clicked')) {
                        serviceList.style.display = 'block';
                        serviceList.classList.add('expanded');

                        // Add animation to list items
                        const listItems = serviceList.querySelectorAll('li');
                        listItems.forEach((item, index) => {
                            // Reset animation
                            item.style.animation = 'none';
                            // Trigger reflow
                            void item.offsetWidth;
                            // Apply animation with delay
                            setTimeout(() => {
                                item.style.animation = `slideInFromRight 0.5s ease forwards ${0.1 * (index + 1)}s`;
                            }, 50);
                        });
                    } else {
                        serviceList.style.display = 'none';
                        serviceList.classList.remove('expanded');
                    }
                }
            } else {
                // For desktop, use the original functionality
                if (serviceList && serviceList.classList.contains('service-list')) {
                    serviceList.classList.toggle('expanded');

                    // If expanding, add animation to list items
                    if (serviceList.classList.contains('expanded')) {
                        const listItems = serviceList.querySelectorAll('li');
                        listItems.forEach((item, index) => {
                            // Reset animation
                            item.style.animation = 'none';
                            // Trigger reflow
                            void item.offsetWidth;
                            // Apply animation with delay
                            setTimeout(() => {
                                item.style.animation = `slideInFromRight 0.5s ease forwards ${0.1 * (index + 1)}s`;
                            }, 50);
                        });
                    }
                }

                // Rotate the image if it exists
                if (serviceImage) {
                    serviceImage.classList.toggle('active');
                }
            }
        });
    });
}

// Typewriter effect implementation
function initTypewriterEffect() {
    const elements = document.querySelectorAll('.txt-rotate');

    elements.forEach(element => {
        // Исправляем парсинг данных
        const wordsStr = element.getAttribute('data-words');
        const period = parseInt(element.getAttribute('data-period'));

        console.log('Typewriter element found:', element);
        console.log('Words string:', wordsStr);
        console.log('Period:', period);

        try {
            const words = JSON.parse(wordsStr);
            console.log('Parsed words:', words);
            // Initialize the typewriter effect
            new TxtRotate(element, words, period);
        } catch (e) {
            console.error('Error parsing typewriter data:', e);
            console.error('Data attributes:', element.dataset);
        }
    });
}

// TxtRotate class for typewriter effect
class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }

    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = `<span class="txt">${this.txt}</span>`;

        let delta = 100; // Установим фиксированную скорость для лучшей читаемости

        if (this.isDeleting) {
            delta /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => {
            this.tick();
        }, delta);
    }
}

function initScrollReveals() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targets = document.querySelectorAll([
        '.portfolio-hero',
        '.work-item',
        '.service-row',
        '.typewriter-section',
    ].join(','));

    if (!targets.length) return;

    targets.forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15,
        },
    );

    targets.forEach((el) => io.observe(el));
}

function initMagneticLinks() {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!supportsHover || !finePointer) return;

    const magneticTargets = document.querySelectorAll('.work-link, .work-visit-link, .contact-link');
    if (!magneticTargets.length) return;

    const maxTranslate = 10;

    magneticTargets.forEach((el) => {
        let rafId = null;

        const setTransform = (x, y) => {
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };

        const handleMove = (e) => {
            if (rafId != null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const rect = el.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width - 0.5;
                const relY = (e.clientY - rect.top) / rect.height - 0.5;
                const x = Math.max(-maxTranslate, Math.min(maxTranslate, relX * maxTranslate * 2));
                const y = Math.max(-maxTranslate, Math.min(maxTranslate, relY * maxTranslate * 2));
                setTransform(x, y);
            });
        };

        const reset = () => {
            if (rafId != null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            el.style.transform = '';
        };

        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', reset);
        el.addEventListener('blur', reset);
    });
}

// Initialize contact section as a static footer
function initContactSection() {
    const contactSection = document.querySelector('.contact-scroller');

    if (!contactSection) return;

    // Set initial styles for the contact section to be positioned statically
    contactSection.style.position = 'relative';
    contactSection.style.top = '0';
    contactSection.style.left = '0';
    contactSection.style.width = '100%';
    contactSection.style.zIndex = '5';

    // Ensure the contact section is visible and not transformed
    contactSection.style.transform = 'translateY(0)';
    contactSection.style.opacity = '1';
}