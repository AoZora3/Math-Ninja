import React from 'react';

export const BackArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

/* Gameplay Hearts matching screenshot */
export const HeartFilled = () => (
  <svg width="22" height="20" viewBox="0 0 24 24" fill="#ff5c47">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const HeartOutlined = () => (
  <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const LinearFunctionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="21" x2="21" y2="21" strokeOpacity="0.4"></line>
    <line x1="3" y1="3" x2="3" y2="21" strokeOpacity="0.4"></line>
    <line x1="4" y1="19" x2="20" y2="5" stroke="#00e5ff" strokeWidth="2.5"></line>
  </svg>
);

export const QuadraticFunctionIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="21" x2="21" y2="21" strokeOpacity="0.4"></line>
    <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.4"></line>
    <path d="M4 6 Q 12 20 20 6" stroke="#00e5ff" strokeWidth="2.5" fill="none"></path>
  </svg>
);

/**
 * Cartoon Apple Graphic matching the user's reference image
 */
export const CartoonApple = ({ size = 44, sliced = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
    {sliced ? (
      <g>
        {/* Left half tilted */}
        <g transform="translate(-4, -2) rotate(-10 32 32)">
          <path d="M30 14 C18 10 8 18 8 32 C8 48 18 58 30 58 Z" fill="#c40d1e" />
          <path d="M30 16 C20 16 12 24 12 34 C12 46 20 54 30 54 Z" fill="#ffefa8" />
          <circle cx="24" cy="34" r="2.5" fill="#421a08" />
        </g>
        {/* Right half tilted */}
        <g transform="translate(6, 2) rotate(12 32 32)">
          <path d="M34 14 C46 10 56 18 56 32 C56 48 46 58 34 58 Z" fill="#c40d1e" />
          <path d="M34 16 C44 16 52 24 52 34 C52 46 44 54 34 54 Z" fill="#ffefa8" />
          <circle cx="40" cy="34" r="2.5" fill="#421a08" />
        </g>
        {/* Neon Katana Slash Streak */}
        <line x1="4" y1="58" x2="60" y2="6" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
        <line x1="14" y1="48" x2="50" y2="16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ) : (
      <g>
        {/* Stem */}
        <path d="M32 14 C33 7 38 4 41 2" stroke="#5c2e0b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        
        {/* Leaf */}
        <path d="M32 14 C26 7 16 9 14 14 C21 17 28 17 32 14 Z" fill="#43a047" stroke="#2e7d32" strokeWidth="1" />
        <path d="M19 13 C23 14 27 15 32 14" stroke="#81c784" strokeWidth="1" fill="none" />

        {/* Apple Main Body */}
        <path
          d="M32 17 C26 11 12 13 12 28 C12 46 22 58 32 58 C42 58 52 46 52 28 C52 13 38 11 32 17 Z"
          fill="url(#appleGradient)"
          stroke="#940510"
          strokeWidth="1.5"
        />

        {/* Large Glossy Highlight (Left shoulder) */}
        <path
          d="M17 24 C14 29 15 38 18 43 C19 45 20 44 20 42 C17 37 17 29 20 24 C21 22 18 22 17 24 Z"
          fill="#ffffff"
          opacity="0.8"
        />
        
        {/* Small Specular Highlight (Right shoulder) */}
        <ellipse cx="43" cy="27" rx="3.5" ry="2" transform="rotate(-25 43 27)" fill="#ffffff" opacity="0.65" />

        <defs>
          <radialGradient id="appleGradient" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#e51f2b" />
            <stop offset="60%" stopColor="#be0c18" />
            <stop offset="100%" stopColor="#7a030b" />
          </radialGradient>
        </defs>
      </g>
    )}
  </svg>
);

export const KatanaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4l5.5 5.5L8 21l-5 1 1-5L14.5 4z"></path>
    <line x1="18" y1="7.5" x2="16.5" y2="9"></line>
  </svg>
);

/**
 * Cartoon Bomb Graphic for CS409 Fruit & Bomb hazard gameplay
 */
export const CartoonBomb = ({ size = 44, exploded = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
    {exploded ? (
      <g>
        {/* Explosion burst */}
        <circle cx="32" cy="32" r="28" fill="rgba(255, 68, 0, 0.2)" />
        <path d="M32 4 L38 22 L56 16 L44 30 L60 40 L42 44 L46 62 L32 48 L18 62 L22 44 L4 40 L20 30 L8 16 L26 22 Z" fill="#ff3b14" />
        <path d="M32 14 L36 24 L48 20 L40 28 L50 36 L38 38 L40 50 L32 42 L24 50 L26 38 L14 36 L24 28 L16 20 L28 24 Z" fill="#ffcc00" />
        <circle cx="32" cy="32" r="10" fill="#ffffff" />
      </g>
    ) : (
      <g>
        {/* Burning Fuse */}
        <path d="M34 16 C38 10 44 9 46 6" stroke="#966c42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        
        {/* Spark Star */}
        <g transform="translate(46, 6)">
          <circle cx="0" cy="0" r="4" fill="#ffe600" />
          <path d="M0 -6 L1 -2 L5 0 L1 2 L0 6 L-1 2 L-5 0 L-1 -2 Z" fill="#ff4800" />
        </g>

        {/* Bomb Cap */}
        <rect x="27" y="14" width="10" height="5" rx="1.5" fill="#525766" stroke="#2a2e38" strokeWidth="1" />

        {/* Bomb Sphere */}
        <circle cx="32" cy="36" r="22" fill="url(#bombGradient)" stroke="#111317" strokeWidth="1.5" />

        {/* Skull / Hazard X */}
        <path d="M26 30 L38 42 M38 30 L26 42" stroke="#ff385c" strokeWidth="3" strokeLinecap="round" opacity="0.9" />

        {/* Glossy Curved Highlight */}
        <path d="M20 22 C16 26 15 34 17 38 C18 39 19 38 18 36 C16 32 17 26 21 22 Z" fill="#ffffff" opacity="0.5" />

        <defs>
          <radialGradient id="bombGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#404452" />
            <stop offset="60%" stopColor="#1e2029" />
            <stop offset="100%" stopColor="#0d0e12" />
          </radialGradient>
        </defs>
      </g>
    )}
  </svg>
);


