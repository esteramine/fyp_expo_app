import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React, { PureComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageHeader } from '../utils/Constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between'
  },
});

export default function CameraPreview({ route, navigation }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const image = route.params.image;

  // bottom sheet
  const openSheet = () => {
    const icons = [
      <Icon name={'rate-review'} color={'#000000'} size={30} />,
      <Icon name={'book'} color={'#000000'} size={30} />
    ];
    const options = ["Post a review", "Save as record"];
    showActionSheetWithOptions({ options, cancelButtonIndex: 2, icons }, (index) => {
      let next;
      if (index == 0) next = "Questionnaire";
      else if (index == 1) next = "AddEntry";
      navigation.navigate(next, { uri: image, review: index == 0 ? true : false });
    });
  };


  return (

    <SafeAreaView style={styles.container}>
      <Image style={styles.preview} source={{ uri: image }} />
      <View style={styles.buttonContainer}>
        <IconButton
          icon="arrow-left"
          color={'white'}
          size={40}
          onPress={() => navigation.goBack()}
        />
        <IconButton
          icon="arrow-right"
          color={'white'}
          size={40}
          onPress={() => openSheet()}
        />
      </View>
    </SafeAreaView >
  );

}
