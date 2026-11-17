import { S3Client } from "@aws-sdk/client-s3";

const storj = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT_URL,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

export default storj;