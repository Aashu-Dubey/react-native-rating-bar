import { StyleSheet } from 'react-native';

export const elementStyle = (itemSize: number) =>
  StyleSheet.create({
    container: {
      width: itemSize,
      height: itemSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
