const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

exports.createNewProduct = async (body, fileData) => {
  try {
    const [product, created] = await db.Product.findOrCreate({
      where: { title: body.title },
      defaults: {
        ...body,
        id: uuidv4(),
        imageUrl: fileData?.path,
        fileName: fileData?.filename,
      },
    });
    if (fileData && !created) cloudinary.uploader.destroy(fileData.filename);
    return {
      message: created ? "Create successfully" : "Title product already exist",
    };
  } catch (error) {
    if (fileData) cloudinary.uploader.destroy(fileData.filename);
    throw new Error(error);
  }
};

exports.editProduct = async ({ id, ...body }, fileData) => {
  try {
    if (fileData) body.imageUrl = fileData?.path;
    const product = await db.Product.update(body, { where: { id: id } });
    if (fileData && product[0] === 0)
      cloudinary.uploader.destroy(fileData.filename);
    return {
      message: product[0] > 0 ? "Update successfully" : "Product id not found",
    };
  } catch (error) {
    if (fileData && product[0] === 0)
      cloudinary.uploader.destroy(fileData.filename);
    throw new Error(error);
  }
};

exports.getProducts = async () => {
  try {
    const products = await db.Product.findAll();
    console.log(products)
    return {
      message: products.length > 0 ? "Fetch all product successfully" : "No product in database",
      products: products.length > 0 ? products : undefined,
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteProduct = async (prodIds, fileName) => {
  try {
    console.log(fileName);
    const product = await db.Product.destroy({
      where: { id: prodIds },
    });
    cloudinary.api.delete_resources(fileName, (error, result) => {
      console.log(result);
    });
    return {
      message:
        product > 0 ? `${product} product are deleted` : "Product id not found",
    };
  } catch (error) {
    throw new Error(error);
  }
};
