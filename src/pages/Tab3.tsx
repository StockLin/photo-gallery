import "./Tab3.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import CustomMap from "../components/CustomMap";

const API_KEY = import.meta.env.VITE_MAP_API_KEY ?? "";

const Tab3: React.FC = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <CustomMap />
    </APIProvider>
  );
};

export default Tab3;
