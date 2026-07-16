const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data/artgallery.db");

const paintingColumns = [
    { name: "slug", definition: "TEXT" },
    { name: "medium", definition: "TEXT DEFAULT ''" },
    { name: "dimensions", definition: "TEXT DEFAULT ''" },
    { name: "year", definition: "TEXT DEFAULT ''" },
    { name: "status", definition: "TEXT DEFAULT 'available'" },
    { name: "featured", definition: "INTEGER DEFAULT 0" },
    { name: "alt_text", definition: "TEXT DEFAULT ''" },
    { name: "sort_order", definition: "INTEGER DEFAULT 0" },
    { name: "updated_at", definition: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
];

const ensurePaintingColumns = () => {
    db.all("PRAGMA table_info(paintings)", (error, columns = []) => {
        if (error) {
            console.error("Failed to inspect paintings table:", error.message);
            return;
        }

        const existingColumns = new Set(columns.map((column) => column.name));
        const missingColumns = paintingColumns.filter((column) => !existingColumns.has(column.name));

        const createSlugIndex = () => {
            db.run(`
                CREATE UNIQUE INDEX IF NOT EXISTS idx_paintings_slug
                ON paintings(slug)
                WHERE slug IS NOT NULL AND slug != ''
            `, (indexError) => {
                if (indexError) {
                    console.error("Failed to create slug index:", indexError.message);
                }
            });
        };

        if (!missingColumns.length) {
            createSlugIndex();
            return;
        }

        let pending = missingColumns.length;

        missingColumns.forEach((column) => {
            db.run(
                `ALTER TABLE paintings ADD COLUMN ${column.name} ${column.definition}`,
                (alterError) => {
                    if (alterError) {
                        console.error(`Failed to add column ${column.name}:`, alterError.message);
                    }

                    pending -= 1;
                    if (pending === 0) {
                        createSlugIndex();
                    }
                }
            );
        });
    });
};

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS paintings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE,
            price REAL NOT NULL,
            description TEXT,
            image TEXT,
            medium TEXT DEFAULT '',
            dimensions TEXT DEFAULT '',
            year TEXT DEFAULT '',
            status TEXT DEFAULT 'available',
            featured INTEGER DEFAULT 0,
            alt_text TEXT DEFAULT '',
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS site_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            hero_title TEXT DEFAULT '',
            hero_copy TEXT DEFAULT '',
            contact_heading TEXT DEFAULT '',
            contact_intro_title TEXT DEFAULT '',
            contact_intro_copy TEXT DEFAULT '',
            contact_email TEXT DEFAULT '',
            contact_phone TEXT DEFAULT '',
            instagram_url TEXT DEFAULT '',
            facebook_url TEXT DEFAULT '',
            pinterest_url TEXT DEFAULT '',
            shipping_note TEXT DEFAULT '',
            footer_blurb TEXT DEFAULT '',
            footer_email TEXT DEFAULT '',
            footer_copyright TEXT DEFAULT '',
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO site_settings (
            id,
            hero_title,
            hero_copy,
            contact_heading,
            contact_intro_title,
            contact_intro_copy,
            contact_email,
            contact_phone,
            instagram_url,
            facebook_url,
            pinterest_url,
            shipping_note
        ) VALUES (
            1,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        )
    `);

    ensurePaintingColumns();
    db.all("PRAGMA table_info(site_settings)", (error, columns = []) => {
        if (error) {
            console.error("Failed to inspect site_settings table:", error.message);
            return;
        }

        const existingColumns = new Set(columns.map((column) => column.name));
        const settingsColumns = [
            { name: "contact_heading", definition: "TEXT DEFAULT ''" },
            { name: "contact_intro_title", definition: "TEXT DEFAULT ''" },
            { name: "contact_intro_copy", definition: "TEXT DEFAULT ''" },
            { name: "pinterest_url", definition: "TEXT DEFAULT ''" },
            { name: "footer_blurb", definition: "TEXT DEFAULT ''" },
            { name: "footer_email", definition: "TEXT DEFAULT ''" },
            { name: "footer_copyright", definition: "TEXT DEFAULT ''" },
        ];

        settingsColumns.forEach((column) => {
            if (existingColumns.has(column.name)) return;
            db.run(`ALTER TABLE site_settings ADD COLUMN ${column.name} ${column.definition}`, (alterError) => {
                if (alterError) {
                    console.error(`Failed to add site_settings column ${column.name}:`, alterError.message);
                }
            });
        });
    });
});

module.exports = db;
