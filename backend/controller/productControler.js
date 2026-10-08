import Product from "../model/productModel.js";
import {
  parseProductId,
  validateProductInput,
} from "../validation/productValidation.js";

const createProduct = async (req, res, next) => {
  const { data, error } = validateProductInput(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const newProduct = await Product.create(data);
    return res.status(201).json(newProduct);
  } catch (requestError) {
    return next(requestError);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (requestError) {
    return next(requestError);
  }
};

const getProductById = async (req, res, next) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Product ID must be a positive integer" });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (requestError) {
    return next(requestError);
  }
};

const updateProduct = async (req, res, next) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Product ID must be a positive integer" });
  }

  const { data, error } = validateProductInput(req.body, { partial: true });
  if (error) {
    return res.status(400).json({ message: error });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(data);
    return res.status(200).json(product);
  } catch (requestError) {
    return next(requestError);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = parseProductId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: "Product ID must be a positive integer" });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    return res.status(200).json({
      message: "Product is deleted successfully",
      deletedProduct: product,
    });
  } catch (requestError) {
    return next(requestError);
  }
};

export {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
