import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
const DifficultyScreen = ({ navigation }) => {
  const handleDifficultyPress = (difficulty) => {
   
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Difficulty</Text>
      <Button
        title="Easy - 8 cards"
        onPress={() => handleDifficultyPress('Easy')}
      />
      <Button
        title="Medium - 10 cards"
        onPress={() => handleDifficultyPress('Medium')}
      />
      <Button
        title="Hard - 12 cards"
        onPress={() => handleDifficultyPress('Hard')}
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

export default DifficultyScreen;
