import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';

export const clamp = (num: number, lower: number, upper: number) =>
  Math.min(Math.max(num, lower), upper);
