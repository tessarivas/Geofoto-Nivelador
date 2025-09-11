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
                backgroundColor: isLevel ? '#85ff89ff' : '#ff6ba6ff' 
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
    backgroundColor: 'rgba(162,89,230,0.15)', 
    borderRadius: 20,
    padding: 16,
    shadowColor: '#a259e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#e2b6ffff',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#e2b6ffff',
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
    color: '#fff',
    backgroundColor: '#a259e6',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusOk: {
    color: '#85ff89ff',
  },
  statusError: {
    color: '#ff6ba6ff',
  },
});

export default BubbleLevel;