# Math Ninja

Math Ninja is a React math graph game where players use equation presets to slice targets on a coordinate-grid game board.

## Project Structure

The app source lives in `mathninjajs/src`. Run the app scripts from the `mathninjajs` directory.

```text
mathninjajs/src/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── styles/
│       └── globals.css
├── components/                     # shared buttons, hearts, star rating, modal, and damage overlay
│   ├── Life.jsx
│   ├── Timer.jsx
│   ├── Points.jsx
│   ├── Combo.jsx
│   └── Stars.jsx
├── context/
│   └── GameContext.jsx             # shared game state
├── game/
│   ├── equations/                  # preset data and fn() definitions
│   │   ├── Stage1Presets.jsx
│   │   ├── Stage2Presets.jsx
│   │   ├── Stage3Presets.jsx
│   │   ├── Stage4Presets.jsx
│   │   └── EndlessPresets.jsx
│   ├── graphRenderer.js             # sampling and coordinate conversion
│   └── collision.js                 # equation-to-target collision checks
├── router/
│   └── routes.js                    # screen route definitions
├── screens/
│   ├── EditPreset/                  # coefficient editing UI
│   ├── EquationList/                # stage preset lists
│   ├── EquationTypeSelect/          # equation type selection
│   ├── GameOver/                    # end-of-game statistics
│   ├── Gameplay/                    # graph, hotbar, and gameplay controls
│   ├── StageComplete/               # completion statistics
│   ├── StageSelect/                 # stage selection
│   └── TitleScreen/                 # opening screen
├── App.jsx                          # top-level screen switcher
└── index.jsx
```

The current implementation uses the same organization with the existing project naming conventions, including `Components`, `Context`, `Game`, `Screens`, `index.js`, and JavaScript preset files.

## Recent Changes

- Added Stage 2 with trigonometrical equation presets.
- Added Stage 3 with logarithmic equation presets.
- Added Stage 4 with exponential equation presets.
- Connected Stages 3 and 4 to stage selection, routing, preset loading, and equation type selection.
- Standardized vertical movement for trigonometrical wave presets through the C and D coefficients.
- Fixed equation editor fields and formula previews so their text remains readable on light backgrounds.
- Added an `Invert curve` button during exponential gameplay. It flips an exponential curve vertically so it can reach targets across more of the game board.