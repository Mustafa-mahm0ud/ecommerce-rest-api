import { Readable } from "node:stream";
import cloudinary from "../../../config/cloudinary.js";

const DEFAULT_TRANSFORMATION = {
  width: 1200,
  height: 1200,
  crop: "limit",
  quality: "auto",
  fetch_format: "auto",
};

const streamUpload = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadImage = async (
  buffer,
  { folder, publicId, transformation = DEFAULT_TRANSFORMATION } = {},
) => {
  const result = await streamUpload(buffer, {
    folder,
    public_id: publicId,
    resource_type: "image",
    transformation,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
};

export const uploadImages = (buffers, { folder, transformation } = {}) =>
  Promise.all(
    buffers.map((buffer) => uploadImage(buffer, { folder, transformation })),
  );

export const deleteCloudinaryImage = (publicId) =>
  cloudinary.uploader.destroy(publicId, { resource_type: "image" });

export const deleteCloudinaryImages = async (publicIds) => {
  if (!publicIds?.length) return;

  const CHUNK_SIZE = 100;
  const chunks = Array.from(
    { length: Math.ceil(publicIds.length / CHUNK_SIZE) },
    (_, index) => publicIds.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
  );

  await Promise.all(
    chunks.map((chunk) =>
      cloudinary.api.delete_resources(chunk, { resource_type: "image" }),
    ),
  );
};
