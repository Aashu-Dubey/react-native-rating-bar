// import React from 'react';
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface RatingElementType {
  /**
   * Defines Element to be used when as rating bar item when item is completely rated.
   *
   * Ex. if `rating = 3` then items at `index <= 3`.
   */
  full: JSX.Element | React.ReactNode;
  /**
   * Defines Element to be used when as rating bar item when only half portion of item is rated.
   *
   * Ex. if `rating = 3.5` then items at `index === 3`
   *
   * Note:- {@link RatingCommonProps.allowHalfRating allowHalfRating} needs to be set to true
   */
  half: JSX.Element | React.ReactNode;
  /**
   * Defines Element to be used as rating bar item when item is unrated.
   *
   * Ex:- if rating == 2.5 then items at `index >= 3` will be shown with this empty element.
   */
  empty: JSX.Element | React.ReactNode;
}

interface RatingCommonProps {
  /**
   * Provide custom styles for View containing whole rating group or single rating item.
   */
  rateStyles?: {
    /**
     * Custom styles for View contaning whole rating group.
     */
    container?: StyleProp<ViewStyle>;
    /**
     * Custom styles for View contaning Sigle rating item.
     */
    starContainer?:
      | StyleProp<ViewStyle>
      | ((index: number) => StyleProp<ViewStyle>);
  };
  /**
   * Return current rating whenever rating is updated.
   *
   * {@link RatingCommonProps.updateOnDrag updateOnDrag} can be used to change the behaviour how the callback reports the update.
   *
   * By Default it only returns update when the touch ends, either when tapping or dragging.
   */
  onRatingUpdate?: (rating: number) => void;
  /**
   * Total number of Rating items to display.
   *
   * Default is `5`
   */
  itemCount?: number;
  /**
   * Defines color for glow.
   * The default is `#FFC107`
   * @requires {@link RatingCommonProps.glow glow}={true}
   *
   * @platform ios
   */
  glowColor?: ColorValue;
  /**
   * Minimum rating value allowed.
   *
   * Should be `>= 0`.
   *
   * Default is 0.
   */
  minRating?: number;
  /**
   * Miximum rating value allowed.
   *
   * Should be `>= `{@link RatingCommonProps.minRating minRating}` >= 0`
   *
   * Defaults to value of `itemCount`
   */
  maxRating?: number;
  /**
   * Layout Direction to show the ratings on, left-to-right (`ltr`) or right-to-left (`rtl`)
   *
   * Default is based on device's preferred layout direction
   */
  layoutDirection?: 'ltr' | 'rtl';
  /**
   * Color for items that are not rated yet, usually when `index >= rating`.
   *
   * Default is `rgba(0, 0, 0, 0.38)`
   */
  unratedColor?: ColorValue;
  /**
   * If `true`, rating will increase/decrease by fraction of `0.5` instead of default `1`.
   *
   * Default is `false`
   */
  allowHalfRating?: boolean;
  /**
   * Direction to show the ratings items in
   *
   * **horizontal**:- Default, shows the rating items horizontally. To see them in reverse horizontally set `layoutDirection="rtl"`
   *
   * **vertical**:- Shows the rating items vertically, top to bottom.
   *
   * **vertical-reverse**:- Shows the rating itmes vertically, bottom to top.
   */
  direction?: 'horizontal' | 'vertical' | 'vertical-reverse';
  /**
   * If true, Rating items will glow when being touched or dragged
   *
   * default is `true`
   *
   * @platform ios
   */
  glow?: boolean;
  /**
   * Defines the radius of glow
   *
   * Default is `2`
   */
  glowRadius?: number;
  /**
   * Ignore user gestures to make rating bar view only.
   *
   * Alternatively you can use `RatingBarIndicator` component.
   *
   * Default is `false`
   */
  ignoreGestures?: boolean;
  /**
   * Defines the initial rating to be set to the rating bar
   *
   * Default is `0`
   */
  initialRating?: number;
  /**
   * The amount of space by which to inset each rating item.
   *
   * Default is `0`
   */
  itemPadding?: number;
  /**
   * Defines width and height of each rating item in the bar.
   *
   * Default is `40`
   */
  itemSize?: number;
  /**
   * If `true`, will disable drag to rate feature and only allow taps to change ratings.
   *
   * Default is `false`
   */
  tapOnlyMode?: boolean;
  /**
   * Defines whether or not the `onRatingUpdate` updates while dragging.
   *
   * Default is `false`
   */
  updateOnDrag?: boolean;
  //   wrapAlignment: any;
  /**
   * Properties for rating view that updates with current rating
   *
   * By default it shows `Rating: {currentRating} / {itemCount}`
   */
  ratingView?: {
    /**
     * Whether to show Rating indicator.
     *
     * By default view doesn't show.
     */
    showRating: boolean;
    /**
     * Whether to show indicator on top or bottom of Rating bar.
     *
     * By default it shows on `top`.
     */
    position?: 'top' | 'bottom';
    /**
     * Custom title that shows at the start, before `{currentRating} / {itemCount}`.
     *
     * Default is `Rating: `.
     */
    titleText?: string;
    /**
     * Style for main view container.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Style for text showing before ratings, at the start.
     */
    titleStyle?: StyleProp<TextStyle>;
    /**
     * Style for text showing current rating.
     */
    ratingStyle?: StyleProp<TextStyle>;
    /**
     * Style for text showing total allowed rating.
     */
    totalStyle?: StyleProp<TextStyle>;
    /**
     * Pass custom component replacing the default one, can be emoji, image or text etc.
     *
     * Note:- You have to handle updates based on rating yourself.
     */
    custom?: React.ReactElement;
  };
  /**
   * There are two implemented solutions for the drag to rate feature, choose whichever works best for you.
   *
   * You won't usually notice any difference, unless ratings are vertical, see `direction` props.
   *
   * By default intial solution 1 is used.
   */
  useSolution?: 1 | 2;
}

export type RatingBarProps = RatingCommonProps &
  (
    | {
        /**
         * Define 3 different states of rating.
         *
         * `empty`, `half` and `full`.
         */
        ratingElement?: RatingElementType;
        /**
         * Function to return your custom components to be used as rating items, usually Image or Icon component from {@link https://github.com/oblador/react-native-vector-icons react-native-vector-icons}
         *
         * You can either pass single component or different components based on `index` property from param.
         *
         * @param {number} index - Rating bar item's index position.
         */
        itemBuilder: (index: number) => JSX.Element;
      }
    | {
        ratingElement: RatingElementType;
        itemBuilder?: (index: number) => JSX.Element;
      }
  );

export interface RatingBarIndicatorProps {
  /**
   * Layout Direction to show the ratings on, left-to-right (`ltr`) or right-to-left (`rtl`)
   *
   * Default is based on device's preferred layout direction
   */
  layoutDirection?: 'ltr' | 'rtl';
  /**
   * Color for items that are not rated yet, usually `index >= rating`.
   *
   * Default is `rgba(0, 0, 0, 0.38)`
   */
  unratedColor?: ColorValue;
  /**
   * Direction to show the ratings items in
   *
   * **horizontal**:- Default, shows the rating items horizontally. To see them in reverse horizontally set `layoutDirection="rtl"`
   *
   * **vertical**:- Shows the rating items vertically, top to bottom.
   *
   * **vertical-reverse**:- Shows the rating itmes vertically, bottom to top.
   */
  direction?: 'horizontal' | 'vertical' | 'vertical-reverse';
  /**
   * Total number of Rating items to display
   *
   * Default is `5`
   */
  itemCount?: number;
  /**
   * The amount of space by which to inset each rating item.
   *
   * Default is `0`
   */
  itemPadding?: number;
  /**
   * Defines width and height of each rating item in the bar.
   *
   * Default is `40`
   */
  itemSize?: number;
  /**
   * Defines the rating value for indicator.
   *
   * Default is `0`
   */
  rating?: number;
  /**
   * Function to return your custom components to be used as rating items, usually Image or Icon component from {@link https://github.com/oblador/react-native-vector-icons react-native-rating-bar}
   *
   * You can either pass single component or different components based on `index` property from param.
   *
   * @param {number} index - Rating bar item's index position.
   */
  itemBuilder: (index: number) => React.ReactNode;
}

export interface NoRatingProps {
  size: number;
  children: JSX.Element | React.ReactNode;
  enableMask: boolean;
  unratedColor: ColorValue;
}

export interface HalfRatingProps {
  size: number;
  children: JSX.Element | React.ReactNode | null | undefined;
  enableMask: boolean;
  rtlMode: boolean;
  unratedColor: ColorValue;
}

export type ItemCloneArray = Array<JSX.Element | React.ReactNode | undefined>;
export type RatingCloneType = {
  full: RatingElementType['full'] | undefined;
  half: RatingElementType['half'] | undefined;
  empty: RatingElementType['empty'] | undefined;
};
