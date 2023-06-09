const productService = require("../services/product");

const cloudinary = require("cloudinary").v2;

const joi = require("joi");

const {
  prodId,
  title,
  price,
  available,
  imageUrl,
  description,
  dateOfManufacture,
  madeIn,
  certificate,
  category,
} = require("../helpers/joi_schema");

const addProduct = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi
      .object({
        title,
        price,
        available,
        imageUrl,
        description,
        dateOfManufacture,
        madeIn,
        certificate,
        category,
      })
      .validate({ ...req.body, imageUrl: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await productService.createNewProduct(req.body, fileData, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi.object({ prodId }).validate({ prodId: req.params.prodId });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await productService.editProduct(req.params.prodId, req.body, fileData, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // const { error } = joi.object({ prodId, fileName }).validate(req.query);
    // if (error) {
    //   return res.status(400).json({
    //     message: error.details[0].message,
    //   });
    // }
    const response = await productService.deleteProduct(req.query.prodId, req.query.fileName, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const response = await productService.getProducts(req.query, res);
    return response;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
};
