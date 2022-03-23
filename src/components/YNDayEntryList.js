import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CalendarHeight, Color, HeaderHeight } from '../utils/Constants';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 5
    },
    rectangle: {
        width: 5,
        height: 50,
        marginRight: 10,
    },
    entryImageContainer: {
        flexDirection: "row",
    },
    listItemContainer: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 3,
        borderRadius: 10,
        borderBottomColor: Color.gray500,
        borderRightColor: Color.gray500,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderWidth: 1
    },
    noEntryListItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


function YNDayEntryList({ posts, showModal, deletePost, loading }) {
    const navigation = useNavigation();

    return (
        <ScrollView
            style={{
                backgroundColor: Color.green300,
                height: Dimensions.get('window').height - (HeaderHeight + CalendarHeight + 30)
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-end', paddingTop: 10 }}>
                <Text style={{ marginRight: 15, color: Color.green900, fontWeight: 'bold' }}>Completion Status</Text>
            </View>
            <List.Section
                style={{ marginBottom: 25 }}
            >
                {
                    loading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={"small"} color={Color.green900} />
                    </View>
                }
                {
                    !loading && (posts.length > 0 ? (
                        posts.map(e =>
                            <List.Item
                                key={e.id}
                                title={e.foodName}
                                description={e.ateTime.substring(11, 16)}
                                onPress={() => navigation.navigate('PostDetail', { data: e })}
                                onLongPress={() => {
                                    showModal();
                                    deletePost(e.id);
                                }}
                                left={props => (
                                    <View style={styles.entryImageContainer}>
                                        <View style={[styles.rectangle, { backgroundColor: Color.breakfast }]} />
                                        <Image
                                            style={styles.thumbnail}
                                            source={{ uri: "data:image/png;base64," + e.image }}
                                        />
                                    </View>
                                )}
                                right={props => e.completion == '' ? (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10, backgroundColor: Color.gray300, color: 'white', fontWeight: 'bold', padding: 3, borderRadius: 5 }} >Unspecified</Text>
                                    </View>
                                ) : (
                                    e.completed && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon {...props} name='smileo' size={30} color={Color.gray900} style={{ marginRight: 15 }} />
                                    </View>
                                )}
                                style={styles.listItemContainer}
                            />
                        )
                    ) : (
                        <List.Item
                            key={0}
                            left={props => (
                                <View style={styles.noEntryListItem}>
                                    <Text>Press  </Text>
                                    <Ionicons name={'add-outline'} size={25} color={Color.gray900} />
                                    <Text>  to record your meal today.</Text>
                                </View>
                            )}
                            style={styles.listItemContainer}
                        />
                    ))
                }
            </List.Section>
        </ScrollView>
    );
};

export default YNDayEntryList;