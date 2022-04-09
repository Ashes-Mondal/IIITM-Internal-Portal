import { google } from "googleapis";

const getAccessToken = async () => {
	const oAuth2Client = new google.auth.OAuth2(
		process.env.OAUTH_CLIENT_ID,
		process.env.OAUTH_CLIENT_SECRET,
		"https://developers.google.com/oauthplayground"
	);
	oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });
	return await oAuth2Client.getAccessToken();
}

export default getAccessToken