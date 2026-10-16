import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Timer({
  mode = 'countup',
  initialTime = 60,
  seconds: controlledSeconds,
  isActive = true,
  onTimeUp,
  onTick,
}) {
  const [internalSeconds, setInternalSeconds] = useState(mode === 'countdown' ? initialTime : 0);
  const isControlled = Number.isFinite(controlledSeconds);
  const seconds = isControlled ? controlledSeconds : internalSeconds;

  useEffect(() => {
    if (isControlled) return undefined;

    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setInternalSeconds((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              clearInterval(interval);
              if (onTimeUp) onTimeUp();
              return 0;
            }
            const next = prev - 1;
            if (onTick) onTick(next);
            return next;
          } else {
            const next = prev + 1;
            if (onTick) onTick(next);
            return next;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isControlled, mode, initialTime, onTimeUp, onTick]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = mode === 'countdown' && seconds <= 10;

  return (
    <View style={styles.timerBadge}>
      <Text style={styles.timerLabel}>
        {mode === 'countdown' ? '⏳ REMAINING' : '⏱ ELAPSED'}
      </Text>
      <Text style={[styles.timerValue, isLowTime && styles.lowTime]}>
        {formatTime(seconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerLabel: {
    fontSize: 14,
  },
  timerValue: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  lowTime: {
    color: '#e63946',
  },
});