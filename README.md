# 📍📸🧭 GeoFoto Nivelada — Actividad Integrada (Expo + React Native)

> **Objetivo:** Construir una app que **solo permita tomar una foto** cuando se cumplan **tres condiciones**:
> 1) Estar **dentro de un radio** (geocerca) de un punto objetivo  
> 2) Apuntar el teléfono al **Norte ±15°** (heading)  
> 3) Mantener el teléfono **nivelado** (tilt < 3°) por **2 segundos**

Cuando las 3 condiciones se cumplen, se **habilita el botón de cámara**. La foto mostrará una **marca de agua** con fecha/hora, lat/lon, heading y “Nivelado: OK”.

---

## 🎯 Aprendizajes esperados
- Lectura y tratamiento de **sensores**: `expo-sensors` (Acelerómetro + Magnetómetro)
- Uso de **geolocalización**: `expo-location` (posición puntual y/o watch)
- Manejo de **Cámara**: `expo-camera` (captura y preview)
- **Permisos** (runtime), suavizado de señales y validación por ventanas de tiempo
- UX básica: estados, errores y bloqueo/desbloqueo de acciones

---

## 🧰 Stack y requisitos
- **Expo** (Managed Workflow)
- **React Native**
- Paquetes:
  ```bash
  npx expo install expo-location expo-sensors expo-camera
  # opcional (guardar en galería)
  npx expo install expo-media-library
  ```
- **Dispositivo físico** recomendado (el simulador de iOS no tiene cámara real)

> **iOS (builds):** agrega descripciones en `app.json/app.config.js` (dentro de `ios.infoPlist`):
> ```json
> {
>   "NSCameraUsageDescription": "Necesitamos la cámara para tomar fotografías.",
>   "NSLocationWhenInUseUsageDescription": "Necesitamos tu ubicación para validar la geocerca y el heading."
> }
> ```
> **Android:** Expo gestiona permisos en runtime; asegúrate de tener **GPS activado**.

---

## 🚀 Puesta en marcha
1. Crear proyecto (o usar uno existente):
   ```bash
   npx create-expo-app geofoto-nivelada
   cd geofoto-nivelada
   npx expo install expo-location expo-sensors expo-camera
   ```
2. Ejecutar:
   ```bash
   npx expo start
   ```
3. Probar en **dispositivo físico** (recomendado). Si usas simulador:
   - iOS: simula ubicación desde **Features → Location**
   - Android: asegúrate de que el **GPS** esté ON y da permisos en runtime

---

## 🧩 Reglas y restricciones
- **Una sola pantalla** (sin tabs): toda la interacción en una vista tipo “misión”.
- No se abre la cámara si **alguna** de las 3 condiciones no se cumple.
- El **nivel** debe ser **estable** ≥ 2 s (no un único frame).
- Deben usarse **Magnetometer + Accelerometer + Location** simultáneamente.

---

## ✅ Criterios de aceptación (Checklist)
- [ ] Permisos y estado de servicios mostrados (ubicación activa / cámara lista)  
- [ ] Distancia dinámica al **objetivo**, con desbloqueo a ≤ **50 m**  
- [ ] **Heading** visible (0–360°), válido al **Norte ±15°**  
- [ ] **Tilt** calculado, **suavizado** y verificado **2 s** < 3°  
- [ ] Botón de **cámara** habilitado **solo** cuando (distancia && heading && tiltEstable)  
- [ ] **Foto** con **marca de agua**: fecha/hora, lat, lon, heading, “Nivelado: OK”  
- [ ] Manejo claro de **errores/permisos** (texto, badges o banners)

---

## 📦 Estructura sugerida
> Puedes usar **Expo Router** con `app/index.tsx` o un `App.tsx` plano. Mantén todo en una sola pantalla.

```
/src
  /components
    Badge.tsx
    BubbleLevel.tsx
    Compass.tsx
  /hooks
    useHeading.ts
    useLevel.ts
    useGeofence.ts
  constants.ts
App.tsx (o app/index.tsx)
```

- `BubbleLevel`: dibuja la “burbuja” y cambia a verde al estar nivelado  
- `Compass`: muestra heading numérico o una brújula simple  
- `useGeofence`: calcula distancia al objetivo y expone condición `inRange`

---

## 🧠 Pistas técnicas (sin solución completa)

**1) Distancia (Haversine)**
```ts
const R = 6371000; // m
const toRad = (deg: number) => (deg * Math.PI) / 180;
export function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a)); // metros
}
```

**2) Objetivo cercano a la posición inicial**
```ts
export function offsetMeters(lat:number, lon:number, dNorth:number, dEast:number){
  const dLat = dNorth / 111111;
  const dLon = dEast / (111111 * Math.cos(lat * Math.PI/180));
  return { lat: lat + dLat, lon: lon + dLon };
}
// Ejemplo: objetivo a ~90 m al NE
// const goal = offsetMeters(lat0, lon0, 64, 64);
```

**3) Heading con Magnetómetro (`expo-sensors`)**
```ts
// Magnetometer.addListener(({ x, y }) => { ... })
export const toHeading = (x:number, y:number) => {
  const deg = (Math.atan2(y, x) * 180) / Math.PI; // -180..180 (aprox)
  return deg < 0 ? deg + 360 : deg;               // 0..360
};
// Validación Norte ±15°:
export const isNorthOk = (h:number) => (h <= 15 || h >= 345);
```

**4) Tilt / Nivel con Acelerómetro + suavizado**
```ts
export const tiltDeg = (a:{x:number,y:number,z:number}) =>
  Math.atan2(Math.sqrt(a.x**2 + a.y**2), a.z) * (180/Math.PI);

// LPF exponencial: next = prev + alpha * (curr - prev)
export function lpf(prev:number, curr:number, alpha=0.2){ 
  return prev + alpha * (curr - prev);
}

// Ventana temporal (2 s):
// - guarda timestamps de lecturas sucesivas con tilt<3°
// - si la diferencia (ultimo - primero) >= 2000 ms => nivel estable
```

**5) Marca de agua en el preview**  
No es obligatorio “pintar” sobre la imagen: basta un **overlay** encima del `Image` del preview con:
- `new Date().toLocaleString()`
- `coords.latitude.toFixed(5), coords.longitude.toFixed(5)`
- `heading.toFixed(0) + '°'`
- `Nivelado: OK`

---

## 🔧 Configuración sugerida (constantes)
```ts
// constants.ts
export const GEOFENCE_RADIUS_M = 50;
export const HEADING_TOLERANCE_DEG = 15;
export const TILT_THRESHOLD_DEG = 3;
export const TILT_HOLD_MS = 2000; // 2s
export const LOCATION_INTERVAL_MS = 1000;
export const SENSOR_INTERVAL_MS = 150; // 100–200 ms
```

---

## 🧪 QA / Pruebas
- Prueba en exterior para obtener señales más estables
- Simula ubicaciones (iOS) o camina unos metros (Android)
- Verifica que **no** puedes abrir la cámara si **falla** cualquiera de las 3 condiciones
- Apaga el GPS para verificar mensajes de error
- Revisa consumo: incrementa intervalos si notas gasto excesivo de batería

---

## 🆘 Troubleshooting
- **El heading no cambia**: algunos dispositivos filtran o requieren movimiento; intenta girar suavemente en un plano horizontal.
- **Tilt salta mucho**: aumenta el `alpha` del LPF (0.1–0.25) y/o usa una **media móvil** adicional.
- **Permisos denegados**: muestra un botón para abrir **Ajustes** (`Linking.openSettings()`).
- **Simulador**: en iOS no hay cámara; la ubicación debe simularse; heading/magnetómetro puede no estar disponible.

---

## 📤 Entregables
1. **Video (≤ 60 s)**: demuestra las 3 validaciones y la captura con marca de agua  
2. **Repositorio** con:
   - `README.md` (este archivo)
   - Captura de pantalla del **preview** con la marca de agua
   - Código organizado
3. **Reflexión breve** (5–8 líneas): ¿qué sensor fue más ruidoso y cómo lo mitigaste?

---

## 🧮 Rúbrica (100 pts)

| Criterio | Pts |
|---|---:|
| Geocerca funcional (distancia dinámica, umbral ≤ 50 m) | 20 |
| Heading funcional (0–360°, validación Norte ±15°) | 20 |
| Nivelado estable (tilt < 3° por 2 s, con suavizado) | 25 |
| Botón de cámara bloqueado/habilitado según 3 condiciones | 15 |
| Foto con marca de agua (fecha/hora, lat, lon, heading, “Nivelado: OK”) | 10 |
| UX/Permisos/Errores claros | 10 |
| **Extra**: Guardar en galería o generar JSON de reporte | +5 |

> **Nota:** La suma sin extra es 100. El extra agrega hasta 5 puntos adicionales.

---

## 🔀 Extensiones opcionales
- Ajustes en pantalla para **cambiar rumbo objetivo** y **radio** sin recompilar
- **Barra de progreso** para el temporizador de 2 s del nivelado
- **Shake** (acelerómetro) para regenerar una nueva geocerca aleatoria

---

## 📄 Licencia de uso educativo
Este material puede ser usado y adaptado con fines didácticos citando la fuente.