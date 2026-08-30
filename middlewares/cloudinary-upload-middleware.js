import asyncHandler from "express-async-handler";

import {
  uploadImage,
  uploadImages,
} from "../services/storage/cloudinary/cloudinary-storage.js";

/**
 * Uploads a single file (from `req.file` or `req.files[fieldName][0]`) to
 * Cloudinary and sets `req.body[fieldName] = { url, publicId }`.
 * If no file was sent, calls next() without touching req.body — this keeps
 * the field untouched on update requests where the image isn't replaced.
 */
export const uploadSingleImageToCloudinary = (folder, fieldName) =>
  asyncHandler(async (req, res, next) => {
    const file = req.file || (req.files && req.files[fieldName]?.[0]);
    if (!file) return next();

    const { url, publicId } = await uploadImage(file.buffer, {
      folder,
    });

    req.body[fieldName] = { url, publicId };

    next();
  });

/**
 * Uploads every file under `req.files[fieldName]` to Cloudinary in
 * parallel and sets `req.body[fieldName]` to an array of { url, publicId }.
 */
export const uploadImagesToCloudinary = (folder, fieldName) =>
  asyncHandler(async (req, res, next) => {
    const files = req.files ? req.files[fieldName] : null;
    if (!files) return next();

    const uploaded = await uploadImages(
      files.map((file) => file.buffer),
      { folder },
    );

    req.body[fieldName] = uploaded.map(({ url, publicId }) => ({
      url,
      publicId,
    }));

    next();
  });
