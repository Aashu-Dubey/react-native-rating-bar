import React from 'react';
import { View } from 'react-native';
import { getClonedElement } from '../helper/cloneElement';
import { elementStyle } from '../theme/styles';
import type { NoRatingProps } from '../types/ratingTypes';

const NoRatingElement: React.FC<NoRatingProps> = ({
  size,
  children,
  enableMask,
  unratedColor,
}) => {
  const cloneChild = enableMask
    ? getClonedElement(children, size, unratedColor)
    : children;

  return (
    <View style={elementStyle(size).container}>
      {/* TODO:- improve this so it can support wide varity of elements */}
      {cloneChild}
    </View>
  );
};
export default React.memo(NoRatingElement);
