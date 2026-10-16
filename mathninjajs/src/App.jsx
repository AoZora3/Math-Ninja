import { useContext, useEffect, useState } from "react";
import "./Assets/Styles/App.css";
import TitleScreen from "./Screens/TitleScreen/TitleScreen.jsx";

import StageSelect from "./Screens/StageSelect/StageSelect.jsx";
import Stage1 from "./Screens/StageSelect/Stage1.jsx";
import Stage2 from "./Screens/StageSelect/Stage2.jsx";
import Stage3 from "./Screens/StageSelect/Stage3.jsx";

import EditPreset from "./Screens/EditPreset/EditPreset.jsx";
import EquationTypeSelect from "./Screens/EquationTypeSelect/EquationTypeSelect.jsx";

import Gameplay from "./Screens/Gameplay/Gameplay.jsx";

import { GameContext, GameProvider } from "./Context/GameContext.jsx";
import { stage1Presets } from "./Game/Equations/StagePreset1.js";
import { stage2Presets } from "./Game/Equations/StagePreset2.js";
import { stage3Presets } from "./Game/Equations/StagePreset3.js";

// Step 4 represents the Endless card; progress is stored locally on this device.
const PROGRESSION_STORAGE_KEY = "mathNinjaUnlockedStep";
const FINAL_UNLOCKED_STEP = 4;

// Ignore invalid or unavailable saved values and begin with only Stage 1 unlocked.
function readUnlockedStep() {
  try {
    const savedStep = Number(window.localStorage.getItem(PROGRESSION_STORAGE_KEY));
    return Number.isInteger(savedStep) && savedStep >= 1 && savedStep <= FINAL_UNLOCKED_STEP
      ? savedStep
      : 1;
  } catch {
    return 1;
  }
}

function createPresetByType(type) {
  const baseId = `${type}-${Date.now()}`;

  if (type === "linear") {
    return {
      id: baseId,
      type: "linear",
      label: "y = ax + b",
      equation: "y = 2x + 1",
      title: "LINEAR EQUATION",
      description: "A line with adjustable slope and intercept.",
      coefficients: { a: 2, b: 1 },
      minMax: { a: [-5, 5], b: [-5, 5] },
      fn: (x, c) => c.a * x + c.b
    };
  }

  // Stage 1 supports adding the requested cubic family alongside line and parabola.
  if (type === "cubic") {
    return {
      id: baseId,
      type: "cubic",
      label: "y = ax³ + b",
      equation: "y = x³",
      title: "CUBIC EQUATION",
      description: "An S-shaped graph with adjustable stretch and vertical shift.",
      coefficients: { a: 1, b: 0 },
      minMax: { a: [-2, 2], b: [-5, 5] },
      fn: (x, c) => c.a * x * x * x + c.b
    };
  }

  if (type === "trigonometric") {
    return {
      id: baseId,
      type: "trigonometric",
      label: "y = a sin(x) + b",
      equation: "y = 1sin(x) + 0",
      title: "TRIG EQUATION",
      description: "A sine wave with adjustable amplitude and shift.",
      coefficients: { a: 1, b: 0 },
      minMax: { a: [0, 3], b: [-5, 5] },
      fn: (x, c) => c.a * Math.sin(x) + c.b
    };
  }

  if (type === "logarithmic") {
    return {
      id: baseId,
      type: "logarithmic",
      label: "y = A * ln(x - H) + K",
      equation: "y = 2 * ln(x - 1) + 0",
      title: "LOGARITHMIC CURVE",
      description: "A steep bend that quickly settles and flattens out.",
      coefficients: { a: 2, b: 1, c: 0 },
      minMax: { a: [-5, 5], b: [-2, 4], c: [-5, 5] },
      fn: (x, c) => (c.a ?? 1) * Math.log(x - (c.b ?? 0)) + (c.c ?? 0)
    };
  }

  if (type === "exponential") {
    // Added Stage 3 equations keep the same exponential/inverse-log relationship.
    return {
      ...stage3Presets[0],
      id: baseId,
      coefficients: { ...stage3Presets[0].coefficients }
    };
  }

  return {
    id: baseId,
    type: "quadratic",
    label: "y = ax² + b",
    equation: "y = x² + 0",
    title: "QUADRATIC EQUATION",
    description: "A curve with adjustable steepness and shift.",
    coefficients: { a: 1, b: 0 },
    minMax: { a: [-2, 2], b: [-5, 5] },
    fn: (x, c) => c.a * x * x + c.b
  };
}

function AppContent() {
  const {
    presets,
    setPresets,
    setActivePreset,
    setCurrentScreen,
    startGameplay,
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    startBackgroundMusic
  } = useContext(GameContext);
  const [screen, setScreen] = useState("splash");
  const [editingPreset, setEditingPreset] = useState(null);
  const [currentStage, setCurrentStage] = useState("stage1");
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [unlockedStep, setUnlockedStep] = useState(readUnlockedStep);

  // Persist unlock progress independently from settings and other game data.
  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESSION_STORAGE_KEY, String(unlockedStep));
    } catch {
      // Keep the session playable when local storage is unavailable.
    }
  }, [unlockedStep]);

  const goToStage = (stageName) => {
    const requestedStep = { stage1: 1, stage2: 2, stage3: 3 }[stageName];
    if (!requestedStep || requestedStep > unlockedStep) return;

    // Stage 3 now owns both logarithmic and exponential preset collections.
    const nextPresets =
      stageName === "stage2"
        ? stage2Presets
        : stageName === "stage3"
          ? stage3Presets
          : stage1Presets;
    setCurrentStage(stageName);
    setPresets(nextPresets);
    setActivePreset(nextPresets[0]);
    setScreen(stageName);
  };

  // A win only advances the furthest unlocked step, never moving progress backward.
  const handleStageWin = () => {
    const completedStep = { stage1: 1, stage2: 2, stage3: 3 }[currentStage];
    if (completedStep) {
      setUnlockedStep((currentStep) => Math.max(currentStep, completedStep + 1));
    }
  };

  // Reset progression only; existing settings and other saved data are preserved.
  const resetProgress = () => setUnlockedStep(1);
  const unlockAllStages = () => setUnlockedStep(FINAL_UNLOCKED_STEP);

  const openEditPreset = (preset) => {
    setActivePreset(preset);
    setEditingPreset(preset);
    setScreen("editPreset");
  };

  const savePreset = (preset) => {
    setPresets((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === preset.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = preset;
        return next;
      }
      return [...prev, preset];
    });

    setActivePreset(preset);
    setEditingPreset(null);
    setScreen(currentStage);
  };

  const handleContinue = () => {
    if (presets.length > 0) {
      setActivePreset(presets[0]);
    }
    startGameplay();
    setScreen("gameplay");
  };

  if (screen === "splash" || screen === "settings") {
    return (
      <TitleScreen
        screen={screen}
        setScreen={setScreen}
        musicVolume={musicVolume}
        onMusicVolumeChange={setMusicVolume}
        sfxVolume={sfxVolume}
        onSfxVolumeChange={setSfxVolume}
        onResetProgress={resetProgress}
        onUnlockAllStages={unlockAllStages}
        onStart={() => {
          startBackgroundMusic();
          setScreen("stageSelect");
        }}
      />
    );
  }

  if (screen === "stageSelect") {
    return (
      <StageSelect
        screen={screen}
        setScreen={goToStage}
        onBack={() => setScreen("splash")}
        showOnboarding={showGettingStarted}
        setShowOnboarding={setShowGettingStarted}
        unlockedStep={unlockedStep}
      />
    );
  }

  if (screen === "stage1") {
    return (
      <Stage1
        presets={presets}
        setScreen={setScreen}
        onEditPreset={openEditPreset}
        onAddEquation={() => setScreen("selectEquationType")}
        onContinue={handleContinue}
        
      />
    );
  }

  if (screen === "stage2") {
    return (
      <Stage2
        presets={presets}
        setScreen={setScreen}
        onEditPreset={openEditPreset}
        onAddEquation={() => setScreen("selectEquationType")}
        onContinue={handleContinue}
      />
    );
  }

  if (screen === "stage3") {
    return (
      <Stage3
        presets={presets}
        setScreen={setScreen}
        onEditPreset={openEditPreset}
        onAddEquation={() => setScreen("selectEquationType")}
        onContinue={handleContinue}
      />
    );
  }

  if (screen === "selectEquationType") {
    return (
      <EquationTypeSelect
        allowedTypes={
          currentStage === "stage2"
            ? ["trigonometric"]
            : currentStage === "stage3"
              ? ["exponential"]
                : ["linear", "quadratic", "cubic"]
        }
        onBack={() => setScreen(currentStage)}
        onSelectType={(type) => {
          setEditingPreset(createPresetByType(type));
          setScreen("editPreset");
        }}
      />
    );
  }

  if (screen === "editPreset") {
    return (
      <EditPreset
        currentPreset={editingPreset}
        onBack={() => setScreen(currentStage)}
        onSave={savePreset}
      />
    );
  }

  if (screen === "gameplay") {
    return <Gameplay
      onBack={() => {
        setCurrentScreen(currentStage);
        setScreen(currentStage);
      }}
      onWin={handleStageWin}
    />;
  }

  return null;
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}