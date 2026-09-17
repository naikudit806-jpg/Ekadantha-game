# GAME_SUMMARY.md
## EKADANTHA — Rise of the Remover
**Official Competition Pitch & Technical Architecture Document**  
*College Ganesh Chaturthi Game-Design Competition*

---

## 1. Executive Game Concept

**EKADANTHA: Rise of the Remover** is an original mythological action-adventure browser game designed from the ground up for the spirit of Ganesh Chaturthi. 

The core philosophical premise centers on the divine mantra:
> **"Every obstacle has a path through it."**

The player embodies Lord Ganesha (Ekadanta) as the divine *Vighnaharta* (Remover of Obstacles). When supernatural manifestations of doubt, fear, and discord—known as the **Vighnas**—threaten the festive peace of the human realm, Ekadanta embarks on a sacred pilgrimage through 5 distinct mythological chapters to restore light, harmony, and auspicious beginnings.

---

## 2. Story Campaign Summary

- **Prologue (Opening Cinematic)**: An ancient city radiates with the joy of Ganesh Chaturthi. Diyas glow and modaks are prepared, until cosmic shadows suddenly blanket the skies. The Vighnas awaken. Lord Ekadanta appears in golden radiance within the inner sanctum, resolving to clear the path.
- **Chapter 1: The Awakening (Ancient Ganapati Temple)**: Ekadanta purifies the temple sanctum from early Vighna scouts and shatters the colossal *Dharani Vighna* (Stone Guardian), unlocking the *Vakratunda Sweep*.
- **Chapter 2: Forest of Durva (Sacred Nature Grove)**: Deep within a mystical forest of healing durva grass and glowing fireflies, Ekadanta overcomes ranged archers and defeats *Aranya Vighna* (Forest Warden), gaining the *Siddhi Shield*.
- **Chapter 3: City of Pandals (Grand Festive Procession)**: The bustling festival streets vibrate with dhol-tasha beats. Ekadanta protects sacred temple lamps from teleporting shadow assassins and banishes *Kolhal Vighna* (Commander of Discord), unlocking the *Ekadanta Strike*.
- **Chapter 4: The Shadow Fortress (Citadel of Obstacles)**: Storming an obsidian fortress of inner hesitations and fears, Ekadanta overcomes the *Chhaya Vighna* (Citadel Titan), mastering the *Mushika Dash* and *Modaka Burst*.
- **Chapter 5: The Final Visarjan (Riverside at Sunset)**: At the sunset river ghats amidst thousands of floating diyas, Ekadanta confronts **MAHA VIGHNA** (The Primordial Obstacle). In a dramatic three-phase cosmic showdown, Ekadanta calls upon the supreme *Vighna Breaker Ultimate*, dissolving all darkness. The journey concludes with joyous celebrations of *"GANPATI BAPPA MORYA!"*

---

## 3. Controls Reference

### Desktop Keyboard
- `A` / `D` or `Arrow Keys`: Walk / Run Left & Right
- `W` or `Space`: Jump & Platforming
- `J`: Light 3-Hit Divine Axe Combo
- `K`: Heavy Ground Slam (Shatters Shields)
- `L`: Invincible Dodge Roll
- `1` - `6`: Cast Divine Powers 1 through 6
- `ESC` / `P`: Pause Menu
- `Space` / `Enter`: Advance Dialogue

### Mobile Touch Controls
- **Left Virtual Analog Stick**: 360-degree walking with distance-responsive speed.
- **Right Action Cluster**: Dedicated buttons for Attack, Heavy, Dodge, Jump, Power quick-cast, and Ultimate.

---

## 4. The 15 Campaign Levels

| Level ID | Chapter & Location | Level Title | Core Objective | Boss Encounter |
|---|---|---|---|---|
| **1-1** | Ch. 1: Ganapati Temple | *Temple Sanctum* | Tutorial; defeat 5 Scouts | None |
| **1-2** | Ch. 1: Ganapati Temple | *Courtyard of Modaks* | Combo test; defeat 7 enemies | None |
| **1-3** | Ch. 1: Ganapati Temple | *Temple Gates* | Boss Fight; purify sanctum | **Dharani Vighna** (500 HP) |
| **2-1** | Ch. 2: Forest of Durva | *Sacred Glade* | Evade ranged dark shards | None |
| **2-2** | Ch. 2: Forest of Durva | *Stream of Purification* | Wave survival across flora | None |
| **2-3** | Ch. 2: Forest of Durva | *Heart of the Grove* | Boss Fight; restore durva | **Aranya Vighna** (750 HP) |
| **3-1** | Ch. 3: City of Pandals | *Procession Avenue* | Break shielded guardians | None |
| **3-2** | Ch. 3: City of Pandals | *Lantern Plaza* | Defend festival lamps | None |
| **3-3** | Ch. 3: City of Pandals | *Pandal of Lights* | Boss Fight; silence discord | **Kolhal Vighna** (1100 HP) |
| **4-1** | Ch. 4: Shadow Fortress | *Outer Ramparts* | Breach fortress defenses | None |
| **4-2** | Ch. 4: Shadow Fortress | *Chamber of Illusions* | Overcome shadow army | None |
| **4-3** | Ch. 4: Shadow Fortress | *Throne of Obstacles* | Boss Fight; destroy titan | **Chhaya Vighna** (1500 HP) |
| **5-1** | Ch. 5: Visarjan River | *Sunset Ghats* | Clear riverbank steps | None |
| **5-2** | Ch. 5: Visarjan River | *Bridge of Devotion* | Intense gauntlet run | None |
| **5-3** | Ch. 5: Visarjan River | *Cosmic Confluence* | Grand Finale Boss Fight | **MAHA VIGHNA** (2200 HP) |

---

## 5. The 6 Divine Powers of Ekadanta

1. **Vakratunda Sweep (`1`)**: 360-degree rotating divine arc of golden energy clearing surrounding enemies.
2. **Siddhi Shield (`2`)**: Radiant sacred barrier granting complete invulnerability for 5 seconds.
3. **Ekadanta Strike (`3`)**: Focused piercing holy charge impaling through enemy defensive lines.
4. **Modaka Burst (`4`)**: Divine sweet offering restoring 35% health and detonating in an aura of light.
5. **Mushika Dash (`5`)**: Swift spirit phase-dash bypassing enemies with speed and invulnerability.
6. **Vighna Breaker Ultimate (`6`)**: Celestial golden thunderbolts raining down from the heavens across the entire screen!

---

## 6. Technical Stack & Engineering Highlights

- **Pure Web Standards**: HTML5, CSS3, Vanilla ES6 JavaScript (Zero npm dependencies, zero build-step fragility).
- **60 FPS Canvas 2D Engine**: Smooth camera following, multi-layered parallax backgrounds, dynamic festival lighting (diyas, god rays), screen shake, and particle systems.
- **Procedural Web Audio Engine**: Custom real-time synthesis of Dhol-Tasha festive drums, Shankha (Conch shell) horn drone, temple bells, and Tanpura chord overtones with zero copyright risks.
- **Opening Video Director**: True WebM video file container + real-time dynamic Canvas sequence with voice narration subtitles and skip option.
- **Persistence**: `localStorage` automatic state tracking for coins, level unlocks, high combos, and stat upgrades.

---

## 7. How to Run Locally & Deploy

```bash
# Run local Python server
python -m http.server 8000
# Open browser at http://localhost:8000
```
- **Deployment**: Static ready — can be hosted directly on GitHub Pages, Vercel, Netlify, or AWS S3 by simply dropping the folder.

---

## 8. 1–3 Minute Live Demo Script (For Presenting to Judges)

```
[0:00 - 0:25] INTRO & CULTURAL CONCEPT:
"Respected judges and faculty, we are thrilled to present 'EKADANTHA: Rise of the Remover'—an original mythological action-adventure game crafted specifically for this Ganesh Chaturthi competition. 

Our core theme is 'Every obstacle can be overcome.' We wanted to build a genuinely playable, premium action game that honors Lord Ganesha respectfully while providing deep, responsive combat, character progression, and festival atmosphere."

[0:25 - 0:55] CINEMATIC INTRO & AUDIO:
"Notice how the game opens: not with static text, but with a real widescreen cinematic sequence showing the festive city, the arrival of supernatural Vighnas, and the heroic reveal of Ekadanta accompanied by an authentic procedural Shankha and temple bell fanfare. Listen to the custom Web Audio engine—the Dhol-Tasha rhythms and temple bells are synthesized in real-time with zero copyright risks!"

[0:55 - 1:40] COMBAT, POWERS & LEVEL DESIGN:
"As we enter gameplay, the controls are instantaneous. We have light 3-hit combo attacks on 'J', heavy ground slams on 'K' that break shields, and invincible dodge rolls on 'L'. 

Here in Chapter 1 at the ancient temple, observe the multi-layered parallax lighting and floating marigold petals. As we defeat Vighnas, we collect sacred Modak coins. Look at power activation: triggering 'Vakratunda Sweep' releases a rotating holy shockwave! In our Upgrades Mandapam, players can enhance Attack, Defense, Vitality, and unlock all 6 divine abilities."

[1:40 - 2:20] PROGRESSION & THE 5 CHAPTERS:
"Across 15 handcrafted levels and 5 chapters—from the mystical Durva Forest to the Lantern Pandals and the Shadow Fortress—the player encounters 6 unique enemy archetypes and 5 multi-phase bosses. On mobile devices, an adaptive virtual analog stick and touch buttons make the experience completely fluid."

[2:20 - 2:50] CLIMAX & CONCLUSION:
"In Chapter 5 at the sunset riverside Visarjan, we confront Maha Vighna and unleash the ultimate 'Vighna Breaker' divine lightning, dissolving all darkness and culminating in the grand chant: 'GANPATI BAPPA MORYA!' 

EKADANTHA runs on any browser with zero setup, saves all progress locally, and delivers an authentic, inspiring festival experience. Thank you!"
```
