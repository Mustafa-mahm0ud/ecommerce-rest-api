import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import * as deleteLocalFiles from "../services/storage/local-storage/delete-files.js";

export const getDocs = (service, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { docs, paginationResult } = await service.getDocs(
      req.sanitizedQuery,
      req.params,
      populateOptions,
    );

    res.status(200).json({
      status: "Success",
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });

export const getDoc = (service, populateOptions, getIdFromUser = false) =>
  asyncHandler(async (req, res, next) => {
    const id = getIdFromUser ? req.user._id : req.params.id;

    const doc = await service.getDoc(id, req.sanitizedQuery, populateOptions);

    res.status(200).json({ status: "Success", data: doc });
  });

export const create = (allowedFields, service) =>
  asyncHandler(async (req, res, next) => {
    const doc = await service.create(
      pickAllowedFields(allowedFields, req.body),
      req.processedImage,
      req.processedImages,
    );

    res.status(201).json({ status: "Success", data: doc });
  });

export const update = (
  allowedFields,
  service,
  imageField,
  folderName,
  getIdFromUser = false,
) =>
  asyncHandler(async (req, res, next) => {
    const id = getIdFromUser ? req.user._id : req.params.id;

    const oldDoc = imageField ? await service.getById(id, imageField) : null;

    const doc = await service.update(
      id,
      pickAllowedFields(allowedFields, req.body),
      req.processedImage,
    );

    res.status(200).json({ status: "Success", data: doc });

    if (!imageField || !folderName) return;

    res.on("finish", () => {
      const oldValue = oldDoc[imageField];
      const newValue = req.body[imageField];

      deleteLocalFiles.deleteOldSingleImage(oldValue, newValue, folderName);
    });
  });

export const del = (service, imageFields = null, folderName = null) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await service.del(id);

    res.status(204).send();

    if (!imageFields || !folderName) return;

    res.on("finish", () => {
      imageFields.forEach((field) => {
        const value = doc[field];

        if (Array.isArray(value))
          deleteLocalFiles.deleteImagesFiles(folderName, value);
        else {
          deleteLocalFiles.deleteImageFile(folderName, value);
        }
      });
    });
  });
