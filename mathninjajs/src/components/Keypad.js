import React from 'react';

export const Keypad = ({ onKeyPress }) => {
  const keys = [
    // Row 1: Linear & Quadratic Function / Math keys
    { label: 'x', value: 'x', type: 'var' },
    { label: 'x²', value: '²', type: 'fn' },
    { label: '√x', value: '√(', type: 'fn' },
    { label: '(', value: '(', type: 'paren' },
    { label: ')', value: ')', type: 'paren' },

    // Row 2: Digits 7, 8, 9, Division, Clear
    { label: '7', value: '7', type: 'num' },
    { label: '8', value: '8', type: 'num' },
    { label: '9', value: '9', type: 'num' },
    { label: '÷', value: ' ÷ ', type: 'op' },
    { label: 'C', value: 'CLEAR', type: 'action-danger' },

    // Row 3: Digits 4, 5, 6, Multiplication, Backspace
    { label: '4', value: '4', type: 'num' },
    { label: '5', value: '5', type: 'num' },
    { label: '6', value: '6', type: 'num' },
    { label: '×', value: ' × ', type: 'op' },
    { label: '⌫', value: 'BACKSPACE', type: 'action' },

    // Row 4: Digits 1, 2, 3, Subtraction, Addition
    { label: '1', value: '1', type: 'num' },
    { label: '2', value: '2', type: 'num' },
    { label: '3', value: '3', type: 'num' },
    { label: '-', value: ' - ', type: 'op' },
    { label: '+', value: ' + ', type: 'op' },

    // Row 5: 0, Decimal point, Negative x, Reset, Done
    { label: '0', value: '0', type: 'num' },
    { label: '.', value: '.', type: 'num' },
    { label: '-x', value: '-x', type: 'var' },
    { label: '+ x', value: ' + x', type: 'var' },
    { label: '=', value: ' = ', type: 'op' },
  ];

  return (
    <div className="keypad-container">
      <div className="keypad-grid">
        {keys.map((k, idx) => (
          <button
            key={`${k.label}-${idx}`}
            type="button"
            className={`keypad-btn key-${k.type}`}
            onClick={() => onKeyPress(k.value)}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
};
