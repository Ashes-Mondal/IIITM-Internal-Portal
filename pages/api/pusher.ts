import { getSession } from "next-auth/react";
import Pusher from "pusher";

export const pusher = new Pusher({
	appId: process.env.app_id,
	key: process.env.NEXT_PUBLIC_KEY,
	secret: process.env.secret,
	cluster: process.env.cluster,
	useTLS: true,
});

export default async function handler(req, res) {
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
	const { message, sender } = req.body;
	console.log(req.body)

	const response = await pusher.trigger("Notification", "notify-event", {
		message,
		sender:user,
	});

	res.status(200).json({ data: response, error: null })
}