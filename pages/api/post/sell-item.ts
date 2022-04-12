import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import nextConnect from '../../../lib/nextConnect'
import dbConnect from '../../../lib/dbConnect'
import { singleFileUpload } from '../../../lib/gridFs'
import trade from '../../../models/trade'

const handler = nextConnect

handler.post(singleFileUpload, async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
	const session = await getSession({ req });
	const user: any = session.user
	const id = user.id
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	//*Client is signedIn
	try {
		const data = JSON.parse(req.body.data)
		let url = 'https://image1.jdomni.in/jdomni_email/searchProduct2.png'
		if(req.file)
		{
			url = `${process.env.NEXTAUTH_URL}/api/image?id=${req.file.id}`
		}
		// console.log(data,url)

		await dbConnect()
		const doc = await trade.create({
			image: url,
			userID: id,
			productName: data.productName,
			description: data.description,
			cost: data.cost
		})
		doc.save()
		res.status(200).json({ data: "Success", error: null })
	} catch (error) {
		console.log(error)
		res.status(500).json({ data: null, error: 'INTERNAL_SERVER_ERROR' })
	}
})
export const config = {
	api: {
		bodyParser: false,
	},
};
export default handler
/**
 * let prevFileID = null
		if(req.body.data.link.includes(`${process.env.NEXTAUTH_URL}/api/image`))
		{
			const url = new URL(req.body.data.link);
			const urlParams = new URLSearchParams(url.search);
			prevFileID = urlParams.get('id');
		}
		if(prevFileID)
		{
			await deleteFile(prevFileID)
		}
 */