import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Toolbar from "../components/Toolbar";
import SignatureCanvas from "react-signature-canvas";
import { useLocation } from "react-router";

const SignaturePage: React.FC = () => {
  const [savedUrl, setSavedUrl] = useState("");
  const signatureRef = useRef<SignatureCanvas | null>();

  const location = useLocation();

  const handleClear = useCallback(() => {
    if (!signatureRef?.current) {
      return;
    }

    setSavedUrl("");
    signatureRef.current.clear();
  }, []);

  useEffect(() => {
    return () => handleClear();
  }, [location, handleClear]);

  const handleSave = () => {
    if (!signatureRef?.current) {
      return;
    }

    const imageUrl = signatureRef.current.toDataURL();
    setSavedUrl(imageUrl);
  };

  return (
    <IonPage>
      <Toolbar title="Signature" />
      <IonContent fullscreen>
        <div className="w-full">
          <SignatureCanvas
            ref={(ref) => {
              signatureRef.current = ref;
            }}
            canvasProps={{
              width: 500,
              height: 300,
              className: "bg-gray-100",
            }}
          />
        </div>

        <>
          <IonButton fill="outline" onClick={handleClear}>
            Clear
          </IonButton>

          <IonButton onClick={handleSave}>SAVE</IonButton>

          {savedUrl && (
            <div className="w-full h-[200px]">
              <img src={savedUrl} />
            </div>
          )}
        </>
      </IonContent>
    </IonPage>
  );
};

export default SignaturePage;
