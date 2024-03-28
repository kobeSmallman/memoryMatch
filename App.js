import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import GameScreen from './screens/GameScreen';
import CustomCardScreen from './screens/CustomCardScreen';
import { database } from '../memoryMatchKobe/utils/database';

const Stack = createNativeStackNavigator();

const App = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    database.init();
    seedDatabaseWithSoundsAndImages();

    if (!userName) {
      Alert.prompt(
        'Welcome',
        'Please enter your name:',
        [
          {
            text: 'OK',
            onPress: name => {
              setUserName(name);
              database.fetchUserByName(name, (fetchedUser) => {
                if (fetchedUser) {
                  setUser(fetchedUser);
                } else {
                  database.insertUser(name, (insertId) => {
                    setUser({ id: insertId, name: name });
                  });
                }
              });
            },
          },
        ],
        'plain-text'
      );
    }
  }, [userName]);

const seedDatabaseWithSoundsAndImages = async () => {
    const soundUris = [
      'assets/sounds/goodSound.mp3',
      'assets/sounds/badSound.mp3',
      'assets/sounds/gameScreenSound.mp3',
      'assets/sounds/defaultSound.mp3',
    ];

    const cardImageUris = [
      'assets/images/card1.webp', 
      'assets/images/card2.webp',
      'assets/images/card3.webp',
      'assets/images/card4.webp',
      'assets/images/card5.webp',
      'assets/images/card6.webp',
      'assets/images/card7.webp',
      'assets/images/card8.webp',
      'assets/images/card9.webp',
      'assets/images/card10.webp',
      'assets/images/card11.webp',
      'assets/images/card12.webp',
     // 'assets/images/splash.png',

    ];
    database.fetchSoundUris(uris => {
      if (uris.length === 0) {
        soundUris.forEach(uri => {
          database.insertSoundUri(uri, (insertId) => {
            console.log(`Inserted sound URI: ${uri}`);
          });
        });
      }
    });
    database.fetchCardImageUris(uris => {
      if (uris.length === 0) {
        cardImageUris.forEach(uri => {
          database.insertCardImageUri(uri, (insertId) => {
            console.log(`Inserted card image URI: ${uri}`);
          });
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} userName={userName} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="Difficulty" component={DifficultyScreen} />
          <Stack.Screen name="Game">
            {props => <GameScreen {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen name="CustomCard">
            {props => <CustomCardScreen {...props} user={user} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
