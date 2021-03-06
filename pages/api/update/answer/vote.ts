import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import dbConnect from '../../../../lib/dbConnect'
import answers from '../../../../models/answers'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != "PUT") {
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
		if(req.body.prevVal ===1)
		{
			await answers.findByIdAndUpdate(req.body.aid,{ $pull:{upvote:id} });
		}
		else if(req.body.prevVal ===-1)
		{
			await answers.findByIdAndUpdate(req.body.aid,{ $pull:{downvote:id} });
		}

		if(req.body.newVal === 1)
		{
			await answers.findByIdAndUpdate(req.body.aid,{ $addToSet:{upvote:id} });
		}
		else if(req.body.newVal ===-1)
		{
			await answers.findByIdAndUpdate(req.body.aid,{ $addToSet:{downvote:id} });
		}
		
		res.status(200).json({ data: "SUCCESS", error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" })
	}

}
export default handler