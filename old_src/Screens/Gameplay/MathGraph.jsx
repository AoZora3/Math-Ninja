import { useRef, useEffect } from 'react';
import { drawGraph } from '../../Game/GraphRender.js';

export default function MathGraph({ activePreset, range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }, width = 400, height = 400 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawGraph(ctx, activePreset, range, width, height);
    } catch {
    }
  }, [activePreset, range, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
