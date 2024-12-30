import { useState } from "react";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";

const useScan = () => {
  const [scanResult, setScanResult] = useState<string>();

  const scanQRCode = async () => {
    try {
      const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: "Please scan the QR code",
        scanText: "Scan",
        web: { scannerFPS: 1000 },
        scanButton: true,
      });
      setScanResult(ScanResult);
    } catch (error) {
      console.error("Error scanning QR code", error);
    }
  };

  return { scanQRCode, scanResult };
};

export default useScan;

// const [isSupport, setIsSupport] = useState(false);
// const [qrcodes, setQrcodes] = useState<Barcode[]>([]);

// useEffect(() => {
//   BarcodeScanner.isSupported().then((result) => {
//     console.log("isSupported", result.supported);
//     setIsSupport(result.supported);
//   });
// }, []);

// const requestPermissions = async () => {
//   const { camera } = await BarcodeScanner.requestPermissions();
//   return camera === "granted" || camera === "limited";
// };

// const scanQRCode = async () => {
//   const granted = await requestPermissions();

//   if (!granted) {
//     console.log("Permission not granted for camera");
//     return;
//   }

//   const { barcodes } = await BarcodeScanner.scan();
//   setQrcodes(barcodes);
// };
