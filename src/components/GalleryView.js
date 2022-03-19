import React, { Component, createRef, useEffect, useRef } from 'react';
import { Text, Image, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Portal, Provider } from 'react-native-paper';
import MasonryList from '@react-native-seoul/masonry-list';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card_default: { // 1/2 width
        height: Dimensions.get('window').width / 2 - 10, // -margin*2
        width: Dimensions.get('window').width / 2 - 10,
        margin: 5,
    },
    card_small: { // 1/3 width
        height: Dimensions.get('window').width / 3 - 10, // -margin*2
        width: Dimensions.get('window').width / 3 - 10,
        margin: 5,
    },
    card_large: { // 2/3 width
        height: Dimensions.get('window').width / 3 * 2 - 10, // -margin*2
        width: Dimensions.get('window').width / 3 * 2 - 10,
        margin: 5,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 20,
        height: '60%',
        paddingHorizontal: 20,
    },
    post: {
        flex: 1,
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        alignSelf: 'center',
    },
    text: {
        flex: 1,
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function GalleryView({ onCardPressed, posts }) {
    const renderItem = ({ item, i }) => {
        return (
            <TouchableOpacity onPress={() => onCardPressed(item)} key={item.id}>
                <Image
                    source={{ uri: "data:image/png;base64," + item.image }}
                    style={{ height: getRandomInt(150, 250), margin: 5, borderRadius: 5 }}
                />
            </TouchableOpacity>
        )
    }

    const renderCard = (post, index) => {
        if (index % 9 == 0) {
            return (
                <Card
                    onPress={() => {
                        onCardPressed(post);
                    }}
                    style={styles.card_large}
                    key={post.id}
                >
                    <Card.Cover
                        source={{ uri: "data:image/png;base64,"+ post.image }}
                        style={styles.post}
                    />
                </Card>
            )
        }
        else {
            return (
                <Card
                    onPress={() => {
                        onCardPressed(post);
                    }}
                    style={styles.card_small}
                    key={post.id}
                >
                    <Card.Cover
                        source={{ uri: "data:image/png;base64,"+ post.image }}
                        style={styles.post}
                    />
                </Card>
            )
        }
    }

    return (
        <Provider>
            {/* <ScrollView contentContainerStyle={styles.content}>
                {posts.map(post => (
                    <Card
                        onPress={() => {
                            onCardPressed(post);
                        }}
                        style={styles.item}
                        key={post.id}
                    >
                        <Card.Cover
                            source={{ uri: "data:image/png;base64,"+ post.image }}
                            style={styles.post}
                        />
                    </Card>
                ))}
            </ScrollView> */}
            <MasonryList
                style={{ alignSelf: 'stretch' }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    alignSelf: 'stretch',
                }}
                numColumns={2}
                data={posts}
                renderItem={renderItem}
            />
        </Provider>
    );
};

// class GalleryView extends Component {
//     componentDidMount() {
//         // this.refs.masonry.addItems(this.props.posts);
//         this.refs.masonry.addItems([
//             { key: 1, text: "186 actionable tsks: 2 executed, 184 up-to-date info Connecting to the development server... info Starting the app on emulator-555..." },
//             { key: 2, text: "text1asdfadsvxdfgadfgsdfgsdfgasdfdfasdfzxcvsdfgasdf" }
//         ]);
//     }
//     render() {
//         return (<Provider>
//             <View style={{ flex: 1 }}>
//                 {/* <Masonry
//                     ref="masonry"
//                     columns={3}
//                     renderItem={(post) => (
//                         <Image source={{ uri: "data:image/png;base64," + post.image }} style={{ height: 100 }}/>            
//                     )}
//                 /> */}
//                 <Masonry
//                     ref="masonry"
//                     columns={3} // optional - Default: 2
//                     renderItem={(item) =>
//                         <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{height: 100}}/>}
//                 />
//             </View>

//         </Provider>)
//     }

// }

export default GalleryView;