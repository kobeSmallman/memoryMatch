import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import GameBoard from '../components/GameBoard';
import { database } from '../utils/database';
import { DIFFICULTY_LEVELS } from '../utils/constants';


// Import images directly
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
const getInitialLives = (difficultyLevel) => {
    return DIFFICULTY_LEVELS[difficultyLevel].lives;
};

const GameScreen = ({ route, navigation }) => {
    const { difficulty } = route.params;
    const [lives, setLives] = useState(getInitialLives(difficulty));
    const [cards, setCards] = useState([]);
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameSounds, setGameSounds] = useState({});
    const [timer, setTimer] = useState(DIFFICULTY_LEVELS[difficulty].memorizationTime + 1); // Add extra second for transition
    const [gameOverShown, setGameOverShown] = useState(false); 
    useEffect(() => {
        loadSounds();
        initializeGame();
    }, [difficulty]);

    useEffect(() => {
        let countdown;
        if (timer > 0 && !isGameActive) {
            countdown = setTimeout(() => setTimer(timer - 1), 1000);
        } else if (timer === 0 && !isGameActive) {
            flipCardsBack();
            setIsGameActive(true);
        }
        return () => clearTimeout(countdown);
    }, [timer, isGameActive]);
  
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
        await gameSounds[soundKey].playAsync();
      }
    };
    const initializeGame = () => {
        setLives(DIFFICULTY_LEVELS[difficulty].lives);
        setTimer(DIFFICULTY_LEVELS[difficulty].memorizationTime + 1);

        const shuffledKeys = Object.keys(cardImages).sort(() => 0.5 - Math.random()).slice(0, DIFFICULTY_LEVELS[difficulty].cardCount / 2);
        const initializedCards = shuffledKeys.flatMap((key, index) => [{
            id: index,
            imageUri: cardImages[key],
            isFlipped: true,
            isMatched: false
        }, {
            id: index,
            imageUri: cardImages[key],
            isFlipped: true,
            isMatched: false
        }]).sort(() => 0.5 - Math.random());

        setCards(initializedCards);
        setIsGameActive(false);
    };

    const flipCardsBack = () => {
        const cardsToFlip = cards.map(card => ({ ...card, isFlipped: false }));
        setCards(cardsToFlip);
    };

    const handleCardFlip = (cardIndex) => {
      if (!isGameActive || gameOverShown) return;
        if (!isGameActive || timer > 0) return;
        let newCards = [...cards];
        const cardToFlip = newCards[cardIndex];
    
        if (cardToFlip.isFlipped || cardToFlip.isMatched) {
          return; 
        }
    
        cardToFlip.isFlipped = true;
        newCards[cardIndex] = cardToFlip;
    
        const flippedCards = newCards.filter(card => card.isFlipped && !card.isMatched);
    
        if (flippedCards.length === 2) {
          if (flippedCards[0].imageUri === flippedCards[1].imageUri) {
           
            playSound('goodSound');
            flippedCards.forEach(card => card.isMatched = true);
          } else {
          
            playSound('badSound');
            setLives(lives - 1);
           
            setTimeout(() => {
              flippedCards.forEach(card => card.isFlipped = false);
            }, 1000);
        }
            newCards = newCards.map(card => {
                if (!card.isMatched && flippedCards.find(fCard => fCard.id === card.id)) {
                  return { ...card, isFlipped: false };
                }
                return card;
              });
            }
        
            setCards(newCards);
            checkGameOver(newCards);
          };
           
        const checkGameOver = (newCards) => {
          if (gameOverShown) return;
  
          const allMatched = newCards.every(card => card.isMatched);
          const noLivesLeft = lives <= 0;
  
          if (allMatched || noLivesLeft) {
              setIsGameActive(false);
              setGameOverShown(true);
              setTimeout(() => handleGameOver(allMatched), 1000);
          }
      };
  
      const handleGameOver = (isWin) => {
          Alert.alert(
              isWin ? "Congratulations!" : "Game Over",
              isWin ? "You've matched all cards!" : "Out of lives, try again?",
              [{ text: "Restart", onPress: () => initializeGame() }]
          );
      };
    
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Game On! Difficulty: {difficulty}</Text>
                {!isGameActive && <Text style={styles.timerText}>Time to memorize: {timer}</Text>}
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
          livesText: {
            fontSize: 18,
            color: 'red',
            marginTop: 10,
          },
        });
        
        export default GameScreen;