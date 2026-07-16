const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("./database");

const app = express();
const sessions = new Map();
const SESSION_COOKIE = "kabul_art_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image uploads are allowed."));
            return;
        }

        cb(null, true);
    },
});

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const parseCookies = (cookieHeader = "") =>
    cookieHeader.split(";").reduce((cookies, entry) => {
        const [rawName, ...rest] = entry.trim().split("=");
        if (!rawName) return cookies;
        cookies[rawName] = decodeURIComponent(rest.join("="));
        return cookies;
    }, {});

const setSessionCookie = (res, token) => {
    const cookieParts = [
        `${SESSION_COOKIE}=${token}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        `Max-Age=${SESSION_TTL_MS / 1000}`,
    ];

    res.setHeader("Set-Cookie", cookieParts.join("; "));
};

const clearSessionCookie = (res) => {
    res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
};

const createSlug = (value = "") =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `painting-${Date.now()}`;

const getAuthSession = (req) => {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[SESSION_COOKIE];
    if (!token) return null;

    const session = sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
        sessions.delete(token);
        return null;
    }

    session.expiresAt = Date.now() + SESSION_TTL_MS;
    return { token, session };
};

const requireAdmin = (req, res, next) => {
    const auth = getAuthSession(req);
    if (!auth) {
        res.status(401).json({ success: false, error: "Authentication required." });
        return;
    }

    req.adminSession = auth;
    next();
};

const runQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function onRun(error) {
            if (error) {
                reject(error);
                return;
            }

            resolve(this);
        });
    });

const getQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(row);
        });
    });

const allQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(rows);
        });
    });

const mapPaintingRow = (row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    price: row.price,
    description: row.description || "",
    image: row.image || "",
    medium: row.medium || "",
    dimensions: row.dimensions || "",
    year: row.year || "",
    status: row.status || "available",
    featured: Boolean(row.featured),
    altText: row.alt_text || "",
    sortOrder: row.sort_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const mapPublicPaintingRow = (row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug || createSlug(row.title),
    price: row.price,
    description: row.description || "",
    image: row.image || "",
    medium: row.medium || "",
    dimensions: row.dimensions || "",
    year: row.year || "",
    status: row.status || "available",
    featured: Boolean(row.featured),
    altText: row.alt_text || `${row.title} original abstract painting by Farhad`,
});

const validatePaintingPayload = (body, { isPartial = false } = {}) => {
    const payload = {
        title: String(body.title || "").trim(),
        price: Number(body.price),
        description: String(body.description || "").trim(),
        medium: String(body.medium || "").trim(),
        dimensions: String(body.dimensions || "").trim(),
        year: String(body.year || "").trim(),
        status: String(body.status || "available").trim().toLowerCase(),
        altText: String(body.altText || "").trim(),
        sortOrder: Number(body.sortOrder || 0),
        featured: body.featured === true || body.featured === "true" || body.featured === "1" ? 1 : 0,
    };

    if (!isPartial || payload.title) {
        if (!payload.title) {
            return { error: "Title is required." };
        }
    }

    if (!isPartial || body.price !== undefined) {
        if (!Number.isFinite(payload.price) || payload.price < 0) {
            return { error: "Price must be a valid non-negative number." };
        }
    }

    if (!["available", "sold", "reserved"].includes(payload.status)) {
        return { error: "Status must be available, sold, or reserved." };
    }

    if (!Number.isFinite(payload.sortOrder)) {
        payload.sortOrder = 0;
    }

    payload.slug = createSlug(body.slug || payload.title);
    return { payload };
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "login.html"));
});

app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "dashboard.html"));
});

app.get("/admin/add-painting", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "add-painting.html"));
});

app.get("/admin/edit-painting", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "edit-painting.html"));
});

app.get("/api/paintings", async (req, res) => {
    try {
        const rows = await allQuery(`
            SELECT *
            FROM paintings
            ORDER BY featured DESC, sort_order ASC, created_at DESC
        `);

        res.json({
            success: true,
            paintings: rows.map(mapPublicPaintingRow),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/paintings/:slug", async (req, res) => {
    try {
        const row = await getQuery("SELECT * FROM paintings WHERE slug = ?", [req.params.slug]);
        if (!row) {
            res.status(404).json({ success: false, error: "Painting not found." });
            return;
        }

        res.json({
            success: true,
            painting: mapPublicPaintingRow(row),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/settings", async (req, res) => {
    try {
        const settings = await getQuery("SELECT * FROM site_settings WHERE id = 1");
        res.json({ success: true, settings: settings || {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/admin/login", async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.status(401).json({ success: false, error: "Invalid username or password." });
        return;
    }

    const token = crypto.randomUUID();
    sessions.set(token, {
        username,
        expiresAt: Date.now() + SESSION_TTL_MS,
    });

    setSessionCookie(res, token);
    res.json({ success: true, username });
});

app.post("/api/admin/logout", (req, res) => {
    const auth = getAuthSession(req);
    if (auth) {
        sessions.delete(auth.token);
    }

    clearSessionCookie(res);
    res.json({ success: true });
});

app.get("/api/admin/session", (req, res) => {
    const auth = getAuthSession(req);
    if (!auth) {
        res.status(401).json({ success: false, authenticated: false });
        return;
    }

    res.json({
        success: true,
        authenticated: true,
        username: auth.session.username,
    });
});

app.get("/api/admin/paintings", requireAdmin, async (req, res) => {
    try {
        const rows = await allQuery(`
            SELECT *
            FROM paintings
            ORDER BY featured DESC, sort_order ASC, created_at DESC
        `);

        res.json({
            success: true,
            paintings: rows.map(mapPaintingRow),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/admin/paintings/:id", requireAdmin, async (req, res) => {
    try {
        const row = await getQuery("SELECT * FROM paintings WHERE id = ?", [req.params.id]);
        if (!row) {
            res.status(404).json({ success: false, error: "Painting not found." });
            return;
        }

        res.json({ success: true, painting: mapPaintingRow(row) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/admin/paintings", requireAdmin, (req, res) => {
    upload.single("image")(req, res, async (uploadError) => {
        if (uploadError) {
            res.status(400).json({ success: false, error: uploadError.message });
            return;
        }

        const { error, payload } = validatePaintingPayload(req.body);
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        try {
            const duplicate = await getQuery("SELECT id FROM paintings WHERE slug = ?", [payload.slug]);
            if (duplicate) {
                res.status(409).json({ success: false, error: "A painting with this slug already exists." });
                return;
            }

            const imagePath = req.file ? `uploads/${req.file.filename}` : "";
            const result = await runQuery(
                `INSERT INTO paintings (
                    title, slug, price, description, image, medium, dimensions, year, status, featured, alt_text, sort_order, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [
                    payload.title,
                    payload.slug,
                    payload.price,
                    payload.description,
                    imagePath,
                    payload.medium,
                    payload.dimensions,
                    payload.year,
                    payload.status,
                    payload.featured,
                    payload.altText,
                    payload.sortOrder,
                ]
            );

            const painting = await getQuery("SELECT * FROM paintings WHERE id = ?", [result.lastID]);
            res.json({ success: true, painting: mapPaintingRow(painting) });
        } catch (dbError) {
            res.status(500).json({ success: false, error: dbError.message });
        }
    });
});

app.put("/api/admin/paintings/:id", requireAdmin, (req, res) => {
    upload.single("image")(req, res, async (uploadError) => {
        if (uploadError) {
            res.status(400).json({ success: false, error: uploadError.message });
            return;
        }

        const { error, payload } = validatePaintingPayload(req.body, { isPartial: false });
        if (error) {
            res.status(400).json({ success: false, error });
            return;
        }

        try {
            const existing = await getQuery("SELECT * FROM paintings WHERE id = ?", [req.params.id]);
            if (!existing) {
                res.status(404).json({ success: false, error: "Painting not found." });
                return;
            }

            const duplicate = await getQuery(
                "SELECT id FROM paintings WHERE slug = ? AND id != ?",
                [payload.slug, req.params.id]
            );

            if (duplicate) {
                res.status(409).json({ success: false, error: "Another painting already uses this slug." });
                return;
            }

            const imagePath = req.file ? `uploads/${req.file.filename}` : existing.image;

            await runQuery(
                `UPDATE paintings
                 SET title = ?, slug = ?, price = ?, description = ?, image = ?, medium = ?, dimensions = ?, year = ?, status = ?, featured = ?, alt_text = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [
                    payload.title,
                    payload.slug,
                    payload.price,
                    payload.description,
                    imagePath,
                    payload.medium,
                    payload.dimensions,
                    payload.year,
                    payload.status,
                    payload.featured,
                    payload.altText,
                    payload.sortOrder,
                    req.params.id,
                ]
            );

            const painting = await getQuery("SELECT * FROM paintings WHERE id = ?", [req.params.id]);
            res.json({ success: true, painting: mapPaintingRow(painting) });
        } catch (dbError) {
            res.status(500).json({ success: false, error: dbError.message });
        }
    });
});

app.delete("/api/admin/paintings/:id", requireAdmin, async (req, res) => {
    try {
        const painting = await getQuery("SELECT * FROM paintings WHERE id = ?", [req.params.id]);
        if (!painting) {
            res.status(404).json({ success: false, error: "Painting not found." });
            return;
        }

        await runQuery("DELETE FROM paintings WHERE id = ?", [req.params.id]);

        if (painting.image) {
            const localImagePath = path.join(__dirname, painting.image);
            if (fs.existsSync(localImagePath)) {
                fs.unlink(localImagePath, () => {});
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
        const settings = await getQuery("SELECT * FROM site_settings WHERE id = 1");
        res.json({ success: true, settings: settings || {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/admin/settings", requireAdmin, async (req, res) => {
    const payload = {
        heroTitle: String(req.body.heroTitle || "").trim(),
        heroCopy: String(req.body.heroCopy || "").trim(),
        contactHeading: String(req.body.contactHeading || "").trim(),
        contactIntroTitle: String(req.body.contactIntroTitle || "").trim(),
        contactIntroCopy: String(req.body.contactIntroCopy || "").trim(),
        contactEmail: String(req.body.contactEmail || "").trim(),
        contactPhone: String(req.body.contactPhone || "").trim(),
        instagramUrl: String(req.body.instagramUrl || "").trim(),
        facebookUrl: String(req.body.facebookUrl || "").trim(),
        pinterestUrl: String(req.body.pinterestUrl || "").trim(),
        shippingNote: String(req.body.shippingNote || "").trim(),
        footerBlurb: String(req.body.footerBlurb || "").trim(),
        footerEmail: String(req.body.footerEmail || "").trim(),
        footerCopyright: String(req.body.footerCopyright || "").trim(),
    };

    try {
        await runQuery(
            `UPDATE site_settings
             SET hero_title = ?, hero_copy = ?, contact_heading = ?, contact_intro_title = ?, contact_intro_copy = ?, contact_email = ?, contact_phone = ?, instagram_url = ?, facebook_url = ?, pinterest_url = ?, shipping_note = ?, footer_blurb = ?, footer_email = ?, footer_copyright = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = 1`,
            [
                payload.heroTitle,
                payload.heroCopy,
                payload.contactHeading,
                payload.contactIntroTitle,
                payload.contactIntroCopy,
                payload.contactEmail,
                payload.contactPhone,
                payload.instagramUrl,
                payload.facebookUrl,
                payload.pinterestUrl,
                payload.shippingNote,
                payload.footerBlurb,
                payload.footerEmail,
                payload.footerCopyright,
            ]
        );

        const settings = await getQuery("SELECT * FROM site_settings WHERE id = 1");
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        res.status(400).json({ success: false, error: error.message });
        return;
    }

    next(error);
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin login at http://localhost:${PORT}/admin`);
});
