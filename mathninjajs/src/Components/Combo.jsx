export default function Combo({ multiplier = 1, streak = 0 }) {
  return (
    <div className="combo-container">
      <span className={`combo-multiplier ${multiplier > 1 ? 'active' : ''}`}>
        {multiplier}x
      </span>
      {streak > 0 && (
        <span className="combo-streak">
          ({streak} STREAK)
        </span>
      )}
    </div>
  );
}
