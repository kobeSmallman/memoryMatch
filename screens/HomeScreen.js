import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation, userName }) => {
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
