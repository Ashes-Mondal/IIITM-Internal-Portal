import crypto from "crypto";
import path from "path";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    metadata: { originalname: file.originalname },
                    bucketName: "uploads",
                    uploadDate: Date.now(),
                };
                resolve(fileInfo);
            });
        });
    },
});

export default multer({ storage })