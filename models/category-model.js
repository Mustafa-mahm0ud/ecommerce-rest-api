import mongoose from "mongoose";

import * as mongooseMiddleware from "../middlewares/mongoose-middleware.js";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 32,
      unique: true,
    },
    slug: String,
    image: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.image;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.image;
        delete ret.__v;
        return ret;
      },
    },
    id: false,
  },
);

CategorySchema.index({ slug: 1 });

mongooseMiddleware.setSlugify(CategorySchema, "name");
mongooseMiddleware.setImageUrl(CategorySchema, "categories", ["image"]);

export default mongoose.model("Category", CategorySchema);
