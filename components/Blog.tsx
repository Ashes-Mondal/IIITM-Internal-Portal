import dynamic from 'next/dynamic'
import Image from 'next/image'
import style from '../styles/Blog.module.scss'
import style1 from '../styles/Editor.module.scss'
import avatar from '../images/avatar2.svg'


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => <p>Loading ...</p>,
})

const opts = { toolbar: [false] }
const bgColor = [
	'#8f1084',
	'#3a6ec2',
	'#ba8a4a',
	'#e85c43'
]
export default function Blog({ content, title, user,date }) {

	const selectedColor = bgColor[Math.floor(Math.random() * bgColor.length)]
	const username = user.name || user.email

	date = new Date(date).toLocaleDateString()

	return <div className={style1.editor_container}>
		<div className="w-full flex flex-wrap justify-between border border-black bg-white">
			<div className="w-full flex gap-1 p-2">
				{
					user.image ?
						<img className="cursor-pointer rounded-xl border border-black" src={`${user.image}`} alt="" width={30} height={30} /> :
						<Image className="cursor-pointer border border-black" src={avatar} alt="" width={30} height={30} />
				}
				<span className='flex  text-lg font-semibold'>{username}</span>
			</div>
			<span style={{color:selectedColor}} className='w-full text-sm flex justify-end px-2 py-1 font-semibold'>Updated on {date}</span>
		</div>

		<div className={style.title} style={{ backgroundColor: selectedColor }}>
			<h1>{title}</h1>
		</div>
		<QuillNoSSRWrapper id='blog' className={style.quill} readOnly value={content} theme="snow" modules={opts} />
	</div>
}