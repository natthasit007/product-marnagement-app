import Product from "../model/productModel.js";

const createProduct = async (req, res,next) =>{
    try {
        const {name, price, description, image} = req.body;
        if(!name || !price){
            return res.status(400).json({ message:"Name and Price are required fields!!"});
        }
         const newProduct = await Product.create({
           name,
           price: Number(price),
           description,
           image,
         }); 
         return res.status(201).json(newProduct);
    } catch (error) {
      return next(error);
    }
};
const getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getProductById = async (req, res, next) => {
     try {
       const { id } = req.params;
       if (!id) {
         return res.status(400).json({ message: "Product Id is required!!" });
       }
       const product = await Product.findByPk(id);
       if (!product) {
         return res.status(404).json({ message: "Product not found" });
       }
       return res.status(200).json(product);
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
};
const updateProduct = async (req, res, next) => {
     try {
       const { id } = req.params;
       if (!id) {
         return res.status(400).json({ message: "Product Id is required!!" });
       }
       const { name, price } = req.body;
       if (!name && !price) {
         return res
           .status(400)
           .json({ message: "Name and Price are required fields!!" });
       }
       const product = await Product.findByPk(id);
       if (!product) {
         return res.status(404).json({ message: "Product not found" });
       }

       await product.update({
         name: name || product.name,
         price: Number(price) || product.price,
       });
       console.log(product);

       return res.status(200).json(product);
     } catch (error) {
       console.log(error);
       return res.status(500).json({ error: error.message });
     }
};
const deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product Id is required!!" });
      }
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await product.destroy();
      return res.status(200).json({
        message: "Product is deleted successfully",
        deletedProduct: product,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};

export { 
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct,
};