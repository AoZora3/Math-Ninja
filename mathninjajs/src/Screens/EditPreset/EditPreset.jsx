import { useState } from 'react';
import { stage1Presets } from '../../Game/Equations/Stage1.js';
import PresetCard from '../../Components/PresetCards.jsx';
import MathGraph from '../Gameplay/MathGraph';

export default function EditPreset() {
  const [presets, setPresets] = useState(stage1Presets);
  const [previewId, setPreviewId] = useState(presets[0].id);

  function handleChange(id, key, value) {
    setPresets(prev => prev.map(p =>
      p.id === id ? { ...p, coefficients: { ...p.coefficients, [key]: value } } : p
    ));
  }

  const previewPreset = presets.find(p => p.id === previewId);

  return (
    <div>
      <MathGraph activePreset={previewPreset} />
      {presets.map(p => (
        <div key={p.id} onClick={() => setPreviewId(p.id)}>
          <PresetCard preset={p} onChange={handleChange} />
        </div>
      ))}
    </div>
  );
}
