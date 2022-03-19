import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import GalleryView from '../components/GalleryView';
import SearchResultItem from '../components/SearchResultItem';
import Styles from '../styles/Styles';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';

function HomeScreen() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  // useEffect(() => {
  //   console.log(data)
  //   console.log(loading)
  //   if (data) {
  //     console.log(data)
  //   }
  // }, [loading])
  return (
    <View style={Styles.container, { flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text>Home Screen</Text>
      <SearchResultItem /> */}
      {loading ? (<Text>Loading</Text>) : <GalleryView posts={data.getPosts}/>}

    </View>
  );
};

export default HomeScreen;