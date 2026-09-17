/**
 * EKADANTHA: Rise of the Remover
 * Narrative & Dialogue System
 */

const STORY_CHAPTERS = {
  1: {
    title: "Chapter 1: The Awakening",
    location: "Ancient Ganapati Temple",
    introDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The sacred bells ring throughout the temple... yet shadows stir at the perimeter." },
      { speaker: "TEMPLE PRIEST", avatar: "🪷", text: "Lord Vighnaharta! Strange manifestations—the Vighnas—block the sanctum gates!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "Fear not. Where an obstacle appears, courage shall forge the path. Let us clear the sacred ground." }
    ],
    bossIntro: [
      { speaker: "DHARANI VIGHNA", avatar: "🗿", text: "I am the weight of immovable doubt! None shall cross this gate!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "Doubt crumbles before steadfast wisdom. Step aside, guardian of stone!" }
    ],
    outroDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The temple sanctum is cleansed. The light of devotion shines bright once more." }
    ]
  },
  2: {
    title: "Chapter 2: Forest of Durva",
    location: "Sacred Grove of Healing Grass",
    introDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The durva grass whispers of disharmony. Dark roots attempt to choke the flowing streams." },
      { speaker: "FOREST SPIRIT", avatar: "🍃", text: "Venerable Ekadanta, the woodland creatures are trapped by thorny illusions!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "Nature reflects the spirit within. With patience and resolve, every thorn shall yield." }
    ],
    bossIntro: [
      { speaker: "ARANYA VIGHNA", avatar: "🌿", text: "The tangled forest shall be your cage! You cannot untangle this maze!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "With clarity of purpose, even the densest brambles reveal their opening!" }
    ],
    outroDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The sacred durva flourishes. Its three blades remind us of wisdom, humility, and strength." }
    ]
  },
  3: {
    title: "Chapter 3: City of Pandals",
    location: "Grand Festive Streets of Ganesh Chaturthi",
    introDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "Listen to the dhol and tasha! Millions gather in joy, but discordant shadows seek to extinguish the lights." },
      { speaker: "FESTIVAL DEVOTEE", avatar: "🏮", text: "Bappa! The procession path is blocked by chaotic illusions!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The rhythm of joy cannot be silenced. Let the festival lanterns blaze!" }
    ],
    bossIntro: [
      { speaker: "KOLHAL VIGHNA", avatar: "⚔️", text: "I am the discord that shatters celebration! Your festival ends here!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "True devotion is unity. No discord can withstand the voice of the collective heart!" }
    ],
    outroDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The streets rejoice. Fragrance of modaks and flowers fills the night sky." }
    ]
  },
  4: {
    title: "Chapter 4: The Shadow Fortress",
    location: "Citadel of Ancient Hesitation",
    introDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "We have reached the source of the gathering gloom—the Citadel where past failures and fears take form." },
      { speaker: "MUSHIKA", avatar: "🐀", text: "Lord, the stone is cold and heavy... but I have found small fissures through the ramparts!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "Well done, faithful Mushika. The smallest guide can reveal the grandest gate." }
    ],
    bossIntro: [
      { speaker: "CHHAYA VIGHNA", avatar: "🌑", text: "You face the obsidian titan! Every doubt you have ever known stands fortified!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "A shadow only exists because a greater light shines behind it. Prepare to dissolve!" }
    ],
    outroDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The dark walls crumble. The dawn beckons toward the sacred river." }
    ]
  },
  5: {
    title: "Chapter 5: The Final Visarjan",
    location: "Sacred River Ghats at Sunset",
    introDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The final day of Chaturthi. The riverside is adorned with thousands of floating diyas." },
      { speaker: "DIVINE VOICE", avatar: "✨", text: "Behold, Ekadanta! The Primordial Obstacle gathers its remaining essence for a final confrontation!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "In the flow of water, all things are renewed. Obstacles dissolve as we embrace auspicious rebirth." }
    ],
    bossIntro: [
      { speaker: "MAHA VIGHNA", avatar: "🔱", text: "I am the ultimate barrier of mortal existence! You cannot remove that which is universal!" },
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "I do not destroy obstacles—I transform them into stepping stones of wisdom! Behold the power of Ekadanta!" }
    ],
    outroDialogue: [
      { speaker: "LORD EKADANTA", avatar: "🐘", text: "The journey is fulfilled. May every household find peace, prosperity, and joy." },
      { speaker: "ALL DEVOTEES", avatar: "🌸", text: "GANPATI BAPPA MORYA! PUDHCHYA VARSHI LAVKAR YA!" }
    ]
  }
};

class DialogueManager {
  constructor() {
    this.box = document.getElementById('dialogue-box');
    this.speakerEl = document.getElementById('dialogue-speaker');
    this.textEl = document.getElementById('dialogue-text');
    this.avatarEl = document.getElementById('dialogue-avatar');
    
    this.queue = [];
    this.currentLine = null;
    this.onCompleteCallback = null;
    this.isActive = false;

    if (this.box) {
      this.box.addEventListener('click', () => this.advance());
    }

    window.addEventListener('keydown', (e) => {
      if (this.isActive && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        this.advance();
      }
    });
  }

  show(lines, onComplete = null) {
    if (!lines || lines.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.queue = [...lines];
    this.onCompleteCallback = onComplete;
    this.isActive = true;
    this.box.classList.remove('hidden');

    this.advance();
  }

  advance() {
    if (this.queue.length === 0) {
      this.close();
      return;
    }

    this.currentLine = this.queue.shift();
    this.speakerEl.textContent = this.currentLine.speaker;
    this.textEl.textContent = this.currentLine.text;
    this.avatarEl.textContent = this.currentLine.avatar || '🐘';

    if (window.SoundEngine) {
      window.SoundEngine.playButtonClick();
    }
  }

  close() {
    this.isActive = false;
    this.box.classList.add('hidden');
    const cb = this.onCompleteCallback;
    this.onCompleteCallback = null;
    if (cb) cb();
  }
}

window.GameDialogue = new DialogueManager();
