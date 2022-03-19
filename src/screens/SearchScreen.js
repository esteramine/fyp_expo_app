import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import { useQuery } from "@apollo/client";
import SearchResultItem from '../components/SearchResultItem';
import SearchSettings from '../components/SearchSettings';
import Styles from '../styles/Styles';
import { Color } from '../utils/Constants';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';

function SearchScreen() {
    const mockedData = [1, 2, 3, 4, 5, 6, 7]
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    const { loading, data } = useQuery(FETCH_POSTS_QUERY, {
        fetchPolicy: "no-cache"
    });

    useEffect(() => {
        if (data) {
        }
    }, [loading])

    return (
        <View style={Styles.container, { flex: 1 }}>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <SearchSettings />
            <FlatList
                data={mockedData}
                renderItem={SearchResultItem}
            />
        </View>
    );
};

export default SearchScreen;