import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import avatar from '../../images/avatar2.svg'
import dbConnect from '../../lib/dbConnect';
import users from '../../models/users';


export default function Profile({ CurrUser, qbookmarks, abookmarks }) {
	qbookmarks = JSON.parse(qbookmarks)
	abookmarks = JSON.parse(abookmarks)

	const { data: session, status } = useSession()
	const router = useRouter()

	const user: { user?: string, id?: string, email?: string, image?: string } = session?.user || null
	const [name, setName] = useState(CurrUser?.name || CurrUser?.email.split('@')[0])
	const [email, setEmail] = useState(CurrUser?.email)
	const [headline, setHeadline] = useState(CurrUser?.headline)
	const [linkedin, setLinkedin] = useState(CurrUser?.linkedin || null)
	const [image, setImage] = useState(CurrUser?.image || null)

	useEffect(()=>{
		setName(CurrUser?.name || CurrUser?.email.split('@')[0])
		setEmail(CurrUser?.email)
		setHeadline(CurrUser?.headline)
		setLinkedin(CurrUser?.linkedin || null)
		setImage(CurrUser?.image || null)
	},[CurrUser])

	const handleSubmit = async () => {
		if (name.length < 1) return
		if (headline.length < 1) return
		if (linkedin && linkedin.substring(0, 25) != "https://www.linkedin.com/") return
		try {
			const res = await axios.put('/api/update-profile', { name, headline, linkedin });
			if (!res.data.error) {
				router.reload()
				return
			} else {
				console.error(res.data.error)
				alert(res.data.error)
			}
		} catch (error) {
			console.error(error)
			alert(error)
		}
	}

	const handleAvatarSubmit = async (file) => {
		if (!file) {
			return
		}
		const data = new FormData();
		data.append(`profilePicture`, file);
		data.append(`link`, image);

		try {
			const res = await axios.put('/api/update-profile/avatar', data,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			if (!res.data.error) {
				router.reload()
				return
			} else {
				console.error(res.data.error)
				alert(res.data.error)
			}
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	//img classess
	const imgClasses = () => {
		let classes = "rounded-xl border border-black "
		if (CurrUser.email == user?.email)
			classes = "cursor-pointer " + classes
		return classes
	}
	return <>
		{session ? <Header /> : null}
		<section className="flex flex-col w-full bg-white lg:max-w-full px-6 lg:px-16 xl:px-12 justify-around items-center" style={{ minHeight: `${session ? '94vh' : '100vh'}` }}>
			<form className="mt-6 w-full md:w-1/2 sm:w-1" onSubmit={async (e) => {
				e.preventDefault()
				await handleSubmit()
			}}>
				<div className="flex flex-wrap items-center justify-center text-3xl font-bold">
					User profile
				</div>
				<label htmlFor='profilePicture'>
					{
						image ?
							<img className={imgClasses()} src={`${image}`} alt="" width={50} height={50} /> :
							<Image className={imgClasses()} src={avatar} alt="" width={50} height={50} />
					}
					<input disabled={CurrUser.email != user?.email} type="file" style={{ display: "none" }} accept="image/png ,image/jpeg" id="profilePicture" onChange={async (e) => {
						e.preventDefault()
						CurrUser.email == user?.email ?
							await handleAvatarSubmit(e.target.files[0]) : null
					}} />
				</label>

				<label className="block text-gray-700 mt-4 "><span className='font-semibold text-xl'>UserID: </span>{CurrUser.id}</label>
				{linkedin ? <label className="block text-gray-700 mt-4 "><span className='font-semibold text-xl'>LinkedIn: </span><span onClick={() => { router.push(linkedin) }} className='cursor-pointer text-sky-600 underline decoration-sky-600 hover:decoration-blue-400'>{linkedin}</span></label>
					:
					null
				}

				{
					name == null || name.length == 0 ? <label className="block text-red-700 mt-4">Please fill your name...</label> : null
				}

				<div>
					<label className="block text-gray-700 mt-4">Username</label>
					<input disabled={CurrUser.email !== user?.email} value={name} onChange={e => { setName(e.target.value) }} type="text" placeholder="Enter name" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>

				{
					headline == null || headline.length == 0 ? <label className="block text-red-700 mt-4">Please fill the headline...</label> : null
				}
				<div>
					<label className="block text-gray-700 mt-4">Headline</label>
					<input disabled={CurrUser.email !== user?.email} value={headline} onChange={e => { setHeadline(e.target.value) }} type="text" placeholder="Hi i am a new user" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required />
				</div>

				{
					linkedin && linkedin.substring(0, 25) != "https://www.linkedin.com/" ? <label className="block text-red-700 mt-4">Link must contain https://www.linkedin.com/ </label> : null
				}
				<div>
					<label className="block text-gray-700 mt-4">Linkedin Link</label>
					<input disabled={CurrUser.email !== user?.email} value={linkedin} onChange={e => { setLinkedin(e.target.value) }} type="text" placeholder="Enter LinkedIn Link" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" />
				</div>

				<div>
					<label className="block text-gray-700 mt-4">Email Address</label>
					<input value={email} disabled type="text" placeholder="Enter name" className="cursor-not-allowed w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
				</div>

				{
					CurrUser.email == user?.email ?
						<button type="submit" className="w-full  block bg-sky-700 hover:bg-sky-600 focus:bg-sky-600 text-white font-semibold rounded-lg px-4 py-3 mt-8 mb-8">Update</button>
						: null
				}
			</form>
			{
				CurrUser.email == user?.email ?
					(
						<>
							<div className="flex flex-wrap items-center justify-center text-3xl font-bold">
								{qbookmarks?.length ? 'Questions Bookmark' : ''}
							</div> 
							{
								qbookmarks.map((q, idx) => {
									return (
										<Link key={idx} passHref href={`/stackoverflow/question/${q._id}`}>
											<p className='text-xs cursor-pointer text-sky-600 hover:text-blue-400 underline mb-2'>
												{q.questionTitle}
											</p>
										</Link>
									)
								})
							}
							<div className="flex flex-wrap items-center justify-center text-3xl font-bold">
								{abookmarks?.length ? 'Answers Bookmark' : ''}
							</div>
							{
								abookmarks.map((a, idx) => {
									return (
										<Link key={idx} passHref href={`/stackoverflow/question/${a.questionID._id}?aid=${a._id}`}>
											<p className='text-xs cursor-pointer text-sky-600 hover:text-blue-400 underline mb-2'>
												{a.questionID.questionTitle}
											</p>
										</Link>
									)
								})
							}
						</>
					)
					: null
			}


		</section>
	</>

}

export async function getServerSideProps(context) {
	const { params } = context
	const { id } = params

	await dbConnect()
	let CurrUser, qBook, aBook
	try {
		CurrUser = await users.findById(id)
			.populate({
				path: "starredAnswers",
				select: "_id questionID",
				populate: { path: "questionID", select: "_id questionTitle" },
			})
			.populate({
				path: "starredQuestions",
				select: '_id questionTitle'
			})
		qBook = CurrUser['starredQuestions']
		aBook = CurrUser['starredAnswers']
		// console.log(CurrUser)
	} catch (error) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}

	if (!id || !CurrUser) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}
	// console.log(CurrUser)
	let userid: string = CurrUser?._id?.toString();
	let obj = {
		id: userid,
		name: CurrUser.name || null,
		headline: CurrUser?.headline || null,
		linkedin: CurrUser?.linkedin || null,
		email: CurrUser.email,
		image: CurrUser.image || null
	}
	return {
		props: { CurrUser: obj, qbookmarks: JSON.stringify(qBook), abookmarks: JSON.stringify(aBook) },
	}
}