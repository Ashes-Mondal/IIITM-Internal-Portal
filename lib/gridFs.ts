import mongoose from 'mongoose'
import upload from "../models/uploads";
import multer from "multer";
import dbConnect from './dbConnect';
import path from "path";
const ObjectID = mongoose.Types.ObjectId;
import { getSession } from "next-auth/react"


const singleUpload = upload.single("profilePicture")
export const singleFileUpload = async (req, res, next) => {
	const session = await getSession({ req });
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	await dbConnect()
	singleUpload(req, res, (err) => {
		const file = req.file
		const ext = path.extname(file.originalname)
		if (ext != '.png' && ext != '.jpg' && ext != '.jpeg') {
			res.status(400).json({ data: null, error: "Files limited to png,jpg,svg ONLY!" });
			return
		}
		if (err instanceof multer.MulterError) {
			res.status(400).json({ data: null, error: "File too large" });
			return;
		} else if (err) {
			console.log("File upload error:", err);
			res.status(500).json({ data: null, error: err });
			return;
		}
		next();
	});
};

export const deleteFile = async (fileID) => {
	try {
		const { gfs } = await dbConnect()
		const _id = new ObjectID(fileID);
		gfs.delete(_id);
	} catch (error) {
		throw error;
	}
};

export const downloadFile = async ({ query: { id } }, res) => {
	if (!id || id === "undefined") {
		res.status(400).json({ data: null, error: "No file id provided" });
		return;
	}
	try {
		const { gfs } = await dbConnect()
		gfs.find({ _id: new ObjectID(id) }).toArray((err, files) => {
			if (err) {
				res.status(500).json({
					data: null,
					error: "INTERNAL_SERVER_ERROR",
				});
				return;
			} else if (!files || files.length === 0)
				return res.status(404).json({ data: null, error: "NOT_FOUND" });
			const originalname = files[0].metadata.originalname;
			// res.set("Content-Disposition", "attachment;filename=" + originalname);
			gfs.openDownloadStream(new ObjectID(id)).pipe(res);
		});
	} catch (error) {
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" });

	}

};