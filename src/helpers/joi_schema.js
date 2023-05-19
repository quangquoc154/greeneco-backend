const joi = require("joi");

const email = joi
  .string()
  .email({ minDomainSegments: 2 ,tlds: { allow: ["com"] } }).required();
// const email = joi.string().pattern(new RegExp('gmail.com')).required()

const password = joi.string().min(6).required();

module.exports = {
  email,
  password,
};
