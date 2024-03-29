import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
 
  const handleDifficultyPress = (difficulty) => {
   
    navigation.navigate('Game', { difficulty });
  };

  
  const DifficultyButton = ({ title, difficulty }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleDifficultyPress(difficulty)}
      activeOpacity={0.8} 
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Difficulty</Text>
      <DifficultyButton title="Easy - 8 cards" difficulty="Easy" />
      <DifficultyButton title="Medium - 10 cards" difficulty="Medium" />
      <DifficultyButton title="Hard - 12 cards" difficulty="Hard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28, 
    color: '#f39c12', 
    marginBottom: 30,
    fontWeight: 'bold',
    borderWidth: 2, 
    borderColor: '#f39c12',
    padding: 10,
    borderRadius: 10, 
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 25, 
    marginVertical: 10, 
    minWidth: 200, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff', 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default DifficultyScreen;
