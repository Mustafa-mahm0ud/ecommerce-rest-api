export const ALLOWED_PRODUCT_FIELDS = [
  "title",
  "description",
  "quantity",
  "price",
  "discountPercentage",
  "imageCover",
  "category",
  "subCategories",
  "brand",
];

export const ALLOWED_PRODUCT_CREATE_FIELDS = [
  ...ALLOWED_PRODUCT_FIELDS,
  "images",
];
