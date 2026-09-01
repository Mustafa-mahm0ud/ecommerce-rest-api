/* eslint-env node */
import mongoose from "mongoose";

import * as mongooseMiddleware from "../middlewares/mongoose-middleware.js";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 32,
    },
    slug: String,
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
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
SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });
SubCategorySchema.index({ category: 1 });
SubCategorySchema.index({ slug: 1 });

mongooseMiddleware.setSlugify(SubCategorySchema, "name");
mongooseMiddleware.setImageUrl(SubCategorySchema, "subCategories", ["image"]);

export default mongoose.model("SubCategory", SubCategorySchema);
