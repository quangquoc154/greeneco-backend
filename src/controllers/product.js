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
      })
      .validate({ ...req.body, imageUrl: fileData?.path });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await productService.createNewProduct(req.body, fileData);
    return res.status(200).json(response);
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
    const { error } = joi.object({ prodId }).validate({ prodId: req.body.id });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const response = await productService.editProduct(req.body, fileData);
    return res.status(200).json(response);
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
    const response = await productService.deleteProduct(req.query.prodId, req.query.fileName);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const response = await productService.getProducts(req.query);
    return res.status(200).json(response);
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
