import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from '../../../lib/nextConnect'
import { getSession } from "next-auth/react"
import dbConnect from '../../../lib/dbConnect'
import users from '../../../models/users';


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
		let theUser = await users.findById(id);
		res.status(200).json({ data: theUser, error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" })
	}

}
export default handler