import asyncHandler from "express-async-handler";

import * as sharpResize from "../services/storage/local-storage/sharp-resize-files.js";

export const uploadSingleImageToLocalStorage = (
  fieldName,
  folderName,
  resizeOptions,
) =>
  asyncHandler(async (req, res, next) => {
    const file = req.file || req.files?.[fieldName]?.[0];
    if (!file) return next();

    const { processedImage, imageName } = await sharpResize.resizeSingleImage(
      file.buffer,
      folderName,
      resizeOptions,
    );

    req.body[fieldName] = imageName;
    req.processedImage = processedImage;

    next();
  });

export const uploadImagesToLocalStorage = (
  fieldName,
  folderName,
  resizeOptions,
) =>
  asyncHandler(async (req, res, next) => {
    const files = req.files?.[fieldName];
    if (!files) return next();

    const { processedImages, imagesNames } = await sharpResize.resizeImages(
      files,
      folderName,
      resizeOptions,
    );

    req.body[fieldName] = imagesNames;
    req.processedImages = processedImages;

    next();
  });
