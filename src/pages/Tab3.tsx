import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonModal,
  useIonViewWillEnter,
} from "@ionic/react";
import "./Tab3.css";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import {
  apiLoadMarkerById,
  apiLoadMarkers,
  CustomMarker,
  MarkerDetail,
} from "./data";
import MarkerInfo from "../components/MarkerInfo";
import { scan } from "ionicons/icons";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import NavigateButton from "../components/NavigateButton";

const API_KEY = import.meta.env.VITE_MAP_API_KEY ?? "";

// v initial map
// v load markers data
// v set markers
// v add click event

const Tab3: React.FC = () => {
  const MAP_ID = "map01";
  const [currentPosition, setCurrentPosition] = useState<any>();
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  const [selectedMarker, setSelectedMarker] = useState<CustomMarker | null>(
    null
  );

  const [markerDetail, setMarkerDetail] = useState<MarkerDetail>();

  const [present, dismiss] = useIonModal(MarkerInfo, {
    marker: selectedMarker,
    markerDetail,
    dismiss: () => dismiss(),
  });

  const modalOptions = {
    initialBreakpoint: 0.25,
    breakpoints: [0, 0.25, 0.5, 0.75],
    backdropBreakpoint: 0.25,
    onDidDismiss: () => dismiss(),
  };

  // load current position
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

  useIonViewWillEnter(() => {
    const init = async () => {
      const coordinates = await getCurrentCoordinates();
      const apiMarkers = await apiLoadMarkers();

      setCurrentPosition({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      });

      setMarkers(apiMarkers);
    };

    init();
  });

  const handleMarkerClick = async (marker: CustomMarker) => {
    const detail = await apiLoadMarkerById(marker.id);

    setSelectedMarker(marker);
    setMarkerDetail(detail);
    present(modalOptions);
  };

  if (!currentPosition) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonLoading isOpen animated message="Loading Location..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <IonPage>
        <IonContent fullscreen>
          <IonFab vertical="top" horizontal="center" slot="fixed">
            <IonToolbar>
              <IonSelect
                label="據點查詢"
                value={selectedMarker}
                onIonChange={(e) => {
                  setSelectedMarker(e.detail.value);
                }}
              >
                {markers?.map((marker) => (
                  <IonSelectOption key={marker.id} value={marker}>
                    {marker.title}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonToolbar>
          </IonFab>

          <Map
            id={MAP_ID}
            defaultCenter={currentPosition}
            defaultZoom={16}
            disableDefaultUI
            mapId="morespace-express"
            clickableIcons={false}
          >
            {markers.map((marker) => {
              const { id, coordinate } = marker;
              const scale =
                selectedMarker && selectedMarker.id === id ? 1.6 : 1;

              return (
                <AdvancedMarker
                  key={id}
                  position={coordinate}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <Pin scale={scale} />
                </AdvancedMarker>
              );
            })}
          </Map>

          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton className="button" onClick={() => {}}>
              <IonIcon size="large" icon={scan} />
            </IonFabButton>
          </IonFab>

          <NavigateButton
            mapId={MAP_ID}
            getCurrentCoordinates={getCurrentCoordinates}
          />
        </IonContent>
      </IonPage>
    </APIProvider>
  );
};

export default Tab3;
