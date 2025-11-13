import express from 'express';
import getProducts from '../controller/product.controller.js';
const router = express.Router();

router.route('/').get(getProducts);

export default router;