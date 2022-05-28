import React from 'react';
import { View, I18nManager } from 'react-native';
import NoRatingElement from './NoRatingElement';
import { isAndroid } from '../helper/utils';
import { elementStyle } from '../theme/styles';
import type { HalfRatingProps } from '../types/ratingTypes';

const HalfRatingElement: React.FC<HalfRatingProps> = ({
  size,
  children,
  enableMask,
  rtlMode,
  unratedColor,
  // fraction, // for exact fraction
}) => {
  // (I18nManager.isRTL && !isRTL):- if whole app is RTL and user passed 'ltr' then gesture will work opposite
  const isOnlyRatingRTL =
    (rtlMode && !I18nManager.isRTL) || (I18nManager.isRTL && !rtlMode);
  const androidRTL = isAndroid && isOnlyRatingRTL;

  // when android RTL is device based or forced, it works different, so inverting the condition on that case
  const handleRtlAndroid = I18nManager.isRTL ? androidRTL : !androidRTL;

  let padding =
    React.isValidElement(children) && children?.props?.style?.width
      ? (size - children?.props.style.width) / 2
      : 0;
  if (isNaN(padding)) {
    padding = 0;
  }

  return (
    <View style={{ width: size, height: size }}>
      {/* TODO:- improve this so it can support wide varity of elements */}
      {enableMask ? (
        <View>
          <NoRatingElement {...{ size, enableMask, unratedColor }}>
            {children}
          </NoRatingElement>

          <View
            style={[
              elementStyle(size).container,
              {
                position: 'absolute',
                overflow: 'hidden',
                paddingHorizontal: padding,
              },
              // for complete fraction use 'size * (1 - fraction)' instead of 'size / 2'
              !isAndroid || handleRtlAndroid
                ? { right: size / 2 }
                : { left: size / 2 },
            ]}
            removeClippedSubviews
          >
            <View
              style={[
                !isAndroid || handleRtlAndroid
                  ? { left: size / 2 }
                  : { right: size / 2 },
              ]}
            >
              {children}
            </View>
          </View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};
export default React.memo(HalfRatingElement);
