import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { database } from '../utils/database';

const LeaderboardScreen = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    database.fetchScores((fetchedScores) => {
      console.log("Leaderboard Scores:", fetchedScores); 
      setScores(fetchedScores);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {scores.map((score, index) => (
  <View key={index} style={styles.scoreEntry}>
    <Text style={styles.scoreText}>{score.name}</Text>
    <Text style={styles.scoreText}>{score.score}</Text>
    <Text style={styles.scoreText}>{score.difficulty}</Text>
  </View>

))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nameText: {
    fontSize: 18,
    marginRight: 10, 
  },
  scoreText: {
    fontSize: 18,
  },
});

export default LeaderboardScreen;
