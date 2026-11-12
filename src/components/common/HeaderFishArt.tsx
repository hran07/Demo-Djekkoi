import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export function HeaderFishArt() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Ripple Rings */}
      <Svg
        width={260}
        height={260}
        viewBox="0 0 260 260"
        fill="none"
        style={styles.ripple}
      >
        <Circle cx={130} cy={130} r={40} stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={1.5} />
        <Circle cx={130} cy={130} r={72} stroke="#FFFFFF" strokeOpacity={0.13} strokeWidth={1.5} />
        <Circle cx={130} cy={130} r={106} stroke="#FFFFFF" strokeOpacity={0.09} strokeWidth={1.5} />
        <Circle cx={130} cy={130} r={128} stroke="#FFFFFF" strokeOpacity={0.06} strokeWidth={1.5} />
      </Svg>

      {/* Koi Fish Illustration */}
      <Svg
        width={118}
        height={76}
        viewBox="0 0 118 76"
        fill="none"
        style={styles.fish}
      >
        <Path d="M8 38C28 14 62 14 84 36C62 60 28 62 8 38Z" fill="#E4572E" />
        <Path d="M84 36L110 18L103 36L110 56Z" fill="#F08A63" />
        <Path d="M34 24C46 20 56 22 64 28C56 30 44 30 34 24Z" fill="#FFFFFF" fillOpacity={0.92} />
        <Circle cx={24} cy={34} r={3} fill="#0B2B33" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    right: -70,
    top: -50,
  },
  fish: {
    position: 'absolute',
    right: 32,
    top: 96,
    transform: [{ rotate: '-16deg' }],
  },
});

