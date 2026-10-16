import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Stars from '../../Components/Stars.jsx';

export function calculateStars({ won, hitRate, elapsedSeconds }) {
  if (!won) return 0;
  return 1 + Number(hitRate >= 80) + Number(elapsedSeconds <= 120);
}

export default function StageResult({
  won,
  score,
  hitRate = 0,
  elapsedSeconds = 0,
  isEndless = false,
  onRetry,
  onBack,
}) {
  const stars = calculateStars({ won, hitRate, elapsedSeconds });
  const resultMessage = won
    ? 'Goal reached. Your run is complete.'
    : 'Time is up. The goal was not reached in time.';

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, won || isEndless ? styles.winBackground : styles.lossBackground]}>
      <View style={styles.card}>
        <Text style={styles.kicker}>
          {isEndless ? 'ENDLESS MODE' : 'RUN COMPLETE'}
        </Text>

        <Text style={styles.title}>
          {isEndless ? 'Endless Complete' : won ? 'Stage Cleared' : 'Game Over'}
        </Text>

        {!isEndless && (
          <>
            <Text style={styles.message}>{resultMessage}</Text>
            <Stars count={stars} />
            <Text style={styles.starSummary}>{stars} of 3 stars earned</Text>
          </>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>POINTS</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Hit Rate</Text>
            <Text style={styles.statValue}>{Math.floor(hitRate)}%</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>{formatTime(elapsedSeconds)}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onBack}>
            <Text style={styles.secondaryButtonText}>Back to Stage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  winBackground: {
    backgroundColor: 'rgba(15, 32, 24, 0.95)',
  },
  lossBackground: {
    backgroundColor: 'rgba(32, 15, 15, 0.95)',
  },
  card: {
    backgroundColor: '#181825',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#313244',
  },
  kicker: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a6adc8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cdd6f4',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#bac2de',
    textAlign: 'center',
    marginBottom: 16,
  },
  starSummary: {
    fontSize: 12,
    color: '#a6adc8',
    marginTop: 6,
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a6adc8',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f9e2af',
  },
  statsContainer: {
    width: '100%',
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#313244',
    paddingVertical: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#a6adc8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#cdd6f4',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#89b4fa',
  },
  secondaryButton: {
    backgroundColor: '#313244',
  },
  primaryButtonText: {
    color: '#11111b',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#cdd6f4',
    fontWeight: '600',
    fontSize: 14,
  },
});