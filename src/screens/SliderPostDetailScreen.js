import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Styles from '../styles/Styles';
import { Color } from '../utils/Constants';
import Tag from '../components/Tag';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import { useLazyQuery, useMutation } from '@apollo/client';
import { COMMENT_POST, DELETE_POST, DELETE_POST_COMMENT, EDIT_POST, LIKE_POST } from '../utils/graphql/mutations';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';
import CircularProgress from '../components/CircularProgress';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        margin: 10,
        top: 0,
        left: 0,
        width: 80
    },
    input: {
        paddingHorizontal: 0,
        paddingVertical: 4
    },
    inputTitle: {
        fontSize: 24,
        color: Color.gray900,
        fontWeight: 'bold'
    },
    star: {
        fontSize: 18,
        alignSelf: 'flex-end'
    },
    delete: {
        position: 'absolute',
        margin: 10,
        top: 0,
        right: 0,
        width: 80
    },
    edit: {
        position: 'absolute',
        margin: 10,
        top: 0,
        right: 70,
        width: 80
    },
    containerStyle: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 20,
        margin: 20,
        borderRadius: 5,
    }
});

function PPostDetailScreen({ route, navigation }) {
    const post = route.params.data;

    const { user } = useContext(AuthContext);
    const [liked, setLiked] = useState(user && post.likes.find(like => like.username == user.username));
    const [likeCount, setLikeCount] = useState(post.likeCount);

    const [likePost] = useMutation(LIKE_POST, {
        update(proxy, result) {
            setLikeCount(result.data.likePost.likeCount);
            setLiked(!liked);
            // refetch();
        },
        onError(err) {
            console.log(err)
        },
        variables: {
            postId: post.id
        }
    });

    // comment section
    const [comments, setComments] = useState(post.comments);
    const [comment, setComment] = useState('');
    let deleteCommentId = "";
    const [createComment] = useMutation(COMMENT_POST, {
        update(proxy, result) {
            setComments(result.data.createComment.comments);
            setComment('');

            // refetch();
        },
        variables: {
            postId: post.id,
            body: comment
        }
    });
    const [deleteComment] = useMutation(DELETE_POST_COMMENT, {
        update(proxy, result) {
            setComments(result.data.deleteComment.comments);
            // setComments(comments.filter(c=> c.id !== deleteCommentId));
            // refetch();
        },
        onError(err) {
            console.log(err)
        },
    });

    // delete post 
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const [deletePost] = useMutation(DELETE_POST, {
        update(proxy, result) {
            navigation.goBack();
        },
        variables: {
            postId: post.id
        }
    });

    // completion
    const [completion, setCompletion] = useState(0);
    const [sliderCompleted, setSliderCompleted] = useState(false);
    const postInput = {
        foodName: post.foodName,
        ateTime: post.ateTime,
        rating: post.rating,
        restaurantName: post.restaurantName,
        location: post.location,
        price: post.price,
        review: post.review,
        tags: post.tags,
        image: post.image,
        public: post.public
    };
    const [editPost] = useMutation(EDIT_POST, {
        onError(err) {
            // TODO: show required field errors on UI
            console.log(err);
        },
        variables: {
            postId: post.id,
            postInput
        }
    });


    return (
        // <Text> { data } </Text>
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Button
                    color='black'
                    uppercase={false}
                    compact
                    style={styles.back}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    Back
                </Button>
                {user.username == post.username &&
                    (<>
                        <Button
                            color={Color.green1000}
                            uppercase={false}
                            compact
                            style={styles.edit}
                            onPress={() => navigation.navigate('EditPost', { post })}
                        >
                            Edit
                        </Button>
                        <Button
                            color={Color.errorText}
                            uppercase={false}
                            compact
                            style={styles.delete}
                            onPress={showModal}
                        >
                            Delete
                        </Button>
                    </>)
                }
            </View>
            <ScrollView style={{ marginTop: 50 }}>
                <View style={{ ...Styles.container, flex: 1, backgroundColor: 'white', marginBottom: 20 }}>
                    {new Date(post.ateTime).toDateString() == (new Date()).toDateString() && post.completion == '' && !sliderCompleted &&
                        <View style={{ paddingHorizontal: 20, alignItems: 'center', marginVertical: 5 }}>
                            <Text style={{ fontSize: 20, color: Color.gray900, fontWeight: 'bold' }}>How much did you finish your meal?</Text>
                            <Text style={{ fontSize: 25, color: Color.gray900, fontWeight: 'bold' }}>{completion}%</Text>
                            <Slider
                                style={{ width: '100%', height: 50 }}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor={Color.green900}
                                maximumTrackTintColor={Color.green900}
                                step={1}
                                onValueChange={(value) => {
                                    setCompletion(value);
                                }}
                                onSlidingComplete={(value) => {
                                    editPost({
                                        variables: {
                                            postInput: { ...postInput, completion: value.toString() }
                                        }
                                    });
                                    setSliderCompleted(true);
                                }}
                            />
                        </View>}
                    <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '500', color: Color.gray900, fontSize: 18, alignSelf: 'flex-start' }}>{post.username}</Text>
                        {post.public ? <MaterialIcon name='public' size={30} color={Color.gray900} /> : <MaterialIcon name='lock' size={30} color={Color.gray900} />}
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Image
                            style={{ alignItems: 'center', width: 300, height: 300, margin: 10, opacity: 1 }}
                            source={{ uri: "data:image/png;base64," + post.image }} />
                    </View>

                    {post.public && (<View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ paddingRight: 15 }} onPress={likePost}>
                            {liked ? (<AntDesignIcon name="heart" size={30} color={Color.green500} />
                            ) : (<AntDesignIcon name="hearto" size={30} color={Color.gray900} />)}
                        </TouchableOpacity>
                        {likeCount > 0 && <Text style={{ color: Color.gray900, fontSize: 15, marginBottom: 5 }}>{likeCount} likes</Text>}
                    </View>)}

                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.input, styles.inputTitle]}>
                                {post.foodName}</Text>
                            {post.rating !== '' && <Button icon="star" color={Color.primary} style={[styles.input, styles.star]} contentStyle={{ flexDirection: 'row-reverse' }}>
                                {post.rating}</Button>}
                        </View>
                        {post.ateTime !== '' && <Text style={styles.input}>
                            Ate Time: {new Date(post.ateTime).toDateString()}</Text>}
                        {post.restaurantName !== '' && <Text style={styles.input}>
                            Restaurant: {post.restaurantName}</Text>}
                        {post.location !== '' && <Text style={styles.input}>
                            Location: {post.location}</Text>}
                        {post.price !== '' && <Text style={styles.input}>
                            Price: {post.price}</Text>}
                        {post.review !== '' && <Text style={styles.input}>
                            Review: {post.review}</Text>}
                        {post.tags.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Text style={{ marginRight: 5 }}>Tags</Text>
                            {post.tags.map((tag, index) => <Tag key={index} text={tag} />)}
                        </View>}
                        <Text style={styles.input}>
                            {moment(post.createdAt).fromNow()}</Text>
                    </View>

                </View>
                {comments.length > 0 &&
                    <View style={{ paddingHorizontal: 20, borderTopColor: Color.gray300, borderTopWidth: 1 }}>
                        {comments.map(c => (
                            <View key={c.id} style={{ paddingVertical: 10, marginRight: 75 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginRight: 10, fontWeight: 'bold' }}>{c.username}</Text>
                                    <Text>{c.body}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <Text style={{ color: Color.gray300 }}>{moment(c.createdAt).fromNow()}</Text>
                                    {c.username == user.username &&
                                        (<TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => {
                                            deleteCommentId = c.id;
                                            deleteComment({
                                                variables: {
                                                    postId: post.id,
                                                    commentId: deleteCommentId
                                                }
                                            });
                                        }}>
                                            <FIcon name='trash-o' size={20} color={Color.deleteButton} />
                                        </TouchableOpacity>)
                                    }
                                </View>

                            </View>
                        ))}
                    </View>
                }

            </ScrollView>
            {post.public && (<View style={{ paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: Color.gray300, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    placeholder='Comment...'
                    multiline={true}
                    onChangeText={setComment}
                    value={comment}
                    style={{ flex: 1 }}
                />
                <TouchableOpacity onPress={createComment} disabled={comment.trim() === ''}>
                    <Text style={{ color: comment.trim() === '' ? 'white' : Color.green900 }}>Post</Text>
                </TouchableOpacity>
            </View>)}
            <Provider>
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ ...styles.containerStyle, backgroundColor: isLoading ? 'transparent' : 'white' }}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Text style={{ fontSize: 15, color: Color.gray900 }}>Are you sure you want to delete this post?</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button
                                        mode="text"
                                        onPress={hideModal}
                                        color={Color.gray500}
                                        style={{ width: 150, marginVertical: 10 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        mode="text"
                                        onPress={() => {
                                            deletePost();
                                            setIsLoading(true);
                                        }}
                                        color={Color.errorText}
                                        style={{ width: 150, marginVertical: 10 }}
                                    >
                                        Yes
                                    </Button>
                                </View>
                            </>
                        )}
                    </Modal>
                </Portal>
            </Provider>
        </SafeAreaView>
    );
};

export default PPostDetailScreen;
