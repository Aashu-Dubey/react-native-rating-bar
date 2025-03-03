import { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Switch,
  I18nManager,
  Platform,
  useColorScheme,
  type ColorValue,
  StatusBar,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { RatingBar } from '@aashu-dubey/react-native-rating-bar';
import { RatingBarIndicator } from '@aashu-dubey/react-native-rating-bar';
import RadioBtn from './components/RadioBtn';
import IconOptionsModal from './components/IconOptionsModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const colorScheme = useColorScheme();
  const [rating, setRating] = useState(2);
  const [userRating, setUserRating] = useState('3.0');
  const [ratingBarMode, setRatingBarMode] = useState(1);
  const [isRtlMode, setRtlMode] = useState(false);
  const [isVertical, setVertical] = useState(false);
  const [verticalMode, setVerticalMode] = useState<
    'vertical' | 'vertical-reverse'
  >('vertical');
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof Icon.glyphMap>('star');
  const [showAlert, setShowAlert] = useState(false);

  const textColor = useMemo(
    () => (colorScheme === 'dark' ? 'white' : 'black'),
    [colorScheme]
  );

  const androidRTL =
    Platform.OS === 'android' &&
    ((isRtlMode && !I18nManager.isRTL) || (I18nManager.isRTL && !isRtlMode));

  /* const mode1Item = useCallback(
    () => <Icon name={selectedIcon ?? 'star'} color="#FFC107" size={50} />,
    [selectedIcon]
  ); */
  const mode1Item = useCallback(
    (name: keyof typeof Icon.glyphMap, color: ColorValue, size?: number) => (
      <Icon {...{ name, color, size }} />
    ),
    []
  );

  const mode3Item = useCallback((index: number) => {
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
  }, []);

  const onRatingUpdate = useCallback((value: number) => setRating(value), []);

  const ratingBar = (mode: number) => {
    switch (mode) {
      case 1:
        return (
          <RatingBar
            rateStyles={{
              container: { alignItems: 'center' },
              // starContainer: (index) => ({ backgroundColor: rating > index ? 'red' : 'green', marginHorizontal: 2, borderRadius: 4 })
            }}
            initialRating={2}
            minRating={1}
            direction={isVertical ? verticalMode : 'horizontal'}
            layoutDirection={isRtlMode ? 'rtl' : 'ltr'}
            allowHalfRating
            unratedColor="rgba(84, 211, 194, 0.2)"
            glowColor="#54D3C2"
            itemCount={5}
            itemSize={50}
            itemPadding={4}
            itemBuilder={() => mode1Item(selectedIcon ?? 'star', '#54D3C2', 50)}
            onRatingUpdate={onRatingUpdate}
            updateOnDrag
            // useSolution={2}
            // ratingView={{ showRating: true }}
          />
        );
      case 2:
        return (
          <RatingBar
            initialRating={2}
            direction={isVertical ? verticalMode : 'horizontal'}
            layoutDirection={isRtlMode ? 'rtl' : 'ltr'}
            allowHalfRating
            itemCount={5}
            glowColor="#54D3C2"
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
            itemPadding={4}
            onRatingUpdate={onRatingUpdate}
            updateOnDrag
          />
        );
      case 3:
        return (
          <RatingBar
            initialRating={2}
            direction={isVertical ? verticalMode : 'horizontal'}
            layoutDirection={isRtlMode ? 'rtl' : 'ltr'}
            itemCount={5}
            itemPadding={4}
            glowColor="#FFC107"
            itemBuilder={mode3Item}
            onRatingUpdate={onRatingUpdate}
            updateOnDrag
          />
        );
      default:
        return <></>;
    }
  };

  const heading = (title: string) => (
    <Text style={[styles.heading, { color: textColor }]}>{title}</Text>
  );

  const renderRadio = useCallback(
    (title: string, isSelected: boolean, onChange: () => void) => (
      <RadioBtn
        style={{ flex: 1, flexDirection: !androidRTL ? 'row' : 'row-reverse' }}
        textStyle={{ color: textColor, fontSize: 12, fontWeight: '300' }}
        title={title}
        radioColor="#54D3C2"
        isSelected={isSelected}
        onSelectionChange={onChange}
      />
    ),
    [androidRTL, textColor]
  );

  const renderSwitchOption = (
    title: string,
    switchBool: boolean,
    onValueChange: (value: boolean) => void
  ) => {
    return (
      <View
        style={{
          flexDirection: !androidRTL ? 'row' : 'row-reverse',
          alignItems: 'center',
          marginVertical: 16,
        }}
      >
        <Text
          style={{ color: textColor, fontWeight: '300', marginHorizontal: 12 }}
        >
          {title}
        </Text>
        <Switch
          trackColor={{ false: 'darkgrey', true: '#09A599' }}
          thumbColor={switchBool ? '#54D3C2' : 'white'}
          ios_backgroundColor="darkgrey"
          onValueChange={onValueChange}
          value={switchBool}
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <StatusBar backgroundColor="rgb(81, 173, 133)" />
      <SafeAreaView style={{ flex: 0, backgroundColor: 'rgb(81, 173, 133)' }} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colorScheme === 'dark' ? '#313a44' : 'white',
        }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>React-Native Rating Bar</Text>
          <Pressable onPress={() => setShowAlert(true)}>
            <Icon name="settings" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 40,
            direction: isRtlMode ? 'rtl' : 'ltr',
          }}
        >
          {heading('Rating Bar')}
          {ratingBar(ratingBarMode)}
          <Text style={[styles.currentRatingTxt, { color: textColor }]}>
            Rating: {rating}
          </Text>

          {heading('Rating Indicator')}
          <RatingBarIndicator
            rating={Number(userRating)}
            itemBuilder={() => mode1Item(selectedIcon ?? 'star', '#FFC107')}
            itemCount={5}
            itemSize={50}
            itemPadding={4}
            // unratedColor="#FFF8E1"
            unratedColor="rgba(255, 193, 7, 0.2)"
            direction={isVertical ? verticalMode : 'horizontal'}
            layoutDirection={isRtlMode ? 'rtl' : 'ltr'}
          />
          <TextInput
            style={{
              width: '90%',
              color: textColor,
              margin: 16,
              marginBottom: 56,
              padding: 16,
              borderWidth: 0.5,
              borderColor: textColor,
              borderRadius: 4,
              writingDirection: isRtlMode ? 'rtl' : 'ltr',
            }}
            placeholder="Enter rating"
            keyboardType="number-pad"
            value={userRating}
            onChangeText={(text) => setUserRating(text)}
          />

          {heading('Scrollable Rating Indicator')}
          <RatingBarIndicator
            rating={8.2}
            itemCount={20}
            itemSize={30}
            itemBuilder={() => mode1Item('star', '#FFC107')}
            layoutDirection={isRtlMode ? 'rtl' : 'ltr'}
          />

          <Text style={{ color: textColor, fontWeight: '300', marginTop: 20 }}>
            Rating Bar Modes
          </Text>
          <View style={{ flexDirection: !androidRTL ? 'row' : 'row-reverse' }}>
            {renderRadio('Mode 1', ratingBarMode === 1, () =>
              setRatingBarMode(1)
            )}
            {renderRadio('Mode 2', ratingBarMode === 2, () =>
              setRatingBarMode(2)
            )}
            {renderRadio('Mode 3', ratingBarMode === 3, () =>
              setRatingBarMode(3)
            )}
          </View>

          {renderSwitchOption('Switch to Vertical Bar', isVertical, (value) =>
            setVertical(value)
          )}
          {isVertical && (
            <View style={{ flexDirection: 'row' }}>
              {renderRadio('Top to Bottom', verticalMode === 'vertical', () =>
                setVerticalMode('vertical')
              )}
              {renderRadio(
                'Bottom to top',
                verticalMode === 'vertical-reverse',
                () => setVerticalMode('vertical-reverse')
              )}
            </View>
          )}

          {renderSwitchOption(
            `Switch to ${I18nManager.isRTL ? 'LTR' : 'RTL'} Mode`,
            isRtlMode,
            (value) => setRtlMode(value)
          )}
        </ScrollView>
      </SafeAreaView>
      <IconOptionsModal
        show={showAlert}
        setShow={setShowAlert}
        onIconSelected={(icon) => {
          setShowAlert(false);
          setSelectedIcon(icon);
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 20,
  },
  headerContainer: {
    height: 52,
    flexDirection: 'row',
    // backgroundColor: '#FFC107',
    backgroundColor: 'rgb(81, 173, 133)',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2.62,
    elevation: 8,
  },
  headerText: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  currentRatingTxt: {
    minWidth: 80,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 40,
  },
});
