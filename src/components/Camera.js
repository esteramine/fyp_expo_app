import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { IconButton } from 'react-native-paper';

export default function CustomizedCamera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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
      <Camera style={styles.camera} type={type}>
        <View style={styles.close}>
          <IconButton
            icon="close"
            color={'white'}
            onPress={() => {
              console.log('Pressed close');
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            icon="image"
            color='white'
            size={40}
            onPress={() => console.log('hihi')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.cameraButton}>
            <IconButton
              icon="camera-iris"
              color={'white'}
              size={40}

              onPress={() => console.log('take picture')}
            />
          </View>

        </View>
      </Camera >
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
    width: '100%',
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