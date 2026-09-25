import { useState } from "react";
import "./App.css";
import TitleScreen from "./Screens/TitleScreen/TitleScreen.jsx";
import StageSelect from "./Screens/StageSelect/StageSelect.jsx";
import Stage1 from "./Screens/StageSelect/Stage1.jsx";
import Gameplay from "./Screens/Gameplay/Gameplay.jsx";

function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedPreset, setSelectedPreset] = useState("y = x");

  // =========================
  // SPLASH SCREEN
  // =========================
  if (screen === "splash") {
    return <TitleScreen screen={screen} onStart={() => setScreen("stageSelect")} />;
  }

  // =========================
  // STAGE SELECT
  // =========================
  if (screen === "stageSelect") {
    return <StageSelect screen={screen} setScreen={setScreen} />;
  }

  // =========================
  // STAGE 1 PRESET DISPLAY
  // =========================
  if (screen === "stage1") {

    const presets = [
      {
        equation: "y = x",
        title: "BASIC LINE",
        description:
          "A simple diagonal line with a positive slope.",
      },
      {
        equation: "y = 2x",
        title: "STEEP LINE",
        description:
          "Increasing the coefficient makes the line steeper.",
      },
      {
        equation: "y = x + 2",
        title: "UPWARD SHIFT",
        description:
          "The constant moves the line upward.",
      },
      {
        equation: "y = x - 2",
        title: "DOWNWARD SHIFT",
        description:
          "A negative constant moves the line downward.",
      },
    ];

    return <Stage1 presets={presets} setScreen={setScreen} onSelectPreset={setSelectedPreset} />;
  
  }
  if (screen === "gameplay") {
    return <Gameplay setScreen={setScreen} initialEquation={selectedPreset} />;
  }
  return null;
}

export default App;
