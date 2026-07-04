import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import type { ThemeColors } from '../theme';

type Props = {
  message: string | null;
  colors: ThemeColors;
  onHide: () => void;
  type?: 'success' | 'error';
};

export function Toast({ message, colors, onHide, type = 'success' }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [message, onHide, opacity]);

  if (!message) return null;

  const bg = type === 'success' ? colors.ok : colors.danger;

  return (
    <Animated.View style={[styles.wrap, { backgroundColor: bg, opacity }]}>
      <Text style={styles.text}>
        {type === 'success' ? '✓ ' : '✕ '}
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 14,
    zIndex: 999,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center' },
});
