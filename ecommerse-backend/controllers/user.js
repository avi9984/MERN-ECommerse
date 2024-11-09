import { User } from '../models/user.js';
import { validEmail, validPwd } from '../utils/validator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../utils/tokenService.js';



export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!(username && email && password)) {
            return res.status(400).json({ status: false, message: `Required all field ${req.body}` });
        }
        if (!validEmail(email)) {
            return res.status(400).json({ status: false, message: 'Invalid email' });
        }
        const userExit = await User.findOne({ email: email.toLowerCase() });
        if (userExit) {
            return res.status(400).json({
                status: false,
                message: "User already exist, Please login now!!"
            })
        }
        if (!validPwd(password)) {
            return res.status(400).json({
                status: false,
                message: '"Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters'
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email: email.toLowerCase(),
            password: hashPassword
        });

        await user.save();
        // Create access and refresh tokens
        const accessToken = await createAccessToken({ id: user._id });
        const refreshToken = await createRefreshToken({ id: user._id });



        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: '/users/refresh_token'
        })
        res.status(201).json({
            status: true,
            message: "User created successfully!!",
            accessToken,
            refreshToken
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refreshToken;
        if (!rf_token) return res.status(400).json({
            status: false,
            message: "Please Login or Registers"
        });
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(400).json({
                status: false,
                message: "Please Login or Registers",
            })
            const accesstoken = await createAccessToken({ id: user.id })

            return res.json({
                status: true,
                accesstoken
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ status: false, message: "Email and password is requied to login" })
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: false, message: "Your does not exist in database" })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: false, message: "Invalid credencail" })
        const accesstoken = await createAccessToken({ id: user._id })
        const refreshToken = await createRefreshToken({ id: user._id })

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            path: '/users/refresh_token'
        })
        return res.status(200).json({
            status: true,
            message: "User login success",
            token: accesstoken
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/users/refresh_token' })
        return res.status(200).json({ message: "User successfully logout" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select({ password: 0 })
        if (!user) return res.status(404).json({ status: false, message: "User not found" })
        return res.status(200).json({ status: true, message: "User profile", user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}