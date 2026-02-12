import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

// Try to import MapView, fallback if not available
let MapView = null;
let Marker = null;
try {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
} catch (e) {
  console.warn("react-native-maps not available, using fallback");
}

export default function MapPicker({ latitude, longitude, onLocationChange }) {
  const [editMode, setEditMode] = useState(false);
  const [tempLat, setTempLat] = useState(latitude?.toString() || "");
  const [tempLng, setTempLng] = useState(longitude?.toString() || "");
  const mapRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      try {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (e) {
        console.warn("Map animation failed:", e);
      }
    }
  }, [latitude, longitude]);

  const handleMapPress = (e) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    onLocationChange(lat, lng);
  };

  const handleSaveCoordinates = () => {
    const lat = parseFloat(tempLat);
    const lng = parseFloat(tempLng);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Erreur", "Latitude et longitude doivent être des nombres");
      return;
    }

    if (lat < -90 || lat > 90) {
      Alert.alert("Erreur", "Latitude doit être entre -90 et 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      Alert.alert("Erreur", "Longitude doit être entre -180 et 180");
      return;
    }

    onLocationChange(lat, lng);
    setEditMode(false);
  };

  // Fallback for web or when maps not available
  if (!MapView || !Marker) {
    return (
      <FallbackMapPicker
        latitude={latitude}
        longitude={longitude}
        tempLat={tempLat}
        tempLng={tempLng}
        setTempLat={setTempLat}
        setTempLng={setTempLng}
        editMode={editMode}
        setEditMode={setEditMode}
        onLocationChange={onLocationChange}
        handleSaveCoordinates={handleSaveCoordinates}
      />
    );
  }

  if (!latitude || !longitude) {
    return (
      <View style={styles.container}>
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color="#19b3e6" />
          <Text style={styles.placeholderText}>
            Activation de la localisation...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!editMode ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={handleMapPress}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title="Position sélectionnée"
              description={`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
              draggable
              onDragEnd={(e) => {
                const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
                onLocationChange(lat, lng);
              }}
            />
          </MapView>

          <View style={styles.coordBar}>
            <MaterialIcons name="location_on" size={18} color="#19b3e6" />
            <Text style={styles.coordText}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setTempLat(latitude.toString());
                setTempLng(longitude.toString());
                setEditMode(true);
              }}
            >
              <MaterialIcons name="edit_location" size={18} color="#19b3e6" />
              <Text style={styles.editBtnText}>Modifier coordonnées</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.infoText}>
            💡 Cliquez sur la carte pour changer la position, ou glissez le marqueur
          </Text>
        </>
      ) : (
        <>
          <View style={styles.editContainer}>
            <Text style={styles.editLabel}>Latitude</Text>
            <TextInput
              style={styles.coordInput}
              placeholder="Ex: 48.856"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={tempLat}
              onChangeText={setTempLat}
            />

            <Text style={styles.editLabel}>Longitude</Text>
            <TextInput
              style={styles.coordInput}
              placeholder="Ex: 2.352"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={tempLng}
              onChangeText={setTempLng}
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveCoordinates}
              >
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

// Fallback component when maps not available
function FallbackMapPicker({
  latitude,
  longitude,
  tempLat,
  tempLng,
  setTempLat,
  setTempLng,
  editMode,
  setEditMode,
  onLocationChange,
  handleSaveCoordinates,
}) {
  return (
    <View style={styles.container}>
      {!editMode ? (
        <>
          <View style={styles.mapPlaceholder}>
            <MaterialIcons name="location_on" size={40} color="#19b3e6" />
            <Text style={styles.coordText}>
              {latitude?.toFixed(6) || "0.000000"},{" "}
              {longitude?.toFixed(6) || "0.000000"}
            </Text>
            <Text style={styles.mapSubText}>
              (Carte interactive en mode développement)
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setTempLat(latitude?.toString() || "");
                setTempLng(longitude?.toString() || "");
                setEditMode(true);
              }}
            >
              <MaterialIcons name="edit_location" size={18} color="#19b3e6" />
              <Text style={styles.editBtnText}>Modifier coordonnées</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.editContainer}>
            <Text style={styles.editLabel}>Latitude</Text>
            <TextInput
              style={styles.coordInput}
              placeholder="Ex: 48.856"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={tempLat}
              onChangeText={setTempLat}
            />

            <Text style={styles.editLabel}>Longitude</Text>
            <TextInput
              style={styles.coordInput}
              placeholder="Ex: 2.352"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={tempLng}
              onChangeText={setTempLng}
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveCoordinates}
              >
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  map: {
    height: 250,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce3e5",
    marginBottom: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dce3e5",
    borderStyle: "dotted",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  coordBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    marginBottom: 8,
    gap: 8,
  },
  coordText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#19b3e6",
    fontFamily: "monospace",
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#637f88",
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  editContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  editLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
    marginTop: 8,
  },
  coordInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#dce3e5",
    borderRadius: 6,
    fontSize: 13,
    color: "#111618",
    backgroundColor: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#19b3e6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editBtnText: {
    color: "#19b3e6",
    fontSize: 13,
    fontWeight: "600",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce3e5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyChange: "center",
  },
  cancelBtnText: {
    color: "#637f88",
    fontSize: 13,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#19b3e6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 11,
    color: "#637f88",
    marginTop: 8,
    fontStyle: "italic",
    lineHeight: 14,
  },
});
