import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { database } from '../utils/database';
//leaderboard screen showing the data we fetched from database 
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Leaderboard</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Score</Text>
        <Text style={styles.headerText}>Difficulty</Text>
      </View>
      {scores.map((score, index) => (
        <View key={index} style={styles.scoreEntry}>
          <Text style={styles.nameText}>{score.name}</Text>
          <Text style={styles.scoreText}>{score.score}</Text>
          <Text style={styles.scoreText}>{score.difficulty}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2c3e50',
    
  },
  titleContainer: {
    paddingVertical: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#2980b9',
    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#34495e',
    
  },
  headerText: {
    fontSize: 26,
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  scoreEntry: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7f8c8d',
    paddingHorizontal:10,
  },
  nameText: {
    fontSize: 18,
    color: '#ecf0f1',
    flex: 1,
    textAlign: 'left',
    paddingHorizontal:10,
  },
  scoreText: {
    fontSize: 18,
    color: '#ecf0f1',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal:10,
  },
});

export default LeaderboardScreen;
