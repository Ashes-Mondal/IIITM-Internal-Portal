import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Filter from '../../components/Filter';
import StackoverflowCard from '../../components/StackoverflowCard';
import StackoverflowHeader from '../../components/StackoverflowHeader';
import style from '../../styles/Stackoverflow.module.scss'
import Asked_Answered from "../../components/Asked_Answered";
import Head from 'next/head';
import Image from 'next/image';
import no_data from '../../images/no-data-found.png'
import { useState, useEffect } from 'react';
import dbConnect from '../../lib/dbConnect';
import questions from '../../models/questions';



export default function Stackoverflow({ questions, tab }) {
	const { data: session, status } = useSession()
	const router = useRouter()

	const [questionsList, setQuestionList] = useState(questions || []);
	const [showImage, set_showImage] = useState(false);

	const resetFilters = () => {
		setQuestionList(questions);
	}

	useEffect(() => { setQuestionList(questions) }, [tab])
	return <>
		<Head >
			<a href='https://www.freepik.com/vectors/mistake'>Mistake vector created by pch.vector - www.freepik.com</a>
		</Head >

		<div className='w-full'>
			<StackoverflowHeader tab={tab} />

			<div className='flex gap-5 flex-col md:flex-row'>
				<Filter list={questionsList} setList={setQuestionList} reset={resetFilters} />
				<div className='flex-1'>
					{
						questionsList.map((ques, idx) => {
							return <StackoverflowCard key={idx} details={ques} />
						})
					}
					{
						questionsList?.length ? null : <Image src={no_data} alt="" width={500} height={500} />
					}
				</div>
			</div>
			<Asked_Answered />
		</div>
	</>

}
Stackoverflow.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}
const sortQuestions = (questions, tab) => {
	const tabs = ['all', 'most_recent', 'most_votes']

	const compare2 = (q1, q2) => {
		return (q2.upvote + q2.downvote) - (q1.upvote + q1.downvote)
	}

	if (tabs[1] === tab) {
		return questions.reverse()
	}
	else if (tabs[2] === tab) {
		return questions.sort(compare2)
	}

	return questions;
}
export async function getServerSideProps(context) {
	const { query } = context
	const { tab } = query

	const session = await getSession(context)
	// console.log("session:",session)
	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}

	const tabs = ['all', 'most_recent', 'most_votes']
	if (!tabs.includes(tab)) {
		return {
			redirect: {
				permanent: false,
				destination: "/stackoverflow?tab=all",
			},
			props: {},
		}
	}

	try {
		await dbConnect()
		const all_questions = await questions.find({}).populate("userID");

		let ques = all_questions.map(q => {
			let obj = { _id: null, date: null, userID: null, ...q['_doc'] }
			obj._id = q._id.toString();
			obj.date = q.date.toString();
			obj.userID = { _id: q.userID._id.toString(), email: q.userID.email, image: q.userID.image, name: q.userID.name }
			return obj;
		})
		ques = sortQuestions(ques, tab)
		return {
			props: { questions: ques, tab },
		}
	} catch (error) {
		console.log("error:", error.message)
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}


}