import React, { PureComponent, useState } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker/src';
import RNFS from 'react-native-fs'
import Camera from '../components/Camera';
import CameraPreview from '../components/CameraPreview';
import BottomSheet from '../components/BottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  close: {
    flex: 2,
    position: 'absolute',
    margin: 16,
    top: 0,
    left: 0,
  },
  next: {
    flex: 0,
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
  },
  imageBtn: {
    flex: 0,
    position: 'absolute',
    margin: 20,
    left: 0,
    bottom: 0,
  }
});

function CaptureScreen({ route, navigation }) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [metaState, setMetaState] = useState(false);
  const [image, setImage] = useState();

  const launchLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const base64Link = response.assets[0].base64;
        navigation.navigate('Questionnaire', { base64Link, review: true })
      }
    });
  }

  return (
    <View style={styles.container}>
      {!metaState ?
        <Camera
          navigation={navigation}
          photoCaptured={(data) => {
            setImage(data);
            setMetaState(true);
          }} /> :
        <CameraPreview
          image={image} />
      }
      <View style={styles.close}>
        <IconButton
          icon="close"
          color={'white'}
          onPress={() => {
            console.log('Pressed close');
            if (metaState) setMetaState(false);
            else navigation.goBack();
          }}
        />
      </View>
      {!metaState &&
        <View style={styles.imageBtn}>
          <IconButton
            icon="image"
            color='white'
            size={32}
            onPress={launchLibrary}
          />
        </View>}
      {metaState &&
        <View style={styles.next}>
          <IconButton
            icon="arrow-right"
            color={'white'}
            size={32}
            onPress={() => {
              console.log('Pressed next page');
              setBottomSheetVisible(true);
              setTimeout(() => {
                setBottomSheetVisible(false);
              }, 1000);
            }}
          />
        </View>
      }
      <BottomSheet
        navigation={navigation}
        visible={bottomSheetVisible}
        image={image} />
    </View>
  );
};

export default CaptureScreen;