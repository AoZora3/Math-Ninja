import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Stars({ count = 0 }) {
  return (
    <View style={styles.resultStars} accessibilityLabel={`${count} out of 3 stars`}>
      {[0, 1, 2].map((star) => (
        <Text style={[styles.resultStar, star < count && styles.earned]} key={star}>
          {star < count ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resultStars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  resultStar: {
    fontSize: 32,
    color: '#888',
  },
  earned: {
    color: '#ffb703',
  },
});