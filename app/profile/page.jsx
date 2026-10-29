"use client"
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import LocationPickerLoader from "@/components/LocationPickerLoader";

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



export default function ProfilePage() {
 const {isLoaded, isSignedIn, user} = useUser();
 const [address, setAddress] = useState({
  fullAddress: "",
  houseNumber: "",
  street: "",
  locality: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  latitude: null,
  longitude: null,
});
   const [loadingAddress, setLoadingAddress] = useState(false);
   const [addressMessage, setAddressMessage] = useState("");
  const [date, setDate] = useState();

   if(!isLoaded) return <div>Loading...</div>;
   if(!isSignedIn) return <div>Please sign in to view your profile.</div>;

   

 async function fetchAddress(lat, lon) {
  setLoadingAddress(true);
  setAddressMessage("");

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error("Address fetch failed");
    }

    const data = await response.json();

    setAddress({
      fullAddress: data.display_name || "",
      houseNumber: data.address?.house_number || "",
      street: data.address?.road || "",
      locality:
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.village ||
        "",
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "",
      state: data.address?.state || "",
      country: data.address?.country || "",
      postalCode: data.address?.postcode || "",
      latitude: lat,
      longitude: lon,
    });
    return true;
  } catch (error) {
    console.error(error);
    setAddressMessage("Address fetch nahi ho paya. Dobara try karo.");
    return false;
  } finally {
    setLoadingAddress(false);
  }
}

function updateAddress(field, value) {
  setAddress((previous) => ({
    ...previous,
    [field]: value,
  }));
}
   

    return (
    <main className="min-h-screen pt-32 -mt-16 bg-[#09090b] text-white">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#09090b]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Cine<span className="text-purple-400">Meet</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Dashboard
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-400">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-gray-400">
            Manage your personal information and account preferences.
          </p>
        </div>

        <div className=" gap-8 ">
          {/* Sidebar */}
          

          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Picture Card */}
            <section className="rounded-2xl border border-white/10 bg-[#111113] p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Profile Picture</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Personalize your CineMeet account.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10 text-3xl font-bold text-purple-300">
                  U
                </div>

                <div>
                  <p className="font-medium">Your profile photo</p>
                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or WEBP. You can change it anytime.
                  </p>

                  <button
                    type="button"
                    className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/5"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </section>

            {/* Personal Information Card */}
            <section className="rounded-2xl border border-white/10 bg-[#111113] p-6 sm:p-8">
              <div className="mb-7">
                <h2 className="text-lg font-semibold">
                  Personal Information
                </h2>

              
              </div>

              <form className="space-y-6">
                {/* Clerk Fields: UI placeholders for now */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Your name from Clerk"
                      readOnly
                      value={user.fullName}
                      className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-gray-400 outline-none"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Managed by your account settings.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Your email from Clerk"
                      readOnly
                      value={user.primaryEmailAddress?.emailAddress}
                      className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-sm text-gray-400 outline-none"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Managed by your account settings.
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm mt-2 font-medium text-gray-300"> Date of Birth </Label>
                  <Popover>
      <PopoverTrigger render={<Button variant={"outline"} data-empty={!date} className="w-[212px] justify-between text-left bg-black font-normal data-[empty=true]:text-muted-foreground">{date ? format(date, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
                  </div>

                {/* Add remaining profile fields here */}
                <div className="border-t border-white/10 pt-6">
                  

                  <Label> Address </Label>
                <Input
                  placeholder="Enter Your address here"
                  type="text"
                  value={address.fullAddress}
                  onChange={(e) => updateAddress("fullAddress", e.target.value)}
                  className="w-full rounded-md border h-11 mt-2 border-white/10 bg-[#09090b] py-2 px-5 outline-none"
                />
                  
                  
<Label className="text-sm mt-2 font-medium text-gray-300"> Country </Label>
<Input
placeholder="Enter your Country here"
type="text"
value={address.country}
onChange={(e) => updateAddress("country", e.target.value)}
className="w-full rounded-md border h-11 mt-2 border-white/10 bg-[#09090b] py-2 px-5 outline-none"
/>

<Label className="text-sm mt-3 font-medium text-gray-300"> State </Label>
                  <Input
                    placeholder="Enter Your State here"
                    type="text"
                    value={address.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                    className="w-full rounded-md border h-11 mt-2 border-white/10 bg-[#09090b] py-2 px-5 outline-none"
                  />

<Label className="text-sm mt-3 font-medium text-gray-300"> City </Label>
                  <Input
                    placeholder="Enter Your City here"
                    type="text"
                    value={address.city}
                    onChange={(e) => updateAddress("city", e.target.value)}
                    className="w-full rounded-md border h-11 mt-2 border-white/10 bg-[#09090b] py-2 px-5 outline-none"
                  />
<Label className="text-sm mt-3 font-medium text-gray-300"> Zip/Postal Code </Label>
                  <Input
                    placeholder="Enter your PIN code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={address.postalCode}
                    onChange={(e) =>
                      updateAddress(
                        "postalCode",
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className="w-full rounded-md border h-11 mt-2 border-white/10 bg-[#09090b] py-2 px-5 outline-none"
                  />

 {/* Location Picker */}
<LocationPickerLoader
  onLocationChange={({ latitude, longitude }) =>
    fetchAddress(latitude, longitude)
  }
/>
{loadingAddress && (
  <p className="mt-2 text-sm text-gray-400">Address load ho raha hai...</p>
)}
{addressMessage && (
  <p role="alert" className="mt-2 text-sm text-red-400">
    {addressMessage}
  </p>
)}

                {/* TODO: Add address, Google Maps autocomplete and location */}
                </div>

                {/* Save Button */}
                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-medium transition hover:bg-white/5"
                  >
                    Cancel
                  </Link>

                  <button
                    type="button"
                    className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold transition hover:bg-purple-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Download Profile Card */}
            <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111113] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="font-semibold">Download Your Profile</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Export your profile information for your records.
                </p>
              </div>

              <button
                type="button"
                className="shrink-0 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/5"
              >
                ↓ Download Profile
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}