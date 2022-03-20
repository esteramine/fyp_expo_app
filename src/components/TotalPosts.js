import { useQuery } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Color } from '../utils/Constants';
import { FETCH_USER_PROGRESS } from '../utils/graphql/queries';

const styles = StyleSheet.create({
    line: {
        alignSelf: 'flex-end',
        marginTop: 5,
        marginRight: 12,
        fontSize: 16,
        color: Color.green900,
        fontWeight: 'bold'
    },
});

function TotalPosts() {
    const { loading, data, refetch } = useQuery(FETCH_USER_PROGRESS, { notifyOnNetworkStatusChange: true });
    const [postNum, setPostNum] = useState('...');

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [refetch])
    );

    useEffect(() => {
        if (data) {
            setPostNum(data.getUserProgress);
        }
    }, [loading]);

    return (
        <Text style={styles.line}>
            CONTRIBUTION: {postNum} POSTS
        </Text>
    );
};

export default TotalPosts;