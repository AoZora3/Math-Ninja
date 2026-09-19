# Math-Ninja
CS409 - Final Project
File Structure

src/
├── main.jsx
├── App.jsx                        # top-level routing/screen switcher — Section 1
├── router/
│   └── routes.js                  # frame name -> screen component map
├── context/
│   └── GameContext.jsx            # shared game state (see contract) — Section 1
├── screens/
│   ├── TitleScreen/                # Frame 1
│   │   ├── TitleScreen.jsx
│   │   └── TitleScreen.css
│   ├── LevelSelect/                # Frame 2
│   ├── EquationList/               # Frame 3 (displays presets, reads from game/equations/)
│   ├── EquationTypeSelect/         # Frame 4
│   ├── EditPreset/                 # Frame 5 (coefficient editing UI)
│   ├── Gameplay/                   # Frame 6
│   │   ├── Gameplay.jsx            # screen layout, ties hotbar + graph + engine together
│   │   ├── MathGraph.jsx           # component wrapper — renders via game/graphRenderer.js
│   │   ├── EquationHotbar.jsx
│   │   └── gameEngine.js           # game loop: spawning/timing/score, calls game/collision.js
│   ├── GameOver/                   # Frame 8
│   ├── StageComplete/              # Frame 9
│   └── EndlessMode/                # Frame 10
├── components/                     # shared buttons, hearts, star rating, modal, BombDamage overlay
├── game/
│   ├── equations/                  # preset data + fn() definitions (algebraic, trig, log, exp)
│   ├── graphRenderer.js            # pure math: sampling, coordinate conversion, drawing
│   └── collision.js                # pure function: (preset, fruitList) -> sliced fruit
├── assets/
│   ├── images/
│   └── fonts/
└── styles/
    └── globals.css
