import { IonContent, IonPage } from "@ionic/react";
import React, { useState } from "react";
import "./ScanPage.css";
import { useHistory } from "react-router";
import ScanBox from "../components/ScanBox";

const ScanPage: React.FC = () => {
  const history = useHistory();
  const [scanValues, setScanValues] = useState<any>();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="relative border-2 w-screen h-screen overflow-hidden">
          <div
            className=" absolute top-4 left-4 z-50 text-gray-100 text-xl font-medium"
            onClick={() => history.push("/tab3")}
          >
            BACK
          </div>

          <ScanBox />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ScanPage;
