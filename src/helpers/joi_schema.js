const joi = require("joi");

const email = joi
  .string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
  .required();
// const email = joi.string().pattern(new RegExp('gmail.com')).required()

const password = joi.string().min(6).required();

const prodId = joi.string().required();
const prodIds = joi.array().required();
const title = joi.string().required();
const price = joi.number().required();
const available = joi.number().required();
const imageUrl = joi.string().required();
const description = joi.string().required();
const dateOfManufacture = joi.number().required();
const madeIn = joi.string().required();
const certificate = joi.string().required();

module.exports = {
  prodId,
  prodIds,
  email,
  password,
  title,
  price,
  available,
  imageUrl,
  description,
  dateOfManufacture,
  madeIn,
  certificate,
};
