import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import GameScreen from './screens/GameScreen';
import CustomCardScreen from './screens/CustomCardScreen';
import LeaderboardScreen from './screens/LeaderboardsScreen';
import { Audio } from 'expo-av';
import { database } from '../memoryMatchKobe/utils/database'; 

const Stack = createNativeStackNavigator();

const App = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const backgroundSound = useRef(new Audio.Sound());

  useEffect(() => {
    const loadBackgroundSound = async () => {
      try {
        await backgroundSound.current.loadAsync(require('../memoryMatchKobe/assets/sounds/defaultSound.mp3'));
        await backgroundSound.current.setIsLoopingAsync(true);
        await backgroundSound.current.playAsync();
      } catch (error) {
        console.error("Couldn't load background sound", error);
      }
    };

    loadBackgroundSound();

    return () => backgroundSound.current.unloadAsync();
  }, []);

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
                  Alert.alert(
                    "Is this you?",
                    `Welcome back, ${fetchedUser.name}`,
                    [
                      { text: "Yes", onPress: () => setUser(fetchedUser) },
                      {
                        text: "No",
                        onPress: () => {
                          setUserName(''); 
                        
                        }
                      }
                    ]
                  );
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
      <NavigationContainer
        onStateChange={async (state) => {
          const routeName = state.routes[state.index].name;
          if (routeName === 'Game') {
            await backgroundSound.current.stopAsync();
            await backgroundSound.current.unloadAsync();
            await backgroundSound.current.loadAsync(require('../memoryMatchKobe/assets/sounds/gameScreenSound.mp3'));
            await backgroundSound.current.setIsLoopingAsync(true);
            await backgroundSound.current.playAsync();
          } else {
            await backgroundSound.current.stopAsync();
            await backgroundSound.current.unloadAsync();
            await backgroundSound.current.loadAsync(require('../memoryMatchKobe/assets/sounds/defaultSound.mp3'));
            await backgroundSound.current.setIsLoopingAsync(true);
            await backgroundSound.current.playAsync();
          }
        }}
      >
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
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
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
