import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React, { useState } from "react";
import {
  Scanner,
  IScannerClassNames,
  IDetectedBarcode,
  TrackFunction,
} from "@yudiel/react-qr-scanner";
import "./ScanPage.css";
import { useHistory } from "react-router";

const ScanPage: React.FC = () => {
  const history = useHistory();
  const [scanValues, setScanValues] = useState<IDetectedBarcode[]>();

  const handeScan = (result: IDetectedBarcode[]) => {
    setScanValues(result);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="relative border-2 w-full h-full overflow-hidden">
          <div
            className=" absolute top-4 left-4 z-50"
            onClick={() => history.push("/tab3")}
          >
            back
          </div>

          <Scanner
            classNames={{
              container: "box",
              video: "video-box",
            }}
            styles={{
              finderBorder: 0.2,
            }}
            onScan={handeScan}
            scanDelay={1000}
            components={{
              // tracker: TrackFunction,
              audio: false,
              onOff: false,
              torch: false,
              zoom: true,
              finder: false,
            }}
          >
            <div className="flex flex-col gap-2">
              {scanValues?.map((scan, index) => (
                <h1 className="text-red-500" key={index}>
                  {JSON.stringify(scan?.rawValue)}
                </h1>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="border-2 border-gray-600 w-[240px] h-[240px]" />
            </div>
          </Scanner>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ScanPage;
