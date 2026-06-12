import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

const requiredCloudinaryEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

const assertCloudinaryConfigured = () => {
  const missing = requiredCloudinaryEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Cloudinary environment variables are missing: ${missing.join(", ")}`);
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadImageBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    try {
      assertCloudinaryConfigured();
    } catch (error) {
      reject(error);
      return;
    }

    const upload = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "surya-ban/products",
        public_id: options.public_id,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(upload);
  });

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return null;

  assertCloudinaryConfigured();
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image"
  });
};
