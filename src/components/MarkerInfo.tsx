import { Marker } from "@capacitor/google-maps";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { MarkerDetail } from "../pages/data";

type Props = {
  marker: Marker;
  markerDetail?: MarkerDetail;
  dismiss?: () => void;
};

const MarkerInfo: React.FC<Props> = ({ marker, markerDetail, dismiss }) => {
  return (
    <IonContent>
      <IonItem>
        <IonLabel>
          <h2 className="ion-margin">{marker.title}</h2>
          <p>{marker.snippet}</p>
        </IonLabel>
      </IonItem>

      {markerDetail && (
        <IonItem>
          <IonText>
            <p>可借數: {markerDetail.counts}</p>
            <p>可還數: {markerDetail.returnCounts}</p>
          </IonText>
        </IonItem>
      )}
    </IonContent>
  );
};

export default MarkerInfo;
