const forbiddenKeys = new Set(["__proto__", "constructor", "prototype"]);

const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;

  Object.keys(obj).forEach((key) => {
    if (key.startsWith("$") || key.includes(".") || forbiddenKeys.has(key)) {
      delete obj[key];
      return;
    }

    sanitizeObject(obj[key]);
  });
  return obj;
};

const stripEmptyObjects = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;

  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      stripEmptyObjects(val);
      if (Object.keys(val).length === 0) delete obj[key];
    }
  });
};

const sanitizeMiddleware = (req, res, next) => {
  req.sanitizedQuery = JSON.parse(JSON.stringify(req.query));

  stripEmptyObjects(sanitizeObject(req.sanitizedQuery));
  stripEmptyObjects(sanitizeObject(req.body));
  stripEmptyObjects(sanitizeObject(req.params));

  next();
};

export default sanitizeMiddleware;
