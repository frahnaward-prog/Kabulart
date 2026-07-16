(function initAdminApp() {
    const page = document.body.dataset.page;
    const statusNode = document.querySelector("[data-admin-status]");

    const setStatus = (message, tone = "") => {
        if (!statusNode) return;
        statusNode.textContent = message || "";
        statusNode.className = `admin-status${tone ? ` ${tone}` : ""}`;
    };

    const request = async (url, options = {}) => {
        const response = await fetch(url, {
            credentials: "same-origin",
            ...options,
        });

        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            throw new Error(data?.error || "Request failed.");
        }

        return data;
    };

    const requireSession = async () => {
        try {
            return await request("/api/admin/session");
        } catch (error) {
            window.location.href = "/admin";
            return null;
        }
    };

    const bindLogout = () => {
        const logoutButtons = document.querySelectorAll("[data-admin-logout]");
        logoutButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                try {
                    await request("/api/admin/logout", { method: "POST" });
                } finally {
                    window.location.href = "/admin";
                }
            });
        });
    };

    const renderPaintingList = (paintings) => {
        const list = document.getElementById("paintings-list");
        if (!list) return;

        if (!paintings.length) {
            list.innerHTML = `<div class="admin-empty">No paintings yet. Add your first artwork to start managing the collection.</div>`;
            return;
        }

        list.innerHTML = paintings.map((painting) => `
            <article class="painting-row">
                <img src="/${painting.image || "images/paintings/Abstract 2 Canvas.png"}" alt="${painting.altText || painting.title}">
                <div>
                    <h3>${painting.title}</h3>
                    <p>$${Number(painting.price).toLocaleString()} • ${painting.medium || "Medium not set"}</p>
                    <p>${painting.dimensions || "Dimensions not set"} • ${painting.year || "Year not set"}</p>
                    <span class="admin-badge ${painting.status}">${painting.status}</span>
                </div>
                <div class="painting-row-actions">
                    <a class="admin-button secondary" href="/admin/edit-painting?id=${painting.id}">Edit</a>
                    <button class="admin-button danger" type="button" data-delete-painting="${painting.id}">Delete</button>
                </div>
            </article>
        `).join("");

        list.querySelectorAll("[data-delete-painting]").forEach((button) => {
            button.addEventListener("click", async () => {
                const paintingId = button.getAttribute("data-delete-painting");
                const confirmed = window.confirm("Delete this painting? This cannot be undone.");
                if (!confirmed) return;

                try {
                    await request(`/api/admin/paintings/${paintingId}`, { method: "DELETE" });
                    await loadDashboardData();
                    setStatus("Painting deleted.", "success");
                } catch (error) {
                    setStatus(error.message, "error");
                }
            });
        });
    };

    const fillSettingsForm = (settings) => {
        const form = document.getElementById("settings-form");
        if (!form) return;

        form.heroTitle.value = settings.hero_title || "";
        form.heroCopy.value = settings.hero_copy || "";
        form.contactHeading.value = settings.contact_heading || "";
        form.contactIntroTitle.value = settings.contact_intro_title || "";
        form.contactIntroCopy.value = settings.contact_intro_copy || "";
        form.contactEmail.value = settings.contact_email || "";
        form.contactPhone.value = settings.contact_phone || "";
        form.instagramUrl.value = settings.instagram_url || "";
        form.facebookUrl.value = settings.facebook_url || "";
        form.pinterestUrl.value = settings.pinterest_url || "";
        form.shippingNote.value = settings.shipping_note || "";
        form.footerBlurb.value = settings.footer_blurb || "";
        form.footerEmail.value = settings.footer_email || "";
        form.footerCopyright.value = settings.footer_copyright || "";
    };

    const loadDashboardData = async () => {
        const [paintingsResponse, settingsResponse] = await Promise.all([
            request("/api/admin/paintings"),
            request("/api/admin/settings"),
        ]);

        renderPaintingList(paintingsResponse.paintings || []);
        fillSettingsForm(settingsResponse.settings || {});

        const totalNode = document.getElementById("paintings-total");
        const featuredNode = document.getElementById("paintings-featured");
        const availableNode = document.getElementById("paintings-available");

        if (totalNode) totalNode.textContent = String((paintingsResponse.paintings || []).length);
        if (featuredNode) featuredNode.textContent = String((paintingsResponse.paintings || []).filter((item) => item.featured).length);
        if (availableNode) availableNode.textContent = String((paintingsResponse.paintings || []).filter((item) => item.status === "available").length);
    };

    const setupDashboard = async () => {
        await requireSession();
        bindLogout();
        await loadDashboardData();

        const settingsForm = document.getElementById("settings-form");
        settingsForm?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(settingsForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                await request("/api/admin/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                setStatus("Settings saved successfully.", "success");
            } catch (error) {
                setStatus(error.message, "error");
            }
        });
    };

    const previewImage = (input, preview) => {
        const file = input.files?.[0];
        if (!file || !preview) return;

        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const setupPaintingForm = async ({ mode }) => {
        await requireSession();
        bindLogout();

        const form = document.getElementById("painting-form");
        const preview = document.getElementById("painting-preview-image");
        const imageInput = document.getElementById("image");
        const titleNode = document.getElementById("page-title");
        const submitNode = document.getElementById("submit-button");

        imageInput?.addEventListener("change", () => previewImage(imageInput, preview));

        let paintingId = null;

        if (mode === "edit") {
            const params = new URLSearchParams(window.location.search);
            paintingId = params.get("id");

            if (!paintingId) {
                setStatus("Missing painting id.", "error");
                return;
            }

            try {
                const response = await request(`/api/admin/paintings/${paintingId}`);
                const painting = response.painting;
                titleNode.textContent = `Edit ${painting.title}`;
                submitNode.textContent = "Save Changes";

                form.title.value = painting.title || "";
                form.slug.value = painting.slug || "";
                form.price.value = painting.price ?? "";
                form.medium.value = painting.medium || "";
                form.dimensions.value = painting.dimensions || "";
                form.year.value = painting.year || "";
                form.status.value = painting.status || "available";
                form.sortOrder.value = painting.sortOrder ?? 0;
                form.altText.value = painting.altText || "";
                form.description.value = painting.description || "";
                form.featured.checked = Boolean(painting.featured);

                if (preview) {
                    preview.src = `/${painting.image || "images/paintings/Abstract 2 Canvas.png"}`;
                }
            } catch (error) {
                setStatus(error.message, "error");
                return;
            }
        }

        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            formData.set("featured", form.featured.checked ? "true" : "false");

            try {
                const url = mode === "edit" ? `/api/admin/paintings/${paintingId}` : "/api/admin/paintings";
                const method = mode === "edit" ? "PUT" : "POST";

                await request(url, {
                    method,
                    body: formData,
                });

                setStatus(`Painting ${mode === "edit" ? "updated" : "created"} successfully.`, "success");

                if (mode === "create") {
                    form.reset();
                    if (preview) {
                        preview.src = "/images/paintings/Abstract 2 Canvas.png";
                    }
                }
            } catch (error) {
                setStatus(error.message, "error");
            }
        });
    };

    const setupLogin = async () => {
        try {
            await request("/api/admin/session");
            window.location.href = "/admin/dashboard";
            return;
        } catch (error) {
            // Not logged in yet; continue.
        }

        const form = document.getElementById("login-form");
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            try {
                await request("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.get("username"),
                        password: formData.get("password"),
                    }),
                });

                setStatus("Login successful. Redirecting…", "success");
                window.location.href = "/admin/dashboard";
            } catch (error) {
                setStatus(error.message, "error");
            }
        });
    };

    if (page === "login") {
        setupLogin();
    } else if (page === "dashboard") {
        setupDashboard();
    } else if (page === "add-painting") {
        setupPaintingForm({ mode: "create" });
    } else if (page === "edit-painting") {
        setupPaintingForm({ mode: "edit" });
    }
})();
