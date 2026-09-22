# Math-Ninja
CS409 - Final Project
File Structure

    src/
    ├── assets/
    │   ├── images/
    │   └── fonts/
    │   └── styles/
    │   │    └── globals.css
    ├── components/                     # shared buttons, hearts, star rating, modal, BombDamage overlay
    │   └── Life.jsx
    │   └── Timer.jsx
    │   └── Points.jsx
    │   └── Combo.jsx
    │   └── Stars.jsx
    ├── context/
    │   └── GameContext.jsx            # shared game state (see contract) — Section 1
    ├── game/
    │   ├── equations/                  # preset data + fn() definitions (algebraic, trig, log, exp)
    │   │    ├── Stage1Presets.jsx               # Stores default preset for stage 1
    │   │    ├── Stage2Presets.jsx  
    │   │    ├── Stage3Presets.jsx
    │   │    ├── Stage4Presets.jsx
    │   │    └── EndlessPresets.jsx
    │   ├── graphRenderer.js            # pure math: sampling, coordinate conversion, drawing
    │   └── collision.js                # pure function: (preset, fruitList) -> sliced fruit    
    ├── router/
    │   └── routes.js                  # frame name -> screen component map
    ├── screens/
    │   ├── EditPreset/                 # Frame 5 (coefficient editing UI)
    │   │    └──　EditPreset.jsx
    │   ├── EquationList/               # Frame 3 (displays presets, reads from game/equations/)
    │   │    ├──Stage1.jsx
    │   │    ├── Stage2.jsx
    │   │    ├── Stage3.jsx
    │   │    ├── Stage4.jsx
    │   │    └── Endless.jsx
    │   ├── EquationTypeSelect/         # Frame 4
    │   │    ├── Stage1EquationType.jsx
    │   │    ├── Stage2EquationType.jsx
    │   │    ├──　tage3EquationType.jsx
    │   │    ├── Stage4EquationType.jsx
    │   │    └── EndlessEquationType.jsx
    │   ├── GameOver/                   # Frame 8
    │   │    └── GameOver.jsx            #Display Stats
    │   ├── Gameplay/                   # Frame 6
    │   │   ├──　Gameplay.jsx            # screen layout, ties hotbar + graph + engine together
    │   │   ├──　MathGraph.jsx           # component wrapper — renders via game/graphRenderer.js
    │   │   └──　EquationHotbar.jsx
    │   ├── StageComplete/              # Frame 9
    │   │    └── StageComplete.jsx            #Display Stars, points, life, time
    │   ├── StageSelect/                # Frame 2
    │   │    └── StageSelect.jsx
    │   ├── TitleScreen/                # Frame 1
    │   │    └── TitleScreen.jsx
    ├── App.jsx                        # top-level routing/screen switcher — Section 1
    └── index.jsx
    
    
    
