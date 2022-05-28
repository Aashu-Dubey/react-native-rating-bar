import React, { useEffect, useMemo, useState } from 'react';
import { View, I18nManager, ScrollView, Image } from 'react-native';
import { isAndroid } from './helper/utils';
import type { RatingBarIndicatorProps } from './types/ratingTypes';

// TODO:- find better solution so we don't need this
const getClonedElement = (children: React.ReactNode, size: number) =>
  React.isValidElement(children)
    ? React.cloneElement(children, {
        // color: unratedColor,
        size,
        style: { width: size, height: size },
      })
    : null;

const DISABLED_COLOR = 'rgba(0, 0, 0, 0.38)';

const RatingBarIndicator: React.FC<RatingBarIndicatorProps> = ({
  layoutDirection = I18nManager.isRTL ? 'rtl' : 'ltr',
  unratedColor,
  direction = 'horizontal',
  itemCount = 5,
  itemPadding = 0,
  itemSize = 40,
  rating = 0,
  itemBuilder,
}) => {
  const [ratingNumber, setRatingNumber] = useState(Math.trunc(rating) + 1);
  //   const ratingNumber = useRef(Math.trunc(rating) + 1);
  //   const ratingFraction = useRef(rating - ratingNumber.current + 1);
  const [ratingFraction, setRatingFraction] = useState(
    rating - ratingNumber + 1
  );
  const [isRTL, setIsRTL] = useState(layoutDirection === 'rtl');
  // const isRTL = useRef(layoutDirection === 'rtl');

  const isVertical = ['vertical', 'vertical-reverse'].includes(direction);
  const isVerticalReverse = direction === 'vertical-reverse';
  const ratingArr = useMemo(() => [...Array(itemCount)], [itemCount]);

  useEffect(() => {
    const newRating = Math.trunc(rating) + 1;
    setRatingNumber(newRating);
    setRatingFraction(rating - newRating + 1);
  }, [rating]);

  useEffect(() => {
    setIsRTL(layoutDirection === 'rtl');
  }, [layoutDirection]);

  const isOnlyRatingRTL =
    (isRTL && !I18nManager.isRTL) || (I18nManager.isRTL && !isRTL);
  const androidRTL = isAndroid && isOnlyRatingRTL;

  const buildItems = (index: number) => {
    const item = itemBuilder(index);
    const itemClone = getClonedElement(item, itemSize);

    const isImage = itemClone?.type === Image;

    return (
      <View style={{ width: itemSize, height: itemSize, margin: itemPadding }}>
        {index + 1 < ratingNumber
          ? itemClone
          : (() => {
              if (React.isValidElement(item)) {
                const clonedChild = React.cloneElement(item, {
                  color: unratedColor ?? DISABLED_COLOR,
                  size: itemSize,
                  style: { width: itemSize, height: itemSize },
                });
                return clonedChild;
              }
              return itemClone;
            })()}
        {index + 1 === ratingNumber && (
          <View
            style={{ position: 'absolute', width: itemSize, height: itemSize }}
          >
            {(() => {
              if (itemClone) {
                /* console.log('ratingFraction.current', ratingFraction);
                itemClone.props.style.height = '100%';
                itemClone.props.style.width = `${100 * ratingFraction}%`;
                if (isRTL.current) {
                  itemClone.props.style.transform = [{ scaleX: -1 }];
                }
                itemClone.props.style.backgroundColor = 'red';
                itemClone.props.style.tintColor = 'green';
                // itemClone.props.style.overflow = 'hidden';
                // itemClone.props.style.aspectRatio = 1;
                // return itemClone; */

                // itemClone.props.style.tintColor = 'green';
                return (
                  <View
                    style={[
                      {
                        height: '100%',
                        width: `${100 * ratingFraction}%`,
                        //   backgroundColor: 'red',
                        overflow: 'hidden',
                      },
                      /* ((isRTL && !I18nManager.isRTL) ||
                        (I18nManager.isRTL && !isRTL)) && {
                        alignSelf: 'flex-end',
                        transform: [{ scaleX: -1 }],
                      }, */
                      // Image probably handles RTL compare to a vector icon so disabling it for Image
                      androidRTL && !isImage && { transform: [{ scaleX: -1 }] },
                      androidRTL && { alignSelf: 'flex-end' },
                    ]}
                  >
                    {itemClone}
                  </View>
                );
              }
              return itemClone;
            })()}
          </View>
        )}
      </View>
    );
  };

  /* const androidRTL =
    Platform.OS === 'android' &&
    ((isRTL && !I18nManager.isRTL) || (I18nManager.isRTL && !isRTL)); */

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: isVerticalReverse
          ? 'column-reverse'
          : isVertical
          ? 'column'
          : androidRTL
          ? 'row-reverse'
          : 'row',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
      horizontal={direction === 'horizontal'}
      showsHorizontalScrollIndicator={false}
    >
      {ratingArr.map((_, i) => {
        // TODO:- this seems unneccessary now
        if (layoutDirection !== null) {
          if (layoutDirection === 'rtl' && !I18nManager.isRTL) {
            return (
              <View key={i} /*  style={{ transform: [{ scaleX: -1 }] }} */>
                {buildItems(i)}
              </View>
            );
          }
        }
        return <View key={i}>{buildItems(i)}</View>;
      })}
    </ScrollView>
  );
};

export default RatingBarIndicator;

// const styles = StyleSheet.create({});
