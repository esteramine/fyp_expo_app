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
});
  
class CameraPreview extends PureComponent {
  render() {
    const image = this.props.image;
    const uri = "data:image/png;base64," + image;

    return (
      <View style={styles.container}>
        <Image style={styles.preview} source={{ uri: uri }} />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <IconButton
            icon="camera-iris"
            color={'white'}
            size={40}
            disabled
            style={{margin: 20}}
          />
        </View>
      </View>
    );
  }
}

export default CameraPreview;