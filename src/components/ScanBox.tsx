import React, { useEffect, useRef, useState } from "react";
import { IonButton } from "@ionic/react";
import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  CameraDevice,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import useCamera from "../hooks/useCamera";
import { useLocation } from "react-router";

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
  const [devices, setDevices] = useState<CameraDevice[]>([]);

  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      // const hasPermission = await checkAndRequestCameraPermissions();

      // console.log("hasPermission", hasPermission);
      // if (!hasPermission) {
      //   await requestPermissions();
      // }

      if (!scannerRef?.current) {
        scannerRef.current = new Html5Qrcode("reader", {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
      }
    };

    init();
  }, []);

  useEffect(() => {
    return () => {
      scannerRef?.current?.stop();
    };
  }, [location]);

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log("onScanSuccess", decodedText);
    setScanResult(decodedText);
    stopScanning();
  };

  const onScanFailure = (error: any) => {
    // console.error("onScanFailure", error);
  };

  const startScanning = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length > 0) {
        setDevices(devices ?? []);
      }

      const scannerElement = document.getElementById("reader");

      if (!scannerElement) {
        console.error("scannerElement not provide");
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const reverseAspectRatio = height / width;

      const mobileAspectRatio =
        reverseAspectRatio > 1.5
          ? reverseAspectRatio + (reverseAspectRatio * 12) / 100
          : reverseAspectRatio;

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: scannerElement.getBoundingClientRect().width * (9 / 16) - 10,
        // qrbox: {
        //   width: 250,
        //   height: 250,
        // },
        // aspectRatio: window.innerWidth / window.innerHeight,
        videoConstraints: {
          aspectRatio: width < 600 ? mobileAspectRatio : aspectRatio,
          facingMode: "environment",
          // height: { min: 576, ideal: 1920 },
          // width: window.innerWidth,
          // height: window.innerHeight,
          // backgroundBlur: true,
        },
      };

      if (scannerRef?.current) {
        await scannerRef.current.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          onScanFailure
          // undefined
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
    <div className="!relative !w-full !h-full flex items-center">
      {/* <div className="w-full h-full bg-red-300"></div> */}
      <div id="reader" className="w-full" />

      {/* Corner markers */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
      </div> */}

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col gap-4">
          {scanResult}

          <h3>Device ({devices?.length})</h3>
          {/* <p>innerWidth {window?.innerWidth}</p>
          <p>innerHeight {window?.innerHeight}</p> */}

          {isScanning ? (
            <IonButton onClick={stopScanning}>STOP</IonButton>
          ) : (
            <IonButton onClick={startScanning}>START</IonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanBox;
