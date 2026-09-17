import React, { useState } from 'react';
import { Frame } from './components/Frame';
import { Equations } from './screens/Equations';
import { SelectType } from './screens/SelectType';
import { EditPreset } from './screens/EditPreset';
import { Gameplay } from './screens/Gameplay';

function App() {
  const [currentScreen, setCurrentScreen] = useState('display_equations');

  const [loadout, setLoadout] = useState([
    { id: '1', formula: 'y = x', type: 'linear', m: 1, b: 0 },
    { id: '2', formula: 'y = -x + 5', type: 'linear', m: -1, b: 5 },
    { id: '3', formula: 'y = x² - 4', type: 'quadratic', a: 1, b: 0, c: -4 },
  ]);

  const [editingEquation, setEditingEquation] = useState(null);

  const handleEditEquation = (eq) => {
    setEditingEquation(eq);
    setCurrentScreen('edit_preset');
  };

  const handleAddEquation = () => {
    setCurrentScreen('select_type');
  };

  const handleSelectType = (selectedType) => {
    setEditingEquation({
      id: String(Date.now()),
      formula: selectedType.defaultFormula || 'y = 2x',
      type: selectedType.id,
    });
    setCurrentScreen('edit_preset');
  };

  const handleSaveEquation = (savedEq) => {
    setLoadout((prev) => {
      const exists = prev.some((item) => item.id === savedEq.id);
      if (exists) {
        return prev.map((item) => (item.id === savedEq.id ? savedEq : item));
      }
      return [...prev, savedEq];
    });
    setEditingEquation(null);
    setCurrentScreen('display_equations');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'display_equations':
        return (
          <Equations
            loadout={loadout}
            onEditEquation={handleEditEquation}
            onAddEquation={handleAddEquation}
            onContinueToGame={() => setCurrentScreen('gameplay')}
          />
        );

      case 'select_type':
        return (
          <SelectType
            onBack={() => setCurrentScreen('display_equations')}
            onSelectType={handleSelectType}
          />
        );

      case 'edit_preset':
        return (
          <EditPreset
            initialEquation={editingEquation}
            onBack={() => setCurrentScreen('display_equations')}
            onSaveEquation={handleSaveEquation}
          />
        );

      case 'gameplay':
        return (
          <Gameplay
            onBackToEquations={() => setCurrentScreen('display_equations')}
          />
        );

      default:
        return (
          <Equations
            loadout={loadout}
            onEditEquation={handleEditEquation}
            onAddEquation={handleAddEquation}
            onContinueToGame={() => setCurrentScreen('gameplay')}
          />
        );
    }
  };

  return (
    <Frame>
      {renderScreen()}
    </Frame>
  );
}

export default App;
