import { useRef, useEffect } from 'react';
import { drawGraph } from '../../game/graphRenderer';

export default function MathGraph({ activePreset, range = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }, width = 400, height = 400 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawGraph(ctx, activePreset, range, width, height);
  }, [activePreset, range, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}