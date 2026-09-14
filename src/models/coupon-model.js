import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [1, "Discount value must be at least 1"],
      validate: {
        validator: function (value) {
          if (this.discountType === "percentage") {
            return value <= 100;
          }
          return true;
        },
        message: "Percentage discount can't exceed 100",
      },
    },
    maxDiscount: {
      type: Number,
      required: [
        function () {
          return this.discountType === "percentage";
        },
        "Max discount is required for percentage discounts",
      ],
      min: [1, "Max discount must be at least 1"],
      validate: {
        validator: function (value) {
          if (this.discountType === "fixed" && value !== undefined)
            return false;
          return true;
        },
        message: "Max discount is not allowed for fixed discounts",
      },
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, "Minimum order value can't be negative"],
    },
    maxUses: {
      type: Number,
      min: [1, "Max uses must be at least 1"],
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expire: {
      type: Date,
      required: [true, "Coupon expiration date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Expiration date must be after the start date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", CouponSchema);
