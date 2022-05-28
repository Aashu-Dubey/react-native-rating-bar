import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, I18nManager, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import NoRatingElement from '../components/NoRatingElement';
import { getClonedElement } from '../helper/cloneElement';
import { clamp, isAndroid } from '../helper/utils';
import { elementStyle } from '../theme/styles';
import type {
  ItemCloneArray,
  RatingBarProps,
  RatingCloneType,
} from '../types/ratingTypes';

const DISABLED_COLOR = 'rgba(0, 0, 0, 0.38)';

// let renderVar = 1; //delete this later

/**
 * This is the initial version for solution 2 before merging it into one
 */
const RatingBarSol2: React.FC<RatingBarProps> = ({
  rateStyles,
  onRatingUpdate,
  itemCount = 5,
  glowColor = '#03dac6', // change this default later
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
  // wrapAlignment,
  ratingElement,
  itemBuilder,
}) => {
  const window = useWindowDimensions();

  const [rating, setRating] = useState(initialRating);
  // isRTL:- if user passed layoutDirection='rtl' as value, if not then based on I18nManager.isRTL (whole app's direction)
  const [isRTL, setIsRTL] = useState(layoutDirection === 'rtl');
  const [isGlow, setGlow] = useState(false);
  const [itemClones, setItemClones] = useState<ItemCloneArray>([]);
  const [ratingElClones, setRatingElClones] = useState<RatingCloneType>({
    full: ratingElement?.full,
    half: ratingElement?.half,
    empty: ratingElement?.empty,
  });

  const [containerWidth, setContainerWidth] = useState(
    (itemSize + itemPadding * 2) * (itemCount - initialRating)
  );

  const iconRating = useRef(initialRating);
  // const itemBuilderClones = useRef<CloneArray>([]);

  // const isVertical = direction === 'vertical';
  const isVertical = ['vertical', 'vertical-reverse'].includes(direction);
  const isVerticalReverse = direction === 'vertical-reverse';
  const ratingOffset = allowHalfRating ? 0.5 : 1.0;
  const ratingArr = useMemo(() => [...Array(itemCount)], [itemCount]);
  const androidRTL =
    isAndroid &&
    ((isRTL && !I18nManager.isRTL) || (I18nManager.isRTL && !isRTL));
  // Rating shadow
  const shouldGlow = glow && isGlow;
  const shadow = {
    shadowColor: glowColor,
    shadowOffset: { width: glowRadius, height: glowRadius },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  };
  const innerShadow = { ...shadow, shadowOpacity: 0.2 };

  // renderVar += 1;

  useEffect(() => {
    const totalItemSize = itemSize + itemPadding * 2;
    // const totalWidth = totalItemSize * iconRating.current; // for width
    const totalWidth = totalItemSize * (itemCount - iconRating.current); // for positions
    // console.log('width is', totalWidth * rating);

    setContainerWidth(totalWidth);
  }, [rating, itemSize, itemPadding, itemCount]);

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

  const getAbsoluteX = useCallback(
    (x: number) => (isRTL ? window.width - x : x),
    [isRTL, window.width]
  );
  const getX = useCallback(
    (x: number, totalWidth: number) => (isRTL ? totalWidth - x : x),
    [isRTL]
  );

  const getAbsoluteY = useCallback(
    (y: number) => (isVerticalReverse ? window.height - y : y),
    [isVerticalReverse, window.height]
  );
  const getY = useCallback(
    (y: number, totalHeight: number) =>
      isVerticalReverse ? totalHeight - y : y,
    [isVerticalReverse]
  );

  const ratingList = (index: number) => {
    // const item = itemBuilder && itemBuilder(index);

    // let ratingItem: JSX.Element = <></>;

    // const clonedChild = getClonedElement(item, itemSize);
    const clonedChild = itemClones[index];
    // console.log('calling', index, renderVar);

    /* if (index >= rating) {
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
        // const rateHalfCloned = getClonedElement(ratingElement?.half, itemSize);
        const rateHalfCloned = ratingElClones.half;

        ratingItem = (
          <View style={elementStyle(itemSize).container}>
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
    } else {
      // const rateFullCloned = getClonedElement(ratingElement?.full, itemSize);
      const rateFullCloned = ratingElClones.full;

      ratingItem = (
        <View style={elementStyle(itemSize).container}>
          {rateFullCloned ?? ratingElement?.full ?? clonedChild}
        </View>
      );
    } */

    const panGesture = Gesture.Pan()
      .onStart((_) => {
        !isAndroid && glow && setGlow(true);
      })
      .onUpdate((e) => {
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
            // for verticle
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
            iconRating.current = exactRating;
            updateOnDrag && onRatingUpdate && onRatingUpdate(exactRating);
          }
        }
      })
      .onEnd(() => {
        !isAndroid && glow && setGlow(false);
        onRatingUpdate && onRatingUpdate(iconRating.current);
      });

    const singleTap = Gesture.Tap()
      .maxDuration(250)
      .onStart((e) => {
        let value = 0;
        if (index === 0 && (rating === 1 || rating === 0.5)) {
          value = 0;
        } else {
          const totalItemSize = itemSize + itemPadding * 2;
          const tappedPosition = getX(e.x, totalItemSize);
          const tappedOnFirstHalf = tappedPosition <= itemSize / 2;
          value = index + (tappedOnFirstHalf && allowHalfRating ? 0.5 : 1.0);
        }

        value = Math.max(value, minRating);
        iconRating.current = value;
        onRatingUpdate && onRatingUpdate(value);
        setRating(value);
      });

    // return <Icon key={index} name="star" size={40} color="#FFC107" />;
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
            <NoRatingElement
              size={itemSize}
              enableMask={ratingElement == null}
              unratedColor={unratedColor}
            >
              {ratingElClones.empty ?? ratingElement?.empty ?? clonedChild}
            </NoRatingElement>

            {/* <View
              style={[
                elementStyle(itemSize).container,
                { position: 'absolute', alignSelf: 'center' },
              ]}
            >
              {clonedChild}
            </View> */}
          </View>
        </GestureDetector>
      </View>
    );
  };

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

  // TODO:- See if this condition can be better
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <View
        style={[
          {
            backgroundColor: 'transparent',
            // justifyContent: 'center',
            flexDirection: isVerticalReverse
              ? 'column-reverse'
              : isVertical
              ? 'column'
              : androidRTL
              ? 'row-reverse'
              : 'row',
            direction: isRTL ? 'rtl' : 'ltr',
          },
          // androidRTL && isVertical && { transform: [{ scaleX: -1 }] }, // for some reason is working without this condition on android
        ]}
      >
        {ratingArr.map((_, i) => ratingList(i))}
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: 'transparent',
              flexDirection: isVerticalReverse
                ? 'column-reverse'
                : isVertical
                ? 'column'
                : androidRTL
                ? 'row-reverse'
                : 'row',
              // width: containerWidth,
              overflow: 'hidden',
              // backgroundColor: 'red',
              left: 0,
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
      </View>
    </View>
  );
};

export default RatingBarSol2;

// const styles = StyleSheet.create({});
