"""
EKADANTHA: Packaging & Verification Script
Validates all game files and bundles the complete game into ekadanta_game.zip
"""

import os
import zipfile
import re

REQUIRED_FILES = [
    'index.html',
    'README.md',
    'ASSETS.md',
    'GAME_SUMMARY.md',
    'css/main.css',
    'css/hud.css',
    'css/cinematic.css',
    'js/main.js',
    'js/audio/sound_engine.js',
    'js/engine/input.js',
    'js/engine/particles.js',
    'js/engine/physics.js',
    'js/engine/renderer.js',
    'js/engine/storage.js',
    'js/gameplay/dialogue.js',
    'js/gameplay/powers.js',
    'js/gameplay/combat.js',
    'js/gameplay/enemies.js',
    'js/gameplay/bosses.js',
    'js/gameplay/player.js',
    'js/gameplay/levels.js',
    'js/gameplay/cinematic.js',
    'js/ui/shop.js',
    'js/ui/ui_manager.js',
    'assets/video/intro_cinematic.webm'
]

def verify_and_package():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    print(f"[Verifier] Checking game repository at: {base_dir}")
    
    missing = []
    total_size = 0
    for rel_path in REQUIRED_FILES:
        full_path = os.path.join(base_dir, rel_path)
        if not os.path.exists(full_path):
            missing.append(rel_path)
        else:
            total_size += os.path.getsize(full_path)
            
    if missing:
        print(f"[Error] Missing required files: {missing}")
        return False

    print(f"[Verifier] All {len(REQUIRED_FILES)} core files verified successfully ({total_size / 1024:.1f} KB).")

    # Verify script links in index.html
    index_path = os.path.join(base_dir, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    script_matches = re.findall(r'<script src="([^"]+)"></script>', html_content)
    print(f"[Verifier] Verified {len(script_matches)} script tags linked in index.html:")
    for s in script_matches:
        s_path = os.path.join(base_dir, s)
        if not os.path.exists(s_path):
            print(f"  [X] Linked script not found: {s}")
            return False
        else:
            print(f"  [OK] {s}")

    # Build ZIP package
    zip_path = os.path.join(base_dir, 'ekadanta_game.zip')
    print(f"[Packager] Bundling project into {zip_path}...")

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(base_dir):
            # Ignore .git or previous zip files
            if '.git' in root or '__pycache__' in root:
                continue
            for file in files:
                if file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                archive_name = os.path.relpath(file_path, base_dir)
                zf.write(file_path, archive_name)

    zip_size = os.path.getsize(zip_path) / 1024
    print(f"[Packager] Successfully created ekadanta_game.zip ({zip_size:.1f} KB)!")
    return True

if __name__ == '__main__':
    success = verify_and_package()
    if not success:
        exit(1)
