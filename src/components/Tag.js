import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color } from '../utils/Constants';

const styles = StyleSheet.create({
    tagContainer: {
        borderWidth: 1, 
        borderColor: Color.gray500, 
        borderRadius: 10, 
        paddingHorizontal: 10, 
        paddingVertical: 2, 
        margin: 5,
    }

});

function Tag({ text }) {
  return (
    <View style={styles.tagContainer}>
      <Text style={{ color: Color.green500 }}>#{text}</Text>
    </View>
  );
};

export default Tag;