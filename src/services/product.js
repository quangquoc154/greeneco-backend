const { Op } = require("sequelize");
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

exports.deleteProduct = async (prodId, fileName) => {
  try {
    console.log(fileName);
    const product = await db.Product.destroy({
      where: { id: prodId },
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

exports.getProducts = async ({page, limit, order, name, category, price, priceGte, priceLte, ...query}) => {
  try {
    const queries = {raw: true, nes: true}
    const offset = (!page || +page<=1) ? 0 : (+page - 1)
    if (limit) {
      queries.offset = offset * +limit
      queries.limit = +limit
    }
    if(order) queries.order = [order]
    if(name) query.title = {[Op.substring]: name}
    if(category) query.title = {[Op.substring]: category}
    if(price) query.price = {[Op.eq]: price}
    if(priceGte && priceLte) query.price = {[Op.between]: [priceGte, priceLte]}
    
    const products = await db.Product.findAll({
      where: query,
      offset: queries.offset,
      limit: queries.limit,
      order: queries.order
    });
    return {
      message: products ? "Fetch product successfully" : "No product in database",
      productData: products
    };
  } catch (error) {
    throw new Error(error);
  }
};

// exports.getProducts = async () => {
//   try {
//     const products = await db.Product.findAll();
//     console.log(products)
//     return {
//       message: products.length > 0 ? "Fetch all product successfully" : "No product in database",
//       products: products.length > 0 ? products : undefined,
//     };
//   } catch (error) {
//     throw new Error(error);
//   }
// };


