import {
	Select,
	Tag,
	TagLabel,
	TagCloseButton,
	Button,
	Input
} from '@chakra-ui/react'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BsFilterRight } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";



const allTags = [
	'tag1', 'tag2', 'tag123', 'tag12', 'tag22', 'tag123222'
]

const allUsers = [
	'user1', 'user2', 'user123', 'user12', 'user22', 'user123222'
]


export default function Filter({ list, setList, reset }) {
	const [tags, setTags] = useState([])
	const [users, setUsers] = useState([])
	const [search, setSearch] = useState('')
	const [tagList, setTagList] = useState([])
	const [userList, setUserList] = useState([])

	useEffect(() => {
		axios.get('/api/fetch/tags').then(resp => setTagList(resp.data?.data || [])).catch(err => console.error(err));
		axios.get('/api/fetch/users').then(resp => setUserList(resp.data?.data || [])).catch(err => console.error(err));
	}, [])

	const handleFilter = () => {
		let filteredList = list.filter(q => {
			let k = q.tags.some(r => tags.indexOf(r) >= 0)
			if (k) return true;
			if (users.includes(q.userID.name)) return true;
			return false;
		})
		setList(filteredList)
	}

	const resetFilter = () => {
		setSearch('')
		setTags([])
		setUsers([]);
		reset()
	}

	const handleSearch = ()=>{
		if(!search || search.length == 0)
		{
			setSearch(null)
			return
		}
		let filteredList = list.filter(q => {
			let k = q.questionTitle.toLowerCase().split(' ').some(r => search.toLowerCase().split(' ').indexOf(r) >= 0)
			return k
		})
		setList(filteredList)
	}
	return <>
		{/* md:sticky md:top-[4rem] md:self-start  */}
		<div className='md:w-64  md:order-2 md:sticky md:top-[4rem] md:self-start' >
			<div className='border p-2'>
				<div className='flex gap-1 text-black justify-end font-semibold '>
					<BsFilterRight size={20} />
					Filters
				</div>
				<div className='flex flex-wrap gap-1 mt-2 mb-6'>
					<div className='w-full text-black text-center'>+Add tags</div>
					{tags.map((tag) => (
						<Tag
							size={'sm'}
							key={'sm'}
							borderRadius='full'
							variant='solid'
							colorScheme='green'
						>
							<TagLabel>{tag}</TagLabel>
							<TagCloseButton onClick={() => {
								const newTags = tags.filter(item => item !== tag)
								setTags(newTags)
							}} />
						</Tag>
					))}
					<Select placeholder='Select tags' size='sm' onChange={(e) => {
						if (e.target.value.length)
							setTags([...tags, e.target.value]);
					}}>
						{
							tagList.map(((tag, idx) => {
								if (tags.includes(tag) == false) {
									return <option key={idx} value={tag}>{tag}</option>
								}
							}))
						}
					</Select>
				</div>

				<div className='flex flex-wrap gap-1 mt-2 mb-6'>
					<div className='w-full text-black text-center'>+Add Users</div>
					{users.map((user) => (
						<Tag
							size={'sm'}
							key={'sm'}
							borderRadius='full'
							variant='solid'
							colorScheme='blue'
						>
							<TagLabel>{user}</TagLabel>
							<TagCloseButton onClick={() => {
								const newTags = users.filter(item => item !== user)
								setUsers(newTags)
							}} />
						</Tag>
					))}
					<Select placeholder='Select username' size='sm' onChange={(e) => {
						if (e.target.value.length)
							setUsers([...users, e.target.value]);
					}}>
						{
							userList.map(((user, idx) => {
								if (users.includes(user) == false) {
									return <option key={idx} value={user}>{user}</option>
								}
							}))
						}
					</Select>
				</div>
				<div className='w-full flex justify-around items-center'>
					<Button colorScheme='blue' variant='outline' size='sm' onClick={handleFilter}>
						Filter
					</Button>
					<Button colorScheme='yellow' variant='outline' size='sm' onClick={resetFilter}>
						Reset
					</Button>
				</div>
			</div>
			<div className='mt-8 border p-2'>
				<div className='flex gap-1 text-black justify-end font-semibold '>
					<BsSearch size={20} />
					Search
				</div>
				<Input value={search} variant='flushed' placeholder='Search anything...' className='mb-2' onChange={e => setSearch(e.target.value)} />
				<div className='w-full flex justify-around items-center mt-4'>
					<Button colorScheme='blue' variant='outline' size='sm' onClick={handleSearch}>
						Search
					</Button>
					<Button colorScheme='yellow' variant='outline' size='sm' onClick={resetFilter}>
						Reset
					</Button>
				</div>
			</div>
		</div>
	</>
}