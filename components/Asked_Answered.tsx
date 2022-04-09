import axios from "axios";
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Asked_Answered() {
	const [asked, setAsked] = useState([]);
	const [answered, setAnswered] = useState([]);

	useEffect(() => {
		axios.get('/api/fetch/asked_questions').then(resp => setAsked(resp.data?.data || [])).catch(err => console.error(err));
		axios.get('/api/fetch/answered_questions').then(resp => setAnswered(resp.data?.data || [])).catch(err => console.error(err));
	}, [])
	return <>
		<div className='mt-4 p-2'>
			{asked.length ? <div className='text-black font-semibold '>
				You Asked
			</div> : null}
			{
				asked.map((que, idx) => {
					return (
						<Link key={idx} passHref href={`/stackoverflow/question/${que.id}`}>
							<p className='text-xs cursor-pointer text-sky-600 hover:text-blue-400 underline mb-2'>
								{que.title}
							</p>
						</Link>
					)
				})
			}
		</div>

		<div className='mt-2 p-2'>
			{answered.length ? <div className='text-black font-semibold '>
				You Answered
			</div> : null}

			{
				answered.map((que, idx) => {
					return (
						<Link key={idx} passHref href={`/stackoverflow/question/${que.id}`}>
							<p className='text-xs cursor-pointer text-sky-600 hover:text-blue-400 underline mb-2'>
								{que.title}
							</p>
						</Link>
					)
				})
			}
		</div>
	</>
}