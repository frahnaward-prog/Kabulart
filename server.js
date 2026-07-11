const express = require("express");
const path = require("path");
const multer = require("multer");
const db = require("./database");

const app = express();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Admin login page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin", "login.html"));
});

// Save painting
app.post("/api/paintings", upload.single("image"), (req, res) => {

    const { title, price, description } = req.body;
    const image = req.file ? req.file.filename : "";

    db.run(
        `INSERT INTO paintings (title, price, description, image)
         VALUES (?, ?, ?, ?)`,
        [title, price, description, image],
        function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});