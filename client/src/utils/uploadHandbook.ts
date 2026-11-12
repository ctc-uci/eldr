import type { AxiosInstance } from "axios";

const MAX_HANDBOOK_BYTES = 20 * 1024 * 1024; // 20 MB

export const validateHandbookFile = (file: File): string | null => {
  const isPdfMime = file.type === "application/pdf";
  const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime || !isPdfExt) {
    return "Please upload a valid PDF document (.pdf).";
  }
  if (file.size > MAX_HANDBOOK_BYTES) {
    return "Handbook PDF must be 20 MB or smaller.";
  }
  if (file.size === 0) {
    return "Uploaded file cannot be empty.";
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

  // Verify %PDF magic header bytes (0x25, 0x50, 0x44, 0x46)
  try {
    const headerBuffer = await file.slice(0, 5).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);
    const isMagicPdf =
      headerBytes[0] === 0x25 &&
      headerBytes[1] === 0x50 &&
      headerBytes[2] === 0x44 &&
      headerBytes[3] === 0x46;

    if (!isMagicPdf) {
      throw new Error("Please upload a genuine PDF document (corrupt or invalid header).");
    }
  } catch (headerErr) {
    if (headerErr instanceof Error && headerErr.message.includes("genuine PDF")) {
      throw headerErr;
    }
  }

  let uploadUrlResp;
  try {
    uploadUrlResp = await backend.get("/users/handbook/upload-url", {
      params: { contentType: "application/pdf", firebaseUid },
    });
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
    const serverMessage = axiosErr?.response?.data?.message || axiosErr?.message;
    throw new Error(serverMessage || "Failed to prepare handbook upload.");
  }

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

