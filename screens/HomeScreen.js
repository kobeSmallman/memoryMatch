import React from 'react';
import { View, Text,TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { database } from '../utils/database';
//provided users a desciption of game and voerall navigation for selecting what they will do 
const HomeScreen = ({ navigation, userName }) => {
  const handleDeleteCustomCards = () => {
    database.deleteAllCustomCards((success) => {
      if (success) {
        console.log('Custom cards deleted successfully');
        Alert.alert('Success', 'Custom cards deleted successfully');
      } else {
        console.log('Failed to delete custom cards');
        Alert.alert('Error', 'Failed to delete custom cards');
      }
    });
  };

  const showGameInfo = () => {
    Alert.alert(
      "Game Info",
      `Hey ${userName} let's get into it

- Tap Start Game to kick things off Different difficulty levels so pick your poison
- You'll hear some cool sounds when you match cards or biff it, keep your ears peeled
- Racking up points depends on how quick and smart you play, big brain time
- Fancy a twist? Create your own custom cards, get creative
- But hey, that Delete button is a beast, wipes all your custom cards clean, no take backs
- Leaderboard's where the champs hang, see how you stack up

Got all that? Great, let's roll!`
    );
  };
  const Button = ({ title, onPress, color }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {userName} to Memory Match Game</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('Difficulty')}
        color="#6f61b8"
      />
      <Button
        title="Create Custom Cards"
        onPress={() => navigation.navigate('CustomCard')}
        color="#557a95"
      />
      <Button
        title="View Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
        color="#6f61b8"
      />
      <Button
        title="Delete Custom Cards"
        onPress={handleDeleteCustomCards}
        color="#d9534f"
      />
      <Button
        title="How To Play"
        onPress={showGameInfo}
        color="#5cb85c"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2c3e50', // Dark cool color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#f39c12', // A contrasting border color
    borderRadius: 10,
    backgroundColor: '#34495e', // Slightly lighter than the container for pop
  },
  button: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default HomeScreen;