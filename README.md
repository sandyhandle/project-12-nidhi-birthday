# Happy Birthday Nidhi ❤️

A complete, responsive birthday website built with pure **HTML, CSS, and JavaScript** — no external frameworks, libraries, or build tools required.

## ✨ Features

- **Page 1 — Welcome**
  Full-screen pink-purple gradient background with floating balloons, a glowing animated button, and the message:  
  *"Are you the Birthday Girl, Nidhi? 🎂"*

- **Page 2 — Photo Gallery** (revealed after clicking the button)
  - Automatic background music (`assets/audio/happy-birthday.mp3`)
  - Slideshow of photos from `assets/photos/` (auto-advances every 4 seconds)
  - Smooth fade transitions, glassmorphism card, confetti & balloons
  - Photo counter and clickable navigation dots
  - Birthday title and a heartfelt message

- Fully responsive (mobile + desktop)
- Smooth page transitions, soft glowing effects, modern typography
- Respects `prefers-reduced-motion` accessibility setting

## 📁 Project Structure

```
Nidi Birthday/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── photos/
    │   ├── photo1.jpg … photo5.jpg   ← add your photos here
    │   └── README.txt
    └── audio/
        ├── happy-birthday.mp3        ← add your music here
        └── README.txt
```

## 🖼️ Adding Your Photos

1. Place image files in `assets/photos/` named `photo1.jpg` through `photo5.jpg`.
2. To use **more** photos, drop the extra files into the folder and add their paths
   to the `photos` array at the top of `script.js`:

   ```js
   "assets/photos/photo6.jpg",
   "assets/photos/photo7.jpg",
   ```

## 🎵 Adding Background Music

Place an MP3 at `assets/audio/happy-birthday.mp3`.  
To use a different filename, update the `<source>` inside the `<audio>` tag in `index.html`.

## 🚀 Deployment

This site is static and deployable anywhere:

**GitHub Pages**
1. Push this project to a GitHub repository.
2. Go to **Settings → Pages**, set source to your branch (e.g. `main`), folder `/root`.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

**Netlify**
1. Drag the project folder into Netlify, or connect the Git repo.
2. No build command or publish directory configuration needed (root is fine).

**Vercel**
1. Import the Git repo into Vercel.
2. Framework preset: **Other** — no build settings required.

## 🧪 Local Preview

Just open `index.html` in any modern browser.  
For full functionality (music + images) add your assets first, or use a
local server to avoid browser file-access restrictions:

```
python -m http.server
```

Have a wonderful birthday, Nidhi! 🎂🎈
