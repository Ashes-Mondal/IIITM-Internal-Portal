import axios from 'axios';
import { useSession } from 'next-auth/react';
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



/**
 * answers: []
date: "Sun Apr 03 2022 09:34:06 GMT+0530 (India Standard Time)"
downvote: 0
question: "<p>Here is a piece of my code:</p><pre class=\"ql-syntax\" spellcheck=\"false\">def main():\n    num = 0\n    try:\n        raise Exception('This is the error message.')\n    except Exception:\n        num += 1\n        return num\n    finally:\n        num += 1\n\na = main()\nprint(a)\n</pre><p>The returning value is 1 instead of 2, this does not make a lot of sense for me. I thought it would return 2 since finally should execute before returning the value. Can someone help me to understand this?</p>"
questionTitle: "Python confusion with return value in try-except-finally"
tags: ['python3']
upvote: 0
userID: "62491ca3f023eaa03db41185"
views: 0
__v: 0
_id: "62492234f023eaa03db4130e"
 */

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
	let d = new Date(dat);

	let str = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

	return str;
}

export default function Question({ question, vote }) {

	const { data: session, status } = useSession()
	const router = useRouter()

	const [voted, setVote] = useState(vote)
	const [bookMarked, setBookmarked] = useState(false)
	const [answer, setAnswer] = useState('')
	const [isLoading, setisLoading] = useState(false)


	const handleVote = (num) => {
		setVote(num);
	}

	const handleBookMark = (status) => {
		setBookmarked(status);
	}
	const askedDate = getFormattedDate(question.date)
	const siteURL = window.location.href
	const checkDisability = () => {
		if (answer.length && !isLoading) return false;
		return true;
	}

	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/monokai-sublime.min.css" />
			</Head>
			<div className='container mx-auto border-l border-r border-slate-300'>
				<div className='pt-4 pb-2 border-b border-b-slate-300 px-2'>
					<div className='text-2xl font-bold'>
						{question.questionTitle}
					</div>
					<div className='flex justify-between items-center px-5 pt-4'>
						<div>
							Asked: <span className='font-bold text-sm'>{askedDate}</span>
						</div>
						<div>
							Views: <span className='font-bold text-sm'>{question.views}</span>
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
					<div className='py-16 flex flex-col items-center gap-2 w-32'>
						<div>
							{
								voted === 1 ? <BsFillArrowUpCircleFill size={25} className='cursor-pointer' onClick={() => { handleVote(0) }} />
									:
									<BsArrowUpCircle size={25} className='cursor-pointer' onClick={() => { handleVote(1) }} />
							}
						</div>
						{question.upvote || 0 + question.downvote || 0}
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
			</div>

			<div className='mt-8'>
				<div className='text-lg font-bold'>YOUR ANSWER:</div>
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
				</Button></div>
		</>
	)
}

export async function getServerSideProps(context) {
	const { params } = context
	const { id } = params

	await dbConnect()
	let theQuestion
	try {
		theQuestion = await questions.findById(id)
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
	// console.log(CurrUser)
	let qid: string = theQuestion?._id?.toString();
	let uid: string = theQuestion?.userID?.toString();

	let obj = {
		_id: null,
		userID: null,
		date: null,
		...theQuestion['_doc']
	}
	obj._id = qid;
	obj.userID = uid;
	obj.date = theQuestion.date.toString();
	return {
		props: { question: obj, vote: 0 },
	}
}

Question.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}


