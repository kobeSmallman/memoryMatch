import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { database } from '../utils/database'; 

const CustomCardScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImageUri(data.uri);

      Alert.alert(
        'Save Picture',
        'Do you want to add this picture to your card combinations?',
        [
          { 
            text: 'Yes', 
            onPress: () => savePicture(data.uri) 
          },
          { 
            text: 'Retake', 
            onPress: () => setImageUri(null)  
          },
          { 
            text: 'Cancel', 
            onPress: () => setImageUri(null),  
            style: 'cancel'
          },
        ],
        { cancelable: false }
      );
    }
  };

  const savePicture = (uri) => {
    database.insertCustomCard(uri, (insertId) => {
      if (insertId) {
        Alert.alert('Success', 'Image added to card combinations!');
        database.fetchCustomCards((cards) => {
          console.log('All custom cards:', cards);
        });
      } else {
        Alert.alert('Error', 'Failed to add the image.');
      }
    });
  };
  

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      </Camera>
      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  preview: {
    alignSelf: 'center',
    width: 300,
    height: 300,
  },
});

export default CustomCardScreen;
