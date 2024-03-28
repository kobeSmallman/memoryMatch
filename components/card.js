import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
const Card = ({ imageUri, onFlip, cardIndex, flipped }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: flipped ? 0 : 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [flipped]);

    const frontAnimatedStyle = {
        transform: [{ rotateY: animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }],
        opacity: flipped ? 1 : 0,
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] }) }],
        opacity: flipped ? 0 : 1,
    };

    return (
        <TouchableOpacity onPress={() => onFlip(cardIndex)}>
            <View style={styles.card}>
                <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
                    <Image source={imageUri} style={styles.cardImage} />
                </Animated.View>
                <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
                    <Image source={require('../assets/images/splash.png')} style={styles.cardImage} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardSide: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
    },
    cardBack: {
        backgroundColor: '#333',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
});

export default Card;
