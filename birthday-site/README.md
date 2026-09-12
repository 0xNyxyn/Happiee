# Sneha Birthday Website 💗

This is a simple static HTML/CSS/JavaScript website designed to run directly from a normal web link.
It works well with GitHub + Cloudflare Pages because it does not require a server or database.

## Files

- `index.html` — the actual pages/screens and text structure.
- `style.css` — colours, layout, animations and mobile styling.
- `script.js` — buttons, candle blowing, letter typing, music, gallery, balloons and WhatsApp sharing.
- `assets/` — put the four photos here.
- `backup/flipbook.html` — standalone backup version with page-turning/flipbook style.

## Your photos

Put these files inside `assets/`:

- `p1.jpg`
- `p2.jpg`
- `p3.jpg`
- `p4.jpg`

The page already has a fallback graphic if a photo is missing.

## Editing the birthday message

Open `script.js` and search for `const LINES = [`.
Edit the words inside that list. Empty quotes `''` make a blank line.

## Editing names / final message

Open `index.html` and search for `Happy Birthday` or `Snehaee`.

## WhatsApp sharing

The button on the final screen automatically creates a WhatsApp link containing the current website URL.
Because it reads `window.location.href`, you do not need to change the code after Cloudflare gives you the final `pages.dev` address.

## Cloudflare Pages

For this version:

- Framework preset: None
- Build command: leave blank if allowed
- Build output directory: `/`
- Production branch: usually `main`

No Node.js build step is required.
