/**
 * ============================================================
 * Fragrance Island — Database Seed Script
 * ============================================================
 * Run from the /server directory:
 *   node seed.js
 *
 * Reads directly from:
 *   ../finalMarketplace_Bulk_Upload_(FOR SCRIPT).csv
 *
 * CSV Columns → DB Fields:
 * ─────────────────────────────────────────────────────────────
 *  IMAGE       → pImages      (empty — upload via admin)
 *  PRODUCT     → pName        (brand / product name)
 *  DESCRIPTION → pDescription (specific fragrance name)
 *  CATEGORY    → pCategory    (ref → categories collection)
 *  PRICE       → pPrice
 *  STOCK       → pQuantity
 *  SIZE        → pSize        (stored as "100ml")
 *  PROPERTY    → pProperty    (EDP / EDT / etc.)
 *
 * ✅  Users, settings, and customize slides are NOT touched.
 * ============================================================
 */

require("dotenv").config();
const fs       = require("fs");
const path     = require("path");
const readline = require("readline");
const mongoose = require("mongoose");

// ── Models ────────────────────────────────────────────────────
const Category = require("./models/categories");
const Product  = require("./models/products");

// ── CSV file path ─────────────────────────────────────────────
const CSV_PATH = path.resolve(
  __dirname,
  "../finalMarketplace_Bulk_Upload_(FOR SCRIPT).csv"
);

// ════════════════════════════════════════════════════════════════
// PARSE CSV
// ════════════════════════════════════════════════════════════════
function parseCSV() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(CSV_PATH)) {
      return reject(new Error(`CSV file not found: ${CSV_PATH}`));
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(CSV_PATH, "utf8"),
      crlfDelay: Infinity,
    });

    let headers  = null;
    const rows   = [];

    rl.on("line", (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;           // skip blank lines

      // Simple CSV split (handles quoted values with commas)
      const cols = trimmed.match(/(".*?"|[^",]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || trimmed.split(",");
      const cleaned = cols.map((c) => c.replace(/^"|"$/g, "").trim());

      if (!headers) {
        headers = cleaned;            // first non-blank row = headers
        return;
      }

      const row = {};
      headers.forEach((h, i) => { row[h] = cleaned[i] || ""; });
      rows.push(row);
    });

    rl.on("close", () => {
      console.log(`📄  CSV headers : ${headers ? headers.join(", ") : "none"}`);
      console.log(`📄  ${rows.length} data rows found.\n`);
      resolve(rows);
    });

    rl.on("error", reject);
  });
}

// ════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ════════════════════════════════════════════════════════════════
async function seed() {
  // ── 1. Parse CSV (fail fast if file missing/bad) ─────────────
  const rows = await parseCSV();
  if (rows.length === 0) throw new Error("CSV has no data rows.");

  // ── 2. Connect to MongoDB ─────────────────────────────────────
  const DB_URI = process.env.DATABASE;
  if (!DB_URI) {
    console.error("❌  DATABASE env variable not set. Check your .env file.");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB …");
  await mongoose.connect(DB_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
    useCreateIndex:     true,
  });
  console.log("✅  Connected.\n");

  // ── 3. Clear products + categories ───────────────────────────
  console.log("🗑️   Clearing products and categories …");
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log("✅  Cleared.\n");

  // ── 4. Build unique categories from the CATEGORY column ──────
  const uniqueCatNames = [
    ...new Set(rows.map((r) => r["CATEGORY"]).filter(Boolean)),
  ];

  const categoriesData = uniqueCatNames.map((name) => ({
    cName:        name,
    cDescription: `${name} fragrances collection`,
    cImage:       "",
    cStatus:      "active",
  }));

  console.log(`📂  Inserting ${categoriesData.length} categories …`);
  const insertedCategories = await Category.insertMany(categoriesData);

  // Lookup map: "M" → ObjectId
  const catMap = {};
  insertedCategories.forEach((c) => { catMap[c.cName] = c._id; });
  console.log(`✅  ${insertedCategories.length} categories inserted.\n`);

  // ── 5. Build + insert products ────────────────────────────────
  console.log("📦  Inserting products …");

  const productsData = rows
    .map((row, i) => {
      const pName     = (row["PRODUCT"]     || "").trim();
      const pDesc     = (row["DESCRIPTION"] || "").trim();
      const catKey    = (row["CATEGORY"]    || "").trim();
      const pPrice    = parseFloat(row["PRICE"]) || 0;
      const pQuantity = parseInt(row["STOCK"])   || 0;
      const sizeRaw   = (row["SIZE"]        || "").trim();
      const pProperty = (row["PROPERTY"]    || "").trim();

      if (!pName) {
        console.warn(`  ⚠️  Row ${i + 2}: empty PRODUCT — skipped.`);
        return null;
      }

      return {
        pName,
        pDescription:     pDesc || `${pName} — ${pProperty} ${sizeRaw}ml`,
        pPrice,
        pQuantity,
        pSold:            0,
        pCategory:        catMap[catKey] || null,
        pImages:          [],   // upload images via admin panel
        pOffer:           null,
        pDeliveryCharges: 0,
        pRatingsReviews:  [],
        pStatus:          "active",
        pSize:            sizeRaw ? `${sizeRaw}ml` : "",
        pProperty,
      };
    })
    .filter(Boolean);

  const insertedProducts = await Product.insertMany(productsData);
  console.log(`✅  ${insertedProducts.length} products inserted.`);

  // ── Summary ───────────────────────────────────────────────────
  console.log("\n════════════════════════════════════");
  console.log("  🌸  Seed completed successfully!  ");
  console.log("════════════════════════════════════");
  console.log(`  Categories inserted: ${insertedCategories.length}`);
  console.log(`  Products inserted  : ${insertedProducts.length}`);
  console.log("  Users / Settings / Slides: untouched");
  console.log("════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("\n❌  Seed failed:", err.message || err);
  mongoose.disconnect();
  process.exit(1);
});
