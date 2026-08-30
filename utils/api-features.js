const prefixOperators = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(prefixOperators);
  }

  if (obj !== null && typeof obj === "object") {
    obj = Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = ["gt", "gte", "lt", "lte", "ne", "eq"].includes(key)
        ? `$${key}`
        : key;

      acc[newKey] = prefixOperators(value);
      return acc;
    }, {});
  }
  return obj;
};

export default class ApiFeatures {
  constructor(mongooseQuery, reqQuery) {
    this.mongooseQuery = mongooseQuery;
    this.reqQuery = reqQuery;
    this.filterQuery = {};
  }

  filtering(allowedFields = []) {
    let queryObj = { ...this.reqQuery };

    const excludeFields = ["sort", "limit", "page", "keyword", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (allowedFields.length) {
      Object.keys(queryObj).forEach((key) => {
        if (!allowedFields.includes(key)) delete queryObj[key];
      });
    }

    queryObj = prefixOperators(queryObj);

    this.filterQuery = { ...this.filterQuery, ...queryObj };
    this.mongooseQuery.find(queryObj);

    return this;
  }

  search() {
    const keyword = this.reqQuery?.keyword?.trim();

    if (keyword) {
      const searchCondition = { $text: { $search: keyword } };

      this.filterQuery = { ...this.filterQuery, ...searchCondition };
      this.mongooseQuery.find(searchCondition);
    }
    return this;
  }

  sort() {
    const sortParam = this.reqQuery?.sort;

    if (sortParam) {
      const sortBy = sortParam
        .split(",")
        .map((s) => s.trim())
        .join(" ");

      this.mongooseQuery.sort(sortBy);
    } else if (!this.reqQuery?.keyword) {
      this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields(defaultFields = "") {
    const fieldsParam = this.reqQuery?.fields;

    if (fieldsParam) {
      const fields = fieldsParam
        .split(",")
        .map((s) => s.trim())
        .join(" ");

      this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery.select(defaultFields);
    }
    return this;
  }

  paginate() {
    let page = parseInt(this.reqQuery.page, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;

    let limit = parseInt(this.reqQuery.limit, 10);
    if (!Number.isInteger(limit) || limit < 1) limit = 5;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    this._page = page;
    this._limit = limit;

    this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  buildPaginationResult(totalDocs) {
    const page = this._page;
    const limit = this._limit;
    const skip = (page - 1) * limit;

    const paginationResult = {
      limit,
      countOfPages: Math.ceil(totalDocs / limit),
      page,
    };

    if (skip > 0) paginationResult.prevPage = page - 1;
    if (page * limit < totalDocs) paginationResult.nextPage = page + 1;

    return paginationResult;
  }

  customPopulate(populateOptions) {
    const fieldName = Object.values(populateOptions)[0];

    const shouldPopulate =
      !this.reqQuery.fields || this.reqQuery.fields.includes(fieldName);

    if (shouldPopulate) {
      this.mongooseQuery.populate(populateOptions);
    }

    return this;
  }
}
