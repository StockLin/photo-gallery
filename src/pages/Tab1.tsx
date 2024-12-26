import {
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  useIonModal,
  useIonViewWillEnter,
} from "@ionic/react";
import "./Tab3.css";
import { useRef, useState } from "react";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation, Position } from "@capacitor/geolocation";
import { apiLoadMarkers, CustomMarker, mockMarkers } from "./data";
import { MapClickCallbackData } from "@capacitor/google-maps/dist/typings/definitions";
import MarkerInfo from "../components/MarkerInfo";
import { location, navigate, scan, trash } from "ionicons/icons";

const API_KEY = import.meta.env.VITE_MAP_API_KEY ?? "";

// v initial map
// v load markers data
// v set markers
// v add click event

const Tab1: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<Position>();
  const mapRef = useRef<HTMLElement>();
  const mapInstance = useRef<GoogleMap>();

  let markers: CustomMarker[] = [];
  const [selectedMarker, setSelectedMarker] = useState<CustomMarker | null>(
    null
  );

  const [present, dismiss] = useIonModal(MarkerInfo, {
    marker: selectedMarker,
    dismiss: () => dismiss(),
  });

  const modalOptions = {
    initialBreakpoint: 0.25,
    breakpoints: [0, 0.25, 0.5, 0.75],
    backdropBreakpoint: 0.25,
    onDidDismiss: () => dismiss(),
  };

  const getCurrentCoordinates = async () => {
    const permResult = await Geolocation.checkPermissions();

    if (permResult.location === "prompt") {
      await Geolocation.requestPermissions();
    }

    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    return coordinates;
  };

  const handleMarkerClick = async (marker: MapClickCallbackData) => {
    if (!mapRef.current) return;

    const targetMarker = markers.find(
      ({ coordinate: { lat, lng } }) =>
        lat === marker.latitude && lng === marker.longitude
    );

    if (targetMarker) {
      setSelectedMarker(targetMarker);
      present(modalOptions);
    }
  };

  const createMap = async () => {
    if (!mapRef.current) return;

    const coordinates = await getCurrentCoordinates();

    // initial map
    mapInstance.current = await GoogleMap.create({
      id: "Map01",
      element: mapRef.current,
      apiKey: API_KEY,
      config: {
        center: {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        },
        zoom: 16,
        fullscreenControl: false,
        disableDefaultUI: true,
        clickableIcons: false,
      },
    });

    // load markers
    const apiMarkers = await apiLoadMarkers();
    const markerIds = mapInstance.current.addMarkers(
      apiMarkers.map(({ id, mapId, ...rest }) => rest)
    );

    markers = apiMarkers;

    mapInstance.current.setOnMarkerClickListener((data) =>
      handleMarkerClick(data)
    );
  };

  const centerToCurrentLocation = async () => {
    const coordinates = await getCurrentCoordinates();

    if (!mapInstance.current) return;

    // center map to current location
    await mapInstance.current.setCamera({
      coordinate: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      },
      zoom: 16,
      animate: true,
    });
  };

  useIonViewWillEnter(() => {
    const init = async () => {
      await createMap();
    };

    init();
  });

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* <capacitor-google-map
          ref={mapRef}
          style={{
            display: "block",
            width: "100wh",
            height: "100vh",
          }}
        /> */}

        <IonRow>
          <IonCol size="6">
            <IonFabButton
              onClick={async () => {
                const coords = await getCurrentCoordinates();
                setCurrentPosition(coords);
              }}
            >
              <IonIcon size="large" icon={location} />
            </IonFabButton>
          </IonCol>

          <IonCol size="6">
            <IonFabButton
              onClick={async () => {
                setCurrentPosition(undefined);
              }}
            >
              <IonIcon size="large" icon={trash} />
            </IonFabButton>
          </IonCol>
        </IonRow>

        <IonLabel>
          <h2 className="ion-margin">
            LAT: {currentPosition?.coords?.latitude ?? ""}
          </h2>
          <h2 className="ion-margin">
            LNG: {currentPosition?.coords?.longitude ?? ""}
          </h2>
        </IonLabel>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => {}}>
            <IonIcon size="large" icon={scan} />
          </IonFabButton>
        </IonFab>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={centerToCurrentLocation}>
            <IonIcon icon={navigate} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
