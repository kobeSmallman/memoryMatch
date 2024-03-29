import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import GameBoard from '../components/GameBoard';
import { database } from '../utils/database';
import { DIFFICULTY_LEVELS } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';

const cardImages = {
  'card1.webp': require('../assets/images/card1.webp'),
  'card2.webp': require('../assets/images/card2.webp'),
  'card3.webp': require('../assets/images/card3.webp'),
  'card4.webp': require('../assets/images/card4.webp'),
  'card5.webp': require('../assets/images/card5.webp'),
  'card6.webp': require('../assets/images/card6.webp'),
  'card7.webp': require('../assets/images/card7.webp'),
  'card8.webp': require('../assets/images/card8.webp'),
  'card9.webp': require('../assets/images/card9.webp'),
  'card10.webp': require('../assets/images/card10.webp'),
  'card11.webp': require('../assets/images/card11.webp'),
  'card12.webp': require('../assets/images/card12.webp'),
};

const GameScreen = ({ route, user }) => {
  const { difficulty } = route.params;
  const initialLives = DIFFICULTY_LEVELS[difficulty].lives;
  const initialGameTimer = DIFFICULTY_LEVELS[difficulty].gameTimer;

  const [lives, setLives] = useState(initialLives);
  const [cards, setCards] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [memorizeTimer, setMemorizeTimer] = useState(DIFFICULTY_LEVELS[difficulty].memorizationTime);
  const [gameTimer, setGameTimer] = useState(initialGameTimer);
  const [score, setScore] = useState(0);
  const [gameSounds, setGameSounds] = useState({});
  const [gameOverShown, setGameOverShown] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    loadSounds();
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let countdown;
    if (memorizeTimer > 0 && !isGameActive) {
      countdown = setTimeout(() => setMemorizeTimer(memorizeTimer - 1), 1000);
    } else if (memorizeTimer === 0 && !isGameActive) {
      flipCardsBack();
      setIsGameActive(true);
    }
    return () => clearTimeout(countdown);
  }, [memorizeTimer, isGameActive]);

  useEffect(() => {
    if (gameTimer > 0 && isGameActive) {
      const gameCountdown = setTimeout(() => setGameTimer(gameTimer - 1), 1000);
      return () => clearTimeout(gameCountdown);
    }
  }, [gameTimer, isGameActive]);

  const loadSounds = async () => {
    const soundsToLoad = {
      goodSound: require('../assets/sounds/goodSound.mp3'),
      badSound: require('../assets/sounds/badSound.mp3'),
      gameScreenSound: require('../assets/sounds/gameScreenSound.mp3'),
    };
    let loadedSounds = {};
    for (const key in soundsToLoad) {
      const { sound } = await Audio.Sound.createAsync(soundsToLoad[key]);
      loadedSounds[key] = sound;
      if (key === 'gameScreenSound') {
        sound.setIsLoopingAsync(true);
      }
    }
    setGameSounds(loadedSounds);
  };

  const playSound = async (soundKey) => {
    if (gameSounds[soundKey]) {
        await gameSounds[soundKey].unloadAsync(); 
        const soundToPlay = {
            goodSound: require('../assets/sounds/goodSound.mp3'),
            badSound: require('../assets/sounds/badSound.mp3'),
        }[soundKey];
        await gameSounds[soundKey].loadAsync(soundToPlay);  
        await gameSounds[soundKey].playAsync();  
    }
};


  const initializeGame = async () => {
    setLives(initialLives);
    setMemorizeTimer(DIFFICULTY_LEVELS[difficulty].memorizationTime);
    setGameTimer(initialGameTimer);
    setScore(0);
    setIsGameActive(false);
    setGameOverShown(false);

    database.fetchCustomCards((customCards) => {
        const customUris = customCards.map(card => card.uri).filter(uri => uri);
        const localUris = Object.values(cardImages);
        
        console.log('All custom cards:', customCards);
        console.log('Custom URIs:', customUris);
        console.log('Local URIs:', localUris);

        // Calculate how many cards needed from the local set
        let cardCount = DIFFICULTY_LEVELS[difficulty].cardCount / 2;
        let remainingCardsCount = cardCount - customUris.length;
        remainingCardsCount = remainingCardsCount > 0 ? remainingCardsCount : 0;

        // Combine custom URIs with a subset of local URIs
        let combinedUris = customUris.concat(localUris.slice(0, remainingCardsCount));

        // If we still don't have enough cards loop over local URIs until we fill the rest
        while (combinedUris.length < cardCount) {
            combinedUris = combinedUris.concat(localUris.slice(0, cardCount - combinedUris.length));
        }

        // Double the array for pair matching then shuffle
        const initializedCards = combinedUris.flatMap((uri, index) => [{
            id: index,
            imageUri: uri,
            isFlipped: true,
            isMatched: false
        }, {
            id: index + combinedUris.length,
            imageUri: uri,
            isFlipped: true,
            isMatched: false
        }]).sort(() => 0.5 - Math.random());

        setCards(initializedCards);
    });
};


  const flipCardsBack = () => {
    const cardsToFlip = cards.map(card => ({ ...card, isFlipped: false }));
    setCards(cardsToFlip);
  };

  const handleCardFlip = (cardIndex) => {
    if (!isGameActive || gameOverShown || gameTimer <= 0) return;

    let newCards = [...cards];
    const cardToFlip = newCards[cardIndex];

    if (cardToFlip.isFlipped || cardToFlip.isMatched) return; // Ignore flips on already flipped or matched cards

    cardToFlip.isFlipped = true;
    newCards[cardIndex] = cardToFlip;

    const flippedCards = newCards.filter(card => card.isFlipped && !card.isMatched);

    if (flippedCards.length === 2) {
        if (flippedCards[0].imageUri === flippedCards[1].imageUri) {
            playSound('goodSound');
            flippedCards.forEach(card => card.isMatched = true);
            setScore(prevScore => prevScore + DIFFICULTY_LEVELS[difficulty].multiplier * gameTimer);
        } else {
            playSound('badSound');
            setTimeout(() => {
                flippedCards.forEach(card => card.isFlipped = false);
                newCards = newCards.map(card => {
                    if (!card.isMatched && flippedCards.find(fCard => fCard.id === card.id)) {
                        return { ...card, isFlipped: false };
                    }
                    return card;
                });
                setCards(newCards);
                setLives(lives - 1);  
                checkGameOver(newCards, lives - 1);  
            }, 1000);
            return;  
        }
        setCards(newCards);
        checkGameOver(newCards, lives);
    }
};

const checkGameOver = (newCards, remainingLives) => {
    const allMatched = newCards.every(card => card.isMatched);

    // Game ends if all cards are matched no lives left or the timer runs out
    if (allMatched || remainingLives <= 0 || gameTimer <= 0) {
        setIsGameActive(false);
        setGameOverShown(true);
        setTimeout(() => handleGameOver(allMatched), 1000);
    }
};

  

  const handleGameOver = (isWin) => {
    Alert.alert(
      isWin ? "Congratulations!" : "Game Over",
      isWin ? "You've matched all cards!" : "Out of lives, try again?",
      [
        { text: "Restart", onPress: () => initializeGame() },
        { text: "View Leaderboard", onPress: () => navigation.navigate('Leaderboard') }
      ]
    );
    // Save the score to the database
    if (user && user.id) {
      database.insertScore({ user_id: user.id, score: score, difficulty: difficulty }, (insertId) => {
        console.log('Score saved with ID:', insertId);
      });
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game On! Difficulty: {difficulty}</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      {isGameActive && <Text style={styles.timerText}>Time left: {gameTimer}</Text>}
      {!isGameActive && <Text style={styles.timerText}>Memorize: {memorizeTimer}</Text>}
      <GameBoard cards={cards} onCardFlip={handleCardFlip} />
      {isGameActive && <Text style={styles.livesText}>Lives left: {lives}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    color: 'blue',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 22,
    color: 'blue',
    marginBottom: 10,
  },
  livesText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});

export default GameScreen;
