import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import style from '../../styles/Editor.module.scss'

import { CreatableSelect } from "chakra-react-select";
import Head from 'next/head'
import hljs from 'highlight.js'


const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => <Loading />,
})

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

export function Editor() {
	const [content, setContent] = useState('')
	const [title, setTitle] = useState(``)
	const router = useRouter()

	const [isLoading, setisLoading] = useState(false)
	const [tags, setTags] = useState([])
	const [allTags, setAllTags] = useState([])

	// const { data: session, status } = useSession()
	useEffect(() => {
		axios.get('/api/fetch/tags').then(resp => {

			setAllTags(resp.data.data.map(tag => {
				return { value: tag, label: tag };
			}))
		})
			.catch(err => {
				console.error(err)
			})
	}, [])

	const handleChange = (value) => {
		setContent(value)
	}
	const handleSelectChange = (value) => {
		setTags(value)
	}
	const handleSubmit = async () => {
		if (content.length < 1 || title.length < 1) return
		try {
			const res = await axios.post('/api/post/askQuestion', { content, title, tags });
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

	const checkDisability = () => {
		if (content.length && title.length && tags.length && !isLoading) return false;
		return true;
	}
	return <>
		<Head>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/monokai-sublime.min.css" />
		</Head>
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
			/>
			<div className='text-black font-bold text-2xl mb-2 pt-8'>
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
				className='!w-full px-4 mt-2 mb-8'
				isLoading={isLoading}
				loadingText='Submitting'
				colorScheme='teal'
				variant='solid'
				disabled={checkDisability()}
			>
				Submit
			</Button>
		</form>
	</>
}

export default function Post() {

	return <>
		<Editor />
	</>
}
Post.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}
