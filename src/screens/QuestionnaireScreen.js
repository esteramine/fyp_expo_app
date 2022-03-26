import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Modal, Portal, Provider } from 'react-native-paper';

import Styles from '../styles/Styles';
import { Color, ImageHeader } from '../utils/Constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/AntDesign';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../utils/graphql/mutations';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';
import CircularProgress from '../components/CircularProgress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { generateRNFile } from '../utils/Functions';

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
    input: {
        paddingHorizontal: 0,
        paddingVertical: 2
    },
    inputBorder: {
        borderWidth: 1, 
        borderColor: Color.gray500, 
        paddingHorizontal: 6,
        paddingVertical: 4, 
        marginVertical: 10
    },
    inputTitle: {
        fontSize: 24,
        color: Color.gray900,
        fontWeight: 'bold'
    },
    containerStyle: {
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
    },
    container: {
        flex: 1,
    }
});

function QuestionnaireScreen({ route, navigation }) {
    // const image = route.params.base64Link;
    const image = route.params.uri;
    const reviewPost = route.params.review;

    const [foodName, setFoodName] = useState('');
    // TODO: set to iso string when send to backend
    const [ateTime, setAteTime] = useState(new Date());
    const [completion, setCompletion] = useState('');
    // TODO: if rating bigger than 5, then it means the user does not change the rating
    // so don't save to backend
    const [rating, setRating] = useState('10');
    const [restaurantName, setRestaurantName] = useState('');
    const [location, setLocation] = useState('');
    // TODO: add 'HKD' when send data to backend
    const [price, setPrice] = useState('');
    const [review, setReview] = useState('');
    // TODO: parse the string to different tags
    const [tags, setTags] = useState('');
    const [publicMode, setPublicMode] = useState(false);

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [errors, setErrors] = useState({});

    // modal
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [isLoading, setIsLoading] = useState(false);
    const [addPost, { loading }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            if (publicMode) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                const newData = [result.data.createPost, ...data.getPosts];
                // getPosts.push(result.data.createPost);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: newData } });
                // console.log(newData);
            }
            navigation.dispatch(StackActions.popToTop());
            navigation.navigate('PostDetail', { data: result.data.createPost });
        },
        onError(err) {
            // TODO: show required field errors on UI
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors);
            setVisible(false);
        },
        variables: {
            foodName,
            ateTime: ateTime.toISOString(),
            completion,
            rating: rating > 5 ? '' : rating,
            restaurantName,
            location,
            price: price.trim() === '' ? '' : (price + ' HKD'),
            review,
            tags: tags.trim() === '' ? [] : tags.trim().split(/\s+/),
            image,
            public: publicMode
        }
    });

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: 'white' }}>
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
                    onPress={showModal}
                >
                    Save
                </Button>
            </View>
            <ScrollView style={{ marginTop: 50 }}>
                {Object.keys(errors).length > 0 && (
                    <View style={styles.errorBox}>
                        {Object.values(errors).map(error => (
                            <Text key={error}>{error}</Text>
                        ))}
                    </View>
                )}
                <View style={{ ...Styles.container, flex: 1, backgroundColor: 'white', marginBottom: 50 }}>
                    <View style={{ alignItems: 'center' }}>
                        {!reviewPost && <Text style={{ fontWeight: '500', color: Color.gray900, fontSize: 18 }}>How much did you finish?</Text>}
                        <Image
                            style={{ width: 300, height: 300, margin: 10, opacity: reviewPost ? 1 : 0.5 }}
                            source={{ uri: image }} />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={[styles.input, styles.inputTitle]}
                            placeholder='What did you get?'
                            onChangeText={setFoodName}
                            value={foodName}
                        />
                        <>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setDatePickerOpen(true)}>
                                <Text style={{ marginRight: 10, color: Color.gray500 }}>{ateTime.toDateString()}</Text>
                                <Icon name='edit' size={25} color={Color.gray500} />
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={datePickerOpen}
                                locale="zh_HK"
                                date={ateTime}
                                mode={'date'}
                                maximumDate={new Date()}
                                onConfirm={(date) => {
                                    setDatePickerOpen(false)
                                    setAteTime(date)
                                }}
                                onCancel={() => {
                                    setDatePickerOpen(false)
                                }}
                            />
                        </>
                        <View style={{ backgroundColor: Color.gray900, height: 1, width: '100%', marginVertical: 10 }}></View>
                        <Text style={{ color: Color.gray900, fontWeight: '600', marginTop: 5, fontSize: 18 }}>Optional Fields</Text>
                        <AirbnbRating
                            onFinishRating={(rating) => setRating(rating.toString())}
                            reviewSize={15}
                            size={20}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Restaurant Name'
                            onChangeText={setRestaurantName}
                            value={restaurantName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Location'
                            onChangeText={setLocation}
                            value={location}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                style={styles.input}
                                placeholder='Price'
                                keyboardType='numeric'
                                onChangeText={setPrice}
                                value={price}
                            />
                            <Text style={{ marginLeft: 5 }}> HKD</Text>
                        </View>
                        <TextInput
                            style={styles.inputBorder}
                            placeholder='Review'
                            // multiline={true}
                            onChangeText={setReview}
                            value={review}
                        />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Text style={{ marginRight: 5 }}>Tags</Text>
                        </View>
                        <TextInput
                            style={styles.inputBorder}
                            placeholder='Please separate the tags with spaces.'
                            // multiline={true}
                            onChangeText={setTags}
                            value={tags}
                        />
                    </View>

                </View>

            </ScrollView>
            <Provider>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ ...styles.containerStyle, backgroundColor: isLoading ? 'transparent' : 'white' }}>
                        {isLoading == true ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Text style={{ fontSize: 15, color: Color.gray900 }}>You want this post to be published</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        mode="text"
                                        onPress={() => {
                                            setPublicMode(false);
                                            addPost({
                                                variables: {
                                                    foodName,
                                                    ateTime: ateTime.toISOString(),
                                                    completion,
                                                    rating: rating > 5 ? '' : rating,
                                                    restaurantName,
                                                    location,
                                                    price: price.trim() === '' ? '' : (price + ' HKD'),
                                                    review,
                                                    tags: tags.trim() === '' ? [] : tags.trim().split(/\s+/),
                                                    image: generateRNFile(image, `${Date.now()}`),
                                                    public: false
                                                }
                                            });
                                            setIsLoading(true);
                                        }}
                                        color={Color.gray500}
                                        style={{ width: 150, marginVertical: 10 }}
                                    >
                                        Privately
                                    </Button>
                                    <Button
                                        mode="text"
                                        onPress={() => {
                                            setPublicMode(true);
                                            addPost({
                                                variables: {
                                                    foodName,
                                                    ateTime: ateTime.toISOString(),
                                                    completion,
                                                    rating: rating > 5 ? '' : rating,
                                                    restaurantName,
                                                    location,
                                                    price: price.trim() === '' ? '' : (price + ' HKD'),
                                                    review,
                                                    tags: tags.trim() === '' ? [] : tags.trim().split(/\s+/),
                                                    image: generateRNFile(image, `${Date.now()}`),
                                                    public: true
                                                }
                                            });
                                            setIsLoading(true);
                                        }}
                                        color={Color.errorText}
                                        style={{ width: 150, marginVertical: 10 }}
                                    >
                                        Publicly
                                    </Button>
                                </View>
                            </>)
                        }

                    </Modal>
                </Portal>
            </Provider>
        </SafeAreaView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};

export default QuestionnaireScreen;