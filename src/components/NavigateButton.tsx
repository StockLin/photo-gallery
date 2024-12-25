import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { useMap } from "@vis.gl/react-google-maps";
import { navigate } from "ionicons/icons";
import React from "react";

interface Props {
  mapId: string;
  getCurrentCoordinates: () => any;
}

const NavigateButton: React.FC<Props> = ({ mapId, getCurrentCoordinates }) => {
  const map = useMap(mapId);

  const centerToCurrentLocation = async () => {
    const coordinates = await getCurrentCoordinates();

    map?.moveCamera({
      center: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      },
      zoom: 16,
    });
  };

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton onClick={centerToCurrentLocation}>
        <IonIcon icon={navigate} />
      </IonFabButton>
    </IonFab>
  );
};

export default NavigateButton;
