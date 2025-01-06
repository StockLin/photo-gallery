import "./ScanBox.css";

import React, { useEffect, useRef, useState } from "react";
import { IonButton, IonContent } from "@ionic/react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeCameraScanConfig,
  CameraDevice,
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
  const [devices, setDevices] = useState<CameraDevice[]>([]);

  const [scannerDimensions, setScannerDimensions] = useState({
    width: 250,
    height: 250,
  });
  const containerRef = useRef(null);

  useEffect(() => {
    // Function to calculate scanner dimensions
    // const updateScannerDimensions = () => {
    //   if (containerRef.current) {
    //     const smallerDimension =
    //       Math.min(window.innerWidth, window.innerHeight) * 0.7;
    //     setScannerDimensions({
    //       width: smallerDimension,
    //       height: smallerDimension,
    //     });
    //   }
    // };

    const init = async () => {
      // Initial calculation
      // updateScannerDimensions();

      // const hasPermission = await checkAndRequestCameraPermissions();

      // console.log("hasPermission", hasPermission);
      // if (!hasPermission) {
      //   await requestPermissions();
      // }

      if (!scannerRef?.current) {
        scannerRef.current = new Html5Qrcode(
          "reader",
          false
          //   {
          //   verbose: false,
          //   formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          // }
        );
      }
    };

    // Add resize listener
    // window.addEventListener("resize", updateScannerDimensions);

    init();
  }, []);

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
        console.log("devices", devices);
        setDevices(devices ?? []);
      }

      const scannerElement = document.getElementById("reader");

      if (!scannerElement) {
        console.error("scannerElement not provide");
        return;
      }

      console.log(
        " window.innerHeight / window.innerWidth",
        window.innerHeight / window.innerWidth,
        window.innerWidth / window.innerHeight
      );

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: scannerElement.getBoundingClientRect().width * (9 / 16) - 10,
        // qrbox: {
        //   width: 250,
        //   height: 250,
        // },
        aspectRatio: window.innerWidth / window.innerHeight,

        // aspectRatio: 16 / 9,
        videoConstraints: {
          // height: { min: 576, ideal: 1920 },
          width: window.innerWidth,
          height: window.innerHeight,
          facingMode: "environment",
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
    <div
      className="!relative !w-full !h-full flex items-center"
      ref={containerRef}
    >
      {/* <div className="w-full h-full bg-red-300"></div> */}
      <div id="reader" className="w-full bg-slate-500" />
      {/* Corner markers */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
      </div> */}

      <div className="absolute w-full h-hull top-10 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col gap-4">
          <IonButton>Device ({devices?.length})</IonButton>

          {isScanning ? (
            <IonButton onClick={stopScanning}>STOP</IonButton>
          ) : (
            <IonButton onClick={startScanning}>START</IonButton>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        {scanResult}
      </div>
    </div>
  );
};

export default ScanBox;
