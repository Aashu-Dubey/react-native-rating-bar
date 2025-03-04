import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Animated,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
  type ColorValue,
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  isSelected: boolean;
  radioColor?: ColorValue;
  inactiveColor?: ColorValue;
  onSelectionChange?: () => void;
}

const RadioBtn: React.FC<Props> = ({
  style,
  textStyle,
  title,
  isSelected,
  radioColor = '#454B79',
  inactiveColor = '#454B79',
  onSelectionChange,
}) => {
  const fadeBoxAnim = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeBoxAnim, {
        toValue: isSelected ? 10 : 16,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: isSelected ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  });

  return (
    <TouchableOpacity
      style={[styles.radioBtn, style]}
      activeOpacity={0.6}
      disabled={!onSelectionChange}
      onPress={() => onSelectionChange && onSelectionChange()}
    >
      <View
        style={[
          styles.radioCircle,
          { borderColor: isSelected ? radioColor : inactiveColor },
        ]}
      >
        <Animated.View
          style={[
            styles.radioInnerCircleStyle,
            {
              height: fadeBoxAnim,
              width: fadeBoxAnim,
              opacity,
              backgroundColor: radioColor,
            },
          ]}
        />
      </View>
      <Text style={[{ paddingHorizontal: 16 }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioBtn: {
    // backgroundColor: '#F6F8F9',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#454B79',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircleStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#454B79',
  },
});

export default RadioBtn;
