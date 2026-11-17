"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProfilePhotoUpload({ initialImageUrl = "" }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const uploadedRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadStorjPhoto() {
      try {
        const response = await fetch("/api/profile/upload");

        if (response.status === 404) {
          if (active && !uploadedRef.current) {
            setImageUrl(initialImageUrl);
          }
          return;
        }
        if (!response.ok) {
          throw new Error("Could not load the Storj profile photo");
        }

        const data = await response.json();

        if (active && !uploadedRef.current && data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Profile photo fetch error:", error);
        if (active && !uploadedRef.current) {
          setImageUrl(initialImageUrl);
          setMessage("Could not load the Storj photo. Showing your Clerk photo.");
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    loadStorjPhoto();

    return () => {
      active = false;
    };
  }, [initialImageUrl]);

  async function handleUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      uploadedRef.current = true;
      setImageUrl(data.imageUrl);
      setMessage("Profile photo uploaded successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="h-full w-full object-cover"
            unoptimized
            onError={() => {
              if (imageUrl !== initialImageUrl) {
                setImageUrl(initialImageUrl);
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            {checking ? "Checking..." : "No Photo"}
          </div>
        )}
      </div>

      <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white">
        {loading ? "Uploading..." : "Upload Photo"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
        />
      </label>

      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}