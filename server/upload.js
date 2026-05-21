import multer from 'multer';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

export default upload;