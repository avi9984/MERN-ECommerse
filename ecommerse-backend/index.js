import express from 'express';
const app = express();
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
dotenv.config();
const PORT = process.env.PORT || 5000;
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB is connected")).catch((error) => console.log(error))

app.get('/welcome', (req, res) => {
    res.send('Welcome to backend ecommerse')
});


app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is listen port http://localhost:${PORT}`);
})

