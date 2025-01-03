import React, { useEffect, useRef, useState } from "react";
import { IonButton } from "@ionic/react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeCameraScanConfig,
} from "html5-qrcode";
import useCamera from "../hooks/useCamera";

interface Props {
  onScan?: (result: string) => void;
  dismiss?: () => void;
}

const ScanBox: React.FC<Props> = ({ onScan, dismiss }) => {
  const {
    checkPermissions,
    requestPermissions,
    checkAndRequestCameraPermissions,
  } = useCamera();
  const scannerRef = useRef<Html5Qrcode>();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    const init = async () => {
      // const hasPermission = await checkAndRequestCameraPermissions();

      // console.log("hasPermission", hasPermission);
      // if (!hasPermission) {
      //   await requestPermissions();
      // }

      if (!scannerRef?.current) {
        // const devices = await Html5Qrcode.getCameras();

        // if (devices && devices.length > 0) {
        //   console.log("devices", devices);
        // }

        scannerRef.current = new Html5Qrcode("reader", {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
      }
    };

    init();
  }, []);

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log("onScanSuccess", decodedText);
    setScanResult(decodedText);
    stopScanning();
  };

  const onScanFailure = (error: any) => {
    console.error("onScanFailure", error);
  };

  const startScanning = async () => {
    try {
      const scannerElement = document.getElementById("reader");

      if (!scannerElement) {
        console.error("scannerElement not provide");
        return;
      }

      const config: Html5QrcodeCameraScanConfig = {
        fps: 30,
        qrbox: scannerElement.getBoundingClientRect().width * (9 / 16) - 10,
        aspectRatio: 16 / 9,
        videoConstraints: {
          // width: { ideal: 1280 },
          // height: { ideal: 720 },
          backgroundBlur: true,
        },
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

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2"></div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col gap-4">
          {scanResult}

          <IonButton
            className="bg-rose-500"
            onClick={async () => {
              await navigator.mediaDevices.getUserMedia({ video: true });
            }}
          >
            Request Permission
          </IonButton>

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
