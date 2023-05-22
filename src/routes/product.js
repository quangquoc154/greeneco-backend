const express = require('express');

const productController = require('../controllers/product');

const uploadCloud = require('../config/cloudinary.config');
const verifyToken = require('../middlewares/verify_token');
const { isAdmin } = require("../middlewares/verify_roles");


const router = express.Router();

router.get('/products', productController.getProducts);
// router.use(verifyToken);
// router.use(isAdmin);
router.post('/add-product', uploadCloud.single('image'), productController.addProduct);
router.put('/edit-product', uploadCloud.single('image'), productController.editProduct);
router.delete('/delete-product', productController.deleteProduct);

module.exports = router;
