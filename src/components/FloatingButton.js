import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { DefaultTheme, FAB, Portal, Provider } from "react-native-paper";
import { Color, Progressbar, KeyNotExistError } from '../utils/Constants';
import UserStorage from '../utils/UserStorage';

const styles = StyleSheet.create({
  fab_upper: {
    position: 'absolute',
    margin: 16,
    right: 60,
    bottom: 48,
    elevation: 0 // to drop the shadow
  },
  fab_lower: {
    position: 'absolute',
    margin: 16,
    right: 60,
    bottom: 0,
    elevation: 0 // to drop the shadow
  },
  bottle: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    height: 100
  },
  wine: {
    marginRight: 16,
    marginTop: -100,
    height: 100,
  },
  progress: {
    overflow: 'hidden',
    position: 'absolute',
    height: 0,
    right: 0,
    bottom: 16,
  },
})

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Color.primary,
    accent: Color.accent,
  },
};

function FloatingButton({ onAddEntry }) {
  const storage = new UserStorage();
  var [progressValue, setProgressValue] = useState(Progressbar.startValue);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchProgress() {
      const response = await storage.retrieveData(Progressbar.key);
      if (response === KeyNotExistError) {
        storage.storeData(Progressbar.key, JSON.stringify(Progressbar.startValue));
      }
      else {
        console.log(JSON.parse(response))
        setProgressValue(JSON.parse(response));
      }
    }
    fetchProgress();
    if (progressValue > Progressbar.endValue) {
      setCompleted(true)
    }
  });

  return (
    <Provider>
      <Portal>
        <FAB
          style={styles.fab_upper}
          small
          icon="plus"
          theme={theme}
          onPress={() => {
            console.log('Pressed add')
            onAddEntry();
          }}
        />
        <FAB
          style={styles.fab_lower}
          small
          icon="wallet-giftcard"
          theme={theme}
          disabled={!completed}
          onPress={async () => {
            console.log('Pressed redeem')
            setProgressValue(Progressbar.startValue)
            setCompleted(false)
            await storage.clearProgress();
          }}
        />
        <Image
          style={styles.bottle}
          source={require('../sources/bottle.png')}
        />
        <View style={[styles.progress, { height: progressValue }]}>
          <Image
            style={[styles.wine, { marginTop: progressValue - 100 }]}
            source={require('../sources/wine.png')}
          />
        </View>
      </Portal>
    </Provider>

  );

  /*
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  return (
    <Provider>
      <Portal theme={theme}>
        <FAB.Group
          open={open}
          icon='glass-wine'
          actions={[
            {
              icon: 'playlist-plus',
              label: 'Add new entry',
              onPress: () => console.log('Pressed add'),
            },
            {
              icon: 'wallet-giftcard',
              label: 'Redeem coupon',
              onPress: () => console.log('Pressed redeem'),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
  */
};

export default FloatingButton;
