const mongoose = require("mongoose");
const fs = require("fs");
const readline = require("readline");
const path = require("path");
require("dotenv").config();

// Models
const productModel = require("../models/products");
const categoryModel = require("../models/categories");

const CATEGORY_MAP = {
  'M': { name: 'Men', desc: 'Fragrances for Men' },
  'W': { name: 'Women', desc: 'Fragrances for Women' },
  'U': { name: 'Unisex', desc: 'Fragrances for All' }
};

async function importData() {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB...");

    // 2. Ensure Categories exist and get their IDs
    const categoryIds = {};
    for (const key in CATEGORY_MAP) {
      let cat = await categoryModel.findOne({ cName: CATEGORY_MAP[key].name });
      if (!cat) {
        console.log(`Creating category: ${CATEGORY_MAP[key].name}`);
        cat = new categoryModel({
          cName: CATEGORY_MAP[key].name,
          cDescription: CATEGORY_MAP[key].desc,
          cStatus: "Active",
          cImage: "category-placeholder.jpg"
        });
        await cat.save();
      }
      categoryIds[key] = cat._id;
    }

    // 3. Read CSV
    const csvFilePath = path.join(__dirname, "../fragrance-data.csv");
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isHeader = true;
    let count = 0;
    let skipped = 0;

    for await (const line of rl) {
      if (isHeader) {
        isHeader = false;
        continue;
      }

      const columns = line.split(",");
      if (columns.length < 8) continue; // Skip malformed lines

      // Header: IMAGE,PRODUCT,DESCRIPTION,CATEGORY,PRICE,STOCK,SIZE,PROPERTY
      const [image, product, description, categoryKey, price, stock, size, property] = columns;

      const pName = product.trim();
      const pDescription = description.trim();
      const pCategory = categoryIds[categoryKey.trim()];
      const pPrice = parseFloat(price) || 0;
      const pQuantity = parseInt(stock) || 0;
      const pSize = size.trim() + "ml"; // Adding 'ml' suffix
      const pProperty = property.trim();

      if (!pName || !pCategory) {
        console.warn(`Skipping line due to missing name or category: ${line}`);
        skipped++;
        continue;
      }

      // 4. Check if product already exists (include name, description, size and category for uniqueness)
      const existing = await productModel.findOne({ pName, pDescription, pSize, pCategory });
      if (existing) {
        console.log(`Product already exists: ${pName} - ${pDescription} (${pSize}). Skipping.`);
        skipped++;
        continue;
      }

      // 5. Create Product
      const newProduct = new productModel({
        pName: pName,
        pDescription: pDescription,
        pPrice: pPrice,
        pQuantity: pQuantity,
        pCategory: pCategory,
        pImages: ["placeholder.jpg"], // Default placeholder
        pStatus: "Active",
        pSize: pSize,
        pProperty: pProperty,
        pOffer: "0%",
        pDeliveryCharges: 0
      });

      await newProduct.save();
      count++;
      if (count % 10 === 0) console.log(`Processed ${count} products...`);
    }

    console.log(`\nImport Summary:`);
    console.log(`Successfully imported: ${count}`);
    console.log(`Skipped/Existing: ${skipped}`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error during import:", err);
    process.exit(1);
  }
}

importData();
