import { Category } from "../models/category.js";
import { Product } from "../models/product.js";

export const getProduct = async (req, res) => {
    try {
        const product = await Product.find();
        return res.status(200).json({ status: true, message: "Get all product", product })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}


export const createProduct = async (req, res) => {
    try {
        const { product_id, title, description, price, content, images, category } = req.body;

        if (!(product_id && title && description && price && content && category)) {
            return res.status(400).json({ status: false, message: "All fields are requierd" })
        }
        if (!req.files || req.files.length === 0) return res.status(400).json({ status: false, message: "No Image Upload" })

        let imageUrls = [];
        const files = req.files.map((file) => ({
            filename: file.originalname,
        }));


        for (let file of files) {
            imageUrls.push(file.filename);
        }
        const findCategory = await Category.findById(category);
        if (!findCategory) return res.status(404).json({ status: false, message: "category not found" });

        const product = await Product.findOne({ product_id })
        if (product)
            return res.status(400).json({ status: false, message: "This product already exists" })
        const newProduct = new Product({
            product_id,
            title,
            description,
            price,
            content,
            category,
            images: imageUrls
        })
        await newProduct.save()
        return res.status(201).json({ status: true, message: "Product created successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { title, price, description, content, images, category } = req.body;
        const id = req.params.id;

        let imageUrls = [];
        const files = req.files.map((file) => ({
            filename: file.originalname,
        }));


        for (let file of files) {
            imageUrls.push(file.filename);
        }

        // Build an object containing only the fields that are present in req.body
        const updateData = {};
        if (title) updateData.title = title;
        if (price) updateData.price = price;
        if (description) updateData.description = description;
        if (content) updateData.content = content;
        if (images) updateData.images = imageUrls;
        if (category) updateData.category = category;

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        return res.status(200).json({ status: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete({ _id: id });
        if (!product) return res.status(404).json({ status: false, message: "Product not found or already deleted" })
        return res.status(200).json({ status: true, message: "Product deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate('category').populate('images');
        if (!product) return res.status(404).json({ status: false, message: "product not found" })
        return res.status(200).json({ status: true, message: "product found by id", product })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}