import React, { useEffect, useRef, useState } from "react";
import { IonButton, IonContent, IonToolbar } from "@ionic/react";
import {
  Html5Qrcode,
  Html5QrcodeFullConfig,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanner,
} from "html5-qrcode";
import useCamera from "../hooks/useCamera";

interface Props {
  onScan?: (result: string) => void;
  dismiss?: () => void;
}

const ScanBox: React.FC<Props> = ({ onScan, dismiss }) => {
  const { checkPermissions, requestPermissions } = useCamera();
  const scannerRef = useRef<Html5Qrcode>();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    const init = async () => {
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        await requestPermissions();
      }

      if (!scannerRef?.current) {
        scannerRef.current = new Html5Qrcode("reader", {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
      }
    };

    init();

    return () => {
      if (scannerRef?.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const config = { fps: 10, qrbox: 250 };

      const onScanSuccess = (decodedText: string, decodedResult: any) => {
        console.log("onScanSuccess", decodedText);
        setScanResult(decodedText);
        stopScanning();
      };

      const onScanFailure = (error: any) => {
        console.error("onScanFailure", error);
      };

      if (scannerRef?.current) {
        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          // onScanFailure
          undefined
        );

        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error starting scanner:", error);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  return (
    <div className=" relative flex flex-col gap-4">
      <div
        id="reader"
        className="w-screen h-screen bg-gray-100 rounded-lg overflow-hidden"
      />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2"></div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col gap-4">
          {scanResult}

          {isScanning ? (
            <IonButton className="bg-rose-500" onClick={stopScanning}>
              STOP
            </IonButton>
          ) : (
            <IonButton onClick={startScanning}>START</IonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanBox;
