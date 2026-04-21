const mongoose = require("mongoose");
require("dotenv").config();
const categoryModel = require("../models/categories");

async function checkCategories() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to DB");
    const categories = await categoryModel.find({});
    console.log("Current Categories in DB:");
    categories.forEach(c => console.log(`ID: ${c._id}, Name: ${c.cName}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCategories();
