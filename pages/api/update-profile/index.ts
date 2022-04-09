import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from '../../../lib/nextConnect'
import { getSession } from "next-auth/react"
import users from '../../../models/users'
import dbConnect from '../../../lib/dbConnect'

const handler = nextConnect

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const user:any = session.user
	const id = user.id
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	//*Client is signedIn
	try {
		await dbConnect()
		const res = await users.findByIdAndUpdate(id,{name:req.body.name,headline:req.body.headline,linkedin:req.body.linkedin})
		// console.log("res",res)
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: 'INTERNAL_SERVER_ERROR' })
	}
	res.status(200).json({ data: "Success", error: null })
})
export default handler