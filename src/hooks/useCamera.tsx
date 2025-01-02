import { useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";

const useCamera = () => {
  const checkPermissions = async () => {
    const permission = await Camera.checkPermissions();
    return permission.camera === "granted";
  };

  const requestPermissions = async () => {
    await Camera.requestPermissions();
  };

  return { checkPermissions, requestPermissions };
};

export default useCamera;
