import { HeadBucketCommand } from "@aws-sdk/client-s3";
import storj from "@/lib/storj";

export async function GET() {
  try {
    await storj.send(
      new HeadBucketCommand({
        Bucket: process.env.STORJ_BUCKET,
      })
    );

    return Response.json({
      success: true,
      message: "Storj bucket connected successfully!",
    });
  } catch (error) {
    console.error("Storj Error:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}