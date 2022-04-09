import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import dbConnect from '../../../lib/dbConnect'
import answers from '../../../models/answers'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != "GET") {
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
		const resp = await answers.find({ userID: id }).populate("questionID");
		let ques = resp.map(q => {
			return {id:q.questionID._id,title:q.questionID.questionTitle}
		})
		res.status(200).json({ data: ques, error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" })
	}

}
export default handler