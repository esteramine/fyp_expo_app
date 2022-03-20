import React, { PureComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

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

export default function CameraPreview({ navigation }) {

  const image = this.props.route.params.image;
  const uri = "data:image/png;base64," + image;

  return (
    <View style={styles.container}>
      <Image style={styles.preview} source={{ uri: uri }} />
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
          onPress={() => navigation.navigate('Home')}
        />
      </View>
      {/* <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <IconButton
            icon="camera-iris"
            color={'white'}
            size={40}
            disabled
            style={{margin: 20}}
          />
        </View> */}
    </View>
  );

}
