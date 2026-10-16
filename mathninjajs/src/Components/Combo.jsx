import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Combo({ multiplier = 1, streak = 0 }) {
  return (
    <View style={styles.comboContainer}>
      <Text style={[styles.comboMultiplier, multiplier > 1 && styles.active]}>
        {multiplier}x
      </Text>
      {streak > 0 && (
        <Text style={styles.comboStreak}>
          ({streak} STREAK)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  comboContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  comboMultiplier: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  active: {
    color: '#ffb703',
  },
  comboStreak: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4cc9f0',
  },
});