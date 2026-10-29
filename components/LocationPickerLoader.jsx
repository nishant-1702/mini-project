"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPicker"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function LocationPickerLoader(props) {
  return <LocationPicker {...props} />;
}
