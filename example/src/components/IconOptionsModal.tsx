import React from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IconsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onIconSelected: (icon: string) => void;
}

const IconOptionsModal: React.FC<IconsModalProps> = ({
  show,
  setShow,
  onIconSelected,
}) => {
  const colorScheme = useColorScheme();

  const iconButton = (icon: string) => (
    <Pressable
      style={{ flex: 1, alignItems: 'center', padding: 8, marginVertical: 8 }}
      onPress={() => onIconSelected(icon)}
    >
      <Icon name={icon} color="#FFC107" size={24} />
    </Pressable>
  );

  return (
    <Modal
      visible={show}
      animationType="fade"
      transparent
      onRequestClose={() => setShow(false)}
    >
      <StatusBar backgroundColor="rgba(0,0,0, 0.5)" />
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => setShow(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0, 0.5)',
          }}
        >
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {}}>
            <View
              style={{
                backgroundColor: colorScheme === 'dark' ? '#313a44' : 'white',
                borderRadius: 10,
                margin: 36,
              }}
            >
              <Text
                style={{
                  color: colorScheme === 'dark' ? 'white' : 'black',
                  padding: 12,
                  fontWeight: '300',
                }}
              >
                Select Icon
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {iconButton('home')}
                {iconButton('airplanemode-active')}
                {iconButton('euro-symbol')}
                {iconButton('beach-access')}
                {iconButton('attach-money')}
                {iconButton('music-note')}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {iconButton('android')}
                {iconButton('toys')}
                {iconButton('language')}
                {iconButton('landscape')}
                {iconButton('ac-unit')}
                {iconButton('star')}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default IconOptionsModal;
