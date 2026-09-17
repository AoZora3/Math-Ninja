import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CheckIcon } from '../components/Icons';
import { Grid } from '../components/Grid';
import { Keypad } from '../components/Keypad';

export const EditPreset = ({
  initialEquation = null,
  onSaveEquation,
  onBack,
}) => {
  const [formula, setFormula] = useState(
    initialEquation?.formula || 'y = 2x - 3'
  );

  const getExprBody = (fullStr) => fullStr.replace(/^y\s*=\s*/i, '');

  const handleKeyPress = (val) => {
    if (val === 'CLEAR') {
      setFormula('y = ');
      return;
    }

    if (val === 'BACKSPACE') {
      const body = getExprBody(formula);
      if (body.length > 0) {
        let newBody = body;
        if (newBody.endsWith('√(')) {
          newBody = newBody.slice(0, -2);
        } else if (newBody.endsWith(' ') && newBody.length >= 3) {
          newBody = newBody.trimEnd();
          newBody = newBody.slice(0, -1).trimEnd();
        } else {
          newBody = newBody.slice(0, -1);
        }
        setFormula(`y = ${newBody}`);
      }
      return;
    }

    const body = getExprBody(formula);
    setFormula(`y = ${body}${val}`);
  };

  const handleSave = () => {

    const body = getExprBody(formula).trim();
    const finalFormula = body ? `y = ${body}` : 'y = x';

    const isQuadratic = finalFormula.includes('²') || finalFormula.includes('^2');
    const detectedType = isQuadratic ? 'quadratic' : 'linear';

    onSaveEquation({
      id: initialEquation?.id || String(Date.now()),
      formula: finalFormula,
      type: detectedType,
    });
  };

  return (
    <div className="screen edit-preset-screen">
      <Header
        title="EDIT PRESET"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            className="header-btn save-btn"
            onClick={handleSave}
            aria-label="Save equation"
          >
            <CheckIcon />
          </button>
        }
      />

      <div className="edit-preset-body">
        {/* Top Half: Graph Preview */}
        <div className="preview-section">
          <div className="formula-display-bar">
            <span className="formula-prefix">f(x)</span>
            <span className="formula-text">{formula || 'y = 0'}</span>
            <span className="formula-cursor" />
          </div>

          <div className="graph-plane-wrapper">
            <Grid
              range={10}
              width={335}
              height={280}
              equation={formula}
              fullBleed={false}
            />
          </div>

          <div className="preview-footer-hint">
            <span>GRID: [-10, 10]</span>
            <span className="live-pill">● PREVIEW</span>
          </div>
        </div>

        {/* Bottom Half: Keypad */}
        <div className="keypad-section">
          <Keypad onKeyPress={handleKeyPress} />
        </div>
      </div>
    </div>
  );
};
