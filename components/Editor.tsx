import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Loading from '../components/Loading'
import style from '../styles/Editor.module.scss'

import { CreatableSelect } from "chakra-react-select";

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => <Loading />,
})

const modules = {
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

const allTags = [
	{ value: "blue", label: "Blue", color: "#0052CC" },
	{ value: "purple", label: "Purple", color: "#5243AA" },
	{ value: "red", label: "Red", color: "#FF5630" },
	{ value: "orange", label: "Orange", color: "#FF8B00" },
	{ value: "yellow", label: "Yellow", color: "#FFC400" },
	{ value: "green", label: "Green", color: "#36B37E" }
]

export default function Editor() {
	const [content, setContent] = useState('')
	const [title, setTitle] = useState(``)
	const [preview, setPreview] = useState(false)
	const router = useRouter()

	const [isLoading, setisLoading] = useState(false)
	const [tags, setTags] = useState([])

	const { data: session, status } = useSession()

	const handleChange = (value) => {
		setContent(value)
	}
	const handleSelectChange = (value) => {
		setTags(value)
	}
	const handleSubmit = async () => {
		if (content.length < 1 || title.length < 1) return
		try {
			const res = await axios.post('/api/uploads/askQuestion', { "content": content, title: title, email: session.user.email });
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


	return <>
		<form className={style.editor_container} onSubmit={async (e) => {
			e.preventDefault()
			setisLoading(true)
			await handleSubmit()
			setisLoading(false)
		}}>
			<div className='text-black font-bold text-2xl pt-5'>
				Question title:
			</div>
			<input className="w-full px-4 py-3 rounded-lg bg-white mt-2 mb-5 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required type="text" value={title} onChange={(e) => setTitle(e.target.value)} name="title" id="title" placeholder="Enter a title" />
			<div className='text-black font-bold text-2xl'>Add tags</div>
			<CreatableSelect
				isMulti
				name="colors"
				options={allTags}
				placeholder="Select tags for the questions..."
				closeMenuOnSelect={true}
				selectedOptionStyle="check"
				hideSelectedOptions={false}
				colorScheme="purple"
				onChange={handleSelectChange}
				className='pb-8'
			/>
			<div className='text-black font-bold text-2xl mb-2'>
				Write your Quetion:
			</div>
			<QuillNoSSRWrapper id='quill_container' value={content} className={style.quill_main} modules={modules} formats={formats} theme="snow" onChange={handleChange} />


			
			<Button
				onClick={async (e) => {
					e.preventDefault();
					setisLoading(true)
					await handleSubmit()
					setisLoading(false)
				}}
				className='!w-full px-4 mt-2'
				isLoading={isLoading}
				loadingText='Submitting'
				colorScheme='teal'
				variant='solid'
			>
				Submit
			</Button>
		</form>
	</>
}