import { useContext, useState } from "react";
import "./App.css";
import TitleScreen from "./Screens/TitleScreen/TitleScreen.jsx";
import StageSelect from "./Screens/StageSelect/StageSelect.jsx";
import Stage1 from "./Screens/StageSelect/Stage1.jsx";
import Stage2 from "./Screens/StageSelect/Stage2.jsx";
import Stage3 from "./Screens/StageSelect/Stage3.jsx";
import Stage4 from "./Screens/StageSelect/Stage4.jsx";
import EditPreset from "./Screens/EditPreset/EditPreset.jsx";
import EquationTypeSelect from "./Screens/EquationTypeSelect/EquationTypeSelect.jsx";
import Gameplay from "./Screens/Gameplay/Gameplay.jsx";
import { GameContext, GameProvider } from "./Context/GameContext.jsx";
import { stage1Presets } from "./Game/Equations/StagePreset1.js";
import { stage2Presets } from "./Game/Equations/StagePreset2.js";
import { stage3Presets } from "./Game/Equations/StagePreset3.js";
import { stage4Presets } from "./Game/Equations/StagePreset4.js";

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
    return {
      id: baseId,
      type: "exponential",
      label: "y = A * exp(-B * (x - H)) + K",
      equation: "y = 2 * exp(-1.5 * (x - 1)) + 0",
      title: "HOOK SHOT",
      description: "A steep hook that glides flat before snapping up.",
      coefficients: { a: 2, b: 1.5, h: 1, k: 0 },
      minMax: { a: [0, 5], b: [0.2, 4], h: [-5, 5], k: [-5, 5] },
      fn: (x, c) => (c.a ?? 1) * Math.exp(-(c.b ?? 1) * (x - (c.h ?? 0))) + (c.k ?? 0)
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
  const { presets, setPresets, setActivePreset, startGameplay } = useContext(GameContext);
  const [screen, setScreen] = useState("splash");
  const [editingPreset, setEditingPreset] = useState(null);
  const [currentStage, setCurrentStage] = useState("stage1");

  const goToStage = (stageName) => {
    const nextPresets =
      stageName === "stage2"
        ? stage2Presets
        : stageName === "stage3"
          ? stage3Presets
          : stageName === "stage4"
            ? stage4Presets
            : stage1Presets;
    setCurrentStage(stageName);
    setPresets(nextPresets);
    setActivePreset(nextPresets[0]);
    setScreen(stageName);
  };

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

  if (screen === "splash") {
    return <TitleScreen screen={screen} onStart={() => setScreen("stageSelect")} />;
  }

  if (screen === "stageSelect") {
    return <StageSelect screen={screen} setScreen={goToStage} />;
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

  if (screen === "stage4") {
    return (
      <Stage4
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
              ? ["logarithmic"]
              : currentStage === "stage4"
                ? ["exponential"]
                : ["quadratic", "linear"]
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
    return <Gameplay onBack={() => setScreen(currentStage)} />;
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
