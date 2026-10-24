import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import * as deleteLocalFiles from "../services/storage/local-storage/delete-files.js";

export const getDocs = ({ service, populateOptions }) =>
  asyncHandler(async (req, res, next) => {
    const { docs, paginationResult } = await service.getDocs({
      sanitizedQuery: req.sanitizedQuery,
      reqParams: req.params,
      populateOptions,
    });

    res.status(200).json({
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });

export const getDoc = ({ service, populateOptions, getIdFromUser = false }) =>
  asyncHandler(async (req, res, next) => {
    const id = getIdFromUser ? req.user._id : req.params.id;

    const doc = await service.getDoc({
      id,
      sanitizedQuery: req.sanitizedQuery,
      populateOptions,
    });

    res.status(200).json({ data: doc });
  });

export const create = ({ service, fieldsToCreate }) =>
  asyncHandler(async (req, res, next) => {
    const doc = await service.create({
      fieldsToCreate: pickAllowedFields(fieldsToCreate, req.body),
      processedImage: req.processedImage,
      processedImages: req.processedImages,
    });

    res.status(201).json({ data: doc });
  });

export const update = ({
  service,
  fieldsToUpdate,
  imageField,
  folderName,
  getIdFromUser = false,
}) =>
  asyncHandler(async (req, res, next) => {
    const id = getIdFromUser ? req.user._id : req.params.id;

    const oldDoc = imageField
      ? await service.getById({ id, fields: imageField })
      : null;

    const doc = await service.update({
      id,
      fieldsToUpdate: pickAllowedFields(fieldsToUpdate, req.body),
      processedImage: req.processedImage,
    });

    res.status(200).json({ data: doc });

    if (!imageField || !folderName) return;

    res.on("finish", () => {
      const oldValue = oldDoc[imageField];
      const newValue = req.body[imageField];

      deleteLocalFiles.deleteOldSingleImage(oldValue, newValue, folderName);
    });
  });

export const del = ({ service, imageFields, folderName }) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const doc = await service.del({ id });

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
