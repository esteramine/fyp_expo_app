import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { IconButton } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function CustomizedCamera() {
  const isFocused = useIsFocused();
  const [focused, setFocused] = useState(true);
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  var camera = null;

  const __takePicture = async () => {
    if (!camera) return;
    const options = { quality: 0.1 };
    const photo = await camera.takePictureAsync(options);
    navigation.navigate('CameraPreview', { image: photo.uri });
  }

  const pickImage = async () => {
    setFocused(false);
    // No permissions request is necessary for launching the image library
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setFocused(true);
        navigation.navigate('Questionnaire', { base64Link: result.base64, review: true, uri: result.uri })
      }
      else {
        setFocused(true);
      }
    }
    else {
      setFocused(true);
      return;
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {isFocused && focused &&
        <Camera
          style={styles.camera}
          type={type}
          ref={(r) => {
            camera = r
          }}
        >
          {/* <View style={styles.close}>
            <IconButton
              icon="close"
              color={'white'}
              onPress={() => {
                console.log('Pressed close');
              }}
            />
          </View> */}
          <View style={styles.buttonContainer}>
            <View style={styles.cameraButton}>
              <IconButton
                icon="camera-iris"
                color={'white'}
                size={40}
                onPress={__takePicture}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton
              icon="image"
              color='white'
              size={40}
              onPress={pickImage}
            />
          </View>
        </Camera >}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    // width: '100%',
    padding: 20,
    justifyContent: 'space-between'
  },
  cameraButton: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  close: {
    flex: 2,
    position: 'absolute',
    margin: 16,
    top: 0,
    left: 0,
  },
});