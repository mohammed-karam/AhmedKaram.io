/**
 * أحمد كرم مناع السعدني - مساح عام ونظم معلومات جغرافية
 * Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle (Dark / Light)
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('ahmed_karam_theme') || 'dark';

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const nextTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('ahmed_karam_theme', nextTheme);
        applyTheme(nextTheme);
    });

    // 3. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 4. Scroll Spy & Navbar Blur on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Active Nav Indicator
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Stat Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    function runCounters() {
        if (hasCounted) return;
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target > 50 ? 20 : 80;

                const updateCount = () => {
                    const inc = Math.ceil(target / (1000 / speed)) || 1;
                    count += inc;
                    if (count < target) {
                        counter.innerText = count;
                        setTimeout(updateCount, speed);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            hasCounted = true;
        }
    }

    window.addEventListener('scroll', runCounters);
    runCounters();

    // 6. Gallery Filtering & Counts
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const countAll = document.getElementById('countAll');
    const countPhotos = document.getElementById('countPhotos');
    const countVideos = document.getElementById('countVideos');

    let totalPhotos = 0;
    let totalVideos = 0;

    galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (cat === 'photos') totalPhotos++;
        if (cat === 'videos') totalVideos++;
    });

    if (countAll) countAll.textContent = galleryItems.length;
    if (countPhotos) countPhotos.textContent = totalPhotos;
    if (countVideos) countVideos.textContent = totalVideos;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 7. Lightbox Modal for Images and Videos
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const mediaContainer = document.getElementById('lightboxMediaContainer');
    const captionEl = document.getElementById('lightboxCaption');

    let currentVisibleItems = [];
    let currentIndex = 0;

    function getVisibleItems() {
        return Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        currentVisibleItems = getVisibleItems();
        if (index < 0 || index >= currentVisibleItems.length) return;

        currentIndex = index;
        const item = currentVisibleItems[currentIndex];
        const type = item.getAttribute('data-category');
        const src = item.getAttribute('data-src');
        const title = item.getAttribute('data-title') || '';

        // Clear existing media
        mediaContainer.innerHTML = '';

        if (type === 'videos') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = title;
            mediaContainer.appendChild(img);
        }

        captionEl.textContent = title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        // Stop any running video
        const video = mediaContainer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        mediaContainer.innerHTML = '';
    }

    function showNext() {
        if (!currentVisibleItems.length) return;
        let nextIdx = (currentIndex + 1) % currentVisibleItems.length;
        openLightbox(nextIdx);
    }

    function showPrev() {
        if (!currentVisibleItems.length) return;
        let prevIdx = (currentIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
        openLightbox(prevIdx);
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const visible = getVisibleItems();
            const idx = visible.indexOf(item);
            if (idx !== -1) {
                openLightbox(idx);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showNext(); // RTL navigation
        if (e.key === 'ArrowRight') showPrev();
    });

    // 8. Contact Form -> Direct WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const senderName = document.getElementById('senderName').value.trim();
            const projectType = document.getElementById('projectType').value;
            const senderMessage = document.getElementById('senderMessage').value.trim();

            const text = 
`السلام عليكم ورحمة الله وبركاته،
معك: ${senderName}
بخصوص: ${projectType}

تفاصيل الطلب:
${senderMessage}`;

            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/201273010455?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
        });
    }
});
