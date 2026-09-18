import { useContext, useState } from "react";
import "./App.css";
import TitleScreen from "./Screens/TitleScreen/TitleScreen.jsx";
import StageSelect from "./Screens/StageSelect/StageSelect.jsx";
import Stage1 from "./Screens/StageSelect/Stage1.jsx";
import EditPreset from "./Screens/EditPreset/EditPreset.jsx";
import EquationTypeSelect from "./Screens/EquationTypeSelect/EquationTypeSelect.jsx";
import Gameplay from "./Screens/Gameplay/Gameplay.jsx";
import { GameContext, GameProvider } from "./Context/GameContext.jsx";

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
    setScreen("stage1");
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
    return <StageSelect screen={screen} setScreen={setScreen} />;
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

  if (screen === "selectEquationType") {
    return (
      <EquationTypeSelect
        onBack={() => setScreen("stage1")}
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
        onBack={() => setScreen("stage1")}
        onSave={savePreset}
      />
    );
  }

  if (screen === "gameplay") {
    return <Gameplay onBack={() => setScreen("stage1")} />;
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
