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
import { BUILD_CHALLENGE_BY_STAGE } from "./Game/Equations/BuildChallengeData.js";
import BuildChallenge from "./Screens/BuildChallenge/BuildChallenge.jsx";
import EndlessMode from "./Screens/EndlessMode/EndlessMode.jsx";
import { storage } from "./Utils/storage";
import { calculateStars } from "./Screens/StageResult/StageResult.jsx";
import { getTrigonometricFunctionName } from "./Game/Equations/EquationText.js";

// Step 4 represents the Endless card; progress is stored locally on this device.
const PROGRESSION_STORAGE_KEY = "mathNinjaUnlockedStep";
const FORMULA_UNLOCK_STORAGE_KEY = "mathNinjaUnlockedFormulas";
const STAGE_STARS_STORAGE_KEY = "mathNinjaStageStars";
const FINAL_UNLOCKED_STEP = 4;
const DEFAULT_FORMULA_UNLOCKS = {
  stage1: ["linear1"],
  stage2: ["sin-basic"],
  stage3: ["exp-shift"]
};

function getDefaultFormulaUnlocks() {
  return Object.fromEntries(
    Object.values(DEFAULT_FORMULA_UNLOCKS).flatMap((ids) => ids.map((id) => [id, true]))
  );
}

// Ignore invalid or unavailable saved values and begin with only Stage 1 unlocked.
function readUnlockedStep() {
  const savedStep = Number(storage.getItem(PROGRESSION_STORAGE_KEY, '1'));
  return Number.isInteger(savedStep) && savedStep >= 1 && savedStep <= FINAL_UNLOCKED_STEP
    ? savedStep
    : 1;
}

function readUnlockedFormulas() {
  const rawValue = storage.getItem(FORMULA_UNLOCK_STORAGE_KEY, '{}');

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function readStageStars() {
  const rawValue = storage.getItem(STAGE_STARS_STORAGE_KEY, '{}');

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      ["stage1", "stage2", "stage3"].map((stage) => {
        const stars = Number(parsed[stage]);
        return [stage, Number.isInteger(stars) && stars >= 0 && stars <= 3 ? stars : 0];
      })
    );
  } catch {
    return {};
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

  const trigFunctions = {
    "trig-sin": { trigFunction: "sin", fn: Math.sin },
    "trig-cos": { trigFunction: "cos", fn: Math.cos },
    "trig-tan": { trigFunction: "tan", fn: Math.tan },
    "trig-sec": { trigFunction: "sec", fn: (x) => 1 / Math.cos(x) },
    "trig-cot": { trigFunction: "cot", fn: (x) => 1 / Math.tan(x) },
    "trig-csc": { trigFunction: "csc", fn: (x) => 1 / Math.sin(x) }
  };

  if (trigFunctions[type]) {
    const { trigFunction, fn } = trigFunctions[type];
    const functionName = getTrigonometricFunctionName(trigFunction);
    return {
      id: baseId,
      type: "trigonometric",
      trigFunction,
      waveType: `endless-${trigFunction}`,
      label: `y = a ${trigFunction}(x) + b`,
      equation: `y = 1 ${trigFunction}(x) + 0`,
      title: `${functionName.toUpperCase()} FUNCTION`,
      description: `The coefficient a scales the ${functionName.toLowerCase()} function, while b shifts it up or down.`,
      coefficients: { a: 1, b: 0 },
      minMax: { a: [-3, 3], b: [-5, 5] },
      fn: (x, c) => {
        const result = fn(x);
        return Number.isFinite(result) ? c.a * result + c.b : Number.NaN;
      }
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

function AppContent({ formulaUnlocks, setFormulaUnlocks }) {
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
    startBackgroundMusic,
    endlessHighScore,
    resetEndlessHighScore
  } = useContext(GameContext);
  const [screen, setScreen] = useState("splash");
  const [editingPreset, setEditingPreset] = useState(null);
  const [currentStage, setCurrentStage] = useState("stage1");
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [unlockedStep, setUnlockedStep] = useState(readUnlockedStep);
  const [stageStars, setStageStars] = useState(readStageStars);
  const [buildChallengeStep, setBuildChallengeStep] = useState(null);

  // Persist unlock progress independently from settings and other game data.
  useEffect(() => {
    storage.setItem(PROGRESSION_STORAGE_KEY, String(unlockedStep));
  }, [unlockedStep]);

  useEffect(() => {
    storage.setItem(FORMULA_UNLOCK_STORAGE_KEY, JSON.stringify(formulaUnlocks));
  }, [formulaUnlocks]);

  useEffect(() => {
    storage.setItem(STAGE_STARS_STORAGE_KEY, JSON.stringify(stageStars));
  }, [stageStars]);

  const goToStage = (stageName) => {
    const requestedStep = { stage1: 1, stage2: 2, stage3: 3, endless: 4 }[stageName];
    if (!requestedStep || requestedStep > unlockedStep) return;

    const nextPresets = stageName === "endless"
      ? [...stage1Presets, ...stage2Presets, ...stage3Presets].filter((preset) => formulaUnlocks[preset.id])
      : stageName === "stage2"
        ? stage2Presets
        : stageName === "stage3"
          ? stage3Presets
          : stage1Presets;
    setCurrentStage(stageName);
    setPresets(nextPresets);
    setActivePreset(nextPresets[0] || null);
    setScreen(stageName);
  };

  // A win only advances the furthest unlocked step, never moving progress backward.
  const handleStageWin = ({ lives, hitRate, elapsedSeconds }) => {
    const completedStep = { stage1: 1, stage2: 2, stage3: 3 }[currentStage];
    if (completedStep) {
      setUnlockedStep((currentStep) => Math.max(currentStep, completedStep + 1));
      const earnedStars = calculateStars({ won: true, lives, hitRate, elapsedSeconds });
      setStageStars((previous) => {
        return { ...previous, [currentStage]: Math.max(previous[currentStage] || 0, earnedStars) };
      });
    }
  };

  // Reset stage and formula progress while preserving settings and other saved data.
  const resetProgress = () => {
    setUnlockedStep(1);
    setFormulaUnlocks(getDefaultFormulaUnlocks());
    setStageStars({ stage1: 0, stage2: 0, stage3: 0 });
    resetEndlessHighScore();
  };
  const unlockAllStages = () => setUnlockedStep(FINAL_UNLOCKED_STEP);

  const openEditPreset = (preset) => {
    setActivePreset(preset);
    setEditingPreset(preset);
    setScreen("editPreset");
  };

  const openBuildChallenge = (stageName) => {
    const stageNumber = { stage1: 1, stage2: 2, stage3: 3 }[stageName];
    const steps = BUILD_CHALLENGE_BY_STAGE[stageNumber] || [];
    const nextStep = steps.find((step) => !formulaUnlocks[step.unlockedPresetId]);

    setCurrentStage(stageName);
    setBuildChallengeStep(nextStep || null);
    setScreen(nextStep ? "buildChallenge" : stageName);
  };

  const completeBuildChallenge = (presetId) => {
    setFormulaUnlocks((previous) => ({ ...previous, [presetId]: true }));
    const preset = [...stage1Presets, ...stage2Presets, ...stage3Presets].find((item) => item.id === presetId);
    if (preset) {
      setActivePreset(preset);
    }
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

  const handleContinue = (isEndlessMode = false) => {
    if (presets.length > 0) {
      setActivePreset(presets[0]);
    }
    startGameplay(isEndlessMode);
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
        stageStars={stageStars}
        endlessHighScore={endlessHighScore}
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
        onBuildChallenge={openBuildChallenge}
        isFormulaUnlocked={Boolean(formulaUnlocks[presets[0]?.id])}
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
        onBuildChallenge={openBuildChallenge}
        isFormulaUnlocked={Boolean(formulaUnlocks[presets[0]?.id])}
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
        onBuildChallenge={openBuildChallenge}
        isFormulaUnlocked={Boolean(formulaUnlocks[presets[0]?.id])}
      />
    );
  }

  if (screen === "endless") {
    return (
      <EndlessMode
        presets={presets}
        highScore={endlessHighScore}
        onBack={() => setScreen("stageSelect")}
        onAddEquation={() => setScreen("selectEquationType")}
        onStart={() => handleContinue(true)}
      />
    );
  }

  if (screen === "buildChallenge") {
    return (
      <BuildChallenge
        key={buildChallengeStep?.id}
        step={buildChallengeStep}
        onBack={() => setScreen(currentStage)}
        onComplete={completeBuildChallenge}
        onContinue={() => setScreen(currentStage)}
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
              : currentStage === "endless"
                ? ["linear", "quadratic", "cubic", "trig-sin", "trig-cos", "trig-tan", "trig-sec", "trig-cot", "trig-csc", "exponential", "logarithmic"]
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
        setScreen(currentStage === "endless" ? "endless" : "stageSelect");
      }}
      onWin={handleStageWin}
    />;
  }

  return null;
}

export default function App() {
  const [formulaUnlocks, setFormulaUnlocks] = useState(() => {
    const saved = readUnlockedFormulas();
    return { ...getDefaultFormulaUnlocks(), ...saved };
  });

  return (
    <GameProvider formulaUnlocks={formulaUnlocks} setFormulaUnlocks={setFormulaUnlocks}>
      <AppContent formulaUnlocks={formulaUnlocks} setFormulaUnlocks={setFormulaUnlocks} />
    </GameProvider>
  );
}