import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  I18nManager,
  useWindowDimensions,
  Text,
  StyleSheet,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import HalfRatingElement from './components/HalfRatingElement';
import NoRatingElement from './components/NoRatingElement';
import { getClonedElement } from './helper/cloneElement';
import { clamp, isAndroid } from './helper/utils';
import { elementStyle } from './theme/styles';
import type {
  ItemCloneArray,
  RatingBarProps,
  RatingCloneType,
} from './types/ratingTypes';

const DISABLED_COLOR = 'rgba(0, 0, 0, 0.38)';

const RatingBar: React.FC<RatingBarProps> = ({
  rateStyles,
  onRatingUpdate,
  itemCount = 5,
  glowColor = '#FFC107', // change this default later
  minRating = 0,
  maxRating = itemCount,
  layoutDirection = I18nManager.isRTL ? 'rtl' : 'ltr',
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
  ratingView,
  useSolution = 1,
  // wrapAlignment,
  ratingElement,
  itemBuilder,
}) => {
  const window = useWindowDimensions();

  // Stores user's current rating
  const [rating, setRating] = useState(initialRating);

  // isRTL:- if user passed layoutDirection='rtl' as value, if not then based on I18nManager.isRTL (whole app's direction)
  const [isRTL, setIsRTL] = useState(layoutDirection === 'rtl');

  // Whether to show Glow effect around Star (Rating Component) or not (iOS only)
  const [isGlow, setGlow] = useState(false);

  /* Below two states are used to store clones of the components passed by the user, on intial render
   * to avoid unneccessary cloning them again and again on every render
   */
  // This stores the clones of the components passed by user in itemBuilder function
  const [itemClones, setItemClones] = useState<ItemCloneArray>([]);
  // This stores the clones of the components passed by user in ratingElement
  const [ratingElClones, setRatingElClones] = useState<RatingCloneType>({
    full: ratingElement?.full,
    half: ratingElement?.half,
    empty: ratingElement?.empty,
  });

  // Solution 2 only
  const [containerWidth, setContainerWidth] = useState(
    (itemSize + itemPadding * 2) * (itemCount - initialRating)
  );

  // Stores exact rating like 1, 2... or 0.5, 1, 1.5 etc. contrary to rating state which contains exact fraction value
  const iconRating = useRef(initialRating);

  const isVertical = ['vertical', 'vertical-reverse'].includes(direction);
  const isVerticalReverse = direction === 'vertical-reverse';
  const ratingOffset = allowHalfRating ? 0.5 : 1.0;
  const ratingArr = useMemo(() => [...Array(itemCount)], [itemCount]);
  const androidRTL =
    isAndroid &&
    ((isRTL && !I18nManager.isRTL) || (I18nManager.isRTL && !isRTL));
  // Rating shadow if glow === true
  const shouldGlow = glow && isGlow;
  const shadow = {
    shadowColor: glowColor,
    shadowOffset: { width: glowRadius, height: glowRadius },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  };
  const innerShadow = { ...shadow, shadowOpacity: 0.2 };

  // Solution 2 only
  useEffect(() => {
    if (useSolution === 2) {
      const totalItemSize = itemSize + itemPadding * 2;
      // const totalWidth = totalItemSize * iconRating.current; // for width
      const totalWidth = totalItemSize * (itemCount - iconRating.current); // for positions

      setContainerWidth(totalWidth);
    }
  }, [rating, itemSize, itemPadding, itemCount, useSolution]);

  // Creating and storing clones for Elements passed in itemBuilder function prop
  useEffect(() => {
    const clones: ItemCloneArray = [];
    ratingArr.forEach((_, index) => {
      const item = itemBuilder && itemBuilder(index);
      clones.push(getClonedElement(item, itemSize));
    });
    setItemClones(clones);
  }, [itemBuilder, ratingArr, itemSize]);

  // Creating and storing clones for Elements passed in ratingElement prop
  useEffect(() => {
    const rateEmptyCloned = getClonedElement(ratingElement?.empty, itemSize);
    const rateHalfCloned = getClonedElement(ratingElement?.half, itemSize);
    const rateFullCloned = getClonedElement(ratingElement?.full, itemSize);

    setRatingElClones({
      full: rateFullCloned,
      half: rateHalfCloned,
      empty: rateEmptyCloned,
    });
  }, [ratingElement, itemSize]);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    setIsRTL(layoutDirection === 'rtl');
  }, [layoutDirection]);

  // Horizontal
  // touch position respective to whole screen width
  const getAbsoluteX = useCallback(
    (x: number) => (isRTL ? window.width - x : x),
    [isRTL, window.width]
  );
  // touch position respective to item's width
  const getX = useCallback(
    (x: number, totalWidth: number) => (isRTL ? totalWidth - x : x),
    [isRTL]
  );

  // Vertical
  // touch position respective to whole screen height
  const getAbsoluteY = useCallback(
    (y: number) => (isVerticalReverse ? window.height - y : y),
    [isVerticalReverse, window.height]
  );
  // touch position respective to item's height
  const getY = useCallback(
    (y: number, totalHeight: number) =>
      isVerticalReverse ? totalHeight - y : y,
    [isVerticalReverse]
  );

  // callback when user starts swiping
  const onGestureStart = () => {
    !isAndroid && glow && setGlow(true);
  };

  // callback when user is swiping on rating
  const onGestureMove = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
    index: number
  ) => {
    if (!tapOnlyMode) {
      const totalItemSize = itemSize + itemPadding * 2;

      // if (posDx >= 0) {
      let i = 0;
      if (!isVertical) {
        // const boxStartX = e.absoluteX - e.x - totalItemSize * index;
        const boxStartX =
          getAbsoluteX(e.absoluteX) -
          getX(e.x, totalItemSize) -
          totalItemSize * index;

        // const posDx = e.absoluteX - boxStartX;
        const posDx = getAbsoluteX(e.absoluteX) - boxStartX;
        i = posDx / totalItemSize;
      } else {
        // for vertical
        /* const boxStartY = e.absoluteY - e.y - totalItemSize * index;
        const posDy = e.absoluteY - boxStartY; */
        const boxStartY =
          getAbsoluteY(e.absoluteY) -
          getY(e.y, totalItemSize) -
          totalItemSize * index;
        const posDy = getAbsoluteY(e.absoluteY) - boxStartY;
        i = posDy / totalItemSize;
      }
      let currentRating = allowHalfRating ? i : Math.round(i);
      if (currentRating > itemCount) {
        currentRating = itemCount;
      }
      if (currentRating < 0) {
        currentRating = 0;
      }

      const newRating = clamp(currentRating, minRating, maxRating);
      if (newRating !== rating) {
        setRating(newRating);

        const exactRating = Math.ceil(newRating * (1 / 0.5)) / (1 / 0.5);

        /* const rateValue = interval === 0 && fractions
          ? Number(newRating.toFixed(Math.min(Math.abs(fractions), 100)))
          : exactRating; */
        iconRating.current = exactRating;
        updateOnDrag && onRatingUpdate && onRatingUpdate(exactRating); // TODO:- this here is slowing things down when drag fast, cause of double re-rendering, try to fix it.
      }
    }
  };

  // when user swipe ends
  const onGestureEnd = () => {
    !isAndroid && glow && setGlow(false);
    onRatingUpdate && onRatingUpdate(iconRating.current);
  };

  const onRatingTap = (
    e: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
    index: number
  ) => {
    let value = 0;
    if (index === 0 && (rating === 1 || rating === 0.5)) {
      value = 0;
    } else {
      const totalItemSize = itemSize + itemPadding * 2;
      const tappedPosition = getX(e.x, totalItemSize);
      const tappedOnFirstHalf = tappedPosition <= itemSize / 2;
      value = index + (tappedOnFirstHalf && allowHalfRating ? 0.5 : 1.0);
      // // for exact fraction
      // value = index + (tappedPosition / 58);
      // value = Math.ceil(value * (1 / 0.2)) / (1 / 0.2);
    }

    value = Math.max(value, minRating);
    iconRating.current = value;
    onRatingUpdate && onRatingUpdate(value);
    setRating(value);
  };

  const ratingList = (index: number) => {
    // const item = itemBuilder && itemBuilder(index);

    let ratingItem: JSX.Element = <></>;

    // const clonedChild = getClonedElement(item, itemSize);
    const clonedChild = itemClones[index];

    // Solution 1 only
    if (useSolution === 1) {
      if (index >= rating) {
        // const rateEmptyCloned = getClonedElement(ratingElement?.empty, itemSize);
        const rateEmptyCloned = ratingElClones.empty;
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
        // } else if ((index >= rating || rating < index + 1) && allowHalfRating) { // for exact fraction
        // const accurateRating = internal === 0 ? rating : iconRating.current;
        if (ratingElement?.half == null) {
          ratingItem = (
            <HalfRatingElement
              size={itemSize}
              enableMask={ratingElement == null}
              rtlMode={isRTL}
              unratedColor={unratedColor}
              // fraction={rating - Math.trunc(rating)} // for exact fraction, value Ex. 2.34 = 0.34
            >
              {clonedChild}
            </HalfRatingElement>
          );
        } else {
          // const rateHalfCloned = getClonedElement(ratingElement?.half, itemSize);
          const rateHalfCloned = ratingElClones.half;

          ratingItem = (
            <View style={elementStyle(itemSize).container}>
              {/* {isRTL ? ( */}
              <View style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
                {rateHalfCloned ?? ratingElement?.half}
              </View>
              {/* ) : (
              rateHalfCloned ?? ratingElement?.half
            )} */}
            </View>
          );
        }
      } else {
        // const rateFullCloned = getClonedElement(ratingElement?.full, itemSize);
        const rateFullCloned = ratingElClones.full;

        ratingItem = (
          <View style={elementStyle(itemSize).container}>
            {rateFullCloned ?? ratingElement?.full ?? clonedChild}
          </View>
        );
      }
    }

    const panGesture = Gesture.Pan()
      .onStart(onGestureStart)
      .onUpdate((e) => onGestureMove(e, index))
      .onEnd(onGestureEnd);

    const singleTap = Gesture.Tap()
      .maxDuration(250)
      .onStart((e) => onRatingTap(e, index));

    return (
      <View
        key={index}
        style={[
          shouldGlow && shadow,
          typeof rateStyles?.starContainer === 'function'
            ? rateStyles?.starContainer(index)
            : rateStyles?.starContainer,
        ]}
        pointerEvents={ignoreGestures ? 'none' : 'auto'}
      >
        {/* Gesture element */}
        <GestureDetector gesture={Gesture.Simultaneous(panGesture, singleTap)}>
          <View
            style={[
              shouldGlow && innerShadow,
              isVertical
                ? { paddingVertical: itemPadding }
                : { paddingHorizontal: itemPadding },
            ]}
          >
            {useSolution === 1 ? (
              ratingItem
            ) : (
              <NoRatingElement
                size={itemSize}
                enableMask={ratingElement == null}
                unratedColor={unratedColor}
              >
                {ratingElClones.empty ?? ratingElement?.empty ?? clonedChild}
              </NoRatingElement>
            )}
          </View>
        </GestureDetector>
      </View>
    );
  };

  // Solution 2 only
  const ratingFillList = (index: number) => {
    const clonedChild = itemClones[index];
    let item = clonedChild;
    if (index >= rating - ratingOffset && allowHalfRating) {
      item = ratingElClones.half ?? ratingElement?.half ?? item;
    } else if (index < rating) {
      item = ratingElClones.full ?? ratingElement?.full ?? item;
    }

    return (
      <View
        key={`fill_${index}`}
        style={[
          isVertical
            ? { paddingVertical: itemPadding }
            : { paddingHorizontal: itemPadding },
        ]}
      >
        <View style={[elementStyle(itemSize).container]}>{item}</View>
      </View>
    );
  };

  // Rating component showing current rating / total rating (customizable by user using props)
  const displayCurrentRating = () => {
    return (
      ratingView?.custom || (
        <View
          style={[
            styles.ratingTxtContainer,
            {
              marginBottom: ratingView?.position === 'top' ? 8 : 0,
              marginTop: ratingView?.position === 'bottom' ? 8 : 0,
            },
            ratingView?.containerStyle,
          ]}
        >
          <Text style={[{ fontSize: 16 }, ratingView?.titleStyle]}>
            {`${ratingView?.titleText || 'Rating:'} `}
          </Text>
          <Text
            style={[
              { fontSize: 20, fontWeight: 'bold' },
              ratingView?.ratingStyle,
            ]}
          >
            {`${iconRating.current} `}
          </Text>
          <Text style={[{ fontSize: 16 }, ratingView?.totalStyle]}>
            {`/ ${itemCount}`}
          </Text>
        </View>
      )
    );
  };

  const flexDirection = isVerticalReverse
    ? 'column-reverse'
    : isVertical
    ? 'column'
    : androidRTL
    ? 'row-reverse'
    : 'row';

  const renderRating = () => {
    return (
      <View
        style={[
          {
            backgroundColor: 'transparent',
            // justifyContent: 'center',
            flexDirection,
            direction: isRTL ? 'rtl' : 'ltr',
          },
          // androidRTL && isVertical && { transform: [{ scaleX: -1 }] }, // for some reason is working without this condition on android
        ]}
      >
        {ratingArr.map((_, i) => ratingList(i))}

        {/* Solution 2 only */}
        {useSolution === 2 ? (
          <View
            style={[
              styles.filledRatingContainer,
              {
                flexDirection,
                // width: containerWidth,
                right: isVertical ? 0 : containerWidth,
                top: isVertical && isVerticalReverse ? containerWidth : 0,
                bottom: isVertical && !isVerticalReverse ? containerWidth : 0,
              },
              //   androidRTL && isVertical && { transform: [{ scaleX: -1 }] },
            ]}
            removeClippedSubviews
            pointerEvents={'none'}
          >
            {ratingArr.map((_, i) => ratingFillList(i))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={rateStyles?.container}>
      {ratingView?.showRating &&
        ratingView?.position !== 'bottom' &&
        displayCurrentRating()}

      {useSolution === 1 ? (
        renderRating()
      ) : (
        // ratingFillList()'s component fills whole screen's width, making rating effect inconsistent
        // so here 'flex-start' align it at the start in par with renderRating()'s component
        <View style={{ alignItems: 'flex-start' }}>{renderRating()}</View>
      )}

      {ratingView?.showRating &&
        ratingView?.position === 'bottom' &&
        displayCurrentRating()}
    </View>
  );
};

export default RatingBar;

const styles = StyleSheet.create({
  ratingTxtContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  // Solution 2
  filledRatingContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    left: 0,
  },
});
