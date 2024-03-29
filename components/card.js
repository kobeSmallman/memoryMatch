import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const isLocalAsset = (uri) => {
  
    return uri && (typeof uri === 'number' || uri.startsWith('require'));
};

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

    const renderCardImage = () => {
        if (isLocalAsset(imageUri)) {
    
            return <Image source={imageUri} style={styles.cardImage} />;
        } else {
           
            return <Image source={{ uri: imageUri }} style={styles.cardImage} />;
        }
    };

    return (
        <TouchableOpacity onPress={() => onFlip(cardIndex)}>
            <View style={styles.card}>
                <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
                    {renderCardImage()}
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
