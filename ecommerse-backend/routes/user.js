import express from 'express';
const router = express.Router();
import { register, refreshToken, login, logOut, getUser } from '../controllers/user.js';
import { auth } from '../middlewares/auth.js';

router.post('/register', register);
router.post('/refresh_token', refreshToken);
router.post('/login', login);
router.post('/logout', logOut);
router.get('/profile', auth, getUser);


export default router


