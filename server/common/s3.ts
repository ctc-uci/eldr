import aws from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

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

const ALLOWED_IMAGE_TYPES = new Set([
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

const assertS3Configured = () => {
  if (!bucket || !region) {
    throw new Error("S3 is not configured");
  }
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3 credentials are not configured");
  }
};

/**
 * Generates presigned PUT URL for profile pictures.
 * Follows structure: profiles/<role>/<firebaseUid>/pfp.<extension>
 */
const getProfilePictureUploadURL = async (
  contentType: string,
  firebaseUid: string,
  role: string = "volunteer",
) => {
  const normalizedType = contentType.trim().toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(normalizedType)) {
    throw new Error("Unsupported image type");
  }

  assertS3Configured();

  const isStaffOrAdmin =
    role.toLowerCase().includes("admin") ||
    role.toLowerCase().includes("supervisor") ||
    role.toLowerCase().includes("staff");
  const targetFolder = isStaffOrAdmin ? "admin" : "volunteer";

  const extension = extensionForContentType(normalizedType);
  const key = `profiles/${targetFolder}/${firebaseUid}/pfp.${extension}`;

  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: bucket,
    Key: key,
    Expires: 60,
    ContentType: normalizedType,
  });

  return { uploadUrl, key };
};

/**
 * Generates presigned PUT URL for volunteer handbook PDF packets.
 * Follows structure: handbooks/<firebaseUid>/handbook_<timestamp>.pdf
 */
const getHandbookUploadURL = async (
  contentType: string = "application/pdf",
  firebaseUid: string,
) => {
  const normalizedType = contentType.trim().toLowerCase();
  if (normalizedType !== "application/pdf") {
    throw new Error("Handbook must be a PDF document");
  }

  assertS3Configured();

  const timestamp = Date.now();
  const key = `handbooks/${firebaseUid}/handbook_${timestamp}.pdf`;

  const uploadUrl = s3.getSignedUrl("putObject", {
    Bucket: bucket,
    Key: key,
    Expires: 300, // 5 minutes for document uploads
    ContentType: "application/pdf",
  });

  return { uploadUrl, key };
};

/**
 * Generates presigned GET URL for viewing or downloading any S3 object.
 */
const getS3ViewURL = async (key: string, expiresInSeconds: number = 3600) => {
  assertS3Configured();

  const viewUrl = s3.getSignedUrl("getObject", {
    Bucket: bucket,
    Key: key,
    Expires: expiresInSeconds,
  });

  return viewUrl;
};

const getProfilePictureGetURL = async (key: string) => {
  return getS3ViewURL(key, 3600);
};

const getHandbookGetURL = async (key: string) => {
  return getS3ViewURL(key, 3600);
};

export {
  s3,
  getProfilePictureUploadURL,
  getProfilePictureGetURL,
  getHandbookUploadURL,
  getHandbookGetURL,
  getS3ViewURL,
};
