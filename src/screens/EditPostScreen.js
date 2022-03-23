import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Styles from '../styles/Styles';
import { Color } from '../utils/Constants';
import { useMutation } from '@apollo/client';
import { CREATE_POST, EDIT_POST } from '../utils/graphql/mutations';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';
import CircularProgress from '../components/CircularProgress';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    inputTitle: {
        fontSize: 24,
        color: Color.gray900,
        fontWeight: 'bold'
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
});

function EditPostScreen({ route, navigation }) {
    const post = route.params.post;
    const [foodName, setFoodName] = useState(post.foodName);
    // TODO: set to iso string when send to backend
    const [ateTime, setAteTime] = useState(post.ateTime == '' ? new Date() : new Date(post.ateTime));
    const [completion, setCompletion] = useState(post.completion);
    // TODO: if rating bigger than 5, then it means the user does not change the rating
    // so don't save to backend
    const [rating, setRating] = useState(post.rating);
    const [restaurantName, setRestaurantName] = useState(post.restaurantName);
    const [location, setLocation] = useState(post.location);
    // TODO: add 'HKD' when send data to backend
    const [price, setPrice] = useState(post.price.split(' ')[0]);
    const [review, setReview] = useState(post.review);
    // TODO: parse the string to different tags
    const [tags, setTags] = useState(post.tags.join(" "));
    const [publicMode, setPublicMode] = useState(post.public);

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const [editPost] = useMutation(EDIT_POST, {
        update(proxy, result) {
            navigation.navigate({ name: 'PostDetail', params: { data: result.data.editPost }, merge: true });
        },
        onError(err) {
            // TODO: show required field errors on UI
            setErrors(err.graphQLErrors[0].extensions.errors);
            setVisible(false);
        },
        variables: {
            postId: post.id,
            foodName,
            ateTime: ateTime.toISOString(),
            completion,
            rating: rating > 5 ? '' : rating,
            restaurantName,
            location,
            price: price.trim() === '' ? '' : (price + ' HKD'),
            review,
            tags: tags.trim() === '' ? [] : tags.trim().split(/\s+/),
            image: post.image,
            public: publicMode
        }
    });

    const [visible, setVisible] = useState(false);

    return (
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
                    onPress={() => {
                        editPost({
                            variables: {
                                postId: post.id,
                                postInput: {
                                    foodName,
                                    ateTime: ateTime.toISOString(),
                                    completion,
                                    rating: rating > 5 ? '' : rating,
                                    restaurantName,
                                    location,
                                    price: price.trim() === '' ? '' : (price + ' HKD'),
                                    review,
                                    tags: tags.trim() === '' ? [] : tags.trim().split(/\s+/),
                                    image: post.image,
                                    public: publicMode
                                }
                            }
                        })
                        setVisible(true);
                    }}
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
                        {/* {!reviewPost && <Text style={{ fontWeight: '500', color: Color.gray900, fontSize: 18 }}>How much did you finish?</Text>} */}
                        <Image
                            style={{ width: 300, height: 300, margin: 10, opacity: 1 }}
                            source={{ uri: "data:image/png;base64," + post.image }} />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            style={[styles.input, styles.inputTitle]}
                            placeholder='Food Name'
                            onChangeText={setFoodName}
                            value={foodName}
                        />

                        <Text style={{ marginRight: 10, color: Color.gray500 }}>{ateTime.toDateString()}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                            <Text>Audience:  </Text>
                            <TouchableOpacity
                                style={{ padding: 10, backgroundColor: publicMode? Color.green300:'transparent', borderRadius: 10 }}
                                onPress={() => {
                                    setPublicMode(true);
                                }}
                            >
                                <MaterialIcon name='public' size={30} color={Color.gray900} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 10, backgroundColor: !publicMode? Color.green300:'transparent', borderRadius: 10 }}
                                onPress={() => {
                                    setPublicMode(false);
                                }}
                            >
                                <MaterialIcon name='lock' size={30} color={Color.gray900} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ backgroundColor: Color.gray900, height: 1, width: '100%', marginVertical: 10 }}></View>
                        <Text style={{ color: Color.gray900, fontWeight: '600', marginTop: 5, fontSize: 18 }}>Optional Fields</Text>
                        <AirbnbRating
                            onFinishRating={(rating) => setRating(rating.toString())}
                            reviewSize={15}
                            size={20}
                            defaultRating={parseInt(rating)}
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
                            style={{ borderWidth: 1, borderColor: Color.gray500, paddingBottom: 40, paddingHorizontal: 10, marginVertical: 10 }}
                            placeholder='Review'
                            multiline={true}
                            onChangeText={setReview}
                            value={review}
                        />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Text style={{ marginRight: 5 }}>Tags</Text>
                        </View>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: Color.gray500, paddingBottom: 40, paddingHorizontal: 10, marginVertical: 10 }}
                            placeholder='Please separate the tags with spaces.'
                            multiline={true}
                            onChangeText={setTags}
                            value={tags}
                        />
                    </View>

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

export default EditPostScreen;