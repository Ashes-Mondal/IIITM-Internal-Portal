import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dbConnect from '../../../lib/dbConnect';
import questions from '../../../models/questions';
import dynamic from 'next/dynamic'
import Loading from '../../../components/Loading'
import style from '../../../styles/question.module.scss'
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { BsArrowUpCircle } from "react-icons/bs";
import { BsArrowDownCircle } from "react-icons/bs";
import { BsBookmarks } from "react-icons/bs";
import { BsBookmarksFill } from "react-icons/bs";
import { BsShareFill } from "react-icons/bs";

import Head from 'next/head';
import hljs from 'highlight.js'
import { RWebShare } from "react-web-share";
import { Button } from '@chakra-ui/react';
import users from '../../../models/users';
import answers from '../../../models/answers';
import { Textarea, Text } from '@chakra-ui/react'
import Link from 'next/link';
import avatar from '../../../images/avatar2.svg'
import { Spinner } from '@chakra-ui/react'


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => <Loading />,
})
const mods = {
	syntax: {
		highlight: (text: string) => hljs.highlightAuto(text).value,
	},
}
const modules = {
	syntax: {
		highlight: (text: string) => hljs.highlightAuto(text).value,
	},
	toolbar: [
		[{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image'],
		['code-block']
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'video',
	'code-block',
]

function getFormattedDate(dat) {
	if (!dat) return
	let d = new Date(dat).toLocaleDateString();
	let t = new Date(dat).toLocaleString();


	// let str = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

	return t;
}

const getNumString = (num) => {
	const k = Math.floor(num / 1000)
	const m = Math.floor(num / 1000000)
	if (m >= 1) return m.toString() + "M";
	if (k >= 1) return k.toString() + "K";
	return num
}

const Answer = ({ id, session }) => {
	//getNumString(question.upvote.length + question.downvote.length)
	//vote
	const [details, setAnswer] = useState(null)
	const [voted, setVote] = useState(0)//+1 0 -1
	const [votes, setVotes] = useState(0)

	const [bookMarked, setBookmarked] = useState(false)
	const [comment, setComment] = useState('')
	const [commentList, setCommentList] = useState([])
	const [showComments, setshowComments] = useState(false)

	// console.log("details",details)
	const handleVote = (num) => {
		const data = {
			prevVal: voted,
			newVal: num,
			aid: id
		}
		let c = votes
		if (num === 0) c--;
		else if (voted === 0) ++c;

		axios.put('/api/update/answer/vote', data).then(resp => { setVote(num); setVotes(getNumString(c)) }).catch((e) => { alert('Failed to vote!') })
	}

	const handleBookMark = (status) => {
		const data = {
			status,
			aid: id
		}
		axios.put('/api/update/answer/bookmark', data).then(resp => { setBookmarked(status); }).catch((e) => { alert('Failed to bookmark!') })
	}


	const answeredDate = getFormattedDate(details?.date)
	const siteURL = window.location.href
	const handleCommentPost = () => {
		if (comment.length < 1) return
		const data = {
			aid: id,
			comment,
		}
		axios.post('/api/post/answer/comment', data).then(resp => {
			setCommentList([...commentList, resp.data.data]);
			setComment('');
		}).catch((e) => { alert('Failed to post comment!') })
	}

	useEffect(() => {
		axios.get(`/api/fetch/answer?id=${id}`).then(resp => {
			setAnswer(resp.data.data)
			setCommentList(resp.data.data.comments)
			const uid = session.user.id
			if (resp.data.data.upvote.includes(uid)) {
				setVote(1)
			}
			else if (resp.data.data.downvote.includes(uid)) {
				setVote(-1)
			}
			setVotes(resp.data.data.upvote.length + resp.data.data.downvote.length)
			axios.get(`/api/fetch/user`).then(resp => {
				if (resp.data.data.starredAnswers?.includes(id)) {
					setBookmarked(true)
				}
			})
		}).catch(err => console.error(err))
	}, [])

	return (
		<div id={id} className='container mx-auto  border border-slate-300'>
			<div className='pt-4 pb-2 border-b border-b-slate-300 px-2'>
				<div className='flex justify-between items-center md:px-5 pt-4'>
					<div>
						Answered: <span className='font-bold text-sm'>{answeredDate}</span>
					</div>
					<div>
						<Link passHref href={`/profile/${details?.userID._id}`}>
							<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1'>
								{details?.userID.image == null ? <Image src={avatar} alt="" width={14} height={12} />
									:
									<img className='rounded-xl border border-black cursor-pointer' src={`${details?.userID.image}`} alt="" width={20} height={20} />}
								{details?.userID.name}
							</span>
						</Link>
					</div>
				</div>
			</div>
			<div className='flex' >
				<div className='py-16 flex flex-col items-center gap-2 md:w-16'>
					<div>
						{
							voted === 1 ? <BsFillArrowUpCircleFill size={25} className='cursor-pointer' onClick={() => { handleVote(0) }} />
								:
								<BsArrowUpCircle size={25} className='cursor-pointer' onClick={() => { handleVote(1) }} />
						}
					</div>
					{votes}
					<div>
						{
							voted === -1 ? <BsFillArrowDownCircleFill size={25} className='cursor-pointer' onClick={() => { handleVote(0) }} />
								:
								<BsArrowDownCircle size={25} className='cursor-pointer' onClick={() => { handleVote(-1) }} />
						}
					</div>
					<div>
						{
							bookMarked ?
								<BsBookmarksFill size={25} className='cursor-pointer' onClick={() => { handleBookMark(false) }} />
								:
								<BsBookmarks size={25} className='cursor-pointer' onClick={() => { handleBookMark(true) }} />
						}
					</div>
				</div>
				<QuillNoSSRWrapper readOnly modules={mods} value={details?.answer} theme="snow" className='quill_container' />
			</div>
			<div className='px-2 py-2'>
				<span className='text-lg font-bold pl-4 md:pl-8'>Comments: ({getNumString(commentList.length)})</span> <span className='cursor-pointer text-sky-400 underline text-sm' onClick={() => { setshowComments(!showComments) }}> {showComments ? "Hide comments" : "Show comments"}</span>

				{
					showComments ? commentList.length ?
						commentList.map((id, idx) => {
							return <Comment key={idx} id={id} />
						})
						:
						<div className='text-sm pl-4 md:pl-8 pb-2'>No Commnets ...</div>
						:
						null
				}
				<div className='pr-2 flex gap-2 pb-2 pl-4 md:pl-8 items-center'>
					<Textarea maxLength={500} value={comment} minHeight={'50px'} resize={'none'} variant={'filled'} placeholder='Add a comment' size='sm' onChange={(e => { setComment(e.target.value) })} /><span className='cursor-pointer text-sky-400 hover:underline text-sm' onClick={handleCommentPost}> Post</span>
				</div>
			</div>
		</div>
	)
}

const Comment = ({ id }) => {
	const [details, setcomment] = useState(null)
	const askedDate = getFormattedDate(details?.date)

	useEffect(() => {
		axios.get(`/api/fetch/comment?id=${id}`).then(resp => { setcomment(resp.data.data) }).catch(err => console.error(err))
	}, [])

	return (
		<>
			{
				details ? (
					< div className='mb-2 border p-2 ml-8' >
						<div className='text-xs' >
							{details?.comment}
						</div >
						<div className='flex flex-wrap justify-end gap-2 text-xs mt-1'>
							<Link passHref href={`/profile/${details?.userID._id}`}>
								<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1'>
									{details?.userID.image == null ? <Image src={avatar} alt="" width={12} height={12} />
										:
										<img className='rounded-xl border border-black cursor-pointer' src={`${details?.userID.image}`} alt="" width={12} height={12} />}
									{details?.userID.name}
								</span>
							</Link>
							<span className="font-semibold">
								commented on {askedDate}
							</span>
						</div>
					</div >
				) :
					<div className='mb-2 border p-2 ml-8 flex justify-center items-center'>
						<Spinner
							thickness='2px'
							speed='0.7s'
							emptyColor='gray.200'
							color='blue.500'
							size='xs'
						/>
					</div>
			}

		</>
	)
}

export default function Question({ question, vote, bookmarked, yourAnswerID, scroll }) {
	question = JSON.parse(question)
	yourAnswerID = JSON.parse(yourAnswerID)


	const { data, status } = useSession()
	const session: any = data
	const router = useRouter()

	const [voted, setVote] = useState(vote)
	const [votes, setVotes] = useState(getNumString(question.upvote.length + question.downvote.length))

	const [bookMarked, setBookmarked] = useState(bookmarked)
	const [answer, setAnswer] = useState('')
	const [comment, setComment] = useState('')
	const [commentList, setCommentList] = useState(question.comments)


	const [isLoading, setisLoading] = useState(false)
	const [showComments, setshowComments] = useState(false)

	const handleVote = (num) => {
		const data = {
			prevVal: voted,
			newVal: num,
			qid: question._id
		}
		let c = votes
		if (num === 0) c--;
		else if (voted === 0) ++c;

		axios.put('/api/update/question/vote', data).then(resp => { setVote(num); setVotes(getNumString(c)) }).catch((e) => { alert('Failed to vote!') })
	}

	const handleBookMark = (status) => {
		const data = {
			status,
			qid: question._id
		}
		axios.put('/api/update/question/bookmark', data).then(resp => { setBookmarked(status); }).catch((e) => { alert('Failed to bookmark!') })
	}

	const handleSubmit = async () => {
		if (answer.length < 1) return
		try {
			const res = await axios.post('/api/update/answer-question', { answer, qid: question._id });
			if (!res.data.error) {
				router.push('/')
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

	const askedDate = getFormattedDate(question.date)
	const siteURL = window.location.href
	const checkDisability = () => {
		if (answer.length && !isLoading) return false;
		return true;
	}
	const handleCommentPost = () => {
		if (comment.length < 1) return
		const data = {
			qid: question._id,
			comment,
		}
		axios.post('/api/post/question/comment', data).then(resp => {
			setCommentList([...commentList, resp.data.data]);
			setComment('');
		}).catch((e) => { alert('Failed to post comment!') })
	}

	useEffect(() => {
		if (scroll) {
			const Element =  document.getElementById(scroll)
			Element.scrollIntoView({ behavior: 'smooth' })
		}
	}, [])
	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/monokai-sublime.min.css" />
			</Head>
			<div className='container mx-auto  border border-slate-300'>
				<div className='pt-4 pb-2 border-b border-b-slate-300 px-2'>
					<div className='text-2xl font-bold'>
						{question.questionTitle}
					</div>
					<div className='flex justify-between items-center md:px-5 pt-4'>
						<div>
							Asked: <span className='font-bold text-sm'>{askedDate}</span>
						</div>
						<div>
							Views: <span className='font-bold text-sm'>{getNumString(question.views)}</span>
						</div>
						<RWebShare
							data={{
								text: question.questionTitle,
								title: "Share",
								url: siteURL
							}}
							onClick={() => console.log("shared successfully!")}
						>
							<div className='flex gap-1 cursor-pointer items-center'>
								<BsShareFill size={15} /> Share
							</div>
						</RWebShare>
					</div>
				</div>
				<div className='flex'>
					<div className='py-16 flex flex-col items-center gap-2 w-64 md:w-40'>
						<div>
							{
								voted === 1 ? <BsFillArrowUpCircleFill size={25} className='cursor-pointer' onClick={() => { handleVote(0) }} />
									:
									<BsArrowUpCircle size={25} className='cursor-pointer' onClick={() => { handleVote(1) }} />
							}
						</div>
						{votes}
						<div>
							{
								voted === -1 ? <BsFillArrowDownCircleFill size={25} className='cursor-pointer' onClick={() => { handleVote(0) }} />
									:
									<BsArrowDownCircle size={25} className='cursor-pointer' onClick={() => { handleVote(-1) }} />
							}
						</div>
						<div>
							{
								bookMarked ?
									<BsBookmarksFill size={25} className='cursor-pointer' onClick={() => { handleBookMark(false) }} />
									:
									<BsBookmarks size={25} className='cursor-pointer' onClick={() => { handleBookMark(true) }} />
							}
						</div>
					</div>
					<QuillNoSSRWrapper readOnly id='ques_container' modules={mods} value={question.question} theme="snow" className={style['question_container']} />
				</div>
				<div className='px-2 py-2'>
					<span className='text-lg font-bold pl-4 md:pl-8'>Comments: ({getNumString(commentList.length)})</span> <span className='cursor-pointer text-sky-400 underline text-sm' onClick={() => { setshowComments(!showComments) }}> {showComments ? "Hide comments" : "Show comments"}</span>

					{
						showComments ? commentList.length ?
							commentList.map((id, idx) => {
								return <Comment key={idx} id={id} />
							})
							:
							<div className='text-sm pl-4 md:pl-8 pb-2'>No Commnets ...</div>
							:
							null
					}
					<div className='pr-2 flex gap-2 pb-2 pl-4 md:pl-8 items-center'>
						<Textarea maxLength={500} value={comment} minHeight={'50px'} resize={'none'} variant={'filled'} placeholder='Add a comment' size='sm' onChange={(e => { setComment(e.target.value) })} /><span className='cursor-pointer text-sky-400 hover:underline text-sm' onClick={handleCommentPost}> Post</span>
					</div>
				</div>
			</div>
			<div className='mt-8 container mx-auto'>
				{
					question.answers.length ? <div className='text-lg font-bold px-2'>ANSWERS:</div> : null
				}
				{
					question.answers.map((aid, idx) => {
						return <Answer key={idx} id={aid} session={session} />
					})
				}
			</div>

			<div className='mt-8 container mx-auto pb-8'>
				<div className='text-lg font-bold px-2'>YOUR ANSWER:</div>
				{
					yourAnswerID ?
						<Answer id={yourAnswerID} session={session} />
						:

						<div>
							<QuillNoSSRWrapper modules={modules} formats={formats} id='quill_container' value={answer} onChange={(val) => setAnswer(val)} theme="snow" className={style['question_container']} />

							<Button
								onClick={async (e) => {
									e.preventDefault();
									setisLoading(true)
									await handleSubmit()
									setisLoading(false)
								}}
								className='!w-full px-4 mt-2 mb-8'
								isLoading={isLoading}
								loadingText='Submitting'
								colorScheme='teal'
								variant='solid'
								disabled={checkDisability()}
							>
								Submit
							</Button>
						</div>
				}
			</div>

		</>
	)
}

export async function getServerSideProps(context) {
	const { params, query } = context
	const { id } = params
	const { aid } = query
	const session: any = await getSession(context)
	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}

	await dbConnect()
	let theQuestion
	let voted = 0
	try {
		theQuestion = await questions.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
		if (theQuestion.upvote.includes(session.user.id)) {
			voted = 1
		}
		else if (theQuestion.downvote.includes(session.user.id)) voted = -1
	} catch (error) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}

	if (!id || !theQuestion) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}
	let bookmarked = false;
	try {
		const { starredQuestions } = await users.findById(session.user.id, { starredQuestions: true, _id: false })
		if (starredQuestions.includes(id)) bookmarked = true;
	} catch (error) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}
	let yourAnswer = null
	let answerID = null
	try {
		yourAnswer = await answers.findOne({ questionID: id, userID: session.user.id })
		answerID = yourAnswer._id
	} catch (error) {
		yourAnswer = null
	}
	if (answerID) {
		theQuestion.answers.remove(answerID)
	}
	return {
		props: { scroll: aid || null, question: JSON.stringify(theQuestion), vote: voted, bookmarked, yourAnswerID: JSON.stringify(answerID) },
	}
}

Question.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}


