import mongoose from "mongoose";

import * as mongooseMiddleware from "../middlewares/mongoose-middleware.js";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 500,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 2000,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
      max: 1e6,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [{ type: String }],
    imageCover: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    avgRatings: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.imageCover;
        delete ret.images;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.imageCover;
        delete ret.images;
        delete ret.__v;
        return ret;
      },
    },
    id: false,
  },
);

ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ category: 1, avgRatings: -1 });

ProductSchema.pre("findOneAndDelete", async function () {
  const reviewModel = mongoose.model("Review");
  await reviewModel.deleteMany({
    product: this.getFilter()._id,
  });
});

mongooseMiddleware.setSlugify(ProductSchema, "title");
mongooseMiddleware.setImageUrl(ProductSchema, "products", [
  "imageCover",
  "images",
]);

export default mongoose.model("Product", ProductSchema);
