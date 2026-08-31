import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImageFile = async (folderName, imageName) => {
  if (!imageName) return;

  const fullPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "uploads",
    folderName,
    imageName,
  );

  try {
    await fs.unlink(fullPath);
    console.log(
      `[File System] Removed Image Successfully: ${imageName}`.yellow,
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(
        `[File System] Image already missing, skipping: ${imageName}`.yellow,
      );
      return;
    }

    console.error(`[File System] Remove Image Failed: ${err.message}`.red);
  }
};

// `fire-and-forget` - There's no await here intentionally

export const deleteOldSingleImage = (oldValue, newValue, folderName) => {
  if (!oldValue || !newValue) return;
  if (oldValue === newValue) return;

  deleteImageFile(folderName, oldValue);
};

export const deleteImagesFiles = (folderName, images) => {
  images.forEach((img) => {
    deleteImageFile(folderName, img);
  });
};
