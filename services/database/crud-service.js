import ApiFeatures from "../../utils/api-features.js";
import ApiError from "../../utils/api-error.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";
import { deleteImageFile } from "../storage/local-storage/delete-files.js";

export const getById =
  (Model) =>
  async (id, fields = "") => {
    const doc = await Model.findById(id).select(fields);
    if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

    return doc;
  };

export const getDocs =
  (Model, defaultFields = "", nestedFilterField = null) =>
  async (reqQuery, reqParams = {}, populateOptions = null) => {
    const nestedId = nestedFilterField
      ? reqParams[`${nestedFilterField}Id`]
      : null;

    const baseFilter = nestedId ? { [nestedFilterField]: nestedId } : {};

    const apiFeatures = new ApiFeatures(Model.find(baseFilter), reqQuery)
      .filtering()
      .search()
      .sort()
      .limitFields(defaultFields)
      .paginate();

    if (populateOptions) apiFeatures.customPopulate(populateOptions);

    const { mongooseQuery, filterQuery } = apiFeatures;

    const [docs, totalDocs] = await Promise.all([
      mongooseQuery,
      Model.countDocuments({ ...baseFilter, ...filterQuery }),
    ]);

    const paginationResult = apiFeatures.buildPaginationResult(totalDocs);

    return { docs, paginationResult };
  };

export const getDoc =
  (Model, defaultFields = "") =>
  async (id, reqQuery, populateOptions) => {
    const apiFeatures = new ApiFeatures(
      Model.findOne({ _id: id }),
      reqQuery,
    ).limitFields(defaultFields);

    if (populateOptions) apiFeatures.customPopulate(populateOptions);

    const doc = await apiFeatures.mongooseQuery;
    if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

    return doc;
  };

export const create =
  (Model) => async (fieldsToCreate, processedImage, processedImages) => {
    const doc = await Model.create(fieldsToCreate);

    if (processedImage) await writeProcessedFiles([processedImage]);
    if (processedImages) await writeProcessedFiles(processedImages);

    return doc;
  };

export const update =
  (Model) => async (id, fieldsToUpdate, processedImage, processedImages) => {
    const doc = await Model.findOneAndUpdate(
      { _id: id },
      { $set: fieldsToUpdate },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

    if (processedImage) await writeProcessedFiles([processedImage]);
    if (processedImages) await writeProcessedFiles(processedImages);

    return doc;
  };

export const del = (Model) => async (id) => {
  const doc = await Model.findOneAndDelete({ _id: id });

  if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

  return doc;
};

export const addImage = (Model) => async (id, newImages, processedImages) => {
  const newImagesCount = newImages.length;

  const doc = await Model.findOneAndUpdate(
    {
      _id: id,
      $expr: {
        $lte: [{ $add: [{ $size: "$images" }, newImagesCount] }, 5],
      },
    },
    { $push: { images: { $each: newImages } } },
    { returnDocument: "after" },
  );

  if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

  if (processedImages) await writeProcessedFiles(processedImages);

  return doc;
};

export const deleteImage =
  (Model) => async (id, fieldName, folderName, imageName) => {
    const doc = await Model.findOneAndUpdate(
      { _id: id, [fieldName]: imageName },
      { $pull: { [fieldName]: imageName } },
      { returnDocument: "after" },
    );

    if (!doc)
      throw new ApiError(
        `Image "${imageName}" was not found for this id: ${id}`,
        404,
      );

    deleteImageFile(folderName, imageName);

    return doc;
  };
