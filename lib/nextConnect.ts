import nextConnect from "next-connect";
import type { NextApiRequest, NextApiResponse } from 'next'

// Handle Error Here
const handler = nextConnect({
	onError: (err: Error, req: NextApiRequest, res: NextApiResponse) => {
		res.status(500).json({ data: null, error: "INTERNAL_SERVER_ERROR" });
	},
	onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
		res.status(405).json({ data: null, error: "INVALID_REQUEST" });
	},
});
export default handler;