import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '../components/card'; 

const GameBoard = ({ cards, onCardFlip }) => {
    const renderCard = (card, index) => (
        <Card 
            key={index} 
            cardIndex={index} 
            imageUri={card.imageUri} 
            flipped={card.isFlipped} 
            onFlip={onCardFlip} 
        />
    );

    return <View style={styles.board}>{cards.map(renderCard)}</View>;
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 100,
    height: 150,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
  },
});

export default GameBoard;
