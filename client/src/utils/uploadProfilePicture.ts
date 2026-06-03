import type { AxiosInstance } from "axios";

const MAX_PROFILE_PICTURE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const validateProfilePictureFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Please choose a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_PROFILE_PICTURE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
};

export const uploadProfilePictureToS3 = async (
  backend: AxiosInstance,
  file: File,
  firebaseUid: string,
  user_type: string,
): Promise<string> => {
  const validationError = validateProfilePictureFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const contentType = file.type;

  const uploadUrlResp = await backend.get("/users/profile-picture/upload-url", {
    params: { contentType, firebaseUid, user_type },
  });

  const { uploadUrl, profilePictureUrl } = uploadUrlResp.data as {
    uploadUrl?: string;
    profilePictureUrl?: string;
  };

  if (!uploadUrl || !profilePictureUrl) {
    throw new Error("Failed to prepare profile picture upload.");
  }

  const s3Resp = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });

  if (!s3Resp.ok) {
    throw new Error("Failed to upload profile picture.");
  }

  return profilePictureUrl;
};
