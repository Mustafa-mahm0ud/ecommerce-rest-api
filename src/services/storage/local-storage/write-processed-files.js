import fs from "fs/promises";
import path from "path";

import ApiError from "../../../utils/api-error.js";

const writeProcessedFiles = async (files) => {
  try {
    if (!files || files.length === 0) return;

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join("uploads", file.folderName, file.imageName);
        return fs.writeFile(filePath, file.buffer);
      }),
    );
  } catch (err) {
    console.error("Writing image error");

    throw new ApiError(
      "An error occurred while typing the image. Please try again later",
      500,
    );
  }
};

export default writeProcessedFiles;
