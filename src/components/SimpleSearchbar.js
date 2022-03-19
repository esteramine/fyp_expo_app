import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { SEARCH_TAG } from '../utils/graphql/queries';

const styles = StyleSheet.create({
    round: {
        borderRadius: 20,
        margin: 10,
    },
});

function SimpleSearchbar({ onSearch, onPressIn, searchStyle }) {

    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const [getSearchResult, { loading, data, refetch }] = useLazyQuery(SEARCH_TAG, { notifyOnNetworkStatusChange: true });

    useEffect(() => {
        if (data) {
            onSearch(data.searchTag);
        }
    }, [loading])

    return (
        <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{...styles.round, ...searchStyle}}
            onIconPress={() => refetch({ tag: searchQuery })}
            onSubmitEditing={() => {
                console.log(searchQuery);
                // getSearchResult({
                //     variables: {
                //         tag: searchQuery
                //     }
                // })
                refetch({ tag: searchQuery });
            }}
            onPressIn={onPressIn}
        />
    );
};

export default SimpleSearchbar;