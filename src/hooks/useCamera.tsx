import { useState } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

const useCamera = () => {
  const checkPermissions = async () => {
    const permission = await Camera.checkPermissions();

    console.log("camer permission", permission);

    return permission.camera === "granted";
  };

  const requestPermissions = async () => {
    await Camera.requestPermissions();
  };

  const checkAndRequestCameraPermissions = async () => {
    try {
      // Check if running on native platform or web
      const isNativePlatform = Capacitor.isNativePlatform();

      if (isNativePlatform) {
        // For native platforms (iOS/Android)
        const permissionStatus = await Camera.checkPermissions();

        if (permissionStatus.camera !== "granted") {
          const request = await Camera.requestPermissions();
          return request.camera === "granted";
        }

        return true;
      } else {
        // For web platform
        if (
          "mediaDevices" in navigator &&
          "getUserMedia" in navigator.mediaDevices
        ) {
          try {
            // Request camera access using web API
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });

            // Stop the stream immediately after getting permission
            stream.getTracks().forEach((track) => track.stop());

            return true;
          } catch (error) {
            console.error("Web camera permission error:", error);
            return false;
          }
        } else {
          console.error("Camera API is not supported in this browser");
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking camera permissions:", error);
      return false;
    }
  };

  return {
    checkPermissions,
    requestPermissions,
    checkAndRequestCameraPermissions,
  };
};

export default useCamera;
