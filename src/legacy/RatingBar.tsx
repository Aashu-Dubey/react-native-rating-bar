import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  ColorValue,
  I18nManager,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/MaterialIcons';

interface RatingElementType {
  full: JSX.Element | React.ReactNode;
  half: JSX.Element;
  empty: JSX.Element;
}

interface RatingCommonProps {
  onRatingUpdate: (rating: number) => void;
  itemCount?: number;
  glowColor?: ColorValue;
  minRating?: number;
  maxRating?: number;
  textDirection?: 'ltr' | 'rtl';
  unratedColor?: ColorValue;
  allowHalfRating?: boolean;
  direction?: 'vertical' | 'horizontal';
  glow?: boolean;
  glowRadius?: number;
  ignoreGestures?: boolean;
  initialRating?: number;
  itemPadding?: number;
  itemSize?: number;
  tapOnlyMode?: boolean;
  updateOnDrag?: boolean;
  //   wrapAlignment: any;
}

type RatingBarProps = RatingCommonProps &
  (
    | {
        ratingElement?: RatingElementType;
        itemBuilder: (index: number) => JSX.Element;
      }
    | {
        ratingElement: RatingElementType;
        itemBuilder?: (index: number) => JSX.Element;
      }
  );

interface NoRatingProps {
  size: number;
  children: React.ReactNode;
  enableMask: boolean;
  unratedColor: ColorValue;
}

interface HalfRatingProps {
  size: number;
  children: JSX.Element | null | undefined;
  enableMask: boolean;
  rtlMode: boolean;
  unratedColor: ColorValue;
}

const isAndroid = Platform.OS === 'android';

/**
 * This file is the initial version of code I tried
 */

// TODO:- find better solution so we don't need this
const getClonedElement = (
  children: React.ReactNode,
  iconSize: number,
  color?: number | ColorValue | undefined
) => {
  /* const clonedElement = React.isValidElement(children)
    ? React.cloneElement(children, {
        // // color: unratedColor,
        size,
        style: { width: size, height: size },
      })
    : null; */

  /* if (clonedElement) {
    clonedElement.props.style.width = clonedElement.props.style?.width || size;
    clonedElement.props.style.height =
      clonedElement.props.style?.height || size;
    clonedElement.props.size = clonedElement.props.size || size;
  } */

  let clonedElement: JSX.Element | null = null;
  if (children && React.isValidElement(children)) {
    const size = children.props.size || iconSize;
    const props = color ? { size, color } : { size };
    clonedElement = React.cloneElement(children, props);
    let style = clonedElement.props.style;
    if (style) {
      style.width = style.width || '100%';
      style.height = style.height || '100%';
      if (color) {
        style.tintColor = color;
      }
    }
    // rateFullCloned.props.size = itemSize;
  }

  return clonedElement;
};

const doubleCloneElement = (children: React.ReactNode, style: any) => {
  let clonedElement: JSX.Element | null = null;
  if (children && React.isValidElement(children)) {
    clonedElement = React.cloneElement(children, {
      style: { ...children.props.style, ...style },
    });
  }

  return clonedElement;
};

const HalfRatingElement: React.FC<HalfRatingProps> = ({
  size,
  children,
  enableMask,
  rtlMode,
  unratedColor,
}) => {
  const isOnlyRatingRTL =
    (rtlMode && !I18nManager.isRTL) || (I18nManager.isRTL && !rtlMode);
  const androidRTL = isAndroid && isOnlyRatingRTL;
  // const clonedChild = getClonedElement(children, size);
  /* const clonedChild = getClonedElement(
    children,
    size,
    // enableMask ? unratedColor : undefined,
  ); */
  // const clonedChild = React.cloneElement(children, { size, key: 'half' });

  // Use legacy implementation based on "RatingBarIndicator.tsx" code
  /* // Legacy
  const clonedChild = doubleCloneElement(children, {}); */

  // New solution
  // when android RTL is device based or forced, it works different, so inverting the condition on that case
  const handleRtlAndroid = I18nManager.isRTL ? androidRTL : !androidRTL;
  const clonedChild = doubleCloneElement(
    children,
    !isAndroid || handleRtlAndroid ? { left: size / 2 } : { right: size / 2 }
  );

  return (
    <View style={{ width: size, height: size }}>
      {/* TODO:- improve this so it can support wide varity of elements */}
      {enableMask ? (
        <View>
          <NoRatingElement {...{ size, enableMask, unratedColor }}>
            {children}
          </NoRatingElement>
          <View style={{ position: 'absolute', width: size, height: size }}>
            {/* {children} */}
            {/* TODO: check if this width: '50%' works properly on other type of elements */}
            {(() => {
              // if (clonedChild) {
              /* clonedChild.props.style.height = '100%';
                clonedChild.props.style.width = '50%';
                if (rtlMode) {
                  clonedChild.props.style.transform = [{ scaleX: -1 }];
                }
                // clonedChild.props.style.backgroundColor = 'blue';
                return clonedChild; */
              // clonedChild.props.style.tintColor = 'green';

              // let paddingLeft = 0;
              const padding = clonedChild?.props?.style?.width
                ? (size - clonedChild?.props.style.width) / 2
                : 0;
              // const isImage = clonedChild?.type === Image;

              // // Legacy
              // return (
              //   <View
              //     style={[
              //       {
              //         height: '100%',
              //         width: '50%',
              //         overflow: 'hidden',
              //         justifyContent: 'center',
              //         paddingHorizontal: padding,
              //       },
              //       // Image probably handles RTL compare to a vector icon so disabling it for Image
              //       isOnlyRatingRTL &&
              //         !isImage && { transform: [{ scaleX: -1 }] },
              //       androidRTL && { alignSelf: 'flex-end' },
              //     ]}
              //   >
              //     {clonedChild}
              //     {/* {children} */}
              //   </View>
              // );
              // /* }
              // return children; */

              // New solution
              return (
                <View
                  style={[
                    {
                      height: size,
                      width: size,
                      // width: size / 2,
                      // right: size / 2,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: padding,
                      // backgroundColor: 'red',
                    },
                    !isAndroid || handleRtlAndroid
                      ? { right: size / 2 }
                      : { left: size / 2 },
                  ]}
                >
                  {clonedChild}
                </View>
              );
            })()}
          </View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

const NoRatingElement: React.FC<NoRatingProps> = ({
  size,
  children,
  enableMask,
  unratedColor,
}) => {
  const cloneChild = getClonedElement(
    children,
    size,
    enableMask ? unratedColor : undefined
  );

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* TODO:- improve this so it can support wide varity of elements */}
      {enableMask
        ? (() => {
            // if (React.isValidElement(children)) {
            //   const clonedChild = React.cloneElement(children, {
            //     color: unratedColor,
            //     size,
            //     style: { width: size, height: size },
            //   });
            //   /* if (clonedChild) {
            //   clonedChild.props.color = unratedColor; */
            //   return clonedChild;
            //   /* }
            // return children; */
            // }
            // return null;
            return cloneChild;
          })()
        : cloneChild}
    </View>
  );
};

const DISABLED_COLOR = 'rgba(0, 0, 0, 0.38)';

const RatingBar: React.FC<RatingBarProps> = ({
  onRatingUpdate,
  itemCount = 5,
  glowColor = '#03dac6',
  minRating = 0,
  maxRating = itemCount,
  textDirection = I18nManager.isRTL ? 'rtl' : 'ltr',
  unratedColor = DISABLED_COLOR,
  allowHalfRating = false,
  direction = 'horizontal',
  glow = true,
  glowRadius = 2,
  ignoreGestures = false,
  initialRating = 0,
  itemPadding = 0,
  itemSize = 40,
  tapOnlyMode = false,
  updateOnDrag = false,
  // wrapAlignment,
  ratingElement,
  itemBuilder,
}) => {
  const window = useWindowDimensions();
  const [rating, setRating] = useState(initialRating);
  const [isRTL, setIsRTL] = useState(textDirection === 'rtl');
  // const isRTL = useRef(textDirection === 'rtl');
  // const [iconRating, setIconRating] = useState(0.0);
  const iconRating = useRef(0);
  /* const [min, setMin] = useState(minRating);
  const [max, setMax] = useState(maxRating ?? itemCount); */
  const [isGlow, setGlow] = useState(false);

  /* useEffect(() => {
    iconRating.current = 0;
  }); */

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    setIsRTL(textDirection === 'rtl');
  }, [textDirection]);

  const ratingList = (index: number) => {
    const item = itemBuilder && itemBuilder(index);
    const ratingOffset = allowHalfRating ? 0.5 : 1.0;

    let ratingItem: JSX.Element = <></>;

    const clonedChild = getClonedElement(item, itemSize);

    if (index >= rating) {
      const rateEmptyCloned = getClonedElement(ratingElement?.empty, itemSize);
      ratingItem = (
        <NoRatingElement
          size={itemSize}
          enableMask={ratingElement == null}
          unratedColor={unratedColor}
        >
          {rateEmptyCloned ?? ratingElement?.empty ?? clonedChild}
        </NoRatingElement>
      );
    } else if (index >= rating - ratingOffset && allowHalfRating) {
      if (ratingElement?.half == null) {
        ratingItem = (
          <HalfRatingElement
            size={itemSize}
            enableMask={ratingElement == null}
            rtlMode={isRTL}
            unratedColor={unratedColor}
          >
            {clonedChild}
          </HalfRatingElement>
        );
      } else {
        const rateHalfCloned = getClonedElement(ratingElement?.half, itemSize);

        ratingItem = (
          <View
            style={{
              width: itemSize,
              height: itemSize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isRTL ? (
              <View style={{ transform: [{ scaleX: -1 }] }}>
                {rateHalfCloned ?? ratingElement?.half}
              </View>
            ) : (
              rateHalfCloned ?? ratingElement?.half
            )}
          </View>
        );
      }

      // // setIconRating(r => r + 0.5);
      // iconRating.current += 0.5;
    } else {
      const rateFullCloned = getClonedElement(ratingElement?.full, itemSize);

      /* let rateFullCloned: JSX.Element | null = null;
      if (ratingElement?.full && React.isValidElement(ratingElement?.full)) {
        rateFullCloned = React.cloneElement(ratingElement?.full, {
          size: itemSize,
        });
        const style = rateFullCloned.props.style;
        if (style) {
          style.width = style.width || '100%';
          style.height = style.height || '100%';
        }
        // rateFullCloned.props.size = itemSize;
      } */

      ratingItem = (
        <View
          style={{
            width: itemSize,
            height: itemSize,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* {ratingElement?.full ?? item} */}
          {rateFullCloned ?? ratingElement?.full ?? clonedChild}
        </View>
      );
      // // setIconRating(r => r + 1);
      // iconRating.current += 1;
    }

    /* // will be true if component rtl by props or whole whole app is rtl
    // 1. isRTL:- if used passed textDirection='rtl' as value, if not then based on I18nManager.isRTL
    // 2. (I18nManager.isRTL && !isRTL):- if whole app is RTL and user passed 'ltr' then gesture will work opposite
    const isValidRTL = isRTL || (I18nManager.isRTL && !isRTL); */
    // TODO:- Check this properly by setting rtl to whole app not by prop
    const getAbsoluteX = (x: number) => (isRTL ? window.width - x : x);
    const getX = (x: number, totalWidth: number) =>
      isRTL ? totalWidth - x : x;

    const panGesture = Gesture.Pan()
      .onStart((_) => {
        // console.log('onStart', e);
        setGlow(true);
      })
      .onUpdate((e) => {
        // console.log('onUpdate', e);
        if (!tapOnlyMode) {
          // console.log('is RTL', I18nManager.isRTL, isRTL);

          const totalItemSize = itemSize + itemPadding * 2;

          // if (posDx >= 0) {
          //   console.log('posDx', posDx);
          let i = 0;
          if (direction === 'horizontal') {
            // const boxStartX = e.absoluteX - e.x - totalItemSize * index;
            const boxStartX =
              getAbsoluteX(e.absoluteX) -
              getX(e.x, totalItemSize) -
              totalItemSize * index;
            // const posDx = e.absoluteX - boxStartX;

            const posDx = getAbsoluteX(e.absoluteX) - boxStartX;
            i = posDx / totalItemSize;
          } else {
            // for verticle
            const boxStartY = e.absoluteY - e.y - totalItemSize * index;
            const posDy = e.absoluteY - boxStartY;
            i = posDy / totalItemSize;
          }
          let currentRating = allowHalfRating ? i : Math.round(i);
          if (currentRating > itemCount) {
            currentRating = itemCount;
          }
          if (currentRating < 0) {
            currentRating = 0;
          }
          /* if (isRTL.current && direction === 'horizontal') {
            currentRating = itemCount - currentRating;
          } */

          const clamp = (num: number, lower: number, upper: number) =>
            Math.min(Math.max(num, lower), upper);
          /* console.log(
            'currentRating',
            clamp(currentRating, minRating, maxRating),
          ); */

          const newRating = clamp(currentRating, minRating, maxRating);
          if (newRating !== rating) {
            // console.log('newRating', newRating);

            setRating(newRating);
            // updateOnDrag && onRatingUpdate(iconRating.current);
            const exactRating = Math.ceil(newRating * (1 / 0.5)) / (1 / 0.5);
            iconRating.current = exactRating;
            updateOnDrag && onRatingUpdate(exactRating);
          }
          // }
        }
      })
      .onEnd(() => {
        // console.log('onEnd: ', e);
        setGlow(false);
        onRatingUpdate(iconRating.current);
        // iconRating.current = 0;
      });

    const singleTap = Gesture.Tap()
      .maxDuration(250)
      .onStart((e) => {
        // console.log('Gesture.Tap: ', e.x, e.absoluteX);
        let value = 0;
        if (index === 0 && (rating === 1 || rating === 0.5)) {
          value = 0;
        } else {
          const totalItemSize = itemSize + itemPadding * 2;
          // const tappedPosition = e.x;
          const tappedPosition = getX(e.x, totalItemSize);
          const tappedOnFirstHalf = tappedPosition <= itemSize / 2;
          value = index + (tappedOnFirstHalf && allowHalfRating ? 0.5 : 1.0);
        }

        value = Math.max(value, minRating);
        onRatingUpdate(value);
        setRating(value);
      });

    const shouldGlow = glow && isGlow;
    const shadow = {
      shadowColor: glowColor,
      shadowOffset: { width: glowRadius, height: glowRadius },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    };
    const innerShadow = { ...shadow, shadowOpacity: 0.2 };
    // return <Icon key={index} name="star" size={40} color="#FFC107" />;
    return (
      <View
        key={index}
        style={[shouldGlow && shadow]}
        pointerEvents={ignoreGestures ? 'none' : 'auto'}
      >
        {/* Gesture element */}
        <GestureDetector gesture={Gesture.Simultaneous(panGesture, singleTap)}>
          {/* <View style={[shouldGlow && shadow]}> */}
          <View
            style={[
              shouldGlow && innerShadow,
              direction === 'vertical'
                ? { paddingVertical: itemPadding }
                : { paddingHorizontal: itemPadding },
            ]}
          >
            {ratingItem}
            {/* </View> */}
          </View>
        </GestureDetector>
      </View>
    );
  };

  const ratingArr = useMemo(() => [...Array(itemCount)], [itemCount]);

  // const androidRTL = Platform.OS === 'android' && isRTL && !I18nManager.isRTL;
  const androidRTL =
    Platform.OS === 'android' &&
    ((isRTL && !I18nManager.isRTL) || (I18nManager.isRTL && !isRTL));

  // <SafeAreaView>
  //   <Text style={{ writingDirection: textDirection }}>RatingBar</Text>

  /* <HalfRatingElement
        size={40}
        rtlMode={false}
        enableMask
        unratedColor={'#FFF8E1'}
      >
        <Icon name="star" size={40} color="#FFC107" />
      </HalfRatingElement> */

  // TODO:- See if this condition can be better
  return (
    <View
      style={[
        {
          backgroundColor: 'transparent',
          // flexDirection: direction === 'vertical' ? 'column' : 'row',
          flexDirection:
            direction === 'vertical'
              ? 'column'
              : androidRTL
              ? 'row-reverse'
              : 'row',
          justifyContent: 'center',
          direction: isRTL ? 'rtl' : 'ltr',
        },
        androidRTL &&
          direction === 'vertical' && { transform: [{ scaleX: -1 }] },
      ]}
    >
      {/* {ratingList()} */}
      {ratingArr.map((_, i) => ratingList(i))}
    </View>
    // </SafeAreaView>
  );
};

export default RatingBar;

// const styles = StyleSheet.create({});
