import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import wishlistModel from "./wishlist-model.js";
import * as mongooseMiddleware from "../middlewares/mongoose-middleware.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    slug: { type: String, lowercase: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    phone: { type: String, unique: true, sparse: true },
    profileImage: String,
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    refreshTokenHash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    loggedOutAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.profileImage;
        delete ret.password;
        delete ret.passwordChangedAt;
        delete ret.passwordResetCode;
        delete ret.passwordResetExpires;
        delete ret.passwordResetVerified;
        delete ret.refreshTokenHash;
        delete ret.loggedOutAt;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.profileImage;
        delete ret.password;
        delete ret.passwordChangedAt;
        delete ret.passwordResetCode;
        delete ret.passwordResetExpires;
        delete ret.passwordResetVerified;
        delete ret.refreshTokenHash;
        delete ret.loggedOutAt;
        delete ret.__v;
        return ret;
      },
    },
    id: false,
  },
);

mongooseMiddleware.setImageUrl(UserSchema, "users", ["profileImage"]);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = Date.now();
});

UserSchema.pre("save", function (next) {
  this._wasNew = this.isNew;
  next();
});

UserSchema.post("save", async (doc) => {
  if (doc.wasNew) {
    try {
      await wishlistModel.create({ user: doc._id });
    } catch (err) {
      console.error(`Failed to create wishlist for user ${doc._id}:`, err);
    }
  }
});

export default mongoose.model("User", UserSchema);
