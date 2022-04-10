import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import dbConnect from '../../../lib/dbConnect'
import answers from '../../../models/answers'
import questions from '../../../models/questions'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != "POST") {
		res.status(404).json({ data: null, error: 'NOT_FOUND' })
		return
	}
	const session = await getSession({ req });
	const user: any = session.user
	const id = user.id
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	//*Client is signedIn
	try {
		await dbConnect()
		// console.log(req.body)
		const doc = await answers.create({userID:id,questionID:req.body.qid,answer:req.body.answer})
		console.log(doc._id)
		await doc.save();

		await questions.findByIdAndUpdate(req.body.qid,{$addToSet:{answers:doc._id}})
		
		res.status(200).json({ data: "SUCCESS", error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" })
	}

}
export default handler