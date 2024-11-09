import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Number, default: 0 },
    cart: { type: Array, default: [] },
    password: { type: String, required: true, minLength: 8 }
}, { versionKey: false, timestamps: true });

userSchema.index({ email: 1 })

export const User = mongoose.model("User", userSchema);
