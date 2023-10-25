/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useCities } from "../../contexts/CitiesContext/CitiesContext";
import { useGeolocation } from "../../hooks/useGeolocation/useGeolocation";
import Button from "../Button/Button";
import { useUrlPosition } from "../../hooks/useUrlPosition/useUrlPosition";
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingGeolocation,
    position: GeolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (GeolocationPosition)
        setMapPosition([GeolocationPosition.lat, GeolocationPosition.lng]);
    },
    [GeolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!GeolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeolocation ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePosition position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}
//Change the position when click on the map
function ChangePosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

//Detect the click on the map and render the form
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
