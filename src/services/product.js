const { Op } = require("sequelize");
const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

exports.createNewProduct = async (body, fileData, res) => {
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
    
    const status = created ? 201 : 409;
    return res.status(status).json({
      message: created ? "Create successfully" : "Title product already exist",
    });
  } catch (error) {
    if (fileData) cloudinary.uploader.destroy(fileData.filename);
    throw new Error(error);
  }
};

exports.editProduct = async (prodId, body, fileData, res) => {
  try {
    if (fileData) {
      body.imageUrl = fileData?.path;
      body.fileName = fileData?.filename
    }
    const product = await db.Product.update(body, { where: { id: prodId } });
    if (fileData && product[0] === 0)
      cloudinary.uploader.destroy(fileData.filename);

    const status = product[0] === 1 ? 200 : 404;
    console.log(product);
    return res.status(status).json({
      message: product[0] === 1 ? "Update successfully" : "Has error when update product",
    });
  } catch (error) {
    if (fileData && product[0] === 0)
      cloudinary.uploader.destroy(fileData.filename);
    throw new Error(error);
  }
};

exports.deleteProduct = async (prodId, fileName, res) => {
  try {
    console.log(fileName);
    const product = await db.Product.destroy({
      where: { id: prodId },
    });
    cloudinary.api.delete_resources(fileName, (error, result) => {
      console.log(result);
    });

    const status = product > 0 ? 200 : 404;
    return res.status(status).json({
      message: product > 0 ? `${product} product are deleted` : "Has error when delete product",
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getProducts = async ({page, limit, order, name, category, price, priceGte, priceLte, ...query}, res) => {
  try {
    const queries = {raw: true, nes: true}
    const offset = (!page || +page<=1) ? 0 : (+page - 1)
    if (limit) {
      queries.offset = offset * +limit
      queries.limit = +limit
    }
    if(order) queries.order = [order]
    if(name) query.title = {[Op.iLike]: `${name}%`}
    if(category) query.title = {[Op.substring]: category}
    if(price) query.price = {[Op.eq]: +price}
    if(priceGte && !priceLte) {
      query.price = {[Op.gte]: +priceGte}
    } else if (!priceGte && priceLte) {
      query.price = {[Op.lte]: +priceLte}
    }
    if(priceGte && priceLte) query.price = {[Op.between]: [+priceGte, +priceLte]}
    
    const products = await db.Product.findAll({
      where: query,
      offset: queries.offset,
      limit: queries.limit,
      order: queries.order,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      }
    });
    return res.status(200).json({
      message: products.length > 0 ? "Fetch product successfully" : "No product in database",
      productData: products
    });
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


