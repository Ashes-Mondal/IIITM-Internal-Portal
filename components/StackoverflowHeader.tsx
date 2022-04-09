import Link from "next/link";
import {
	Button,
} from '@chakra-ui/react'

const tabNames = ['all', 'most_recent', 'most_votes']
export default function StackoverflowHeader({ tab }) {

	const getHeading = () => {
		if (tab.toLowerCase() == tabNames[0]) {
			return 'Top Questions'
		}
		else if (tab.toLowerCase() == tabNames[1]) {
			return 'Most Recent Questions'
		}
		else if (tab.toLowerCase() == tabNames[2]) {
			return 'Most Voted Questions'
		}
	}
	return <>
		<div className='text-center pt-8 text-3xl'>
			{getHeading()}
		</div>
		<div className="text-right m-2">
			<Link passHref href="/stackoverflow/ask_question">
				<Button colorScheme='purple' variant='solid' size='md'>
					Ask Question
				</Button>
			</Link>
		</div>
		<div className=' flex gap-4 ml-2 mr-2 mt-8 mb-8 text-lg'>
			{
				tabNames.map((item, idx) => {
					return (
						<Link key={idx} passHref href={`/stackoverflow?tab=${item}`}>
							<span className={`${tab.toLowerCase() == item.toLowerCase() ? 'underline underline-offset-8 decoration-red-500 decoration-4' : null} cursor-pointer hover:text-slate-700`}>
								{item.toUpperCase().replace('_'," ")}
							</span>
						</Link>
					)

				})
			}

		</div>
	</>

}