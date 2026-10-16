import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const formatSliderValue = (value) => Number(value).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

export default function PresetCards({ preset, onChange }) {
  const sliderStep = 0.01;
  const safePreset = preset || {};
  const coefficients = safePreset.coefficients || { a: 1, b: 0 };
  const minMax = safePreset.minMax || { a: [-5, 5], b: [-5, 5] };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{safePreset.label || 'Preset'}</Text>
      {Object.keys(coefficients).map(key => {
        const currentValue = Number(coefficients[key] ?? 0);
        const bounds = minMax[key] || [-5, 5];

        return (
          <View key={key} style={styles.labelContainer}>
            <View style={styles.header}>
              <Text style={styles.text}>{key}</Text>
              <Text style={styles.boldText}>{formatSliderValue(currentValue)}</Text>
            </View>
            <Slider
              minimumValue={bounds[0]}
              maximumValue={bounds[1]}
              step={sliderStep}
              value={currentValue}
              onValueChange={val => onChange?.(safePreset.id, key, Number.parseFloat(Number(val).toFixed(2)))}
              style={styles.slider}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  title: {
    margin: 0,
    marginBottom: 12,
    fontWeight: '700',
    fontSize: 16,
  },
  labelContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});