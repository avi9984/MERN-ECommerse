import express from 'express';
const router = express.Router();
import { getProduct, createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/product.js';
import { auth, adminAuth } from '../middlewares/auth.js';
import { uploadFilesMiddleware } from '../middlewares/fileUpload.js';

router.get('/get', getProduct);
router.post('/create', auth, adminAuth, uploadFilesMiddleware, createProduct);
router.put('/update/:id', auth, adminAuth, uploadFilesMiddleware, updateProduct);
router.delete('/delete/:id', auth, adminAuth, deleteProduct);
router.get('/get/:id', getProductById);

export default router;