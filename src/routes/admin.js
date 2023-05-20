const express = require('express');

const adminController = require('../controllers/admin');

const uploadCloud = require('../config/cloudinary.config');

const router = express.Router();

router.post('/add-product', uploadCloud.single('image'), adminController.addProduct);
router.put('/edit-product', uploadCloud.single('image'), adminController.editProduct);
router.delete('/delete-product', adminController.deleteProduct);
router.get('/products', adminController.getProducts);

// router.get('/product/:id', adminController.getProductDetail);


module.exports = router;
