export default function Combo({ multiplier = 1, streak = 0 }) {
  return (
    <div className="combo-container" aria-label={`${multiplier} times multiplier, ${streak} hit streak`}>
      <strong className={`combo-multiplier ${multiplier > 1 ? 'active' : ''}`}>
        {multiplier}x
      </strong>
      {streak > 0 && <span className="combo-streak">{streak} STREAK</span>}
    </div>
  );
}