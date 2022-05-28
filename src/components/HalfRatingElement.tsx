import React from 'react';
import { View, I18nManager, Animated } from 'react-native';
import NoRatingElement from './NoRatingElement';
// import { doubleCloneElement } from '../helper/cloneElement';
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
  // const clonedChild = getClonedElement(children, size);
  /* const clonedChild = getClonedElement(
      children,
      size,
      // enableMask ? unratedColor : undefined,
    ); */

  // Use legacy implementation based on "RatingBarIndicator.tsx" code
  /* // Legacy
    const clonedChild = doubleCloneElement(children, {}); */

  // New solution
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
          {/* TODO: check if this width: '50%' works properly on other type of elements */}
          <Animated.View
            style={[
              elementStyle(size).container,
              {
                position: 'absolute',
                overflow: 'hidden',
                paddingHorizontal: padding,
              },
              // for complete fraction user 'size * (1 - fraction)' instead of 'size / 2'
              !isAndroid || handleRtlAndroid
                ? { right: size / 2 }
                : { left: size / 2 },
            ]}
            removeClippedSubviews
          >
            <Animated.View
              style={[
                !isAndroid || handleRtlAndroid
                  ? { left: size / 2 }
                  : { right: size / 2 },
              ]}
            >
              {children}
            </Animated.View>
          </Animated.View>
        </View>
      ) : (
        children
      )}
    </View>
  );

  // const clonedChild = enableMask
  //   ? doubleCloneElement(
  //       children,
  //       // for complete fraction user 'size * (1 - fraction)' instead of 'size / 2'
  //       !isAndroid || handleRtlAndroid
  //         ? { left: size / 2 }
  //         : { right: size / 2 },
  //     )
  //   : null;

  // return (
  //   <View style={{ width: size, height: size }}>
  //     {/* TODO:- improve this so it can support wide varity of elements */}
  //     {enableMask ? (
  //       <View>
  //         <NoRatingElement {...{ size, enableMask, unratedColor }}>
  //           {children}
  //         </NoRatingElement>
  //         <View
  //           style={{ position: 'absolute', width: size, height: size }}
  //           removeClippedSubviews
  //         >
  //           {/* {children} */}
  //           {/* TODO: check if this width: '50%' works properly on other type of elements */}
  //           {(() => {
  //             // let paddingLeft = 0;
  //             let padding = clonedChild?.props?.style?.width
  //               ? (size - clonedChild?.props.style.width) / 2
  //               : 0;
  //             if (isNaN(padding)) {
  //               padding = 0;
  //             }
  //             // const isImage = clonedChild?.type === Image;

  //             // // Legacy
  //             // return (
  //             //   <View
  //             //     style={[
  //             //       {
  //             //         height: '100%',
  //             //         width: '50%',
  //             //         overflow: 'hidden',
  //             //         justifyContent: 'center',
  //             //         paddingHorizontal: padding,
  //             //       },
  //             //       // Image probably handles RTL compare to a vector icon so disabling it for Image
  //             //       isOnlyRatingRTL &&
  //             //         !isImage && { transform: [{ scaleX: -1 }] },
  //             //       androidRTL && { alignSelf: 'flex-end' },
  //             //     ]}
  //             //   >
  //             //     {clonedChild}
  //             //     {/* {children} */}
  //             //   </View>
  //             // );
  //             // /* }
  //             // return children; */

  //             // New solution
  //             return (
  //               <View
  //                 style={[
  //                   elementStyle(size).container,
  //                   { overflow: 'hidden', paddingHorizontal: padding },
  //                   // for complete fraction user 'size * (1 - fraction)' instead of 'size / 2'
  //                   !isAndroid || handleRtlAndroid
  //                     ? { right: size / 2 }
  //                     : { left: size / 2 },
  //                 ]}
  //               >
  //                 {/* <View
  //                   style={[
  //                     !isAndroid || handleRtlAndroid
  //                       ? { left: size / 2 }
  //                       : { right: size / 2 },
  //                   ]}
  //                 > */}
  //                 {clonedChild}
  //                 {/* {children}
  //                 </View> */}
  //               </View>
  //             );
  //           })()}
  //         </View>
  //       </View>
  //     ) : (
  //       children
  //     )}
  //   </View>
  // );
};
export default React.memo(HalfRatingElement);
