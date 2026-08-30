import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
      immutable: true,
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });

ReviewSchema.statics.calcRatings = async function (productId) {
  const productModel = mongoose.model("Product");

  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRatings: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      avgRatings: stats[0].avgRatings,
      ratingsCount: stats[0].ratingsCount,
    });
    console.log(stats[0].avgRatings);
  } else {
    await productModel.findByIdAndUpdate(productId, {
      avgRatings: undefined,
      ratingsCount: 0,
    });
  }
};

ReviewSchema.post("save", function () {
  this.constructor.calcRatings(this.product);
});

ReviewSchema.post("findOneAndDelete", (doc) => {
  if (doc) doc.constructor.calcRatings(doc.product);
});

export default mongoose.model("Review", ReviewSchema);
