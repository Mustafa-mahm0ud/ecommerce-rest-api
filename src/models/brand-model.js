import mongoose from "mongoose";

import * as mongooseMiddleware from "../middlewares/mongoose-middleware.js";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 32,
      unique: true,
    },
    slug: {
      type: String,
    },
    image: {
      type: String,
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

BrandSchema.index({ slug: 1 });

mongooseMiddleware.setSlugify(BrandSchema, "name");
mongooseMiddleware.setImageUrl(BrandSchema, "brands", ["image"]);

export default mongoose.model("Brand", BrandSchema);
