import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import GameScreen from './screens/GameScreen';
import CustomCardScreen from './screens/CustomCardScreen';
import LeaderboardScreen from './screens/LeaderboardsScreen';
import { Audio } from 'expo-av';
import { database } from '../memoryMatchKobe/utils/database'; 
//made a basic theme for the app and pages I choose.
const Stack = createNativeStackNavigator();
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#2c3e50'
  },
};
const App = () => {
  
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const backgroundSound = useRef(new Audio.Sound());
//background sounds for the game 
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
    seedDatabaseImages();
//user exist?
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
//default  images and sounds
  const seedDatabaseImages = async () => {

  

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
  //returns the game sound, and the sound for all the other pages
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer theme={AppTheme}
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
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#34495e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
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
    backgroundColor: '#2c3e50',
  },
});

export default App;