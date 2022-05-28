<h1 align="center">
    React Native Rating Bar
</h1>

A React Native component for generating and displaying interactive Tap or Swipe enabled Ratings supporting custom icons from [vector icons](https://github.com/oblador/react-native-vector-icons) and custom images.

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-examples">Examples</a> •
  <a href="./example">Demo</a>
</p>

## 🚀 Installation

Install the package using yarn or npm:

```sh
yarn add @aashu-dubey/react-native-rating-bar
```

Or

```sh
npm install --save @aashu-dubey/react-native-rating-bar
```

And you also need to install [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler), as we're using it for Swipe/Tap gestures:

```sh
yarn add react-native-gesture-handler
```

then wrap your App's entry point with `GestureHandlerRootView` (see [official doc](https://docs.swmansion.com/react-native-gesture-handler/docs/next/installation#js)) in order for drag to rate feature to work

```JSX
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* content */}
    </GestureHandlerRootView>
  );
}
```

For more info see gesture-handler's [official Installation guide](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

## 💪🏼 Usage

### Props

#### RatingBar

| prop                                                     | default                   | type                                             | description                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------- | ------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span id="tableRateStylesProp">rateStyles</span>         | undefined                 | object ([RateStyles](#ratestyless-object))       | Provide custom styles for View containing whole rating group or single rating item.                                                                                                                                                                                                                                                                                    |
| itemCount                                                | 5                         | number                                           | Total number of Rating items to display.                                                                                                                                                                                                                                                                                                                               |
| minRating                                                | 0                         | number                                           | Minimum rating value allowed. Should be `>= 0`                                                                                                                                                                                                                                                                                                                         |
| maxRating                                                | `itemCount`               | number                                           | Miximum rating value allowed. Should be `>= minRating >= 0`                                                                                                                                                                                                                                                                                                            |
| layoutDirection                                          | device's layout direction | 'ltr' or 'rtl'                                   | Layout Direction to show the ratings on, left-to-right (`ltr`) or right-to-left (`rtl`)                                                                                                                                                                                                                                                                                |
| unratedColor                                             | 'rgba(0, 0, 0, 0.38)'     | string (ColorValue)                              | Color for items that are not rated yet, usually when `index >= rating`.                                                                                                                                                                                                                                                                                                |
| <span id="tableAllowHalfRating">allowHalfRating</span>   | false                     | boolean                                          | If `true`, rating will increase/decrease by fraction of `0.5` instead of default `1`.                                                                                                                                                                                                                                                                                  |
| <span id="tableDirectionProp">direction</span>           | 'horizontal'              | 'horizontal' \| 'vertical' \| 'vertical-reverse' | Direction to show the ratings items in                                                                                                                                                                                                                                                                                                                                 |
|                                                          |                           | 'horizontal'                                     | shows the rating items horizontally. To see them in reverse horizontally set `layoutDirection="rtl"`                                                                                                                                                                                                                                                                   |
|                                                          |                           | 'vertical'                                       | Shows the rating items vertically, top to bottom.                                                                                                                                                                                                                                                                                                                      |
|                                                          |                           | 'vertical-reverse'                               | Shows the rating itmes vertically, bottom to top.                                                                                                                                                                                                                                                                                                                      |
| glow                                                     | true                      | boolean                                          | If true, Rating items will glow when being touched or dragged.<br><br>Note:- iOS only                                                                                                                                                                                                                                                                                  |
| glowColor                                                | '#FFC107'                 | string (ColorValue)                              | Defines color for glow                                                                                                                                                                                                                                                                                                                                                 |
| glowRadius                                               | 2                         | number                                           | Defines the radius of glow                                                                                                                                                                                                                                                                                                                                             |
| ignoreGestures                                           | false                     | boolean                                          | Ignore user gestures to make rating bar view only<br>Alternatively you can use `RatingBarIndicator` component.                                                                                                                                                                                                                                                         |
| initialRating                                            | 0                         | number                                           | Defines the initial rating to be set to the rating bar.                                                                                                                                                                                                                                                                                                                |
| itemPadding                                              | 0                         | number                                           | The amount of space by which to inset each rating item.                                                                                                                                                                                                                                                                                                                |
| itemSize                                                 | 40                        | number                                           | Defines width and height of each rating item in the bar.                                                                                                                                                                                                                                                                                                               |
| tapOnlyMode                                              | false                     | boolean                                          | If `true`, will disable drag to rate feature and only allow taps to change ratings.                                                                                                                                                                                                                                                                                    |
| <span id="tableUpdateOnDragProp">updateOnDrag</span>     | false                     | boolean                                          | Defines whether or not the [`onRatingUpdate`](#tableOnRatingUpdateProp) updates while dragging.                                                                                                                                                                                                                                                                        |
| useSolution                                              | 1                         | 1 or 2 (number)                                  | There are two implemented solutions for the drag to rate feature, choose whichever works best for you.<br><br>You won't usually notice any difference, unless ratings are vertical, see [`direction`](#tableDirectionProp) props.                                                                                                                                      |
| <span id="tableOnRatingUpdateProp">onRatingUpdate</span> | undefined                 | function(rating: number)                         | Return current rating whenever rating is updated.<br><br>[`updateOnDrag`](#tableUpdateOnDragProp) can be used to change the behaviour how the callback reports the update.<br>By Default it only returns update when the touch ends, either when tapping or dragging.                                                                                                  |
| <span id="tableRatingView">ratingView</span>             | undefined                 | object ([RatingView](#ratingviews-object))       | Properties for rating view that updates with current rating.<br>By default it shows `Rating: {rating} / {itemCount}`                                                                                                                                                                                                                                                   |
| <span id="tableItemBuilder">itemBuilder<span>            | undefined                 | function(index: number) => JSX.Element           | Function to return your custom components to be used as rating items, usually Image or Icon component from [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).<br>You can either pass single component or different components based on `index` property from param.<br><br>index - Provides Rating bar item's index position as param. |
| <span id="tableRatingElement">ratingElement</span>       | undefined                 | object ([RatingElement](#ratingelements-object)) | Define 3 different states of rating.<br>`empty`, `half` and `full`.                                                                                                                                                                                                                                                                                                    |

##### [`ratingElement`'s Object](#tableRatingElement)

- | key   | type        | description                                                                                                                                                                |
  | ----- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | empty | JSX.Element | Defines Element to be used as rating bar item when item is unrated.                                                                                                        |
  | half  | JSX.Element | Defines Element to be used when as rating bar item when only half portion of item is rated.<br>**Note**:- [allowHalfRating](#tableAllowHalfRating) needs to be set to true |
  | full  | JSX.Element | Defines Element to be used when as rating bar item when item is completely rated.                                                                                          |

##### [`rateStyles`'s Object](#tableRateStylesProp)

- | key           | type                                                            | description                                          |
  | ------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
  | container     | object (ViewStyle)                                              | Custom styles for View contaning whole rating group. |
  | starContainer | object (ViewStyle) \| ((index: number) => StyleProp<ViewStyle>) | Custom styles for View contaning Sigle rating item.  |

##### [`ratingView`'s Object](#tableRatingView)

- | key            | type               | description                                                                                                                                                                                                                                |
  | -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | showRating     | boolean            | Whether to show Rating indicator. By default view doesn't show.                                                                                                                                                                            |
  | position       | 'top' \| 'bottom'  | Whether to show indicator on `top` or `bottom` of Rating bar. By default it shows on `top`.                                                                                                                                                |
  | titleText      | string             | Custom title that shows at the start, before `{currentRating} / {itemCount}`.<br>Default is `"Rating: "`.                                                                                                                                  |
  | containerStyle | object (ViewStyle) | Style for main view container.                                                                                                                                                                                                             |
  | titleStyle     | object (TextStyle) | Style for text showing before ratings, at the start.                                                                                                                                                                                       |
  | ratingStyle    | object (TextStyle) | Style for text showing current rating.                                                                                                                                                                                                     |
  | totalStyle     | object (TextStyle) | Style for text showing total allowed rating.                                                                                                                                                                                               |
  | custom         | ReactElement       | Pass custom component replacing the default one, can be emoji, image or text etc.<br>Passing this will make above props irrelevent, except `showRating` and `position`.<br><br>Note:- You have to handle updates based on rating yourself. |

> **Note**:- To make the component work you must pass either of `itemBuilder` or `ratingElement` with valid values.

#### RatingBarIndicator

This is view only alternative to `RatingBar` with no Tap or Swipe capability and From above props **RatingBarIndicator** contains `layoutDirection`, `unratedColor`, `direction`, `itemCount`, `itemPadding`, `itemSize`, `rating` and `itemBuilder` with same specific uses.

### 📲 Examples

#### Using RatingBar Component

There are few different ways to use Rating Bar component

###### Using [`ratingElement`](#tableRatingElement) prop:

<img width="248" alt="image" src="https://user-images.githubusercontent.com/86477859/169906569-f937a04a-0bbc-40b9-ad79-6eaefcb58c0c.png">

```JSX
<RatingBar
  initialRating={3.5}
  direction="horizontal"
  allowHalfRating
  itemCount={5}
  itemPadding={4}
  ratingElement={{
    full: (
      <Image
        style={{ width: 30, height: 30, tintColor: '#54D3C2' }}
        resizeMode="contain"
        source={require('./assets/heart.png')}
      />
    ),
    half: (
      <Image
        style={{ width: 30, height: 30, tintColor: '#54D3C2' }}
        resizeMode="contain"
        source={require('./assets/heart_half.png')}
      />
    ),
    empty: (
      <Image
        style={{ width: 30, height: 30, tintColor: '#54D3C2' }}
        resizeMode="contain"
        source={require('./assets/heart_border.png')}
      />
    ),
  }}
  onRatingUpdate={value => console.log(value)}
/>
```

Assets are available [here](./example/src/assets).<br>
Or you can use Icon component from [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons):

<img width="248" alt="image" src="https://user-images.githubusercontent.com/86477859/169905930-0fbdd3d0-df05-4e87-b328-79f891ec0e7a.png">

```JSX
<RatingBar
  initialRating={3.5}
  direction="horizontal"
  allowHalfRating
  itemCount={5}
  itemPadding={4}
  ratingElement={{
    full: <Icon name="star-rate" color="#54D3C2" size={40} />,
    half: <Icon name="star-half" color="#54D3C2" size={40} />,
    empty: <Icon name="star-border" color="#54D3C2" size={40} />,
  }}
  onRatingUpdate={value => console.log(value)}
/>
```

###### Using [`itemBuilder`](#tableItemBuilder) prop:

<img width="248" alt="image" src="https://user-images.githubusercontent.com/86477859/169903719-224b225e-e45b-4dec-b4b8-3b0d4230e709.png">

```JSX
<RatingBar
  initialRating={2.5}
  minRating={1}
  direction="horizontal"
  allowHalfRating
  unratedColor="rgba(255, 193, 7, 0.2)"
  itemCount={5}
  itemPadding={4}
  itemSize={40}
  itemBuilder={() => <Icon name="star" color="#FFC107" size={40} />}
  onRatingUpdate={value => console.log(value)}
/>
```

###### Based on [`itemBuilder`](#tableItemBuilder) prop's index param:

Passing different component in `itemBuilder` based on index param value:

<img width="248" alt="image" src="https://user-images.githubusercontent.com/86477859/169907826-2388a362-b5fe-457c-9573-f749c2014c6a.png">

```JSX
<RatingBar
  initialRating={3}
  itemCount={5}
  itemPadding={4}
  itemBuilder={index => {
    switch (index) {
      case 0:
        return (
          <Icon name="sentiment-very-dissatisfied" color="#F44336" size={40} />
        );
      case 1:
        return <Icon name="sentiment-dissatisfied" color="#FF5252" size={40} />;
      case 2:
        return <Icon name="sentiment-neutral" color="#FFC107" size={40} />;
      case 3:
        return <Icon name="sentiment-satisfied" color="#8BC34A" size={40} />;
      case 4:
        return (
          <Icon name="sentiment-very-satisfied" color="#4CAF50" size={40} />
        );
      default:
        return <View />;
    }
  }}
  onRatingUpdate={value => console.log(value)}
/>
```

#### Using `RatingBarIndicator` Component

<img width="248" alt="image" src="https://user-images.githubusercontent.com/86477859/169963092-a600f105-5d7c-458f-9bb6-862175d5f840.png">

```JSX
<RatingBarIndicator
  rating={3.37}
  itemBuilder={() => <Icon name="star" color="#FFC107" />}
  itemCount={5}
  itemSize={50}
  unratedColor="rgba(255, 193, 7, 0.2)"
  direction="horizontal" // Or "vertical", "vertical-reverse"
/>
```

#### Vertical Mode

| <img width="154" alt="image" src="https://user-images.githubusercontent.com/86477859/169964817-4cfbb2d6-1c15-4769-8099-23cd450a0d8f.png"> | <img width="154" alt="image" src="https://user-images.githubusercontent.com/86477859/169964900-1e8d3a8e-b3fd-45ac-9d2d-3a80ce219205.png"> |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|                                                              <b>vertical</b>                                                              |                                                          <b>vertical-reverse</b>                                                          |

## 🚧 Issue

You may notice, especially in Android drag to rate is a little slower, this is a dev only problem, if you run your build on release mode or even debug with JS dev mode disabled it will run way way faster, something related to [this](https://github.com/facebook/hermes/issues/48).
That being said, I'm trying to fix this.

## 🌻 Motivation

This project was initially started as I needed to implement a rating component for [Hotel Booking UI](https://github.com/Aashu-Dubey/React-Native-UI-Templates/blob/main/react_native_UI_Templates/res/hotel/hotel_booking.png) template in my other open source project for learning [React-Native-UI-Templates](https://github.com/Aashu-Dubey/React-Native-UI-Templates), and failing to find a proper solution that works same as the original Project in Flutter, I decided to replicate the Rating library used in the Flutter project.<br>
So this package is initially inspired from Flutter package [flutter_rating_bar](https://github.com/sarbagyastha/flutter_rating_bar) (including the demo 😅) with some extra added functionalities.

## 🙋‍♀️ Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📜 License

MIT
