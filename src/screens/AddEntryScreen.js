import React, { useState } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { Button, TextInput, Modal, Portal, Provider } from 'react-native-paper';
import UserStorage from '../utils/UserStorage';
import { getCurrentDate } from '../utils/Functions';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../utils/graphql/mutations';
import { FETCH_USER_MONTH_POSTS_QUERY } from '../utils/graphql/queries';
import { Color, ImageHeader } from '../utils/Constants';
import CircularProgress from '../components/CircularProgress';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';

const styles = StyleSheet.create({
  cancel: {
    position: 'absolute',
    margin: 10,
    top: 0,
    left: 0,
    width: 80
  },
  save: {
    position: 'absolute',
    margin: 10,
    top: 0,
    right: 0,
    width: 80
  },
  textinput: {
    // position: 'absolute',
    margin: 10,
    // top: 42
  },
  userImage: {
    width: 300,
    height: 300,
    padding: 5,
    borderRadius: 10,
  },
  centerContainer: {
    // justifyContent: 'center',
    alignItems: 'center'
  },
  containerStyle: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 5,
  },
  errorBox: {
    marginHorizontal: 50,
    padding: 10,
    backgroundColor: Color.errorBg,
    borderColor: Color.errorText,
    borderWidth: 1,
    borderRadius: 10,
    color: Color.errorText,
  }
})

const getCurrentTime = () => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeString = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute);
  return timeString;
}

function AddEntryScreen({ route, navigation }) {
  const storage = new UserStorage();
  const { base64Link } = route.params;
  const imageUri = ImageHeader + base64Link;
  const [text, setText] = React.useState('');
  const ateTimeObj = new Date();
  const [errors, setErrors] = useState({});

  const [addPost] = useMutation(CREATE_POST, {
    update(proxy, result) {
      // TODO: update getUserMonthPost Query
      // const currYear = ateTimeObj.getFullYear().toString();
      // const currMonth = (ateTimeObj.getMonth()+1).toString();
      // const data = proxy.readQuery({
      //   query: FETCH_USER_MONTH_POSTS_QUERY,
      //   variables: {
      //     year: currYear,
      //     month: currMonth
      //   }
      // });
      // const newData = [...data.getUserMonthPosts, result.data.createPost];
      // proxy.writeQuery({
      //   query: FETCH_USER_MONTH_POSTS_QUERY,
      //   data: { getUserMonthPosts: newData },
      //   variables: {
      //     year: currYear,
      //     month: currMonth
      //   }
      // });
      navigation.dispatch(StackActions.popToTop());
      navigation.navigate('Diary', { update: true });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
      setVisible(false);
    },
    variables: {
      foodName: text,
      ateTime: ateTimeObj.toISOString(),
      completion: '',
      rating: '',
      restaurantName: '',
      location: '',
      price: '',
      review: '',
      tags: [],
      image: base64Link,
      public: false
    }
  });
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Button
          color='black'
          uppercase={false}
          compact
          style={styles.cancel}
          onPress={() => {
            navigation.goBack();
          }}
        >
          Cancel
        </Button>
        <Button
          color={Color.green1000}
          uppercase={false}
          compact
          style={styles.save}
          onPress={() => {
            addPost();
            setVisible(true);
          }}
        >
          Save
        </Button>
      </View>
      <ScrollView style={{ marginTop: 50, backgroundColor: 'white' }}>
        {Object.keys(errors).length > 0 && (
          <View style={styles.errorBox}>
            {Object.values(errors).map(error => (
              <Text key={error}>{error}</Text>
            ))}
          </View>
        )}
        <TextInput
          value={text}
          mode='outlined'
          placeholder='What did you get?'
          selectionColor='lightblue'
          outlineColor='transparent'
          activeOutlineColor='transparent'
          style={styles.textinput}
          onChangeText={text => setText(text)}
        />
        <View style={styles.centerContainer}>
          <Image style={styles.userImage} source={{ uri: imageUri }} />
        </View>
      </ScrollView>
      <Provider>
        <Portal>
          <Modal visible={visible} contentContainerStyle={{ ...styles.containerStyle }}>
            <CircularProgress />
          </Modal>
        </Portal>
      </Provider>
    </SafeAreaView>
  );
};

export default AddEntryScreen;