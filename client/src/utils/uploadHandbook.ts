import type { AxiosInstance } from "axios";

const MAX_HANDBOOK_BYTES = 20 * 1024 * 1024; // 20 MB

export const validateHandbookFile = (file: File): string | null => {
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "Please upload a valid PDF document (.pdf).";
  }
  if (file.size > MAX_HANDBOOK_BYTES) {
    return "Handbook PDF must be 20 MB or smaller.";
  }
  return null;
};

export const uploadHandbookToS3 = async (
  backend: AxiosInstance,
  file: File,
  firebaseUid: string,
): Promise<string> => {
  const validationError = validateHandbookFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const uploadUrlResp = await backend.get("/users/handbook/upload-url", {
    params: { contentType: "application/pdf", firebaseUid },
  });

  const { uploadUrl, key } = uploadUrlResp.data as {
    uploadUrl?: string;
    key?: string;
  };

  if (!uploadUrl || !key) {
    throw new Error("Failed to prepare handbook upload.");
  }

  const s3Resp = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": "application/pdf" },
  });

  if (!s3Resp.ok) {
    throw new Error("Failed to upload handbook document to S3.");
  }

  return key;
};

