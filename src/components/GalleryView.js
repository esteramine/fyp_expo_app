import React from 'react';
import { Image, Dimensions, StyleSheet } from 'react-native';
import { Card, Provider } from 'react-native-paper';
import MasonryList from '@react-native-seoul/masonry-list';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ImageHeader, ThumbnailImageHeader } from '../utils/Constants';
import ExpoFastImage from 'expo-fast-image';

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
    },
    testContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    testItem: {
        width: '45%',
        margin: 5
    }
});

function GalleryView({ onCardPressed, posts }) {
    const heights = [168, 227, 235, 157, 228, 233, 180, 152, 224, 158, 231, 156, 204, 171, 190, 151, 249, 201, 169, 238, 227];
    // for (var i = 0; i < 20; i++) {
    //     heights[i] = getRandomInt(150, 250);
    // }

    const renderItem = ({ item, i }) => {
        return (
            <TouchableOpacity onPress={() => onCardPressed(item)} key={item.id}>
                {/* <Image
                    source={{ uri: ThumbnailImageHeader + item.image }}
                    style={{ height: heights[i%21], margin: 5, borderRadius: 5 }}
                /> */}
                <ExpoFastImage
                    uri= {ThumbnailImageHeader + item.image} 
                    cacheKey={item.id}
                    style={{ height: heights[i%21], margin: 5, borderRadius: 5 }} 
                />
            </TouchableOpacity>
        )
    }

    return (
        <Provider>
            {/* <ScrollView contentContainerStyle={styles.content}>
                {posts.map((post, i) => (
                    <Card
                        onPress={() => {
                            onCardPressed(post);
                        }}
                        style={{...styles.testItem, height: heights[i%21], borderRadius: 5}}
                        key={post.id}
                    >
                        <Card.Cover
                            source={{ uri: ImageHeader+ post.image }}
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
//                         <Image source={{ uri: ImageHeader + post.image }} style={{ height: 100 }}/>            
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