document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Script loaded - Kabul Art website");

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

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    window.addEventListener('scroll', updateActiveLink);
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
        const searchTerm = searchInput?.value.toLowerCase().trim() || '';
        const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active')).map((btn) => btn.dataset.filter);

        const filtered = paintings.filter((painting) => {
            const matchesSearch = painting.title.toLowerCase().includes(searchTerm);
            const matchesFilter = activeFilters.includes('all') ||
                activeFilters.includes(painting.medium) ||
                (activeFilters.includes('available') && painting.status === 'available');
            return matchesSearch && matchesFilter;
        });

        renderGallery(filtered);
    };

    // Event Listeners
    searchInput?.addEventListener('input', filterGallery);

    document.querySelectorAll('.filter-btn').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.filter === 'all') {
                document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
            } else {
                document.querySelector('[data-filter="all"]')?.classList.remove('active');
                button.classList.toggle('active');
            }
            if (document.querySelectorAll('.filter-btn.active').length === 0) {
                document.querySelector('[data-filter="all"]')?.classList.add('active');
            }
            filterGallery();
        });
    });

    // Initial load
    renderGallery(paintings);

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
            const medium = card.dataset.medium || '';
            const status = card.dataset.status || '';
            const matchesSearch = title.includes(normalizedSearch);
            const matchesFilter = activeFilter === 'all' || medium === activeFilter || status === activeFilter;
            card.style.display = matchesSearch && matchesFilter ? '' : 'none';
        });
    };

    const bindGalleryCardEvents = () => {
        getGalleryCards().forEach((card) => {
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
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        document.body.style.overflow = 'visible';
    };

    document.addEventListener('click', (event) => {
        const detailButton = event.target.closest('.view-details');
        if (detailButton) {
            event.preventDefault();
            openLightbox(detailButton.dataset.image, detailButton.dataset.title);
        }
    });

    document.querySelectorAll('.project-card').forEach((card) => {
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
    });

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

    const detailImage = document.getElementById('detail-main-image');
    const thumbButtons = document.querySelectorAll('.thumb-btn');
    const viewerModal = document.getElementById('artwork-viewer-modal');
    const viewerModalImage = document.getElementById('viewer-modal-image');
    const viewerZoomLabel = document.getElementById('viewer-zoom-label');
    const viewerCloseButton = document.querySelector('.artwork-viewer-close');
    let currentZoom = 1;

    const setViewerZoom = (zoomValue) => {
        if (!viewerModalImage) return;
        currentZoom = Math.min(2.6, Math.max(1, zoomValue));
        viewerModalImage.style.transform = `scale(${currentZoom})`;
        if (viewerZoomLabel) {
            viewerZoomLabel.textContent = `${currentZoom.toFixed(1)}×`;
        }
    };

    const openViewerModal = () => {
        if (!viewerModal || !viewerModalImage || !detailImage) return;
        viewerModalImage.src = detailImage.src;
        viewerModalImage.alt = detailImage.alt;
        setViewerZoom(1);
        viewerModal.classList.add('active');
        viewerModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeViewerModal = () => {
        if (!viewerModal) return;
        viewerModal.classList.remove('active');
        viewerModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (detailImage) {
        detailImage.addEventListener('click', openViewerModal);
    }

    thumbButtons.forEach((button) => {
        button.addEventListener('click', () => {
            thumbButtons.forEach((thumb) => thumb.classList.remove('active'));
            button.classList.add('active');
            const imageSrc = button.dataset.image;
            const imageAlt = button.dataset.alt || 'Artwork preview';
            if (detailImage && imageSrc) {
                detailImage.src = imageSrc;
                detailImage.alt = imageAlt;
            }
        });
    });

    document.querySelectorAll('[data-action="zoom-in"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            setViewerZoom(currentZoom + 0.25);
        });
    });

    document.querySelectorAll('[data-action="zoom-out"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            setViewerZoom(currentZoom - 0.25);
        });
    });

    document.querySelectorAll('[data-action="reset"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            setViewerZoom(1);
        });
    });

    document.querySelectorAll('[data-action="fullscreen"]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            openViewerModal();
        });
    });

    if (viewerCloseButton) {
        viewerCloseButton.addEventListener('click', closeViewerModal);
    }

    if (viewerModal) {
        viewerModal.addEventListener('click', (event) => {
            if (event.target === viewerModal) {
                closeViewerModal();
            }
        });
    }

    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('visible', window.scrollY > 500);
        });

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
    };

    const closeCart = () => {
        cartSidebar?.classList.remove('open');
        cartOverlay?.classList.remove('active');
        cartSidebar?.setAttribute('aria-hidden', 'true');
        cartOverlay?.setAttribute('aria-hidden', 'true');
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
