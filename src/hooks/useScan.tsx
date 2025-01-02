import { useState } from "react";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";

import { WebPlugin } from "@capacitor/core";

const useScan = () => {
  const [scanResult, setScanResult] = useState<any>();

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

  return {
    scanQRCode,
    scanResult,
  };
};

export default useScan;
