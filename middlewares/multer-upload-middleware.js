import multer from "multer";
import ApiError from "../utils/api-error.js";

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Accept Image Only!!!", 400), false);
    }
  };

  return multer({
    storage: multerStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: multerFilter,
  });
};

export const uploadSingleImage = (fieldName) =>
  multerOptions().single(fieldName);

export const uploadImages = (fieldName, maxCount) =>
  multerOptions().fields([{ name: fieldName, maxCount }]);

export const uploadMixOfImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);
