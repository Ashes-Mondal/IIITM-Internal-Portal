import Image from "next/image";
import Link from "next/link";
import avatar from '../images/avatar2.svg'


export default function StackoverflowCard({ details }) {
	const date = new Date(details.date).toLocaleDateString()
	return <div className='md:max-w-5xl flex items-start bg-white border border-slate-300 py-2 px-3 shadow-md gap-1'>
		<div className='w-32 md:w-24 flex flex-col text-left text-sm'>
			<div className='py-1'>
				{details.upvote} votes
			</div>
			<div className={`${details.answers.length ? 'py-1 border border-green-500 text-green-500' : 'py-1'}`}>
				{details.answers.length} answers
			</div>
			<div className='py-1'>
				{details.downvote} views
			</div>
		</div>
		<div className='w-full'>
			<Link passHref href={`/stackoverflow/question/${details._id}`}>
				<div className='cursor-pointer text-sky-600 underline decoration-sky-600 hover:decoration-blue-400 hover:text-blue-400'>
					{details.questionTitle}
				</div>
			</Link>

			<div className='flex flex-wrap gap-1 mt-2'>
				{details.tags.map((tag, idx) => {
					return <span key={idx} className='rounded bg-[#E1ECF4] p-1 text-[#39739D] hover:bg-[#B3D3EA] cursor-pointer text-xs'>
						{tag}
					</span>
				})}

			</div>
			<div className='flex flex-wrap justify-end gap-2 text-sm mt-4'>
				<Link passHref href={`/profile/${details.userID._id}`}>
					<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1'>
						{details.userID.image==null ? <Image src={avatar} alt="" width={24} height={24} />
							:
							<img className='rounded-xl border border-black cursor-pointer' src={`${details.userID.image}`} alt="" width={24} height={24} />}
						{details.userID.name}
					</span>
				</Link>
				<span className="font-semibold">
					Asked on {date}
				</span>
			</div>
		</div>
	</div>
}