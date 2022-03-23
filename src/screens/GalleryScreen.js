import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import GalleryView from '../components/GalleryView';
import { FETCH_POSTS_QUERY } from '../utils/graphql/queries';
import { Color } from '../utils/Constants';
import SimpleSearchbar from '../components/SimpleSearchbar';
import SearchResultItem from '../components/SearchResultItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TotalPosts from '../components/TotalPosts';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Color.green500,
  },
});

function GalleryScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const { loading, data, refetch } = useQuery(FETCH_POSTS_QUERY, { notifyOnNetworkStatusChange: true });
  const [searchResult, setSearchResult] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log('rerender')
      refetch()
    }, [refetch])
  )

  useEffect(() => {
    if (data) {
      setPosts(data.getPosts);
    }
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading])

  var base64Link = '';

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: 'white' }}>
      <TotalPosts/>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {searchMode &&
          <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => setSearchMode(false)}>
            <Icon name='arrow-back' size={30} />
          </TouchableOpacity>}
        <SimpleSearchbar
          onSearch={(data) => {
            setSearchResult(data);
          }}
          onPressIn={() => setSearchMode(true)}
          searchStyle={searchMode ? { marginRight: 60, marginLeft: 0 } : {}}
        />
      </View>

      {isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Color.green900} />
        </View>}
      {!isLoading && (
        <>
          {searchMode && searchResult.length > 0 && (<View>{searchResult.map(post => <SearchResultItem key={post.id} post={post} />)}</View>)}
          {!searchMode && posts.length!=0 && <GalleryView
            onCardPressed={(data) =>
              navigation.navigate('PostDetail', { data })
            }
            posts={posts}
          />}
        </>
      )}


      {/* <FAB
        style={styles.fab}
        icon="plus"
        label='Contribute a Review'
        // onPress={() => navigation.navigate('Questionnaire', { base64Link: '', review: true })}
        onPress={launchLibrary}
      /> */}
    </SafeAreaView>
  );
};

export default GalleryScreen;