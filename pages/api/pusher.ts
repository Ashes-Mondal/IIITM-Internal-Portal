import { getSession } from "next-auth/react";
import Pusher from "pusher";
import notifications from "../../models/notifications";

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
	console.log(req.body,user)
	const { title, notification, value } = req.body;
	let doc = await notifications.create({userID:id,title,notification,type:value?'Emergency':'Normal'})
	doc = await doc.populate('userID')
	if (value) {
		await pusher.trigger("Notification", "emergency-notify-event", doc);
	}
	else {
		await pusher.trigger("Notification", "normal-notify-event", doc);
	}


	res.status(200).json({ data: "SUCCESS", error: null })
}