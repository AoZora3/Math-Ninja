import React from 'react';
import { Header } from '../components/Header';
import { PlusIcon, LinearFunctionIcon, QuadraticFunctionIcon } from '../components/Icons';

export const SelectType = ({ onBack, onSelectType }) => {
  const equationTypes = [
    {
      id: 'linear',
      title: 'Linear',
      subtitle: 'y = mx + b',
      defaultFormula: 'y = 2x - 3',
      icon: <LinearFunctionIcon />,
    },
    {
      id: 'quadratic',
      title: 'Quadratic',
      subtitle: 'y = ax² + bx + c',
      defaultFormula: 'y = x² - 4',
      icon: <QuadraticFunctionIcon />,
    },
  ];

  return (
    <div className="screen select-type-screen">
      <Header title="SELECT TYPE" onBack={onBack} />

      <div className="screen-body">
        <div className="select-type-header">
          <span className="section-eyebrow">EQUATION TYPE</span>
          <p className="section-hint">Select a category to build your equation</p>
        </div>

        <div className="type-options-list">
          {equationTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className="type-card"
              onClick={() => onSelectType(type)}
            >
              <div className="type-icon-box">
                {type.icon}
              </div>

              <div className="type-text-content">
                <span className="type-title">{type.title}</span>
                <span className="type-subtitle">{type.subtitle}</span>
                <span className="type-desc">{type.description}</span>
              </div>

              <div className="type-plus-action">
                <PlusIcon />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
