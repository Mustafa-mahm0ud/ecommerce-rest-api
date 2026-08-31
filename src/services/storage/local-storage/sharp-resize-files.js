import "colors";
import sharp from "sharp";
import { randomUUID } from "crypto";

const DEFAULT_RESIZE_OPTIONS = {
  width: 1200,
  height: 1200,
  format: "jpeg",
  quality: 95,
};

export const resizeSingleImage = async (
  bufferToResize,
  folderName,
  resizeOptions = DEFAULT_RESIZE_OPTIONS,
) => {
  const { width, height, format, quality } = resizeOptions;

  const imageName = `${Date.now()}-${randomUUID()}.${format}`;

  const buffer = await sharp(bufferToResize)
    .resize(width, height)
    .toFormat(format, { quality })
    .toBuffer();

  const processedImage = { buffer, imageName, folderName };

  return { processedImage, imageName };
};

export const resizeImages = async (
  files,
  folderName,
  resizeOptions = DEFAULT_RESIZE_OPTIONS,
) => {
  const imagesNames = [];
  const processedImages = [];

  const { width, height, format, quality } = resizeOptions;

  Promise.all(
    files.map(async (img) => {
      const imageName = `${Date.now()}-${randomUUID()}.${format}`;

      imagesNames.push(imageName);

      const buffer = await sharp(img.buffer)
        .resize(width, height)
        .toFormat(format, { quality })
        .toBuffer();

      processedImages.push({ buffer, imageName, folderName });
    }),
  );

  return { processedImages, imagesNames };
};
