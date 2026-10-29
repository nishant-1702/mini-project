# Map se input fields mein address kyu nahi aa raha tha?

## Pehle dikkat kya thi?

Map aur profile form ke beech data ka connection complete nahi tha. Map apni location ko sirf `LocationPicker` component ke local state mein rakhta tha. Profile page ko coordinates milte hi nahi the, isliye address lookup aur form update nahi ho pate the.

Iske alawa:

1. **Map click par selection ka handler nahi tha.** Map par click karne se marker/location update nahi hoti thi.
2. **Current location sirf map ke andar update hoti thi.** Browser se latitude/longitude milne par `position` badalta tha, lekin parent profile page ko koi callback nahi jaata tha.
3. **Callback ke naam alag the.** Profile page `onAddressChange` pass kar raha tha, jabki map component us prop ko leta ya call nahi karta tha.
4. **Address lookup function chal hi nahi raha tha.** `fetchAddress(lat, lon)` likha hua tha, lekin usse call karne wala flow nahi tha. Coordinates ke bina Nominatim reverse-geocoding request nahi ho sakti.
5. **Kuch inputs form state se connected nahi the.** Address field mein `value` nahi tha; state aur postal-code fields bhi state mein update nahi karte the. City field ka fallback `"csc"` tha aur uska `onChange` bhi nahi tha.
6. **Error handling mein ek undefined function tha.** Address lookup fail hone par `setMessage(...)` call hota, lekin profile page mein `setMessage` defined nahi tha.

## Ab flow kaise kaam karta hai?

1. User **map par click** karta hai ya **Use My Current Location** button dabata hai.
2. `LocationPicker` selected latitude/longitude se apna marker update karta hai aur `onLocationChange` ke zariye coordinates profile page ko deta hai.
3. Profile page ka `fetchAddress` coordinates ke saath OpenStreetMap Nominatim reverse-geocoding API call karta hai.
4. Response ke address fields React `address` state mein set hote hain.
5. Address, country, state, city aur postal-code inputs isi state se `value` lete hain. Isliye lookup result fields mein dikhai deta hai; user unhe manually edit bhi kar sakta hai.
6. Lookup ke dauran loading message aur failure par error message dikhaya jata hai.

## Kaun si files mein fix hai?

- [`components/LocationPicker.jsx`](./components/LocationPicker.jsx): map click handling, marker/location update aur coordinates parent ko bhejna.
- [`app/profile/page.jsx`](./app/profile/page.jsx): reverse-geocoding, address state aur controlled form inputs.
- [`components/LocationPickerLoader.jsx`](./components/LocationPickerLoader.jsx): dynamic map loader; yeh props ko map component tak forward karta hai.

## Dhyan dene wali baatein

- **Use My Current Location** ke liye browser location permission deni hogi. Geolocation aam taur par HTTPS ya localhost par hi kaam karta hai.
- Address lookup ke liye internet connection aur Nominatim service response zaroori hai. Kuch jagahon par API har field (jaise postal code ya city) nahi de sakti; aise fields khaali reh sakte hain.
- **Save Changes** button abhi form data ko backend/profile mein persist nahi karta. Yeh fix map se fields populate aur manually edit karne ka hai, save functionality ka nahi.
