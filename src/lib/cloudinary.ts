import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return false;
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return true;
}

export async function uploadToCloudinary(
  file: string,
  folder = "rasul-dev/receipts"
): Promise<string | null> {
  if (!configureCloudinary()) return null;
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    return result.secure_url;
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
    return null;
  }
}

export function isCloudinaryEnabled() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
