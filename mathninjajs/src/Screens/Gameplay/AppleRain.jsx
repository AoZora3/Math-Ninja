import { useMemo } from 'react';
import appleSprite from '../../Assets/Sprites/Apple_Sprite.png';
import '../../Assets/Styles/AppleRain.css';

const APPLE_COUNT = 80;

export default function AppleRain() {
  const apples = useMemo(
    () =>
      Array.from({ length: APPLE_COUNT }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: -(Math.random() * 12),
        duration: 6 + Math.random() * 7,
        size: 18 + Math.random() * 18,
        drift: Math.random() * 80 - 40,
      })),
    []
  );

  return (
    <div className="apple-rain" aria-hidden="true">
      {apples.map((apple) => (
        <img
          key={apple.id}
          className="falling-apple"
          src={appleSprite}
          alt=""
          draggable="false"
          style={{
            left: `${apple.left}%`,
            width: `${apple.size}px`,
            height: `${apple.size}px`,
            animationDelay: `${apple.delay}s`,
            animationDuration: `${apple.duration}s`,
            '--apple-drift': `${apple.drift}px`,
          }}
        />
      ))}
    </div>
  );
}