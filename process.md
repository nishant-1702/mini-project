# Storj profile image flow

## Goal

The profile picture should use the user's uploaded Storj image after a reload.
If the user has not uploaded a Storj image, or the stored Storj object no longer
exists, the profile should use the image supplied by Clerk (for example, the
Google account photo).

## How it works

1. The profile page gets the signed-in Clerk user's `imageUrl` and passes it to
   `ProfilePhotoUpload` as the fallback image.
2. When the component mounts, it requests `GET /api/profile/upload`.
   It shows a checking indicator while this request is in progress.
3. The server authenticates the request and reads `profileImageKey` from the
   signed-in user's PostgreSQL `User` row. It does not trust a user ID supplied
   by the browser.
4. If there is no saved key, the API responds with `404`. The component then
   displays the Clerk image.
5. If there is a key, the server checks that the object exists in Storj and
   creates a new signed read URL, valid for one hour. The component displays
   that URL. A fresh URL is requested after each page reload so an expired
   signed URL is not stored in the database.
6. If the object is missing, the server clears the stale key and responds with
   `404`; the Clerk image remains visible. If an image URL fails in the browser,
   the component also switches back to Clerk's image.
7. When the user uploads a photo, `POST /api/profile/upload` validates the
   image, writes it to Storj under a user-specific object key, and saves that
   key in `User.profileImageKey`. The API returns a signed URL for immediate
   display. The object key, not the expiring URL, is persisted.

## Why these changes were made

- **Persist the key instead of the signed URL:** signed URLs expire, whereas
  the object key can be used to mint a new signed URL for each page load.
- **Keep Storj and Clerk data separate:** `imageUrl` remains the Clerk image
  used as a fallback; `profileImageKey` points to the user's Storj upload.
- **Resolve the image server-side:** Storj credentials stay on the server, and
  the caller can only read the image associated with their authenticated
  Clerk account.
- **Check object existence:** signing a URL alone does not prove that the
  object is still present. A missing object is treated as no Storj photo, so
  the profile falls back cleanly.

## Files changed

- `components/profile/ProfilePhotoUpload.jsx` loads the Storj URL on mount,
  uses Clerk's image as its fallback, and displays the newly uploaded image.
- `app/api/profile/upload/route.js` authenticates upload and read requests,
  stores the key after upload, and returns a fresh read URL on reload.
- `lib/uploadToStorj.js` uploads photos and checks/signs existing Storj objects.
- `prisma/schema.prisma` adds the separate `profileImageKey` field.
- `prisma/migrations/20261117114000_add_profile_image_key/migration.sql`
  adds that field to the existing PostgreSQL `User` table.

## Setup and verification

1. Configure the server environment with `DATABASE_URL`,
   `STORJ_ENDPOINT_URL`, `STORJ_ACCESS_KEY`, `STORJ_SECRET_KEY`, and
   `STORJ_BUCKET`. Keep Storj credentials out of client-side code.
2. Apply the database migration with `npx prisma migrate deploy` (or use
   `npx prisma migrate dev` during local development).
3. Regenerate Prisma Client with `npx prisma generate` if your setup does not
   run generation automatically after migrations.
4. Sign in, open the profile page, and upload a JPG, PNG, or WEBP image under
   5 MB.
5. Reload the page. The image should load from Storj; the database should hold
   the object's key in `User.profileImageKey`, not the signed URL.
6. For a user without a Storj upload, or with a deleted Storj object, verify
   that the Clerk image is displayed instead.
