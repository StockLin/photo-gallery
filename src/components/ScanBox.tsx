import React, { useRef } from "react";
import { Scanner, IScannerStyles } from "@yudiel/react-qr-scanner";
import { IonContent, IonToolbar } from "@ionic/react";

interface Props {
  onScan: (result: string) => void;
  dismiss?: () => void;
}

const ScanBox: React.FC<Props> = ({ onScan, dismiss }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrBoxRef = useRef<HTMLDivElement>(null);

  return (
    <IonContent>
      <IonToolbar></IonToolbar>
      <Scanner
        styles={{
          container: { width: "100%", height: "100%" },
          video: { borderColor: "blue" },
          finderBorder: 0.2,
        }}
        onScan={(result) => {
          console.log(result);
        }}
      />
    </IonContent>
  );
};

export default ScanBox;
