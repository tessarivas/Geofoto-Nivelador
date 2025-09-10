// components/BubbleLevel.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BubbleLevelProps {
  tilt: number;
  isLevel: boolean;
}

const BubbleLevel: React.FC<BubbleLevelProps> = ({ tilt, isLevel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nivel</Text>
      <View style={styles.levelContainer}>
        <View style={styles.bubbleContainer}>
          <View 
            style={[
              styles.bubble, 
              { 
                transform: [
                  { translateX: tilt * 2 }, 
                  { translateY: tilt * 2 }
                ],
                backgroundColor: isLevel ? 'green' : 'red' 
              }
            ]} 
          />
        </View>
        <Text style={styles.tiltText}>{tilt.toFixed(1)}°</Text>
      </View>
      <Text style={[styles.status, isLevel ? styles.statusOk : styles.statusError]}>
        {isLevel ? 'Nivelado estable ✓' : 'No nivelado ✗'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  bubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  tiltText: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusOk: {
    color: 'green',
  },
  statusError: {
    color: 'red',
  },
});

export default BubbleLevel;