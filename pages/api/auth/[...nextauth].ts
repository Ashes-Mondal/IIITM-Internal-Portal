import nextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"

import connectToDatabase from "../../../lib/mongoDB";
import getAccessToken from "../../../lib/nodemailer";

import nodemailer from "nodemailer"
import { html, text } from "../../../template/LogIn";



export default nextAuth(
	{
		adapter: MongoDBAdapter(connectToDatabase),
		providers: [
			EmailProvider({
				server: process.env.EMAIL_SERVER,
				from: process.env.EMAIL_FROM,
				async sendVerificationRequest({
					identifier: email,
					url,
					provider: { server, from },
				}) {
					const { host } = new URL(url)
					const transport = nodemailer.createTransport({
						service: "gmail",
						auth: {
							type: "OAuth2",
							user: process.env.EMAIL_SERVER_USER,
							accessToken: await getAccessToken(),
							clientId: process.env.OAUTH_CLIENT_ID,
							clientSecret: process.env.OAUTH_CLIENT_SECRET,
							refreshToken: process.env.OAUTH_REFRESH_TOKEN,
						},
					})
					await transport.sendMail({
						to: email,
						from,
						subject: `Sign in to ${host}`,
						text: text({ url, host }),
						html: html({ url, host, email }),
					})
				}
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET
			}),
			GitHubProvider({
				clientId: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET
			})
		],
		secret: process.env.SECRET,
		pages: {
			signIn: `${process.env.NEXTAUTH_URL}`,
			verifyRequest: `${process.env.NEXTAUTH_URL}?mailSent=true`,
			error: `${process.env.NEXTAUTH_URL}`,
			newUser: `${process.env.NEXTAUTH_URL}/api/redirect?page=profile`,
		},
		callbacks:
		{
			async signIn({ user, account, profile, email, credentials }) {
				console.log(account, profile, email, credentials)
				let userEmail = null
				if (account.type === 'email') {
					userEmail = account.providerAccountId
				}
				else
				{
					userEmail = profile.email
				}
				let domain = userEmail?.split('@')[1]
				console.log(domain)
				return domain === 'iiitm.ac.in'
				// return true
			},
			async jwt({ token, account }) {
				// Persist the OAuth access_token to the token right after signin
				console.log("account", account, "token", token)
				if (account) {
					token.accessToken = account.access_token
				}
				return token
			},
			async session({ session, token, user }) {
				// Send properties to the client, like an access_token from a provider.
				// console.log("session", session, "token", token,"user",user)

				if (token && token.accessToken) {
					session.accessToken = token.accessToken
				}
				const sessionUser = {
					id: user.id,
					...session.user
				}
				session.user = sessionUser
				return session
			},
		}
	}
)