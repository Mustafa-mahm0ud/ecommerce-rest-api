import authRouter from "./auth-route.js";
import userRouter from "./user-route.js";
import categoryRouter from "./category-route.js";
import { standaloneSubCategoryRouter } from "./subcategory-route.js";
import brandRouter from "./brand-route.js";
import productRouter from "./product-route.js";
import { standaloneReviewRouter } from "./review-route.js";
import wishlistRouter from "./wishlist-route.js";

const mountRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", standaloneSubCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/reviews", standaloneReviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
};

export default mountRoutes;
