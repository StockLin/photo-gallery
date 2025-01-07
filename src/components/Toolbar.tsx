import React from "react";
import { IonButton, IonButtons, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router";

interface Props {
  title?: string;
  showBack?: boolean;
}

const Toolbar: React.FC<Props> = ({ title = "title", showBack = true }) => {
  const history = useHistory();

  return (
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton onClick={showBack ? () => history.push("/tab3") : undefined}>
          Back
        </IonButton>
      </IonButtons>
      <IonTitle>{title}</IonTitle>
    </IonToolbar>
  );
};

export default Toolbar;
