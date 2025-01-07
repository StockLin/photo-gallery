import { IonContent, IonPage } from "@ionic/react";
import React, { useState } from "react";
import "./ScanPage.css";
import { useHistory } from "react-router";
import ScanBox from "../components/ScanBox";
import Toolbar from "../components/Toolbar";

const ScanPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <Toolbar title="QRCODE Scan" />
        <ScanBox />
      </IonContent>
    </IonPage>
  );
};

export default ScanPage;
