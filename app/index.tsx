import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BubbleLevel from '../components/bubbleLevel';
import Compass from '../components/compass';
import GeofenceIndicator from '../components/geofenceIndicator';
import { TARGET_LOCATION } from '../constants';
import { useLocation } from '../hooks/useLocation';
import { useSensors } from '../hooks/useSensors';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const cameraRef = useRef<any>(null);
  
  const { heading, isNorth, tilt, isLevel } = useSensors();
  const { location, errorMsg, distance, isInGeofence } = useLocation();

  const canTakePhoto = isInGeofence && isNorth && isLevel;

  const takePicture = async () => {
    if (cameraRef.current && canTakePhoto) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo.uri);
        setIsCameraActive(false);
        
        if (mediaPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          Alert.alert('Éxito', 'Foto guardada en la galería');
        }
      } catch (error) {
        console.error('Error tomando la foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    
    if (!mediaPermission?.granted) {
      await requestMediaPermission();
    }
    
    if (permission?.granted && mediaPermission?.granted) {
      setIsCameraActive(true);
    } else {
      Alert.alert(
        'Permisos necesarios', 
        'Necesitas conceder permisos de cámara y almacenamiento para usar esta función',
        [
          { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  };

  if (!permission) {
    return <View style={styles.container}><Text>Solicitando permisos...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos permisos para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCameraActive) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
            style={styles.camera}
            facing="back"
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={[styles.captureButton, !canTakePhoto && styles.captureButtonDisabled]} 
                onPress={takePicture}
                disabled={!canTakePhoto}
              >
                <Text style={styles.captureButtonText}>📸</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.overlayInfo}>
              <Text style={styles.overlayText}>
                {location ? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}` : 'Obteniendo ubicación...'}
              </Text>
              <Text style={styles.overlayText}>Heading: {Math.round(heading)}°</Text>
              <Text style={styles.overlayText}>Nivelado: {isLevel ? 'OK' : 'NO'}</Text>
              <Text style={styles.overlayText}>{new Date().toLocaleString()}</Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <View style={styles.watermark}>
            <Text style={styles.watermarkText}>
              {new Date().toLocaleString()}
            </Text>
            <Text style={styles.watermarkText}>
              {location ? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}` : 'Ubicación no disponible'}
            </Text>
            <Text style={styles.watermarkText}>
              Heading: {Math.round(heading)}°
            </Text>
            <Text style={styles.watermarkText}>
              Nivelado: OK
            </Text>
          </View>
          
          <View style={styles.previewButtons}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setPhoto(null)}
            >
              <Text style={styles.buttonText}>Volver a tomar foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>GeoFoto Nivelada</Text>
        
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : (
          <>
            <GeofenceIndicator distance={distance} isInGeofence={isInGeofence} />
            <Compass heading={heading} isNorth={isNorth} />
            <BubbleLevel tilt={tilt} isLevel={isLevel} />
            
            <Text style={styles.targetText}>
              Objetivo: {TARGET_LOCATION.latitude.toFixed(5)}, {TARGET_LOCATION.longitude.toFixed(5)}
            </Text>
            
            <TouchableOpacity 
              style={[styles.mainButton, !canTakePhoto && styles.mainButtonDisabled]} 
              onPress={openCamera}
              disabled={!canTakePhoto}
            >
              <Text style={styles.mainButtonText}>
                {canTakePhoto ? 'Abrir Cámara' : 'Condiciones no cumplidas'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Requisitos para activar la cámara:</Text>
              <Text style={[styles.requirement, isInGeofence && styles.requirementMet]}>
                • Estar dentro de 50m del objetivo: {isInGeofence ? '✓' : '✗'}
              </Text>
              <Text style={[styles.requirement, isNorth && styles.requirementMet]}>
                • Apuntar al Norte ±15°: {isNorth ? '✓' : '✗'}
              </Text>
              <Text style={[styles.requirement, isLevel && styles.requirementMet]}>
                • Teléfono nivelado por 2 segundos: {isLevel ? '✓' : '✗'}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033', 
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ffffffff', 
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  error: {
    color: '#ff6bcb', 
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  targetText: {
    fontSize: 14,
    marginVertical: 10,
    color: '#d1b3ff',
  },
  mainButton: {
    backgroundColor: '#6c2eb7', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  mainButtonDisabled: {
    backgroundColor: '#3d246c', 
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requirements: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2d1457', 
    borderRadius: 10,
    width: '100%',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#a259e6',
  },
  requirement: {
    fontSize: 14,
    marginVertical: 5,
    color: '#fff',
  },
  requirementMet: {
    color: '#a259e6', 
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#6c2eb7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraControls: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#a259e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#3d246c',
  },
  captureButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: 'rgba(162,89,230,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 2,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a0033',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  watermark: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: 'rgba(162,89,230,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  watermarkText: {
    fontSize: 12,
    marginVertical: 2,
    color: '#fff',
  },
  previewButtons: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6c2eb7',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});