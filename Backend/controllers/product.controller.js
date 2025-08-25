

const fs = require("fs");
const uploadOnCloudinary = require("../config/cloudinary");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs"); // make sure you use the same hashing method
const { clearScreenDown } = require("readline");

// // Only washerman can add products
// const addProduct = async (req, res) => {
//   try {
//     const washerman = req.userId;

//     // Extra check (in case middleware isn't used correctly)
//     if (req.userRole !== "washerman") {
//       return res
//         .status(403)
//         .json({ message: "Only washermen can add products" });
//     }

//     const { title, description, price, category, serviceType, more_details } =
//       req.body;

//     if (!title || !description || !price || !category || !serviceType) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     // const imageFile = req.files?.image?.[0];
//     const imageFile = req.file;
//     if (!imageFile) {
//       return res.status(400).json({ message: "Image file is required" });
//     }

//     // const image = await uploadOnCloudinary(imageFile.path);

//     const image = await uploadOnCloudinary(imageFile.buffer);
//     if (!image) {
//       return res.status(500).json({ message: "Image upload failed" });
//     }

//     // Clean up local temp image
//     if (fs.existsSync(imageFile.path)) {
//       fs.unlink(imageFile.path, (err) => {
//         if (err) console.error("Temp file deletion failed:", err);
//       });
//     }

//     const product = await Product.create({
//       title,
//       description,
//       price,
//       category,
//       serviceType,
//       more_details,
//       image,
//       washerman,
//     });

//     // Link product to washerman
//     const user = await User.findByIdAndUpdate(
//       washerman,
//       { $push: { products: product._id } },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "Washerman user not found" });
//     }

//     res.status(201).json(product);
//     // res.status(201).json({
//     //   message: "Product created successfully",
//     //   product,
//     //   imageUrl: image.url, // 👈 add this line
//     // });
//   } catch (error) {
//     console.error("AddProduct error:", error);
//     res.status(500).json({ message: `AddProduct error: ${error.message}` });
//   }
// };









// // 
// //own product for washerman
// const getMyProducts = async (req, res) => {
//   try {
//     const userId = req.userId;
//     console.log(userId);

//     if (!userId) {
//       return res.status(400).json({ message: "User not authenticated" });
//     }

//     const products = await Product.find({ washerman: userId }).populate("washerman");
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("getMyProducts error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// //all prouct show
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("washerman", "name _id");
//     res.status(200).json(products);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch products", error: err.message });
//   }
// };


const addProduct = async (req, res) => {
  try {
    const washerman = req.userId;

    if (req.userRole !== "washerman") {
      return res.status(403).json({ message: "Only washermen can add products" });
    }

    const { title, name, description, category } = req.body;

    // Parse options safely
    let options;
    try {
     options = JSON.parse(req.body.options);
 // This should match frontend field name
    } catch (err) {
      return res.status(400).json({ message: "Invalid serviceType format (must be JSON array)" });
    }

    if (!title || !name || !description || !category || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ message: "Required fields missing or invalid" });
    }

    // Image file check
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadOnCloudinary(imageFile.buffer);
    if (!imageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Save product
    const product = await Product.create({
      title,
      name,
      description,
      category,
      options,
      image: imageUrl,
      washerman,
    });

    await User.findByIdAndUpdate(
      washerman,
      { $push: { products: product._id } },
      { new: true }
    );

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("AddProduct error:", error);
    res.status(500).json({ message: `AddProduct error: ${error.message}` });
  }
};


// //own product for washerman
const getMyProducts = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const products = await Product.find({ washerman: userId }).populate("washerman", "name email");
    res.status(200).json(products);
  } catch (error) {
    console.error("getMyProducts error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





// //all prouct show
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("washerman", "name email");
    res.status(200).json(products);
  } catch (error) {
    console.error("getAllProducts error:", error.message);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};


//product by id show

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "washerman",
      "name _id"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: err.message });
  }
};



const bookProduct = async (req, res) => {
  try {
    const customerId = req.userId; // comes from isAuth middleware
    const productId = req.params.id;
    //  const washerman = req.userId;
    const { selectedOptions = [] } = req.body; // optional add-ons

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isBooked) {
      return res.status(400).json({ message: "Product is already booked" });
    }

    product.isBooked = true;
    product.guest = customerId;
    // product.washerman = washerman

    // Optionally store selected options or validate them
    if (selectedOptions.length > 0) {
      // Match and assign valid options
      product.options = product.options.filter(opt =>
        selectedOptions.includes(opt.id)
      );
    }

    await product.save();

    res.status(200).json({
      message: "Product booked successfully",
      product
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};



// //update the product
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params; // productId
//     const washerman = req.userId;

//     const product = await Product.findOne({ _id: id, washerman });
//     if (!product)
//       return res
//         .status(404)
//         .json({ message: "Product not found or unauthorized" });

//     const updates = req.body;
//     Object.assign(product, updates);
//     await product.save();

//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };




const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const washerman = req.userId;

    // Allow only washermen to update
    if (req.userRole !== "washerman") {
      return res.status(403).json({ message: "Only washermen can update products" });
    }

    // Find product with ownership check
    const product = await Product.findOne({ _id: id, washerman });
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    const { title, name, description, category, options } = req.body;

    // ✅ Handle options directly without parsing
    if (options && !Array.isArray(options)) {
      return res.status(400).json({ message: "Options must be an array" });
    }

    // Apply updates (excluding image)
    if (title) product.title = title;
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (options) product.options = options;

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    console.error("UpdateProduct error:", err);
    res.status(500).json({ message: `Update failed: ${err.message}` });
  }
};



//product delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body; // password from client
    const washermanId = req.userId;

    const washerman = await User.findById(washermanId);
    if (!washerman) return res.status(404).json({ message: "User not found" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, washerman.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // ✅ Delete product if owner matches
    const product = await Product.findOneAndDelete({ _id: id, washerman: washermanId });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    // ✅ Remove product reference from user
    await User.findByIdAndUpdate(washermanId, { $pull: { products: id } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};



module.exports = {
  addProduct,
   getMyProducts,
  getAllProducts,
  getProductById,
  bookProduct,
  updateProduct,
  deleteProduct,
 
};





