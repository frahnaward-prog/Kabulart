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

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMedium = document.getElementById('lightbox-medium');
    const lightboxSize = document.getElementById('lightbox-size');
    const lightboxPrice = document.getElementById('lightbox-price');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const searchInput = document.getElementById('gallery-search');
    const filterButtons = document.querySelectorAll('.filter-pills button');
    const galleryAdminToggle = document.getElementById('gallery-admin-toggle');
    const galleryAdminPanel = document.getElementById('gallery-admin-panel');
    const addGalleryItem = document.getElementById('add-gallery-item');
    const galleryEditList = document.getElementById('gallery-edit-list');
    const galleryGrid = document.querySelector('.projects-grid');

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
    const siteLogo = document.querySelector('.logo');

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
        siteLogo: 'Kabul Art',
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
        if (siteLogo) siteLogo.textContent = content.siteLogo || defaultContent.siteLogo;
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
                    <a href="${item.id || 'golden-horizon'}.html" class="button small-button">View Details</a>
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

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchTerm = event.target.value;
            applyGalleryFilters();
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            activeFilter = button.dataset.filter || 'all';
            applyGalleryFilters();
        });
    });

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
            image: 'images/paintings/Abstract 2 Canvas.HEIC',
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
        galleryAdminToggle?.classList.add('hidden');
        galleryAdminPanel?.classList.add('hidden');
        adminBadge?.classList.add('hidden');
    } else {
        adminBadge?.classList.remove('hidden');
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

    renderGalleryGrid();
    if (isAdmin) renderGalleryEditor();

    const openLightbox = (card) => {
        if (!lightbox || !lightboxImage) return;

        const image = card.querySelector('.project-image');
        const src = card.dataset.image || image?.dataset.lightboxSrc || image?.getAttribute('src');
        const alt = image?.alt || 'Artwork preview';

        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightboxTitle.textContent = card.dataset.title || 'Artwork';
        lightboxMedium.textContent = card.dataset.medium || 'Original artwork';
        lightboxSize.textContent = card.dataset.size || 'Custom size';
        lightboxPrice.textContent = card.dataset.price || 'Contact for price';
        lightboxDescription.textContent = card.dataset.description || 'A one-of-a-kind painting crafted with intention and care.';
        
        // Set cart button attributes
        const lightboxAddToCart = document.getElementById('lightbox-add-to-cart');
        if (lightboxAddToCart) {
            lightboxAddToCart.dataset.id = card.dataset.title?.toLowerCase().replace(/\s+/g, '-') || 'artwork';
            lightboxAddToCart.dataset.title = card.dataset.title || 'Artwork';
            lightboxAddToCart.dataset.price = card.dataset.price?.replace('$', '').replace(',', '') || '0';
            lightboxAddToCart.dataset.image = src;
            lightboxAddToCart.dataset.size = card.dataset.size || 'Custom size';
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
        document.body.style.overflow = '';
    };

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
        if (event.key === 'Escape') {
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
    const cart = {
        items: JSON.parse(localStorage.getItem('cart-items')) || [],
    };

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartTrigger = document.getElementById('cart-trigger');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    const saveCart = () => {
        localStorage.setItem('cart-items', JSON.stringify(cart.items));
    };

    const updateCartUI = () => {
        cartCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <p class="cart-empty-hint">Add artworks to get started</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.items.map((item) => `
                <div class="cart-item" data-id="${item.id}">
                    <img class="cart-item-image" src="${item.image}" alt="${item.title}">
                    <div class="cart-item-content">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-meta">${item.size}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-button" data-action="decrease">−</button>
                            <div class="quantity-display">${item.quantity}</div>
                            <button class="quantity-button" data-action="increase">+</button>
                            <button class="cart-remove-button" data-action="remove">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Attach quantity control listeners
            document.querySelectorAll('.cart-item').forEach((itemEl) => {
                const itemId = itemEl.dataset.id;
                itemEl.querySelectorAll('.quantity-button').forEach((btn) => {
                    btn.addEventListener('click', () => {
                        const action = btn.dataset.action;
                        const cartItem = cart.items.find((i) => i.id === itemId);
                        if (action === 'increase') cartItem.quantity++;
                        if (action === 'decrease' && cartItem.quantity > 1) cartItem.quantity--;
                        saveCart();
                        updateCartUI();
                    });
                });

                itemEl.querySelector('.cart-remove-button').addEventListener('click', () => {
                    cart.items = cart.items.filter((i) => i.id !== itemId);
                    saveCart();
                    updateCartUI();
                });
            });
        }

        // Update totals
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;
        cartTotal.textContent = `$${subtotal.toLocaleString()}`;
    };

    const openCart = () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        cartSidebar.setAttribute('aria-hidden', 'false');
        cartOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        cartSidebar.setAttribute('aria-hidden', 'true');
        cartOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (cartTrigger) {
        cartTrigger.addEventListener('click', openCart);
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && cartSidebar.classList.contains('active')) {
            closeCart();
        }
    });

    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const title = btn.dataset.title || 'Artwork';
            const price = parseInt(btn.dataset.price) || 0;
            const image = btn.dataset.image || 'images/paintings/Abstract 2 Canvas.HEIC';
            const size = btn.dataset.size || 'Custom';
            const id = btn.dataset.id || `item-${Date.now()}`;

            const existingItem = cart.items.find((item) => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.items.push({ id, title, price, image, size, quantity: 1 });
            }

            saveCart();
            updateCartUI();
            openCart();
        });
    });

    // Initialize cart UI
    updateCartUI();

    // ===== CONTACT FORM AUTO-FILL (from checkout) =====
    const contactForm = document.getElementById('contact-form');
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
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(contactForm);
            const errors = {};
            let isValid = true;

            // Validate name
            if (!formData.get('name')?.trim()) {
                errors.name = 'Name is required';
                isValid = false;
            }

            // Validate email
            const email = formData.get('email')?.trim();
            if (!email) {
                errors.email = 'Email is required';
                isValid = false;
            } else if (!email.includes('@')) {
                errors.email = 'Please enter a valid email';
                isValid = false;
            }

            // Validate message
            if (!formData.get('message')?.trim()) {
                errors.message = 'Message is required';
                isValid = false;
            }

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            if (!isValid) {
                Object.entries(errors).forEach(([field, message]) => {
                    const input = contactForm.querySelector(`[name="${field}"]`);
                    if (input?.parentElement) {
                        const errorEl = input.parentElement.querySelector('.error-message');
                        if (errorEl) errorEl.textContent = message;
                    }
                });
                return;
            }

            // Show success state
            const formStatus = document.getElementById('form-status');
            if (formStatus) {
                formStatus.textContent = 'Thank you! Your message has been sent. We will respond within 48 hours.';
                formStatus.style.color = '#C8A96A';
            }

            // Here you would typically send the data to a server
            // For now, we'll just show success and reset the form
            setTimeout(() => {
                contactForm.reset();
                if (formStatus) formStatus.textContent = '';
            }, 3000);
        });
    }
});