import express from 'express';
const router = express.Router();
import { getCategory, createCategory, updateCategory, deleteCategrory, getCategoryById } from '../controllers/category.js';
import { auth, adminAuth } from '../middlewares/auth.js';

router.get('/get', getCategory);
router.post('/create', auth, adminAuth, createCategory);
router.put('/update/:id', auth, adminAuth, updateCategory);
router.delete('/delete/:id', auth, adminAuth, deleteCategrory);
router.get('/get/:id', getCategoryById);

export default router;


