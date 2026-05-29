import crypto from "crypto";

import aws from "aws-sdk";

const isDevelopment = process.env.NODE_ENV?.toLowerCase() === "development";

const region = isDevelopment
  ? process.env.DEV_S3_REGION ?? process.env.AWS_REGION
  : process.env.PROD_S3_REGION ?? process.env.AWS_REGION;

const accessKeyId = isDevelopment
  ? process.env.DEV_S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID
  : process.env.PROD_S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;

const secretAccessKey = isDevelopment
  ? process.env.DEV_S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY
  : process.env.PROD_S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;

const bucket = process.env.S3_BUCKET_NAME ?? process.env.AWS_BUCKET_NAME;

// initialize a S3 instance
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extensionForContentType = (contentType: string) => {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
};

const getProfilePictureUploadURL = async (
  contentType: string,
  firebaseUid: string,
) => {
  const normalizedType = contentType.trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(normalizedType)) {
    throw new Error("Unsupported image type");
  }

  if (!bucket || !region) {
    throw new Error("S3 is not configured");
  }

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3 credentials are not configured");
  }

  const extension = extensionForContentType(normalizedType);
  const key = `profile-pictures/${firebaseUid}/${crypto.randomBytes(16).toString("hex")}.${extension}`;

  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: bucket,
    Key: key,
    Expires: 60,
    ContentType: normalizedType,
  });

  const profilePictureUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, profilePictureUrl, key };
};

export { s3, getProfilePictureUploadURL };
