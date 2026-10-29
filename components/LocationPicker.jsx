"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Fix default marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);

  return null;
}

function MapClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(event) {
      onSelectLocation([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

export default function LocationPicker({ onLocationChange }) {
  const [position, setPosition] = useState([26.4499, 80.3319]);
  const [message, setMessage] = useState("");

  function selectLocation(newPosition) {
    setPosition(newPosition);
    setMessage("Fetching address for the selected location...");

    Promise.resolve(
      onLocationChange?.({
        latitude: newPosition[0],
        longitude: newPosition[1],
      })
    )
      .then((addressFound) => {
        setMessage(
          addressFound
            ? "Location selected and address filled in."
            : "Location selected, but the address could not be found."
        );
      })
      .catch(() => {
        setMessage("Location selected, but the address could not be found.");
      });
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location.");
      return;
    }

    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = [
          location.coords.latitude,
          location.coords.longitude,
        ];

        selectLocation(newPosition);
      },
      (error) => {
        if (error.code === 1) {
          setMessage("Permission denied. Browser settings mein location allow karo.");
        } else if (error.code === 2) {
          setMessage("Position unavailable. Device location detect nahi ho rahi.");
        } else if (error.code === 3) {
          setMessage("Request timed out. Dobara try karo.");
        } else {
          setMessage("Unknown location error.");
        }
      }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Select Your Location</h2>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Use My Current Location
        </button>
      </div>

      {message && <p className="text-sm">{message}</p>}

      <div className="overflow-hidden rounded-lg border">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom
          style={{ height: "350px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater position={position} />
          <MapClickHandler onSelectLocation={selectLocation} />

          <Marker position={position} icon={markerIcon}>
            <Popup>Selected location</Popup>
          </Marker>
        </MapContainer>
      </div>

      <p className="text-sm text-gray-500">
        Map par click karke location select karein.
      </p>

      <p className="text-sm text-gray-500">
        Latitude: {position[0].toFixed(6)} | Longitude:{" "}
        {position[1].toFixed(6)}
      </p>
    </div>
  );
}