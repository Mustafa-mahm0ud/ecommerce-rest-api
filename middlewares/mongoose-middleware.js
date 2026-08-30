import slugify from "slugify";

export const setSlugify = (Schema, sourceField) => {
  Schema.pre("save", async function () {
    const target = this[sourceField];
    if (target) this.slug = slugify(target, { lower: true });
  });

  Schema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();
    const target = update.$set[sourceField];
    if (target) update.slug = slugify(target, { lower: true });
  });
};

export const setImageUrl = (Schema, folderName, imageFields) => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

  imageFields.forEach((field) => {
    const virtualName = `${field}Url`;

    Schema.virtual(virtualName).get(function () {
      const value = this[field];
      if (!value) return;

      if (Array.isArray(value))
        return value.map((img) => `${BASE_URL}/uploads/${folderName}/${img}`);

      return `${BASE_URL}/uploads/${folderName}/${value}`;
    });
  });
};
