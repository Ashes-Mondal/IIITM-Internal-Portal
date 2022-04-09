import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/dbConnect';
import mongoose from 'mongoose'
import nextConnect from '../../../lib/nextConnect'
import questions from '../../../models/questions';
import tagsModel from '../../../models/tags';

import { getSession } from 'next-auth/react';
const ObjectID = mongoose.Types.ObjectId;

const handler = nextConnect

const handleNewTags = async (tags) => {
	try {
		for (let i = 0; i < tags.length; i++) {
			const doc = await tagsModel.create({ value: tags[i] });
			await doc.save();
		}
		return "Success";
	} catch (error) {
		throw error;
	}

}
dbConnect()
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
	let newTags = []
	try {
		const session: any = await getSession({ req });
		console.log(session);
		if (!session) {
			res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
			return
		}

		console.log(req.body)
		const tags = req.body.tags.map(tag => {
			if (tag.__isNew__) {
				newTags.push(tag.value);
			}
			return tag.value;
		})
		const doc = await questions.create({ question: req.body.content, questionTitle: req.body.title, userID: session.user.id, tags });
		await doc.save();
		res.status(200).json({ data: doc, error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: error })
	}
	//after sending response insert tags
	if (newTags.length) {
		handleNewTags(newTags).then(resp => {
			console.log(resp);
		}).catch(error => {
			console.log(error);
		})
	}
})
export default handler