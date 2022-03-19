import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native';

import { AppName, CalendarHeight, Color, HeaderHeight, KeyNotExistError, PresetHeight } from '../utils/Constants';
import UserStorage from '../utils/UserStorage';

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
  }
});


function EntryList(props) {
  const storage = new UserStorage();
  const [foodEntryList, setFoodEntryList] = useState([]);
  let i = 0;
  console.log("Food Entry List Length: " + foodEntryList.length);

  useEffect(() => {
    async function fetchFoodEntryList() {
      const response = await storage.retrieveData(props.date)
      //console.log("Retrieve Food Entry List Response: "+response);
      if (response != KeyNotExistError) {
        setFoodEntryList(JSON.parse(response));
      }
      else {
        setFoodEntryList([]);
      }
    }
    fetchFoodEntryList();
  }, [props]);

  return (
    <ScrollView
      style={{ height: Dimensions.get('window').height - (HeaderHeight + CalendarHeight + 30) }}>
      <List.Section>
        {
          foodEntryList.length > 0 ? (
            foodEntryList.map(e =>
              <List.Item
                key={i++}
                title={e.title}
                description={e.description}
                left={props => (
                  <View style={styles.entryImageContainer}>
                    <View style={[styles.rectangle, { backgroundColor: Color[e.meal] }]} />
                    <Image
                      style={styles.thumbnail}
                      source={{ uri: e.image }}
                    />
                  </View>
                )}
              />
            )
          ) : (
            <></>
          )
        }
      </List.Section>
    </ScrollView>
  );
};

export default EntryList;