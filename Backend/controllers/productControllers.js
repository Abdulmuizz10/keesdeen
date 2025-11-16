import ProductModel from "../models/productModel.js";

// Client Controllers

// Home
const getHomeBestSellersController = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $match: { bestSeller: true } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      { $sample: { size: 12 } },
    ]);

    if (!products.length) {
      return res.status(200).json({
        message: "No best sellers found yet",
        products: [],
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching best sellers",
      error: error.message,
    });
  }
};

const getHomeCollectionsController = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([{ $sample: { size: 12 } }]);

    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No products available yet",
        products: [],
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch random products",
      error: error.message,
    });
  }
};

const getHomeNewArrivalsController = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $match: { newArrival: true } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      { $sample: { size: 12 } },
    ]);

    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No new arrivals found yet",
        products: [],
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching new arrivals",
      error: error.message,
    });
  }
};

// Collections
const getCollectionsShopAllController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.category) {
      const categories = req.query.category.split(",");
      filters.category = { $in: categories };
    }

    if (req.query.size) {
      const sizes = req.query.size.split(",");
      filters.sizes = { $in: sizes };
    }

    if (req.query.color) {
      const colors = req.query.color.split(",");
      filters.colors = { $in: colors };
    }

    let sort = {};
    if (req.query.sort === "low-high") sort.price = 1;
    else if (req.query.sort === "high-low") sort.price = -1;

    const products = await ProductModel.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filters);

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getCollectionsNewArrivalsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.category) {
      const categories = req.query.category.split(",");
      filters.category = { $in: categories };
    }

    if (req.query.size) {
      const sizes = req.query.size.split(",");
      filters.sizes = { $in: sizes };
    }

    if (req.query.color) {
      const colors = req.query.color.split(",");
      filters.colors = { $in: colors };
    }

    let sort = {};
    if (req.query.sort === "low-high") sort.price = 1;
    else if (req.query.sort === "high-low") sort.price = -1;

    const products = await ProductModel.find({ newArrival: true })
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filters);

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getCollectionsActiveWearController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.subcategory) {
      const subcategory = req.query.subcategory.split(",");
      filters.subcategory = { $in: subcategory };
    }

    if (req.query.size) {
      const sizes = req.query.size.split(",");
      filters.sizes = { $in: sizes };
    }

    if (req.query.color) {
      const colors = req.query.color.split(",");
      filters.colors = { $in: colors };
    }

    // Sorting logic
    let sort = {};
    if (req.query.sort === "low-high") sort.price = 1;
    else if (req.query.sort === "high-low") sort.price = -1;

    const query = { category: "Active Wear", ...filters };

    const products = await ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(query);

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getCollectionsFitnessAccessoriesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.subcategory) {
      const subcategory = req.query.subcategory.split(",");
      filters.subcategory = { $in: subcategory };
    }

    if (req.query.size) {
      const sizes = req.query.size.split(",");
      filters.sizes = { $in: sizes };
    }

    if (req.query.color) {
      const colors = req.query.color.split(",");
      filters.colors = { $in: colors };
    }

    // Sorting logic
    let sort = {};
    if (req.query.sort === "low-high") sort.price = 1;
    else if (req.query.sort === "high-low") sort.price = -1;

    const query = { category: "Fitness Accessories", ...filters };

    const products = await ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(query);

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getCollectionsProductByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Calculate total stars, average rating, and total reviews
    const totalStars = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const totalReviews = product.reviews.length;
    const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    res.status(200).json({
      product,
      averageRating: averageRating.toFixed(1), // Round to 2 decimal places
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addProductReviewController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews.push(req.body);
    await product.save();
    res.status(200).json({ message: "Thanks for the review!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCollectionsRelatedProductByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await ProductModel.find({
      _id: { $ne: product._id }, // Exclude the current product
      category: product.category,
    }).limit(12);
    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchSuggestionsWithProductsController = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    // Query the database for matching products
    const products = await ProductModel.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { type: searchRegex },
      ],
    }).limit(12);

    const suggestions = [
      ...new Set(products.map((product) => product.name)),
    ].slice(0, 7);

    res.status(200).json({ products, suggestions });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// const searchProductsResultsController = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const skip = (page - 1) * limit;

//     const filters = {};

//     if (req.query.name) {
//       // Trim and split words by spaces or punctuation
//       const words = req.query.name.trim().split(/\s+/);
//       // Create a regex that matches any of those words (case-insensitive)
//       const regexPattern = words.map((word) => `(?=.*${word})`).join("") + ".*";

//       filters.name = { $regex: words.join("|"), $options: "i" };
//     }

//     if (req.query.category) {
//       const categories = req.query.category.split(",");
//       filters.category = { $in: categories };
//     }

//     if (req.query.size) {
//       const sizes = req.query.size.split(",");
//       filters.size = { $in: sizes };
//     }

//     if (req.query.color) {
//       const colors = req.query.color.split(",");
//       filters.color = { $in: colors };
//     }

//     let sort = {};
//     if (req.query.sort === "low-high") sort.price = 1;
//     else if (req.query.sort === "high-low") sort.price = -1;

//     const products = await ProductModel.find(filters)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);

//     const total = await ProductModel.countDocuments(filters);

//     res.status(200).json({
//       products,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// };

const searchProductsResultsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filters = {};

    let searchQuery = null;
    if (req.query.name) {
      const words = req.query.name.trim().split(/\s+/);
      const regexPattern = words.join("|");
      searchQuery = req.query.name.trim().toLowerCase();
      filters.name = { $regex: regexPattern, $options: "i" };
    }

    if (req.query.category) {
      const categories = req.query.category.split(",");
      filters.category = { $in: categories };
    }

    if (req.query.size) {
      const sizes = req.query.size.split(",");
      filters.size = { $in: sizes };
    }

    if (req.query.color) {
      const colors = req.query.color.split(",");
      filters.color = { $in: colors };
    }

    let sort = {};
    if (req.query.sort === "low-high") sort.price = 1;
    else if (req.query.sort === "high-low") sort.price = -1;

    // Step 1: Find products
    let products = await ProductModel.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filters);

    // Step 2: If a name query exists, rank by closeness
    if (searchQuery) {
      products = products.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        const exactA = nameA === searchQuery;
        const exactB = nameB === searchQuery;

        // Exact match comes first
        if (exactA && !exactB) return -1;
        if (!exactA && exactB) return 1;

        // Then matches that start with the search query
        const startsA = nameA.startsWith(searchQuery);
        const startsB = nameB.startsWith(searchQuery);
        if (startsA && !startsB) return -1;
        if (!startsA && startsB) return 1;

        // Finally, by number of matching words
        const wordCountA = searchQuery
          .split(" ")
          .filter((w) => nameA.includes(w)).length;
        const wordCountB = searchQuery
          .split(" ")
          .filter((w) => nameB.includes(w)).length;
        return wordCountB - wordCountA;
      });
    }

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Admin Controllers
const adminCreateProductController = async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetProductsByPaginationController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetProductByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Calculate total stars, average rating, and total reviews
    const totalStars = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const totalReviews = product.reviews.length;
    const averageRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    res.status(200).json({
      product,
      averageRating: averageRating.toFixed(1), // Round to 2 decimal places
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const adminUpdateProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminDeleteProductController = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateProductToBestSellerController = async (req, res) => {
  let { status } = req.body;

  // Convert the 'status' string to a boolean
  if (status === "isBestSeller") {
    status = true;
  } else if (status === "notBestSeller") {
    status = false;
  } else {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the order delivery status
    product.bestSeller = status;
    await product.save();

    // Respond with an appropriate message
    const message = status
      ? "Product updated to best seller"
      : "Product updated to non best seller";
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateProductToNewArrivalController = async (req, res) => {
  let { status } = req.body;

  // Convert the 'status' string to a boolean
  if (status === "isNewArrival") {
    status = true;
  } else if (status === "notNewArrival") {
    status = false;
  } else {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the order delivery status
    product.newArrival = status;
    await product.save();

    // Respond with an appropriate message
    const message = status
      ? "Product updated to new arrival"
      : "Product updated to not new arrival";
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminUpdateProductAvailabilityController = async (req, res) => {
  const { id } = req.params;
  let { status } = req.body;

  // Convert the 'status' string to a boolean
  if (status === "isAvailable") {
    status = true;
  } else if (status === "notAvailable") {
    status = false;
  } else {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product availability status
    product.isAvailable = status;
    await product.save();

    // Respond with an appropriate message
    const message = status
      ? "Product marked as available"
      : "Product marked as unavailable";

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getHomeBestSellersController,
  getHomeCollectionsController,
  getHomeNewArrivalsController,
  getCollectionsShopAllController,
  getCollectionsNewArrivalsController,
  getCollectionsActiveWearController,
  getCollectionsFitnessAccessoriesController,
  getCollectionsProductByIdController,
  addProductReviewController,
  getCollectionsRelatedProductByIdController,
  searchSuggestionsWithProductsController,
  searchProductsResultsController,
  //////
  adminCreateProductController,
  adminGetProductsByPaginationController,
  adminGetProductByIdController,
  adminUpdateProductController,
  adminDeleteProductController,
  adminUpdateProductToBestSellerController,
  adminUpdateProductToNewArrivalController,
  adminUpdateProductAvailabilityController,
};
