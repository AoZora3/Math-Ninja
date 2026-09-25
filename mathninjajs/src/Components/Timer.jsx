function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function Timer({ mode = 'countdown', seconds = 0 }) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const isUrgent = mode === 'countdown' && safeSeconds <= 10;

  return (
    <div className="timer-badge" aria-label={`${mode === 'countdown' ? 'Time remaining' : 'Time elapsed'} ${formatTime(safeSeconds)}`}>
      <span className="timer-label">{mode === 'countdown' ? 'REMAINING' : 'ELAPSED'}</span>
      <strong className={`timer-value ${isUrgent ? 'urgent' : ''}`}>
        {formatTime(safeSeconds)}
      </strong>
    </div>
  );
}