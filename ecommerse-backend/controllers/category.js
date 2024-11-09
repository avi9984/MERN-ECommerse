import { Category } from "../models/category.js";


export const getCategory = async (req, res) => {
    try {
        const category = await Category.find();
        return res.status(200).json({ status: true, message: "All Category", category })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: false, message: "Name is required field" })
        }
        const category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ status: false, message: "Category already exist" })
        }
        await Category.create({ name });
        return res.status(201).json({ status: true, message: "Category Created Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;
        await Category.findByIdAndUpdate({ _id: id }, { name })
        return res.status(200).json({ status: true, message: "Category Updated Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const deleteCategrory = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteCate = await Category.findByIdAndDelete({ _id: id });
        if (!deleteCate) {
            return res.status(404).json({ status: false, message: "Cateogry not found or already deleted" })
        }
        return res.status(200).json({ status: true, message: "Category Deleted Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById({ _id: id });
        if (!category) return res.status(404).json({ status: false, message: "Category not found" })
        return res.status(200).json({
            status: true,
            message: "Category by id",
            data: category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}