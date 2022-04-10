import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import dbConnect from '../../../../lib/dbConnect'
import answers from '../../../../models/answers'
import comments from '../../../../models/comments'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != "POST") {
		res.status(404).json({ data: null, error: 'NOT_FOUND' })
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
		const doc = await comments.create({comment:req.body.comment,userID:id,})
		doc.save()
		await answers.findByIdAndUpdate(req.body.aid,{ $addToSet:{comments:doc._id} },{new:true}).populate("userID");
		res.status(200).json({ data: doc._id, error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" })
	}

}
export default handler