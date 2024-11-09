import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const auth = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ status: false, message: "Authorization header is missing" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ status: false, message: "Token is missing" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ message: "Invalid token" })

            req.user = user;
            next()

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        if (user.role === 0) {
            return res.status(400).json({ status: false, message: "Access denied" })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}