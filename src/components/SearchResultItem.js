import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import {
    Avatar,
    Text,
    ListItem,
    LinearProgress,
} from 'react-native-elements';
import { Color } from '../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

function SearchResultItem({ post }) {
    const navigation = useNavigation();

    return (
        <ListItem bottomDivider style={{ width: '100%' }} onPress={()=> navigation.navigate('PostDetail', { data: post })}>

            <Avatar
                style={{ width: 100, height: 100 }}
                source={{
                    uri: "data:image/png;base64,"+ post.image,
                }}
            />

            <ListItem.Content>
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <ListItem.Title style={{ color: Color.gray900, fontSize: 15, fontWeight: 'bold' }}>
                                {post.foodName}
                            </ListItem.Title>
                            <ListItem.Subtitle style={{ color: Color.gray500, fontWeight: '800' }}>{post.restaurantName}</ListItem.Subtitle>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ListItem.Title right style={{ color: Color.gray500, marginRight: 8 }}>
                                {post.rating}
                            </ListItem.Title>
                            <Icon name='star' size={30} color={Color.ratingStar} />
                        </View>

                    </View>

                    <View style={{ flex: 1 }}>
                        <LinearProgress
                            style={{ marginVertical: 10, width: '65%' }}
                            value={0.75}
                            variant="determinate"
                            color={Color.green500}
                        />
                    </View>
                    <ListItem.Subtitle style={{ color: Color.gray500 }}>Price: {post.price}</ListItem.Subtitle>

                </View>
            </ListItem.Content>
        </ListItem>
    );
};

export default SearchResultItem;