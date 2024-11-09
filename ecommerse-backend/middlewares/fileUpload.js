import util from 'util';
import fs from 'fs';
import multer from 'multer';

export const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const path = process.env.PRODUCT
        fs.mkdirSync(path, { recursive: true });
        callback(null, path)
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg", "image/jfif"];
        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }
        const filename = file.originalname;
        callback(null, filename);
    }
})

const uploadFiles = multer({ storage }).array("images");
const uploadFilesMiddleware = util.promisify(uploadFiles);

export { uploadFilesMiddleware };