import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { database } from '../utils/database';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {userName} to Memory Match Game</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('Difficulty')}
      />
      <Button
        title="Create Custom Cards"
        onPress={() => navigation.navigate('CustomCard')}
      />
      <Button
        title="View Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
      />
      <Button
        title="Delete Custom Cards"
        onPress={handleDeleteCustomCards}
        color="red"
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
