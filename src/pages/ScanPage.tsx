import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import "./ScanPage.css";
import { useHistory } from "react-router";
import ScanBox from "../components/ScanBox";

const ScanPage: React.FC = () => {
  const history = useHistory();
  const [scanValues, setScanValues] = useState<any>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      setScanValues(decodedText);
    };

    const onScanFailure = () => {};

    const init = async () => {};

    init();

    return () => setPaused(true);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="relative border-2 w-screen h-screen overflow-hidden">
          <div
            className=" absolute top-4 left-4 z-50 text-gray-100 text-xl font-medium"
            onClick={() => {
              history.push("/tab3");
              setPaused(true);
            }}
          >
            BACK
          </div>

          {/* <video ref={ref} className="w-full h-full object-cover" /> */}

          {/* <div className="flex justify-center items-center w-[300px] h-[300px]"> */}
          <ScanBox />
          {/* </div> */}

          {/* <div className=" absolute top-[80%] left-1/2 -translate-x-1/2  text-white text-xl font-medium">
            {scanValues && JSON.stringify(scanValues)}
          </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ScanPage;
