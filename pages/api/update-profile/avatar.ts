import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from '../../../lib/nextConnect'
import { getSession } from "next-auth/react"
import users from '../../../models/users'
import dbConnect from '../../../lib/dbConnect'
import { singleFileUpload ,deleteFile} from '../../../lib/gridFs'

const handler = nextConnect

handler.put(singleFileUpload, async (req:NextApiRequest & {file:any}, res: NextApiResponse) => {
	const session = await getSession({ req });
	const user: any = session.user
	const id = user.id
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	//*Client is signedIn
	try {
		let prevFileID = null
		if(req.body.link.includes(`${process.env.NEXTAUTH_URL}/api/image`))
		{
			const url = new URL(req.body.link);
			const urlParams = new URLSearchParams(url.search);
			prevFileID = urlParams.get('id');
		}
		if(prevFileID)
		{
			await deleteFile(prevFileID)
		}
		const file = req.file
		const url = `${process.env.NEXTAUTH_URL}/api/image?id=${file.id}`
		await dbConnect()
		const res = await users.findByIdAndUpdate(id, { image: url })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: 'INTERNAL_SERVER_ERROR' })
	}
	res.status(200).json({ data: "Success", error: null })
})
export const config = {
	api: {
		bodyParser: false,
	},
};
export default handler