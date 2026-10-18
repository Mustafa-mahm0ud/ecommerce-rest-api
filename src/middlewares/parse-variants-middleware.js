const parseVariants = (req, _, next) => {
  if (typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  next();
};

export default parseVariants;
