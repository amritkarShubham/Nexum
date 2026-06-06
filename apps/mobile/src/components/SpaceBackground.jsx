import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Ellipse, Line, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay, Easing, interpolate } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const Star = ({ size, delay, x, y }) => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withDelay(delay * 1000, withRepeat(withSequence(
      withTiming(1, { duration: 2000 + Math.random() * 3000, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.3, { duration: 2000 + Math.random() * 3000, easing: Easing.inOut(Easing.ease) })
    ), -1, true));
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <AnimatedCircle cx={x} cy={y} r={size} fill="#fff" style={style} />;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PlanetA = () => {
  const translateY = useSharedValue(0);
  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return (
    <Animated.View style={[styles.planetWrapper, { left: '12%', top: '38%' }, style]}>
      <View style={[styles.planet, { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FF6B9D', shadowColor: '#FF6B9D' }]} />
      <View style={styles.ring} />
    </Animated.View>
  );
};

const PlanetB = () => {
  const translateY = useSharedValue(10);
  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return (
    <Animated.View style={[styles.planetWrapper, { right: '12%', top: '42%' }, style]}>
      <View style={[styles.planet, { width: 80, height: 80, borderRadius: 40, backgroundColor: '#7C3AED', shadowColor: '#7C3AED' }]} />
      <View style={[styles.ring, { borderColor: 'rgba(124,58,237,0.2)' }]} />
    </Animated.View>
  );
};

const Beam = () => {
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.6);

  useEffect(() => {
    opacity1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1250, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
    opacity2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1250, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1250, easing: Easing.inOut(Easing.ease) })
      ), -1, true
    );
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: opacity1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: opacity2.value }));

  return (
    <View style={styles.beamContainer}>
      <Animated.View style={[styles.beam, { backgroundColor: 'rgba(255,107,157,0.15)' }, style1]} />
      <Animated.View style={[styles.beam, { backgroundColor: 'rgba(124,58,237,0.1)', width: 120 }, style2]} />
      <Animated.View style={[styles.beam, { backgroundColor: 'rgba(255,107,157,0.08)', width: 60 }, style1]} />
    </View>
  );
};

export default function SpaceBackground() {
  const stars = useMemo(() => {
    const result = [];
    const configs = [
      { count: 80, size: 1 },
      { count: 40, size: 1.5 },
      { count: 15, size: 2 },
    ];
    configs.forEach((cfg) => {
      for (let i = 0; i < cfg.count; i++) {
        result.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: cfg.size,
          delay: Math.random() * 4,
        });
      }
    });
    return result;
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {stars.map((s, i) => (
          <Star key={i} {...s} />
        ))}
      </Svg>
      <PlanetA />
      <PlanetB />
      <Beam />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', width: '100%', height: '100%', zIndex: 0 },
  planetWrapper: { position: 'absolute' },
  planet: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  ring: {
    position: 'absolute', inset: -3, borderRadius: 50,
    borderWidth: 1, borderColor: 'rgba(255,107,157,0.15)',
  },
  beamContainer: {
    position: 'absolute', top: '48%', left: '30%', right: '30%',
    height: 4, alignItems: 'center', justifyContent: 'center',
  },
  beam: { height: 3, borderRadius: 2, marginVertical: 1 },
});
