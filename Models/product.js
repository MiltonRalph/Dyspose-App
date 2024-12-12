const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Waste title is required"],
    },
    description: {
      type: String,
      required: [true, "Waste description is required"],
    },
    image: {
      type: String,
      required: [true, "Waste image is required"],
    },
    price: {
      type: Number,
      required: [true, "Waste price is required"]
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
