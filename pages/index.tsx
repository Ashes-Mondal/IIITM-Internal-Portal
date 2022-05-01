import { getCsrfToken, getSession, getProviders, signIn } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import planet from '../images/planet.svg'

const errors: Record<string, string> = {
	'Signin': "Try signing with a different account.",
	'OAuthSignin': "Try signing with a different account.",
	'OAuthCallback': "Try signing with a different account.",
	'OAuthCreateAccount': "Try signing with a different account.",
	'EmailCreateAccount': "Try signing with a different account.",
	'Callback': "Try signing with a different account.",
	'OAuthAccountNotLinked': "To confirm your identity, sign in with the same account you used originally.",
	'EmailSignin': "Check your email address.",
	'CredentialsSignin': "Sign in failed. Check the details you provided are correct.",
	'SessionRequired': `Session expired, LogIn to continue.`,
	'AccessDenied': "Access Denied, Please Login with institute email.",
	'default': "Unable to sign in.",
};
//"https://i.imgur.com/81RTZEw.png"
export default function Login({ csrfToken, providers, session, mailSent, }) {
	const [email, set_email] = useState("")
	const { error } = useRouter().query;
	const k: any = error
	const [msg, set_msg] = useState(mailSent ? "Please check your email..." : k ? errors[k] || errors['default'] : null)
	useEffect(() => {
		set_msg(mailSent ? "Please check your email..." : k ? errors[k] || errors['default'] : null)
	}, [mailSent, k])
	return (
		<>
			<section className="flex flex-col md:flex-row h-screen items-center">
				<div className="bg-blue-600 hidden md:block w-full md:w-1/2 xl:w-2/3 h-screen">
					<img src='https://free4kwallpapers.com/uploads/originals/2021/03/12/low-poly-planet-wallpaper.jpg' alt="" className="w-full h-full  object-cover" />
				</div>

				<div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">

					<div className="w-full h-100">
						<div className="flex flex-wrap items-center">
							<Link passHref={true} href="/">
								<Image className="cursor-pointer" src={planet} alt="" width={40} height={40} />
							</Link>
							IIITM
						</div>
						{/* <Link href="/" passHref><h1 className="text-xl font-bold cursor-pointer">IIITM</h1></Link> */}

						<h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

						<form className="mt-6" onSubmit={(e) => {
							e.preventDefault()
							if (email.length < 1) {
								set_msg("Please enter email...")
								return
							}
							signIn('email', {
								email: email,
								callbackUrl: "/home"
							})
						}}>
							<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
							{
								msg ? <label className="block text-red-700">{msg}</label> : null
							}

							<div>
								<label className="block text-gray-700">Email Address</label>
								<input onChange={(e) => set_email(e.target.value)} type="email" name="email" id="email" placeholder="Enter Email Address" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
							</div>

							<button type="submit" className="w-full block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-6">Log In with Email</button>
						</form>

						<div className="divider"><span></span><span>OR</span><span></span></div>
						<button type="submit" onClick={(e) => {
							e.preventDefault()
							signIn('google', { callbackUrl: '/home' })
						}}
							className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg   px-6 py-3 mt-6">
							<svg className="text-white inline w-4 h-4 mr-3 fill-current" fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">    <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866 c-3.431,0.635-6.862-1.865-7.19-5.339c-0.34-3.595,2.479-6.62,6.005-6.62c1.002,0,1.946,0.246,2.777,0.679 c0.757,0.395,1.683,0.236,2.286-0.368l0,0c0.954-0.954,0.701-2.563-0.498-3.179c-1.678-0.862-3.631-1.264-5.692-1.038 c-4.583,0.502-8.31,4.226-8.812,8.809C1.945,16.9,6.649,22,12.545,22c6.368,0,8.972-4.515,9.499-8.398 c0.242-1.78-1.182-3.352-2.978-3.354l-4.61-0.006C13.401,10.24,12.545,11.095,12.545,12.151z" /></svg>
							Sign in with Google
						</button>
						<button type="submit" onClick={(e) => {
							e.preventDefault()
							signIn('github', { callbackUrl: '/home' })
						}}
							className="w-full block bg-black hover:bg-slate-600 focus:bg-slate-600 text-white font-semibold rounded-lg   px-6 py-3 mt-6">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-white inline w-4 h-4 mr-3 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
							Sign in with Github
						</button>
					</div>
				</div>

			</section>
		</>
	)
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
	const { mailSent, error } = context.query

	const session = await getSession(context)
	// console.log("session:",session)
	if (session) {
		return {
			redirect: {
				permanent: false,
				destination: "/home",
			},
			props: {},
		}
	}
	const csrfToken = await getCsrfToken(context)
	const providers = await getProviders()

	
	// console.log(csrfToken,providers)
	return {
		props: { csrfToken, providers, session: session, mailSent: mailSent != null, error: error || null },
	}
}
