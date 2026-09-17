# EKADANTHA — Rise of the Remover
### *An Original Mythological Action-Adventure Browser Game*
*Specially crafted for Ganesh Chaturthi College Game-Design Competitions*

> **"Where there is fear, there is an obstacle.  
> Where there is an obstacle, there must be courage.  
> The path before us is dark... but no darkness can stand forever.  
> I am Ekadanta. And I will clear the path."**

---

## 🌟 Game Overview

**EKADANTHA: Rise of the Remover** is a rich, high-performance mythological 2.5D action-adventure browser game inspired by the spiritual and cultural world of Lord Ganesha and Ganesh Chaturthi.

The player controls Lord Ganesha (Ekadanta) on a sacred quest through 5 narrative chapters to banish the **Vighnas**—supernatural manifestations of doubt, fear, discord, and obstacles—culminating in the triumphant Ganesh Visarjan celebration along the holy river at sunset.

### Key Highlights
- **Respectful & Majestic Portrayal**: Built in strict adherence to cultural respect. Lord Ganesha is depicted as heroic, wise, noble, and compassionate, adorned with a golden Mukut, radiant Prabhavali halo, sacred Parashu axe, and holy Modaka.
- **Cinematic Opening Video**: 59-second narrative sequence featuring widescreen letterbox visuals, dramatic lighting, temple architecture, gathering Vighna storm clouds, voice narration subtitles, conch fanfare, and a seamless *Skip Cinematic* option.
- **Story Campaign**: 5 Chapters and 15 Playable Levels with unique environments (Ancient Temple, Durva Forest, City of Pandals, Shadow Fortress, Visarjan Riverside).
- **Responsive Action Combat**: Light 3-hit combo attacks (`J`), heavy shield-breaking ground slams (`K`), invincible dodge rolls (`L`), and jumping platform mechanics (`W` / `Space`).
- **6 Unlockable Divine Powers**: *Vakratunda Sweep*, *Siddhi Shield*, *Ekadanta Strike*, *Modaka Burst*, *Mushika Dash*, and the screen-clearing *Vighna Breaker* Ultimate.
- **Sacred Upgrades Mandapam**: Progressive coin economy to upgrade Attack, Defense, Health, Speed, Power synergy, and Ultimate Prana generation.
- **Procedural Indian Classical Audio**: Authentic synthesized Dhol-Tasha festive rhythms, Shankha (Conch shell) horn drones, metallic temple bells, and Tanpura harmonic drones via the Web Audio API with zero external copyright dependencies.
- **Cross-Platform Compatibility**: Full desktop keyboard support and adaptive mobile touch controls (virtual analog stick + touch combat clusters).
- **Persistent Local Progression**: Auto-saves unlocked levels, coins, high combos, power tiers, and stat upgrades to `localStorage`.

---

## 🎮 Controls

### Desktop Keyboard Controls
| Action | Keybinding |
|---|---|
| **Move Left / Right** | `A` / `D` or `←` / `→` |
| **Jump / Ascend** | `W` or `Space` or `↑` |
| **Light Divine Combo** | `J` |
| **Heavy Parashu Slam** | `K` |
| **Dodge Roll / Dash** | `L` |
| **Power 1: Vakratunda Sweep** | `1` |
| **Power 2: Siddhi Shield** | `2` |
| **Power 3: Ekadanta Strike** | `3` |
| **Power 4: Modaka Burst** | `4` |
| **Power 5: Mushika Dash** | `5` |
| **Power 6: Vighna Breaker (Ultimate)** | `6` |
| **Pause Game** | `ESC` or `P` |
| **Advance Dialogue** | `Space` or `Enter` or Click |

### Mobile Touch Controls
- **Left Thumb**: Dynamic virtual analog joystick for smooth 360-degree walking.
- **Right Thumb**: Oversized tactile action buttons for **Attack**, **Heavy Smash**, **Dodge**, **Jump**, **Power Quick-Cast**, and **Ultimate**.

---

## 🗺️ Campaign Structure (15 Levels Across 5 Chapters)

### Chapter 1: The Awakening (Ancient Ganapati Temple)
- **Level 1-1: Temple Sanctum** — Basic movement and combat tutorial; vanquish 5 Vighna Scouts.
- **Level 1-2: Courtyard of Modaks** — Test combo chains against Scouts and heavy Brutes.
- **Level 1-3: Temple Gates (Boss)** — Confront **Dharani Vighna (Stone Guardian)**; unlock *Vakratunda Sweep*.

### Chapter 2: Forest of Durva (Sacred Nature Grove)
- **Level 2-1: Sacred Glade** — Evade ranged dark shards from Vighna Archers.
- **Level 2-2: Stream of Purification** — Wave survival through glowing flora and fireflies.
- **Level 2-3: Heart of the Grove (Boss)** — Defeat **Aranya Vighna (Forest Warden)**; unlock *Siddhi Shield*.

### Chapter 3: City of Pandals (Grand Festival Streets)
- **Level 3-1: Procession Avenue** — Break through front-shielded Vighna Guardians amidst festive dhol beats.
- **Level 3-2: Lantern Plaza** — Protect the sacred lamps from teleporting Shadow Vighnas.
- **Level 3-3: Pandal of Lights (Boss)** — Defeat **Kolhal Vighna (Commander of Discord)**; unlock *Ekadanta Strike*.

### Chapter 4: The Shadow Fortress (Citadel of Obstacles)
- **Level 4-1: Outer Ramparts** — Storm the ramparts against elite demonic battalions.
- **Level 4-2: Chamber of Illusions** — Reflex gauntlet against teleporting enemies and traps.
- **Level 4-3: Throne of Obstacles (Boss)** — Vanquish **Chhaya Vighna (Citadel Titan)**; unlock *Mushika Dash* & *Modaka Burst*.

### Chapter 5: The Final Visarjan (Riverside at Sunset)
- **Level 5-1: Sunset Ghats** — Clear the riverbank steps adorned with hundreds of floating diyas.
- **Level 5-2: Bridge of Devotion** — High-intensity procession gauntlet.
- **Level 5-3: Cosmic Confluence (Final Boss)** — Vanquish **MAHA VIGHNA (The Primordial Obstacle)** in a multi-phase cosmic battle, leading to the grand Ganpati Bappa Morya victory celebration!

---

## ⚡ Quick Start & How to Run Locally

Because the game is built with pure web standards (HTML5 Canvas 2D + ES6 Modular JavaScript + Web Audio API), it runs instantly on any machine with zero npm/node installations required!

### Option 1: Python Built-in Web Server (Recommended)
Open your terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Direct Browser Launch
You can also directly double-click `index.html` to launch the game in Chrome, Edge, Firefox, or Safari!

---

## 🚀 Deployment Instructions

### Deploy to GitHub Pages:
1. Push the `ekadanta` repository to GitHub.
2. In the repository settings, go to **Pages** -> Select the `main` branch -> Click **Save**.
3. Your game is immediately live at `https://<your-username>.github.io/<repo-name>/`.

### Deploy to Vercel / Netlify:
- Drag and drop the `ekadanta` folder into the Netlify or Vercel dashboard. It deploys in seconds with zero configuration.

---

## 🕉️ Cultural Dedication
Dedicated to Lord Ganesha, the embodiment of wisdom, auspicious beginnings, and the remover of all obstacles.  
**GANPATI BAPPA MORYA!**
