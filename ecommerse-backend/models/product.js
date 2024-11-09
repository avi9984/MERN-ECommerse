import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    product_id: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    content: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: ObjectId, required: true },
    checked: { type: Boolean, default: false },
    sold: { type: Number, default: 0 }
}, { versionKey: false, timestamps: true })

productSchema.index({ product_id: 1 })

export const Product = mongoose.model('Product', productSchema);