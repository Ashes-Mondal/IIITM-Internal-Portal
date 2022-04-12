import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import nextConnect from '../../../lib/nextConnect'
import dbConnect from '../../../lib/dbConnect'
import { deleteFile, singleFileUpload } from '../../../lib/gridFs'
import trade from '../../../models/trade'

const handler = nextConnect

handler.put(singleFileUpload, async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
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
		let url = null
		if(req.file)
		{
			url = `${process.env.NEXTAUTH_URL}/api/image?id=${req.file.id}`
		}
		if(url && data.image?.includes(`${process.env.NEXTAUTH_URL}/api/image`))
		{
			const url = new URL(data.image);
			const urlParams = new URLSearchParams(url.search);
			let prevFileID = urlParams.get('id');
			await deleteFile(prevFileID)
		}
		if(!url)url = data.image
		// console.log(data,url)

		await dbConnect()
		await trade.findByIdAndUpdate(data.id,{
			image: url,
			productName: data.productName,
			description: data.description,
			cost: data.cost
		})
		res.status(200).json({ data: "SUCCESS", error: null })
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
