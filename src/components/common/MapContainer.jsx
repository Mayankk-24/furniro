import { Skeleton } from "@heroui/react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 40.744402,
  lng: -73.987949,
};

// ✅ Define `libraries` outside the component to prevent re-renders
const libraries = ["marker"];

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCc-wUS9TfxeGGJJFsDUGFDgLasWfWE3Ho",
    libraries, // ✅ Uses the constant, preventing unnecessary re-renders
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (isLoaded && mapRef.current && !markerRef.current) {
      const { AdvancedMarkerElement } = window.google.maps.marker;

      markerRef.current = new AdvancedMarkerElement({
        map: mapRef.current,
        position: center,
      });
    }
  }, [isLoaded]);

  if (!isLoaded) return <div className="w-full h-[600px]">
    <Skeleton className="w-full h-full"/>
  </div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => (mapRef.current = map)}
    />
  );
}

export default MapContainer;
