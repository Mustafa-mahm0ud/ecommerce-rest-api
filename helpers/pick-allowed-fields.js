const pickAllowedFields = (allowedFields, reqBody) =>
  allowedFields.reduce((acc, field) => {
    if (reqBody[field] !== undefined) acc[field] = reqBody[field];
    return acc;
  }, {});

export default pickAllowedFields;
