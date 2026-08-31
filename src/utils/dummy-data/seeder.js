require("dotenv").config({ path: "../../.env" });
require("colors");
const fs = require("fs");
const dbConnection = require("../../config/db");

// Models
const Category = require("../../models/category-model");
const SubCategory = require("../../models/subCategory-model");
const Brand = require("../../models/brand-model");
const Product = require("../../models/product-model");

// Data
const productsData = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
const brandsData = JSON.parse(fs.readFileSync("./brand.json", "utf-8"));

const insertData = async () => {
  try {
    await Product.create(productsData);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const start = async () => {
  await dbConnection();
  if (process.argv[2] === "-i") insertData();
  else if (process.argv[2] === "-d") destroyData();
};

start();
