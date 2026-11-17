import "server-only";
import {
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import storj from "@/lib/storj";

export async function uploadProfilePhoto(file, userId) {
  const key = `profile-images/${userId}/${randomUUID()}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await storj.send(
    new PutObjectCommand({
      Bucket: process.env.STORJ_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const imageUrl = await getSignedUrl(
    storj,
    new GetObjectCommand({
      Bucket: process.env.STORJ_BUCKET,
      Key: key,
    }),
    { expiresIn: 3600 }
  );

  return { key, imageUrl };
}

export async function getProfilePhoto(imageKey) {
  try {
    await storj.send(
      new HeadObjectCommand({
        Bucket: process.env.STORJ_BUCKET,
        Key: imageKey,
      })
    );
  } catch (error) {
    if (
      error.name === "NoSuchKey" ||
      error.name === "NotFound" ||
      error.$metadata?.httpStatusCode === 404
    ) {
      return null;
    }

    throw error;
  }

  return getSignedUrl(
    storj,
    new GetObjectCommand({
      Bucket: process.env.STORJ_BUCKET,
      Key: imageKey,
    }),
    { expiresIn: 3600 }
  );
}