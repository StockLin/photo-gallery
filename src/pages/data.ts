import { Marker } from "@capacitor/google-maps";

enum MarkerIdEnum {
  mk01 = 'mk01',
  mk02 = 'mk02',
  mk03 = 'mk03',
  mk04 = 'mk04',
  mk05 = 'mk05',
}

export interface CustomMarker extends Marker {
  id: string;
  mapId?: string;
}

export const mockMarkers: CustomMarker[] = [
  {
    id: MarkerIdEnum.mk01,
    title: "板橋大樓020",
    coordinate: { lat: 24.998398339336507, lng: 121.45810035296773 },
    snippet: "新北市板橋區ooo路20號",
    opacity: 0.8
    // iconUrl: "icons8-location-24.png",
  },
  {
    id: MarkerIdEnum.mk02,
    title: "板橋大樓030",
    coordinate: { lat: 24.99731629303063, lng: 121.45627771928024 },
    snippet: "新北市板橋區ooo路30號",
    opacity: 0.8
    // iconUrl: "icons8-location-24.png",
  },
  {
    id: MarkerIdEnum.mk03,
    title: "板橋大樓040",
    coordinate: { lat: 24.996567360558455, lng: 121.45564898138564 },
    snippet: "新北市板橋區ooo路40號",
    opacity: 0.8
    // iconUrl: "icons8-location-24.png",
  },
  {
    id: MarkerIdEnum.mk04,
    title: "板橋大樓050",
    coordinate: { lat: 24.996335442434326, lng: 121.45718145352797 },
    snippet: "新北市板橋區ooo路50號",
    opacity: 0.8
    // iconUrl: "icons8-location-24.png",
  },
  {
    id: MarkerIdEnum.mk05,
    title: "板橋大樓060",
    coordinate: { lat: 24.995797439355073, lng: 121.45687245538466 },
    snippet: "新北市板橋區ooo路60號",
    opacity: 0.8
    // iconUrl: "icons8-location-24.png",
  },
];

export const apiLoadMarkers = async (): Promise<CustomMarker[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMarkers);
    }, 1000);
  });
};

export interface MarkerDetail {
  counts: number;
  returnCounts: number
}

export const apiLoadMarkerById = async (id: string): Promise<MarkerDetail> => {
  switch (id) {
    case MarkerIdEnum.mk01:
      return { counts: 10, returnCounts: 10 }

    case MarkerIdEnum.mk02:
      return { counts: 5, returnCounts: 15 }

    case MarkerIdEnum.mk03:
      return { counts: 12, returnCounts: 8 }

    case MarkerIdEnum.mk04:
      return { counts: 3, returnCounts: 17 }

    case MarkerIdEnum.mk05:
      return { counts: 16, returnCounts: 4 }

    default:
      return { counts: 0, returnCounts: 0 }
  }
}