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
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import {
  apiLoadMarkerById,
  apiLoadMarkers,
  CustomMarker,
  MarkerDetail,
} from "../pages/data";
import MarkerInfo from "./MarkerInfo";
import { navigate, scan } from "ionicons/icons";

import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import useScan from "../hooks/useScan";
import ScanBox from "./ScanBox";
import { useHistory } from "react-router";

// v initial map
// v load markers data
// v set markers
// v add click event

const initalCenter = {
  lat: 24.997725,
  lng: 121.457211,
};

const CustomMap: React.FC = () => {
  const MAP_ID = "map01";
  const map = useMap(MAP_ID);
  const isMapLoaded = useApiIsLoaded();
  const [currentPosition, setCurrentPosition] = useState<any>(initalCenter);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const { scanQRCode, scanResult } = useScan();

  const history = useHistory();

  const [selectedMarker, setSelectedMarker] = useState<CustomMarker | null>(
    null
  );

  const [markerDetail, setMarkerDetail] = useState<MarkerDetail>();

  const [present, dismiss] = useIonModal(MarkerInfo, {
    marker: selectedMarker,
    markerDetail,
    dismiss: () => dismiss(),
  });

  const [presentScan, dismissScan] = useIonModal(ScanBox, {
    dismiss: () => dismissScan(),
  });

  const modalOptions = {
    initialBreakpoint: 0.25,
    breakpoints: [0, 0.25, 0.5, 0.75],
    backdropBreakpoint: 0.25,
    onDidDismiss: () => dismiss(),
  };

  const scanModalOptions = {
    initialBreakpoint: 1,
    breakpoints: [0, 1],
    backdropBreakpoint: 0,
    onDidDismiss: () => dismissScan(),
  };

  // load current position
  const getCurrentCoordinates = async () => {
    try {
      const permResult = await Geolocation.checkPermissions();

      // if (permResult.location === "prompt") {
      //   await Geolocation.requestPermissions();
      // }

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return coordinates;
    } catch (error: any) {
      console.log("Geolocation error...", error);
      return {
        coords: { latitude: initalCenter.lat, longitude: initalCenter.lng },
      };
    }
  };

  useEffect(() => {
    const init = async () => {
      const coordinates = await getCurrentCoordinates();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      if (lat && lng) {
        setCurrentPosition({ lat, lng });
        map?.moveCamera({
          center: { lat, lng },
          zoom: 16,
        });
      }

      const apiMarkers = await apiLoadMarkers();
      setMarkers(apiMarkers);
    };

    if (isMapLoaded && map) {
      init();
    }
  }, [isMapLoaded, map]);

  const handleMarkerClick = async (marker: CustomMarker) => {
    const detail = await apiLoadMarkerById(marker.id);

    setSelectedMarker(marker);
    setMarkerDetail(detail);
    present(modalOptions);
  };

  const centerToCurrentLocation = async () => {
    const coordinates = await getCurrentCoordinates();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;

    if (!lat || !lng) return;

    map?.moveCamera({
      center: { lat, lng },
      zoom: 16,
    });
  };

  const handleScan = async () => {
    history.push("/scan");
  };

  if (!isMapLoaded) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonLoading isOpen animated message="Loading Location..." />
        </IonContent>
      </IonPage>
    );
  }

  return (
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

        <h1 className="text-3xl font-bold text-orange-500">GPS</h1>

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
            const scale = selectedMarker && selectedMarker.id === id ? 1.6 : 1;

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
          <IonFabButton className="button" onClick={handleScan}>
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

export default CustomMap;
