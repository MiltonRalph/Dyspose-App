const Product = require("../Models/product");

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username email");

    // Add full URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullPath = products.map((product) => ({
      ...product._doc,
      image: product.image ? `${baseUrl}/uploads/${product.image}` : null, // Append correct path
    }));

    res.status(200).json({ success: true, products: productsWithFullPath });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image is required" });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      image: `/products/${req.file.filename}`, // Relative path stored in DB
      seller: req.user.id, // Assuming you're using middleware to attach the logged-in user's info
    });

    await newProduct.save();

    res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create product", error: error.message });
  }
};
// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete the image file if it exists
    const imagePath = path.join(__dirname, `../${product.image}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct };
