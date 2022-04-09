import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from '../../lib/nextConnect'
import { getSession } from "next-auth/react"

const handler = nextConnect

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const user: any = session.user
	const id = user.id.toString()
	if (!session) {
		res.status(401).json({ data: null, error: 'UNAUTHORIZED' })
		return
	}
	//*Client is signedIn
	const { page } = req.query
	if (page == 'profile') {
		res.redirect(`/profile/${id}`)
	} else {
		res.redirect('/')
	}
})
export default handler