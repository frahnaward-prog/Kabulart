document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach((reveal) => observer.observe(reveal));
    } else {
        reveals.forEach((reveal) => reveal.classList.add('active'));
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section[id]');
    const siteHeader = document.querySelector('.site-header');
    const scrollLocks = new Set();

    const syncBodyScrollLock = () => {
        const shouldLock = scrollLocks.size > 0;
        document.body.classList.toggle('menu-open', scrollLocks.has('menu'));
        document.body.classList.toggle('modal-open', scrollLocks.has('artwork-modal'));
        document.body.classList.toggle('cart-open', scrollLocks.has('cart'));
        document.body.classList.toggle('lightbox-open', scrollLocks.has('lightbox'));
        document.body.style.overflow = shouldLock ? 'hidden' : '';
    };

    const lockScroll = (reason) => {
        scrollLocks.add(reason);
        syncBodyScrollLock();
    };

    const unlockScroll = (reason) => {
        scrollLocks.delete(reason);
        syncBodyScrollLock();
    };

    const updateActiveLink = () => {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 220) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    let navOverlay = null;

    const closeMenu = () => {
        if (!navToggle || !navMenu) return;
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
        navOverlay?.classList.remove('active');
        unlockScroll('menu');
    };

    const openMenu = () => {
        if (!navToggle || !navMenu) return;
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation');
        navOverlay?.classList.add('active');
        lockScroll('menu');
    };

    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-label', 'Open navigation');
        navOverlay = document.createElement('button');
        navOverlay.type = 'button';
        navOverlay.className = 'nav-menu-overlay';
        navOverlay.setAttribute('aria-label', 'Close navigation menu');
        document.body.appendChild(navOverlay);

        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay.addEventListener('click', closeMenu);

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('click', (event) => {
            if (!navMenu.classList.contains('active')) return;
            if (event.target.closest('.nav-menu, .nav-toggle')) return;
            closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, { passive: true });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMedium = document.getElementById('lightbox-medium');
    const lightboxSize = document.getElementById('lightbox-size');
    const lightboxPrice = document.getElementById('lightbox-price');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const searchInput = document.getElementById('search-input') || document.getElementById('gallery-search');
    const galleryAdminToggle = document.getElementById('gallery-admin-toggle');
    const galleryAdminPanel = document.getElementById('gallery-admin-panel');
    const addGalleryItem = document.getElementById('add-gallery-item');
    const galleryEditList = document.getElementById('gallery-edit-list');
    const galleryGrid = document.getElementById('gallery-grid') || document.querySelector('.projects-grid');

    const adminBgColorInput = document.getElementById('admin-bg-color');
    const adminTextColorInput = document.getElementById('admin-text-color');
    const adminAccentColorInput = document.getElementById('admin-accent-color');
    const adminButtonTextColorInput = document.getElementById('admin-button-text-color');
    const adminHeadingFontSelect = document.getElementById('admin-heading-font');
    const adminBodyFontSelect = document.getElementById('admin-body-font');
    const adminSiteLogoInput = document.getElementById('admin-site-logo');
    const adminHeroTitleInput = document.getElementById('admin-hero-title');
    const adminHeroCopyInput = document.getElementById('admin-hero-copy');
    const saveAdminThemeButton = document.getElementById('save-admin-theme');
    const resetAdminThemeButton = document.getElementById('reset-admin-theme');
    const saveAdminContentButton = document.getElementById('save-admin-content');
    const heroTitle = document.getElementById('hero-title');
    const heroCopy = document.querySelector('.hero-copy');
    const siteLogoLink = document.querySelector('.logo');
    const siteLogoImage = document.querySelector('.logo-image');

    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === '1' || localStorage.getItem('kabulArtAdmin') === 'true';

    const defaultTheme = {
        bodyBg: '#111111',
        textColor: '#FFFFFF',
        accentColor: '#F5E7C6',
        buttonText: '#000000',
        headingFont: 'Playfair Display, serif',
        bodyFont: 'Inter, system-ui, sans-serif',
    };

    const defaultContent = {
        siteLogo: '',
        heroTitle: 'Original Abstract Art for Modern Interiors',
        heroCopy: 'Discover handcrafted original paintings created by Farhad. Each artwork is one of a kind, bringing texture, emotion, and timeless elegance into your home.',
    };

    const artworkPageMap = {
        'golden-horizon': 'golden-horizon.html',
        'painting-golden-horizon': 'painting-golden-horizon.html',
        'liminal-equilibrium': 'liminal-equilibrium.html',
        'veiled-memories': 'veiled-memories.html',
        'echoes-of-dawn': 'echoes-of-dawn.html',
        'quiet-horizon': 'quiet-horizon.html',
        'still-waters': 'still-waters.html',
        'amber-drift': 'amber-drift.html',
        'velvet-silence': 'velvet-silence.html',
        'midnight-bloom': 'midnight-bloom.html',
    };

    const fallbackPaintings = [
        {
            title: 'Golden Horizon',
            slug: 'golden-horizon',
            medium: 'Acrylic on Canvas',
            dimensions: '48 × 36 in',
            price: 2800,
            status: 'available',
            image: 'images/paintings/Abstract 2 Canvas.png',
            altText: 'Golden Horizon original abstract painting by Farhad',
            description: 'Golden Horizon is a luminous abstract composition layered with rich texture, warm metallic tones, and an expansive sense of movement.',
            featured: true,
            year: '2026',
        },
        {
            title: 'Liminal Equilibrium',
            slug: 'liminal-equilibrium',
            medium: 'Oil on Canvas',
            dimensions: '36 × 24 in',
            price: 2200,
            status: 'available',
            image: 'images/paintings/liminal-equilibrium.png',
            altText: 'Liminal Equilibrium original abstract painting by Farhad',
            description: 'Liminal Equilibrium explores stillness and transition through layered movement and warm contrast.',
            featured: true,
            year: '2024',
        },
        {
            title: 'Veiled Memories',
            slug: 'veiled-memories',
            medium: 'Mixed Media',
            dimensions: '30 × 40 in',
            price: 2600,
            status: 'available',
            image: 'images/paintings/still-waters.png.png',
            altText: 'Veiled Memories original abstract painting by Farhad',
            description: 'Veiled Memories brings together layered surfaces, softness, and quiet depth.',
            featured: true,
            year: '2024',
        },
    ];

    const defaultPublicSettings = {
        hero_title: defaultContent.heroTitle,
        hero_copy: defaultContent.heroCopy,
        contact_heading: 'Commission or Purchase',
        contact_intro_title: 'Interested in a painting or custom commission?',
        contact_intro_copy: 'Send me a message and I will reply within 48 hours.',
        contact_email: '',
        contact_phone: '',
        instagram_url: '',
        facebook_url: '',
        pinterest_url: '',
        shipping_note: '',
        footer_blurb: 'Original abstract paintings in acrylic and oil.\nHandcrafted with passion.',
        footer_email: 'info@kabulart.ca',
        footer_copyright: '© 2026 Kabul Art • All Rights Reserved • Handcrafted by Farhad',
    };

    const getSavedTheme = () => {
        try {
            return JSON.parse(localStorage.getItem('kabulArtTheme')) || {};
        } catch (error) {
            return {};
        }
    };

    const getSavedContent = () => {
        try {
            return JSON.parse(localStorage.getItem('kabulArtContent')) || {};
        } catch (error) {
            return {};
        }
    };

    const applyTheme = (theme) => {
        const root = document.documentElement;
        root.style.setProperty('--body-bg', theme.bodyBg || defaultTheme.bodyBg);
        root.style.setProperty('--text-color', theme.textColor || defaultTheme.textColor);
        root.style.setProperty('--accent-color', theme.accentColor || defaultTheme.accentColor);
        root.style.setProperty('--button-text', theme.buttonText || defaultTheme.buttonText);
        root.style.setProperty('--heading-font', theme.headingFont || defaultTheme.headingFont);
        root.style.setProperty('--body-font', theme.bodyFont || defaultTheme.bodyFont);
    };

    const applyContent = (content) => {
        if (siteLogoImage) {
            siteLogoImage.alt = content.siteLogo ? content.siteLogo : 'Kabul Art Logo';
        }
        if (heroTitle) heroTitle.innerHTML = (content.heroTitle || defaultContent.heroTitle).replace(/\n/g, '<br>');
        if (heroCopy) heroCopy.textContent = content.heroCopy || defaultContent.heroCopy;
    };

    const saveThemeState = (theme) => {
        localStorage.setItem('kabulArtTheme', JSON.stringify(theme));
    };

    const saveContentState = (content) => {
        localStorage.setItem('kabulArtContent', JSON.stringify(content));
    };

    const collectThemeFromInputs = () => ({
        bodyBg: adminBgColorInput?.value || defaultTheme.bodyBg,
        textColor: adminTextColorInput?.value || defaultTheme.textColor,
        accentColor: adminAccentColorInput?.value || defaultTheme.accentColor,
        buttonText: adminButtonTextColorInput?.value || defaultTheme.buttonText,
        headingFont: adminHeadingFontSelect?.value || defaultTheme.headingFont,
        bodyFont: adminBodyFontSelect?.value || defaultTheme.bodyFont,
    });

    const collectContentFromInputs = () => ({
        siteLogo: adminSiteLogoInput?.value.trim() || defaultContent.siteLogo,
        heroTitle: adminHeroTitleInput?.value.trim() || defaultContent.heroTitle,
        heroCopy: adminHeroCopyInput?.value.trim() || defaultContent.heroCopy,
    });

    const updateAdminInputs = (theme, content) => {
        if (adminBgColorInput) adminBgColorInput.value = theme.bodyBg || defaultTheme.bodyBg;
        if (adminTextColorInput) adminTextColorInput.value = theme.textColor || defaultTheme.textColor;
        if (adminAccentColorInput) adminAccentColorInput.value = theme.accentColor || defaultTheme.accentColor;
        if (adminButtonTextColorInput) adminButtonTextColorInput.value = theme.buttonText || defaultTheme.buttonText;
        if (adminHeadingFontSelect) adminHeadingFontSelect.value = theme.headingFont || defaultTheme.headingFont;
        if (adminBodyFontSelect) adminBodyFontSelect.value = theme.bodyFont || defaultTheme.bodyFont;
        if (adminSiteLogoInput) adminSiteLogoInput.value = content.siteLogo || defaultContent.siteLogo;
        if (adminHeroTitleInput) adminHeroTitleInput.value = content.heroTitle || defaultContent.heroTitle;
        if (adminHeroCopyInput) adminHeroCopyInput.value = content.heroCopy || defaultContent.heroCopy;
    };

    const loadAdminSettings = () => {
        const theme = { ...defaultTheme, ...getSavedTheme() };
        const content = { ...defaultContent, ...getSavedContent() };
        applyTheme(theme);
        applyContent(content);
        updateAdminInputs(theme, content);
    };

    const formatCurrency = (value) => {
        const amount = Number(value);
        if (!Number.isFinite(amount)) return 'Contact for price';
        return `$${amount.toLocaleString()}`;
    };

    const formatMediumLabel = (medium = '') => {
        return medium ? `Original ${medium}` : 'Original artwork';
    };

    const getArtworkPageHref = (slug = '') => artworkPageMap[slug] || 'index.html#gallery';

    const fetchJson = async (url) => {
        const response = await fetch(url, {
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Request failed for ${url}`);
        }

        return response.json();
    };

    const applyPublicSettings = (settings = {}) => {
        if (heroTitle && settings.hero_title) {
            heroTitle.innerHTML = settings.hero_title.replace(/\n/g, '<br>');
        }

        if (heroCopy && settings.hero_copy) {
            heroCopy.textContent = settings.hero_copy;
        }

        const contactHeading = document.querySelector('.contact-section .section-heading h2');
        const contactIntroTitle = document.querySelector('.contact-intro h3');
        const contactIntroCopy = document.querySelector('.contact-intro p:last-child');
        const footerBlurb = document.querySelector('.site-footer .footer-column p');
        const footerConnectLinks = document.querySelectorAll('.site-footer .footer-column:last-child a');
        const footerBottom = document.querySelector('.footer-bottom p');
        const shippingCard = Array.from(document.querySelectorAll('.store-card')).find((card) => card.querySelector('h3')?.textContent.trim() === 'Shipping Information');

        if (contactHeading && settings.contact_heading) {
            contactHeading.textContent = settings.contact_heading;
        }

        if (contactIntroTitle && settings.contact_intro_title) {
            contactIntroTitle.textContent = settings.contact_intro_title;
        }

        if (contactIntroCopy && settings.contact_intro_copy) {
            contactIntroCopy.textContent = settings.contact_intro_copy;
        }

        const emailField = document.getElementById('email');
        if (emailField && settings.contact_email) {
            emailField.placeholder = settings.contact_email;
        }

        if (shippingCard && settings.shipping_note) {
            const shippingCopy = shippingCard.querySelector('p');
            if (shippingCopy) {
                shippingCopy.textContent = settings.shipping_note;
            }
        }

        if (footerBlurb && settings.footer_blurb) {
            footerBlurb.innerHTML = settings.footer_blurb.replace(/\n/g, '<br>');
        }

        if (footerConnectLinks.length >= 4) {
            if (settings.instagram_url) footerConnectLinks[0].href = settings.instagram_url;
            if (settings.facebook_url) footerConnectLinks[1].href = settings.facebook_url;
            if (settings.pinterest_url) footerConnectLinks[2].href = settings.pinterest_url;
            if (settings.footer_email) footerConnectLinks[3].href = `mailto:${settings.footer_email}`;
        }

        if (footerBottom && settings.footer_copyright) {
            footerBottom.textContent = settings.footer_copyright;
        }
    };

    if (urlParams.get('admin') === '1') {
        localStorage.setItem('kabulArtAdmin', 'true');
    }

    loadAdminSettings();

    // Sample Paintings Data - Add all your paintings here
    const paintings = [
        {
            title: 'Golden Horizon',
            medium: 'acrylic',
            size: '48 × 36 in',
            price: 2800,
            status: 'available',
            image: 'images/paintings/Abstract 2 Canvas.png',
            alt: 'Golden Horizon',
        },
        {
            title: 'Liminal Equilibrium',
            medium: 'oil',
            size: '36 × 24 in',
            price: 2200,
            status: 'available',
            image: 'images/paintings/liminal-equilibrium.png',
            alt: 'Liminal Equilibrium',
        },
        {
            title: 'Veiled Memories',
            medium: 'mixed',
            size: '30 × 40 in',
            price: 2600,
            status: 'available',
            image: 'images/paintings/still-waters.png.png',
            alt: 'Veiled Memories',
        },
        // Add more paintings here...
    ];

    // Render function
    const renderGallery = (filteredPaintings) => {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        filteredPaintings.forEach((painting) => {
            const cardHTML = `
                <article class="project-card reveal" data-medium="${painting.medium}" data-status="${painting.status}" data-title="${painting.title}" data-image="${painting.image}" data-size="${painting.size}" data-price="$${painting.price.toLocaleString()}">
                    <img class="project-image" src="${painting.image}" alt="${painting.alt}" loading="lazy">
                    <div class="project-info">
                        <h3>${painting.title}</h3>
                        <p class="medium">Original ${painting.medium.charAt(0).toUpperCase() + painting.medium.slice(1)} on Canvas</p>
                        <p class="size">${painting.size}</p>
                        <p class="status">${painting.status === 'available' ? 'Available' : 'Sold'}</p>
                        <p class="price"><strong>$${painting.price.toLocaleString()}</strong></p>
                        <button class="button small-button add-to-cart" type="button" data-title="${painting.title}" data-price="${painting.price}" data-image="${painting.image}">Add to Cart</button>
                    </div>
                </article>
            `;
            galleryGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    };

    // Filter Logic
    const filterGallery = () => {
        searchTerm = searchInput?.value.toLowerCase().trim() || '';
        applyGalleryFilters();
    };

    // Event Listeners
    searchInput?.addEventListener('input', filterGallery);

    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.filter === 'all') {
                document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                activeFilter = 'all';
            } else {
                document.querySelector('[data-filter="all"]')?.classList.remove('active');
                button.classList.toggle('active');
                activeFilter = button.classList.contains('active') ? button.dataset.filter : 'all';
            }
            if (document.querySelectorAll('.filter-btn.active').length === 0) {
                document.querySelector('[data-filter="all"]')?.classList.add('active');
                activeFilter = 'all';
            }
            filterGallery();
        });
    });

    let activeFilter = 'all';
    let searchTerm = '';

    const getGalleryState = () => {
        const saved = localStorage.getItem('gallery-items');
        if (saved) return JSON.parse(saved);
        return Array.from(document.querySelectorAll('.projects-grid .project-card')).map((card) => ({
            id: card.dataset.title?.toLowerCase().replace(/\s+/g, '-'),
            title: card.dataset.title || 'Untitled',
            image: card.dataset.image || card.querySelector('.project-image')?.src || '',
            medium: card.dataset.medium || '',
            status: card.dataset.status || '',
            size: card.dataset.size || '',
            price: card.dataset.price || '',
            description: card.dataset.description || '',
        }));
    };

    let galleryItems = getGalleryState();

    const saveGalleryState = (items) => {
        localStorage.setItem('gallery-items', JSON.stringify(items));
    };

    const renderGalleryGrid = () => {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = galleryItems.map((item) => `
            <article class="project-card reveal" data-medium="${item.medium}" data-status="${item.status}" data-title="${item.title}" data-image="${item.image}" data-size="${item.size}" data-price="${item.price}" data-description="${item.description}">
                <img class="project-image" src="${item.image}" alt="${item.title} painting by Farhad" loading="lazy" data-lightbox-src="${item.image}">
                <div class="project-info">
                    <div class="painting-badges">
                        <span class="badge ${item.status === 'Sold' ? 'badge-sold' : 'badge-available'}">${item.status || 'Available'}</span>
                    </div>
                    <span>${item.medium} • ${item.size}</span>
                    <h3>${item.title}</h3>
                    <p>${item.price}</p>
                    <button class="button small-button add-to-cart" type="button" data-title="${item.title}" data-price="${String(item.price).replace(/[^0-9]/g, '')}" data-image="${item.image}">Add to Cart</button>
                </div>
            </article>
        `).join('');
        bindGalleryCardEvents();
        applyGalleryFilters();
    };

    const getGalleryCards = () => document.querySelectorAll('.projects-grid .project-card');

    const applyGalleryFilters = () => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        getGalleryCards().forEach((card) => {
            const title = card.dataset.title?.toLowerCase() || '';
            const medium = (card.dataset.medium || '').toLowerCase();
            const status = (card.dataset.status || '').toLowerCase();
            const matchesSearch = title.includes(normalizedSearch);
            const matchesFilter = activeFilter === 'all' || medium.includes(activeFilter) || status === activeFilter;
            card.style.display = matchesSearch && matchesFilter ? '' : 'none';
        });
    };

    const bindGalleryCardEvents = () => {
        getGalleryCards().forEach((card) => {
            if (card.dataset.galleryBound === 'true') return;
            const image = card.querySelector('.project-image');

            card.addEventListener('click', (event) => {
                if (event.target.closest('.button, .small-button')) return;
                event.preventDefault();
                openLightbox(card);
            });

            image?.addEventListener('click', (event) => {
                event.stopPropagation();
                openLightbox(card);
            });

            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(card);
                }
            });

            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.dataset.galleryBound = 'true';
        });
    };

    const updateGalleryData = () => {
        saveGalleryState(galleryItems);
        renderGalleryEditor();
        renderGalleryGrid();
    };

    const renderGalleryEditor = () => {
        galleryEditList.innerHTML = galleryItems.map((item) => `
            <div class="gallery-edit-item" data-id="${item.id}">
                <div class="gallery-edit-fields">
                    <div class="gallery-edit-preview">
                        <img src="${item.image}" alt="${item.title}">
                        <p>${item.title}</p>
                    </div>
                    <input type="text" class="gallery-title-input" placeholder="Painting title" value="${item.title}">
                    <input type="text" class="gallery-image-input" placeholder="Image URL" value="${item.image}">
                    <input type="file" accept="image/*" class="gallery-upload-input">
                </div>
                <div class="gallery-edit-actions">
                    <button type="button" class="button secondary-button save-gallery-item">Save</button>
                    <button type="button" class="button secondary-button remove-gallery-item">Remove</button>
                </div>
            </div>
        `).join('');

        galleryEditList.querySelectorAll('.gallery-upload-input').forEach((input) => {
            input.addEventListener('change', (event) => {
                const file = event.target.files?.[0];
                const card = input.closest('.gallery-edit-item');
                if (!file || !card) return;
                const previewImage = card.querySelector('.gallery-edit-preview img');
                const reader = new FileReader();
                reader.onload = () => {
                    if (!previewImage) return;
                    previewImage.src = reader.result;
                    const itemId = card.dataset.id;
                    const item = galleryItems.find((entry) => entry.id === itemId);
                    if (item) {
                        item.image = reader.result;
                        updateGalleryData();
                    }
                };
                reader.readAsDataURL(file);
            });
        });

        galleryEditList.querySelectorAll('.save-gallery-item').forEach((btn) => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.gallery-edit-item');
                if (!card) return;
                const itemId = card.dataset.id;
                const titleInput = card.querySelector('.gallery-title-input');
                const imageInput = card.querySelector('.gallery-image-input');
                const item = galleryItems.find((entry) => entry.id === itemId);
                if (!item || !titleInput || !imageInput) return;
                item.title = titleInput.value.trim() || item.title;
                item.image = imageInput.value.trim() || item.image;
                updateGalleryData();
            });
        });

        galleryEditList.querySelectorAll('.remove-gallery-item').forEach((btn) => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.gallery-edit-item');
                if (!card) return;
                const itemId = card.dataset.id;
                galleryItems = galleryItems.filter((entry) => entry.id !== itemId);
                updateGalleryData();
            });
        });
    };

    const normalizePainting = (painting) => {
        const numericPrice = Number(String(painting.price ?? '').replace(/[^0-9.]/g, ''));
        const medium = painting.medium || '';
        const normalizedMedium = medium.toLowerCase();
        const normalizedStatus = (painting.status || 'available').toLowerCase();

        return {
            id: painting.id || painting.slug || painting.title?.toLowerCase().replace(/\s+/g, '-') || `painting-${Date.now()}`,
            title: painting.title || 'Untitled',
            slug: painting.slug || createSlugFromTitle(painting.title || ''),
            image: painting.image || 'images/paintings/Abstract 2 Canvas.png',
            medium,
            mediumKey: normalizedMedium.includes('oil') ? 'oil' : normalizedMedium.includes('mixed') ? 'mixed' : 'acrylic',
            status: normalizedStatus,
            size: painting.dimensions || painting.size || '',
            priceValue: Number.isFinite(numericPrice) ? numericPrice : 0,
            price: typeof painting.price === 'string' && painting.price.includes('$') ? painting.price : formatCurrency(numericPrice),
            description: painting.description || '',
            alt: painting.altText || `${painting.title || 'Artwork'} painting by Farhad`,
            featured: Boolean(painting.featured),
            year: painting.year || '',
        };
    };

    const createSlugFromTitle = (title = '') => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const renderFeaturedCollection = (items) => {
        const collectionGrid = document.querySelector('.featured-collection-grid');
        if (!collectionGrid || !items.length) return;

        collectionGrid.innerHTML = items.slice(0, 9).map((item) => `
            <article class="collection-card">
              <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async">
              <div class="collection-card-body">
                <h3>${item.title}</h3>
                <p class="card-subtitle">${formatMediumLabel(item.medium)}</p>
                <p class="card-meta">${item.size || 'Custom size'}</p>
                <p class="card-status">${item.status === 'sold' ? 'Sold' : item.status === 'reserved' ? 'Reserved' : 'Available'}</p>
                <p class="card-price">${item.price}</p>
                <div class="painting-actions">
                  <a class="button small-button secondary-button" href="${getArtworkPageHref(item.slug)}">View Artwork</a>
                  <button class="button small-button add-to-cart" type="button" data-title="${item.title}" data-price="${item.priceValue}" data-image="${item.image}">Add to Cart</button>
                </div>
              </div>
            </article>
        `).join('');
    };

    const renderHomepageFeature = (item) => {
        if (!item) return;

        const featureCard = document.querySelector('.painting-detail-section .painting-detail-card');
        if (!featureCard) return;

        const image = featureCard.querySelector('.painting-detail-image');
        const title = featureCard.querySelector('#painting-title');
        const metaRows = featureCard.querySelectorAll('.painting-meta div strong');
        const actionLink = featureCard.querySelector('.painting-actions .primary-button');
        const buyLink = featureCard.querySelector('.painting-actions .secondary-button');

        if (image) {
            image.src = item.image;
            image.alt = item.alt;
        }

        if (title) title.textContent = item.title;
        if (metaRows[0]) metaRows[0].textContent = item.price;
        if (metaRows[1]) metaRows[1].textContent = item.size || 'Custom size';
        if (metaRows[2]) metaRows[2].textContent = item.medium || 'Original artwork';
        if (metaRows[3]) metaRows[3].textContent = item.year || 'Current Collection';
        if (metaRows[4]) metaRows[4].textContent = item.status === 'sold' ? 'Sold' : item.status === 'reserved' ? 'Reserved' : 'Available';
        if (actionLink) actionLink.href = getArtworkPageHref(item.slug);
        if (buyLink) {
            buyLink.href = getArtworkPageHref(item.slug);
            buyLink.textContent = 'Buy Now';
        }
    };

    const applyArtworkTemplate = (painting) => {
        if (!painting) return;

        const bodySlug = document.body.dataset.artworkSlug;
        if (!bodySlug) return;

        document.title = `${painting.title} | Kabul Art`;

        const mainTitle = document.querySelector('#artwork-title, .painting-detail-info h1');
        const priceTag = document.querySelector('.price-tag, .price-amount');
        const description = document.querySelector('.lightbox-description');
        const mainImage = document.querySelector('[data-gallery-main], #artwork-main, #detail-main-image');
        const modalImage = document.querySelector('[data-gallery-modal-image], #viewer-modal-image');
        const thumbButton = document.querySelector('.thumb-btn.active');
        const availabilityBadge = document.querySelector('.availability-badge');
        const detailBadges = document.querySelector('.detail-badges');
        const metaRows = document.querySelectorAll('.painting-meta div');
        const specTerms = document.querySelectorAll('.artwork-specs dt');
        const addToCart = document.querySelector('[data-add-to-cart]');
        const wishlistButton = document.querySelector('[data-wishlist-button]');

        if (mainTitle) mainTitle.textContent = painting.title;
        if (priceTag) priceTag.textContent = painting.price;
        if (description && painting.description) description.textContent = painting.description;

        [mainImage, modalImage].forEach((imageNode) => {
            if (!imageNode) return;
            imageNode.src = painting.image;
            imageNode.alt = painting.alt;
        });

        if (thumbButton) {
            thumbButton.dataset.image = painting.image;
            thumbButton.dataset.alt = painting.alt;
            const thumbImage = thumbButton.querySelector('img');
            if (thumbImage) thumbImage.src = painting.image;
        }

        if (availabilityBadge) {
            availabilityBadge.textContent = painting.status === 'sold' ? 'Sold' : painting.status === 'reserved' ? 'Reserved' : 'In Stock';
        }

        if (detailBadges) {
            const availability = detailBadges.querySelector('.badge');
            if (availability) {
                availability.textContent = painting.status === 'sold' ? 'Sold' : painting.status === 'reserved' ? 'Reserved' : 'Available';
                availability.className = `badge ${painting.status === 'sold' ? 'badge-sold' : 'badge-available'}`;
            }
        }

        if (metaRows.length) {
            const values = [painting.price, painting.size || 'Custom size', painting.medium || 'Original artwork', painting.year || 'Current Collection', painting.status === 'sold' ? 'Sold' : painting.status === 'reserved' ? 'Reserved' : 'Available for worldwide shipping'];
            metaRows.forEach((row, index) => {
                const strong = row.querySelector('strong');
                if (strong && values[index]) strong.textContent = values[index];
            });
        }

        if (specTerms.length) {
            const valuesByLabel = {
                medium: painting.medium || 'Original artwork',
                dimensions: painting.size || 'Custom size',
                year: painting.year || 'Current Collection',
                availability: painting.status === 'sold' ? 'Sold' : painting.status === 'reserved' ? 'Reserved' : 'Available',
            };

            specTerms.forEach((term) => {
                const key = term.textContent.trim().toLowerCase();
                const valueNode = term.nextElementSibling;
                if (valueNode && valuesByLabel[key]) {
                    valueNode.textContent = valuesByLabel[key];
                }
            });
        }

        if (addToCart) {
            addToCart.dataset.id = painting.slug;
            addToCart.dataset.title = painting.title;
            addToCart.dataset.price = String(painting.priceValue);
            addToCart.dataset.image = painting.image;
            addToCart.dataset.size = painting.size || '';
        }

        if (wishlistButton) {
            wishlistButton.dataset.artworkId = painting.slug;
        }
    };

    const hydratePublicSite = async () => {
        let paintingsData = fallbackPaintings.map(normalizePainting);
        let settingsData = defaultPublicSettings;

        try {
            const [paintingsResponse, settingsResponse] = await Promise.all([
                fetchJson('/api/paintings'),
                fetchJson('/api/settings'),
            ]);

            if (Array.isArray(paintingsResponse.paintings) && paintingsResponse.paintings.length) {
                paintingsData = paintingsResponse.paintings.map(normalizePainting);
            }

            if (settingsResponse.settings) {
                settingsData = { ...defaultPublicSettings, ...settingsResponse.settings };
            }
        } catch (error) {
            // Static HTML remains as a graceful fallback when the API is unavailable.
        }

        applyPublicSettings(settingsData);

        if (galleryGrid) {
            galleryItems = paintingsData.map((item) => ({
                id: item.id,
                title: item.title,
                image: item.image,
                medium: item.mediumKey,
                status: item.status,
                size: item.size,
                price: item.price,
                description: item.description,
            }));
            renderGalleryGrid();
        }

        renderFeaturedCollection(paintingsData.filter((item) => item.featured || item.status === 'available'));
        renderHomepageFeature(paintingsData.find((item) => item.featured) || paintingsData[0]);

        const artworkSlug = document.body.dataset.artworkSlug;
        if (artworkSlug) {
            const matchingPainting = paintingsData.find((item) => item.slug === artworkSlug);
            if (matchingPainting) {
                applyArtworkTemplate(matchingPainting);
            }
        }
    };

    const addNewGalleryItem = () => {
        const newItem = {
            id: `painting-${Date.now()}`,
            title: 'New Painting',
            image: 'images/paintings/Abstract 2 Canvas.png',
            medium: 'Acrylic',
            status: 'Available',
            size: '16" × 20"',
            price: '$750',
            description: 'New painting added via gallery editor.',
        };
        galleryItems.push(newItem);
        updateGalleryData();
    };

    const adminBadge = document.getElementById('admin-badge');
    if (!isAdmin) {
        if (galleryAdminToggle) {
            galleryAdminToggle.classList.add('hidden');
            galleryAdminToggle.style.display = 'none';
        }
        if (galleryAdminPanel) {
            galleryAdminPanel.classList.add('hidden');
        }
        if (adminBadge) {
            adminBadge.classList.add('hidden');
        }
    } else if (adminBadge) {
        adminBadge.classList.remove('hidden');
    }

    const closeGalleryEditor = document.getElementById('close-gallery-editor');

    const setAdminEditorState = (isOpen) => {
        galleryAdminPanel?.classList.toggle('hidden', !isOpen);
        adminBadge?.classList.toggle('admin-active', isOpen);
        if (adminBadge) {
            adminBadge.textContent = isOpen ? 'Editing Gallery' : 'Admin Mode';
        }
    };

    if (galleryAdminToggle && galleryAdminPanel && isAdmin) {
        galleryAdminToggle.addEventListener('click', () => {
            const isPanelOpen = galleryAdminPanel.classList.contains('hidden');
            setAdminEditorState(isPanelOpen);
        });
    }

    if (closeGalleryEditor && isAdmin) {
        closeGalleryEditor.addEventListener('click', () => {
            setAdminEditorState(false);
        });
    }

    if (addGalleryItem && isAdmin) {
        addGalleryItem.addEventListener('click', addNewGalleryItem);
    }

    if (saveAdminThemeButton && isAdmin) {
        saveAdminThemeButton.addEventListener('click', () => {
            const theme = collectThemeFromInputs();
            saveThemeState(theme);
            applyTheme(theme);
        });
    }

    if (resetAdminThemeButton && isAdmin) {
        resetAdminThemeButton.addEventListener('click', () => {
            localStorage.removeItem('kabulArtTheme');
            const theme = { ...defaultTheme };
            applyTheme(theme);
            updateAdminInputs(theme, getSavedContent());
        });
    }

    if (saveAdminContentButton && isAdmin) {
        saveAdminContentButton.addEventListener('click', () => {
            const content = collectContentFromInputs();
            saveContentState(content);
            applyContent(content);
        });
    }

    if (isAdmin && galleryEditList) renderGalleryEditor();

    bindGalleryCardEvents();
    hydratePublicSite();

    // Lightbox Functionality
    const openLightbox = (cardOrSource, titleOverride) => {
        if (!lightbox || !lightboxImage) return;

        let src = '';
        let alt = 'Artwork preview';
        let cardTitle = 'Artwork';
        let cardMedium = 'Original artwork';
        let cardSize = 'Custom size';
        let cardPrice = 'Contact for price';
        let cardDescription = 'A one-of-a-kind painting crafted with intention and care.';

        if (cardOrSource && typeof cardOrSource === 'object' && 'querySelector' in cardOrSource) {
            const card = cardOrSource;
            const image = card.querySelector('.project-image');
            src = card.dataset.image || image?.dataset.lightboxSrc || image?.getAttribute('src');
            alt = image?.alt || 'Artwork preview';
            cardTitle = card.dataset.title || 'Artwork';
            cardMedium = card.dataset.medium || 'Original artwork';
            cardSize = card.dataset.size || 'Custom size';
            cardPrice = card.dataset.price || 'Contact for price';
            cardDescription = card.dataset.description || 'A one-of-a-kind painting crafted with intention and care.';
        } else if (typeof cardOrSource === 'string') {
            src = cardOrSource;
            alt = titleOverride || 'Artwork preview';
            cardTitle = titleOverride || 'Artwork';
        }

        lightboxImage.src = src;
        lightboxImage.alt = alt;
        if (lightboxTitle) lightboxTitle.textContent = cardTitle;
        if (lightboxMedium) lightboxMedium.textContent = cardMedium;
        if (lightboxSize) lightboxSize.textContent = cardSize;
        if (lightboxPrice) lightboxPrice.textContent = cardPrice;
        if (lightboxDescription) lightboxDescription.textContent = cardDescription;
        
        const lightboxAddToCart = document.getElementById('lightbox-add-to-cart');
        if (lightboxAddToCart) {
            lightboxAddToCart.dataset.id = cardTitle.toLowerCase().replace(/\s+/g, '-') || 'artwork';
            lightboxAddToCart.dataset.title = cardTitle;
            lightboxAddToCart.dataset.price = cardPrice?.replace('$', '').replace(',', '') || '0';
            lightboxAddToCart.dataset.image = src;
            lightboxAddToCart.dataset.size = cardSize;
        }
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        lockScroll('lightbox');
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        unlockScroll('lightbox');
    };

    document.addEventListener('click', (event) => {
        const detailButton = event.target.closest('.view-details');
        if (detailButton) {
            event.preventDefault();
            openLightbox(detailButton.dataset.image, detailButton.dataset.title);
        }
    });

    bindGalleryCardEvents();

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox?.classList.contains('active')) {
            closeLightbox();
        }
    });

    const createZoomSurface = (stage, image, zoomLabel, options = {}) => {
        if (!stage || !image) return null;

        const config = {
            minScale: 1,
            maxScale: options.maxScale || 4,
            wheelStep: options.wheelStep || 0.24,
            pinchPadding: options.pinchPadding || 0.2,
        };

        const state = {
            scale: 1,
            x: 0,
            y: 0,
            pointers: new Map(),
            pinchStartDistance: 0,
            pinchStartScale: 1,
            pinchAnchor: { x: 0, y: 0 },
            dragStart: null,
            lastTapMoved: false,
        };

        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

        const updateZoomLabel = () => {
            if (zoomLabel) {
                zoomLabel.textContent = `${state.scale.toFixed(1)}×`;
            }
        };

        const getLimits = () => {
            const stageRect = stage.getBoundingClientRect();
            const baseWidth = image.offsetWidth || image.clientWidth || stageRect.width;
            const baseHeight = image.offsetHeight || image.clientHeight || stageRect.height;
            const overflowX = Math.max(0, ((baseWidth * state.scale) - stageRect.width) / 2);
            const overflowY = Math.max(0, ((baseHeight * state.scale) - stageRect.height) / 2);

            return {
                x: overflowX,
                y: overflowY,
            };
        };

        const clampPan = () => {
            const limits = getLimits();
            state.x = clamp(state.x, -limits.x, limits.x);
            state.y = clamp(state.y, -limits.y, limits.y);
        };

        const render = () => {
            if (state.scale <= 1) {
                state.x = 0;
                state.y = 0;
            } else {
                clampPan();
            }

            image.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
            image.style.cursor = state.scale > 1 ? 'grab' : 'zoom-in';
            updateZoomLabel();
        };

        const setAspectRatio = () => {
            if (image.naturalWidth && image.naturalHeight) {
                stage.style.setProperty('--artwork-aspect-ratio', `${image.naturalWidth} / ${image.naturalHeight}`);
            }
        };

        const setLoadingState = (isLoading) => {
            stage.classList.toggle('is-loading', isLoading);
        };

        const handleImageReady = () => {
            setAspectRatio();
            setLoadingState(false);
            render();
        };

        const syncImageState = () => {
            setLoadingState(true);

            if (image.complete && image.naturalWidth > 0) {
                handleImageReady();
                return;
            }

            image.addEventListener('load', handleImageReady, { once: true });
            image.addEventListener('error', () => setLoadingState(false), { once: true });
        };

        const zoomTo = (nextScale, origin) => {
            const clampedScale = clamp(nextScale, config.minScale, config.maxScale);
            const previousScale = state.scale;

            if (clampedScale === previousScale) return;

            if (origin && previousScale > 0) {
                const ratio = clampedScale / previousScale;
                state.x = origin.x - ((origin.x - state.x) * ratio);
                state.y = origin.y - ((origin.y - state.y) * ratio);
            }

            state.scale = clampedScale;
            render();
        };

        const zoomBy = (delta, origin) => {
            zoomTo(state.scale + delta, origin);
        };

        const reset = () => {
            state.scale = 1;
            state.x = 0;
            state.y = 0;
            render();
        };

        const getPointerDistance = () => {
            const points = Array.from(state.pointers.values());
            if (points.length < 2) return 0;

            const [first, second] = points;
            return Math.hypot(second.x - first.x, second.y - first.y);
        };

        const getPointerMidpoint = () => {
            const points = Array.from(state.pointers.values());
            if (points.length < 2) return { x: 0, y: 0 };

            const [first, second] = points;
            const rect = stage.getBoundingClientRect();

            return {
                x: ((first.x + second.x) / 2) - rect.left - (rect.width / 2),
                y: ((first.y + second.y) / 2) - rect.top - (rect.height / 2),
            };
        };

        stage.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = stage.getBoundingClientRect();
            const origin = {
                x: event.clientX - rect.left - (rect.width / 2),
                y: event.clientY - rect.top - (rect.height / 2),
            };
            const direction = event.deltaY < 0 ? config.wheelStep : -config.wheelStep;
            zoomBy(direction, origin);
        }, { passive: false });

        stage.addEventListener('pointerdown', (event) => {
            state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            state.lastTapMoved = false;

            if (state.pointers.size === 1 && state.scale > 1) {
                stage.setPointerCapture(event.pointerId);
                state.dragStart = {
                    x: event.clientX - state.x,
                    y: event.clientY - state.y,
                };
            }

            if (state.pointers.size === 2) {
                state.pinchStartDistance = getPointerDistance();
                state.pinchStartScale = state.scale;
                state.pinchAnchor = getPointerMidpoint();
            }
        });

        stage.addEventListener('pointermove', (event) => {
            if (!state.pointers.has(event.pointerId)) return;

            const previous = state.pointers.get(event.pointerId);
            state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

            if (previous && (Math.abs(event.clientX - previous.x) > 3 || Math.abs(event.clientY - previous.y) > 3)) {
                state.lastTapMoved = true;
            }

            if (state.pointers.size === 2) {
                const nextDistance = getPointerDistance();
                if (state.pinchStartDistance > 0) {
                    const scaleFactor = nextDistance / state.pinchStartDistance;
                    zoomTo(state.pinchStartScale * scaleFactor, state.pinchAnchor);
                }
                return;
            }

            if (state.dragStart && state.scale > 1) {
                state.x = event.clientX - state.dragStart.x;
                state.y = event.clientY - state.dragStart.y;
                render();
            }
        });

        const clearPointer = (event) => {
            state.pointers.delete(event.pointerId);
            if (state.pointers.size < 2) {
                state.pinchStartDistance = 0;
            }
            if (state.pointers.size === 0) {
                state.dragStart = null;
            }
        };

        stage.addEventListener('pointerup', clearPointer);
        stage.addEventListener('pointercancel', clearPointer);
        stage.addEventListener('pointerleave', clearPointer);

        updateZoomLabel();
        syncImageState();

        return {
            zoomBy,
            zoomTo,
            reset,
            syncImageState,
            get scale() {
                return state.scale;
            },
            get moved() {
                return state.lastTapMoved;
            },
        };
    };

    const initArtworkGalleries = () => {
        const galleries = document.querySelectorAll('[data-artwork-gallery]');

        galleries.forEach((gallery) => {
            const mainStage = gallery.querySelector('[data-gallery-stage="main"]');
            const mainImage = gallery.querySelector('[data-gallery-main]');
            const modal = gallery.querySelector('.artwork-viewer-modal');
            const modalStage = gallery.querySelector('[data-gallery-stage="modal"]');
            const modalImage = gallery.querySelector('[data-gallery-modal-image]');
            const modalCloseButton = gallery.querySelector('.artwork-viewer-close');
            const zoomLabel = gallery.querySelector('[data-gallery-zoom-label]');
            const thumbs = Array.from(gallery.querySelectorAll('.thumb-btn'));

            if (!mainStage || !mainImage || !modal || !modalStage || !modalImage) return;

            const mainSurface = createZoomSurface(mainStage, mainImage, null, { maxScale: 3.5, wheelStep: 0.18 });
            const modalSurface = createZoomSurface(modalStage, modalImage, zoomLabel, { maxScale: 5, wheelStep: 0.22 });

            const setActiveThumb = (activeButton) => {
                thumbs.forEach((button) => {
                    const isActive = button === activeButton;
                    button.classList.toggle('active', isActive);
                    button.setAttribute('aria-selected', String(isActive));
                });
            };

            const updateGalleryImage = (src, alt, activeButton) => {
                if (!src) return;

                gallery.classList.add('is-switching');

                mainImage.src = src;
                mainImage.alt = alt;
                modalImage.src = src;
                modalImage.alt = alt;

                mainSurface?.reset();
                modalSurface?.reset();
                mainSurface?.syncImageState();
                modalSurface?.syncImageState();

                setActiveThumb(activeButton);

                window.setTimeout(() => {
                    gallery.classList.remove('is-switching');
                }, 220);
            };

            const openModal = () => {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                lockScroll('artwork-modal');
                modalSurface?.reset();
                modalSurface?.syncImageState();
            };

            const closeModal = () => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                unlockScroll('artwork-modal');
                modalSurface?.reset();
            };

            thumbs.forEach((button) => {
                button.addEventListener('click', () => {
                    const imageSrc = button.dataset.image;
                    const imageAlt = button.dataset.alt || mainImage.alt;
                    updateGalleryImage(imageSrc, imageAlt, button);
                });
            });

            mainStage.addEventListener('click', () => {
                if (!mainSurface?.moved) {
                    openModal();
                }
            });

            mainStage.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal();
                }
            });

            gallery.querySelectorAll('[data-gallery-control]').forEach((button) => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    const surface = button.dataset.gallerySurface === 'main' ? mainSurface : modalSurface;
                    const action = button.dataset.galleryControl;

                    if (action === 'fullscreen') {
                        openModal();
                        return;
                    }

                    if (!surface) return;

                    if (action === 'zoom-in') {
                        surface.zoomBy(0.3);
                    } else if (action === 'zoom-out') {
                        surface.zoomBy(-0.3);
                    } else if (action === 'reset') {
                        surface.reset();
                    }
                });
            });

            modalCloseButton?.addEventListener('click', closeModal);

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });

            if (thumbs.length > 0) {
                const activeThumb = thumbs.find((button) => button.classList.contains('active')) || thumbs[0];
                updateGalleryImage(activeThumb.dataset.image || mainImage.src, activeThumb.dataset.alt || mainImage.alt, activeThumb);
            } else {
                mainSurface?.syncImageState();
                modalSurface?.syncImageState();
            }
        });
    };

    const initArtworkWishlist = () => {
        const wishlistButton = document.querySelector('[data-wishlist-button], #save-wishlist, .wishlist-button');
        if (!wishlistButton) return;

        const addToCartButton = document.querySelector('[data-add-to-cart]');
        const artworkId = wishlistButton.dataset.artworkId || addToCartButton?.dataset.id;
        if (!artworkId) return;

        const updateWishlistButton = (isWishlisted) => {
            wishlistButton.classList.toggle('wishlisted', isWishlisted);
            wishlistButton.innerHTML = isWishlisted ? '&#9829; Saved to Wishlist' : '&#9825; Save to Wishlist';
            wishlistButton.setAttribute('aria-pressed', String(isWishlisted));
        };

        wishlistButton.addEventListener('click', () => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            const wishlistIndex = wishlist.indexOf(artworkId);

            if (wishlistIndex >= 0) {
                wishlist.splice(wishlistIndex, 1);
            } else {
                wishlist.push(artworkId);
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistButton(wishlist.includes(artworkId));
        });

        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        updateWishlistButton(wishlist.includes(artworkId));
    };

    const initStickyPurchaseBar = () => {
        if (window.innerWidth > 768) return;

        const purchaseSection = document.querySelector('.painting-actions, .artwork-actions');
        const footer = document.querySelector('.site-footer');
        if (!purchaseSection) return;

        const title = document.querySelector('.painting-detail-info h1, .artwork-header h1')?.textContent?.trim() || 'Artwork';
        const priceText = document.querySelector('.price-tag, .price-amount, .painting-meta strong')?.textContent?.trim() || 'Contact for price';
        const stickySource = purchaseSection.querySelector('.secondary-button[href], .primary-button[href], [data-add-to-cart], .button');
        if (!stickySource) return;

        document.body.classList.add('page-has-sticky-purchase');

        const stickyBar = document.createElement('div');
        stickyBar.className = 'sticky-purchase-bar';
        stickyBar.setAttribute('aria-hidden', 'true');

        const summary = document.createElement('div');
        summary.className = 'sticky-purchase-summary';
        summary.innerHTML = `<span>${title}</span><strong>${priceText}</strong>`;

        let action;
        if (stickySource.tagName === 'A') {
            action = document.createElement('a');
            action.href = stickySource.getAttribute('href') || '#contact';
        } else {
            action = document.createElement('button');
            action.type = 'button';
            Array.from(stickySource.attributes).forEach((attribute) => {
                if (attribute.name.startsWith('data-')) {
                    action.setAttribute(attribute.name, attribute.value);
                }
            });
        }

        action.className = stickySource.className;
        action.textContent = stickySource.textContent?.trim() || 'Buy Now';

        stickyBar.append(summary, action);
        document.body.appendChild(stickyBar);

        const setStickyVisibility = (isVisible) => {
            stickyBar.classList.toggle('is-visible', isVisible);
            stickyBar.setAttribute('aria-hidden', String(!isVisible));
            document.body.style.setProperty('--sticky-purchase-height', `${stickyBar.offsetHeight || 88}px`);
            document.body.classList.toggle('has-sticky-purchase-bar', isVisible);
        };

        const purchaseObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setStickyVisibility(!entry.isIntersecting);
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px',
        });

        purchaseObserver.observe(purchaseSection);

        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                const footerEntry = entries[0];
                if (!footerEntry) return;
                if (footerEntry.isIntersecting) {
                    setStickyVisibility(false);
                }
            }, {
                threshold: 0.12,
            });

            footerObserver.observe(footer);
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                stickyBar.remove();
                document.body.classList.remove('page-has-sticky-purchase', 'has-sticky-purchase-bar');
            } else {
                document.body.style.setProperty('--sticky-purchase-height', `${stickyBar.offsetHeight || 88}px`);
            }
        }, { passive: true });
    };

    initArtworkGalleries();
    initArtworkWishlist();
    initStickyPurchaseBar();

    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SHOPPING CART =====
    let cart = [];
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartTrigger = document.getElementById('cart-trigger');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-btn');

    function updateCart() {
        if (!cartItemsContainer || !cartTotalAmount) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" width="70" height="70" style="object-fit:cover" alt="${item.title}">
                    <div>
                        <h4>${item.title}</h4>
                        <p>$${item.price}</p>
                        <button onclick="removeFromCart(${index})" style="color:red">Remove</button>
                    </div>
                </div>
            `;
        });

        cartTotalAmount.textContent = total;
        if (cartCount) cartCount.textContent = cart.length;
    }

    function addToCart(title, price, image) {
        cart.push({ title, price, image });
        updateCart();
        alert(`${title} added to cart!`);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    window.addToCart = addToCart;
    window.updateCart = updateCart;
    window.removeFromCart = removeFromCart;

    const openCart = () => {
        cartSidebar?.classList.add('open');
        cartOverlay?.classList.add('active');
        cartSidebar?.setAttribute('aria-hidden', 'false');
        cartOverlay?.setAttribute('aria-hidden', 'false');
        lockScroll('cart');
    };

    const closeCart = () => {
        cartSidebar?.classList.remove('open');
        cartOverlay?.classList.remove('active');
        cartSidebar?.setAttribute('aria-hidden', 'true');
        cartOverlay?.setAttribute('aria-hidden', 'true');
        unlockScroll('cart');
    };

    if (cartTrigger) {
        cartTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            openCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeMenu();
        }
        if (event.key === 'Escape' && cartSidebar?.classList.contains('open')) {
            closeCart();
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const title = event.target.dataset.title;
            const price = parseInt(event.target.dataset.price);
            const image = event.target.dataset.image;
            addToCart(title, price, image);
        }
    });

    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const title = btn.dataset.title || 'Artwork';
            const price = parseInt(btn.dataset.price) || 0;
            const image = btn.dataset.image || 'images/paintings/Abstract 2 Canvas.png';

            addToCart(title, price, image);
            openCart();
        });
    });

    // Initialize cart UI
    updateCart();

    // ===== CONTACT FORM AUTO-FILL (from checkout) =====
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const pendingOrder = localStorage.getItem('pending-order');

    if (pendingOrder && contactForm) {
        const orderData = JSON.parse(pendingOrder);
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');

        if (nameField) nameField.value = orderData.name;
        if (emailField) emailField.value = orderData.email;
        if (messageField) messageField.value = orderData.message;

        // Auto-scroll to contact form
        setTimeout(() => {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);

        // Clear pending order after use
        localStorage.removeItem('pending-order');
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea, select');

            inputs.forEach((input) => {
                const errorMessage = input.parentElement?.querySelector('.error-message');

                if (!input.value.trim()) {
                    isValid = false;
                    if (errorMessage) {
                        errorMessage.textContent = 'This field is required';
                    }
                } else if (errorMessage) {
                    errorMessage.textContent = '';
                }
            });

            if (isValid && formStatus) {
                formStatus.textContent = "Thank you! Your message has been sent successfully. I'll reply soon.";
                formStatus.style.color = 'green';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }
});
