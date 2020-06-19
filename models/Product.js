const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: String,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  productimages: [ImageSchema],
  details: String,
  reviews: String,
  qty: String,
});

module.exports = mongoose.model("products", ProductSchema);
