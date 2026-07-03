# Artwork Detail Page Template Guide

## Quick Start

I've created a **reusable template** (`artwork-template.html`) that makes creating new artwork pages super fast. Just copy, paste, and replace placeholders!

---

## How to Create a New Artwork Page

### Step 1: Copy the Template
1. Duplicate `artwork-template.html`
2. Rename to `[artwork-id].html` (e.g., `liminal-equilibrium.html`)

### Step 2: Find & Replace
Replace these placeholders with your artwork data:

| Placeholder | Example | Notes |
|---|---|---|
| `[ARTWORK_TITLE]` | `Liminal Equilibrium` | Used in title, heading, cart |
| `[ARTWORK_ID]` | `liminal-equilibrium` | Unique identifier, used in URLs and cart |
| `[MEDIUM]` | `Oil on Canvas` | Painting medium |
| `[SIZE]` | `36 × 24 in` | Dimensions |
| `[PRICE]` | `$2,200` | Display price |
| `[PRICE_NUMBER]` | `2200` | Numeric price (no $ or commas) |
| `[YEAR]` | `2024` | Year created |
| `[IMAGE_PATH]` | `images/paintings/Abstract Paint.heic` | Path to main image |
| `[DESCRIPTION]` | `A fluid composition...` | Meta description |
| `[STORY_PARAGRAPH_1]` | Long text... | Creative story (1-3 sentences) |
| `[STORY_PARAGRAPH_2]` | Long text... | More story details |
| `[RELATED_1_TITLE]` | `Golden Horizon` | First related artwork title |
| `[RELATED_1_MEDIUM]` | `Acrylic on Canvas` | Related artwork medium |
| `[RELATED_1_PRICE]` | `$2,800` | Related artwork price |
| `[RELATED_1_IMAGE]` | `images/paintings/Abstract 2 Canvas.HEIC` | Related artwork image |
| `[RELATED_1_URL]` | `golden-horizon.html` | Link to related page |
| `[RELATED_2_*]` | (same as above) | Second related artwork |

---

## Example: Creating `liminal-equilibrium.html`

**From gallery data:**
```
Title: Liminal Equilibrium
Medium: Oil on Canvas
Size: 36 × 24 in
Price: $2,200
Image: images/paintings/Abstract Paint.heic
```

**Search & Replace (in order):**
1. `[ARTWORK_TITLE]` → `Liminal Equilibrium`
2. `[ARTWORK_ID]` → `liminal-equilibrium`
3. `[MEDIUM]` → `Oil on Canvas`
4. `[SIZE]` → `36 × 24 in`
5. `[PRICE]` → `$2,200`
6. `[PRICE_NUMBER]` → `2200`
7. `[YEAR]` → `2024` (or current year)
8. `[IMAGE_PATH]` → `images/paintings/Abstract Paint.heic`
9. `[DESCRIPTION]` → Something like "A fluid composition of warm golds and shadowed layers..."
10. `[STORY_PARAGRAPH_1]` & `[STORY_PARAGRAPH_2]` → Write 2-3 sentences about the piece
11. `[RELATED_1_*]` & `[RELATED_2_*]` → Pick 2 other artworks to link to

---

## Paintings in Your Gallery

Here are all the paintings that need pages:

1. **Liminal Equilibrium** (Oil, 36×24", $2,200) - Abstract Paint.heic
2. **Veiled Memories** (Mixed Media, 30×40", $2,600) - Abstract Paint 2.heic
3. **Echoes of Dawn** (Oil, 20×24", $1,050) - Abstract Paint.heic
4. **Quiet Horizon** (Acrylic, 18×24", $900) - Abstract Paint 2.heic
5. **Still Waters** (Mixed Media, 16×20", $860) - Abstract 2 Canvas.HEIC
6. **Amber Drift** (Acrylic, 40×30", $2,900) - Abstract 2 Canvas.HEIC
7. **Velvet Silence** (Oil, 28×22", $2,100) - Abstract Paint.heic
8. **Midnight Bloom** (Mixed Media, 34×28", $2,650) - Abstract Paint 2.heic

---

## Features Included

✅ **Image Zoom** – +/−/Reset buttons + fullscreen view  
✅ **Cart Integration** – Add to cart with price and size  
✅ **Wishlist** – Save for later (♡ button)  
✅ **Sharing** – Facebook, Twitter, Pinterest, Email  
✅ **Trust Badges** – Original, Signed, Certified, Shipping  
✅ **Related Works** – Links to 2 other artworks  
✅ **Custom Commission CTA** – Link to contact form  
✅ **Responsive Design** – Mobile, tablet, desktop  
✅ **SEO Ready** – Meta tags, structured content  

---

## After Creating Pages

### Update Gallery Links
In `Kabul-Art.html`, change gallery card links from:
```html
<a href="golden-horizon.html" class="button small-button">View Details</a>
```

To point to the new pages:
```html
<a href="liminal-equilibrium.html" class="button small-button">View Details</a>
```

### Create Pages Incrementally
You don't need to create all 8 at once. Start with 3-4 popular ones, then add more as needed.

---

## Customization Tips

### Story Paragraphs
Write 1-2 sentences per paragraph about:
- Inspiration behind the piece
- Technique or materials used
- Mood or emotion it conveys
- How it fits in a space

### Related Works
Choose artworks that:
- Have similar colors or mood
- Complement each other size-wise
- Are "step up" prices (upsell)

### Share URLs
Update the domain from `https://kabulart.com` to your actual domain when deploying.

---

## All Features at a Glance

| Feature | Status | Notes |
|---|---|---|
| Zoom controls | ✅ Built-in | +/−/Reset/Fullscreen |
| Add to cart | ✅ Built-in | Integrates with cart system |
| Wishlist | ✅ Built-in | localStorage persistence |
| Share buttons | ✅ Built-in | Facebook, Twitter, Pinterest, Email |
| Related works | ✅ Built-in | 2 artwork links |
| Mobile responsive | ✅ Built-in | Uses site styles |
| SEO optimized | ✅ Built-in | Meta tags included |
| Trust badges | ✅ Built-in | 4 reassurance items |
| Custom CTA | ✅ Built-in | Links to commission request |

---

## Questions?

The template is self-contained and uses the same styles as your main site. Just fill in the placeholders and you're done!

Need help creating a specific page? Let me know which artwork and I'll create it for you.
