import { body } from "express-validator";

const requireAtLeastOneField = (allowedFields) =>
  body().custom((_, { req }) => {
    const hasAtLeastOneField = allowedFields.some(
      (field) => field in (req.body ?? {}),
    );

    if (!hasAtLeastOneField)
      throw new Error(
        `You must provide at least one of the following fields: ${allowedFields.join(", ")}`,
      );

    return true;
  });

export default requireAtLeastOneField;
