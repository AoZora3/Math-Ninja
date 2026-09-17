import React from 'react';
import { Header } from '../components/Header';
import { PlusIcon, EditIcon } from '../components/Icons';

export const Equations = ({
  loadout,
  onEditEquation,
  onAddEquation,
  onContinueToGame,
}) => {
  return (
    <div className="screen display-equations-screen">
      
      <Header title="EQUATIONS" />

      <div className="screen-body">
        {/* Loadout Subheader */}
        <div className="loadout-header-info">
          <span className="loadout-subtitle">ACTIVE LOADOUT</span>
          <span className="loadout-counter">{loadout.length} / 6 EQUIPPED</span>
        </div>

        {/* Stacked Equation Cards */}
        <div className="equations-list">
          {loadout.map((eq, index) => (
            <div key={eq.id || index} className="equation-card">
              <div className="equation-info">
                <div className="equation-meta">
                  <span className="slot-badge">SLOT 0{index + 1}</span>
                  <span className="type-badge">{eq.type ? eq.type.toUpperCase() : 'CUSTOM'}</span>
                </div>
                <div className="equation-formula">
                  {eq.formula}
                </div>
              </div>

              <button
                type="button"
                className="btn-edit-dark"
                onClick={() => onEditEquation(eq)}
                aria-label={`Edit ${eq.formula}`}
              >
                <EditIcon />
                <span>EDIT</span>
              </button>
            </div>
          ))}

          {/* Empty slot indicator */}
          {loadout.length < 6 && (
            <button
              type="button"
              className="empty-slot-card"
              onClick={onAddEquation}
            >
              <div className="empty-slot-icon">
                <PlusIcon />
              </div>
              <span className="empty-slot-text">EMPTY WEAPON SLOT</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="screen-footer">
        <button
          type="button"
          className="btn-cyan-primary"
          onClick={onAddEquation}
        >
          <PlusIcon />
          <span> Add Equation</span>
        </button>

        <button
          type="button"
          className="btn-cyan-secondary"
          onClick={onContinueToGame}
        >
          <span>Continue</span>
          <span className="arcade-arrow">▶</span>
        </button>
      </footer>
    </div>
  );
};
