import { Button, Select, Spinner, Input, Textarea, InputGroup, InputRightElement } from '@chakra-ui/react'
import { MdSell } from "react-icons/md";
import style from '../../styles/trade.module.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import avatar from '../../images/avatar2.svg'
import Image from 'next/image';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react';
import dbConnect from '../../lib/dbConnect';
import trade from '../../models/trade';
import no_data from '../../images/no-data-found.png'
import { BsSearch } from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";



const Card = ({ details, session }) => {
	const [product, setProduct] = useState(details)
	const [loading, setLoading] = useState(false)
	const [edit, setEdit] = useState(false)

	const handleCloseDeal = () => {
		axios.put(`/api/update/close-trade`, { pid: product._id }).then(resp => { window.location.reload() }).catch(e => console.error(e))
	}

	useEffect(() => {
		setProduct(details)
	}, [details])
	return (
		<>
			<article className='bg-white'>
				{loading ?
					(
						<>
							<article className={`${loading ? 'h-64 flex items-center justify-center' : ''}`}>
								<Spinner />
							</article>
						</>
					)
					:
					(
						<div className='flex justify-around flex-col h-full '>
							<TheModal isOpen={edit} setOpen={setEdit} session={session} pid={product?._id} />
							<div className='flex flex-1 justify-center items-center bg-slate-200'>
								<img src={product?.image} alt="Sample photo" />
							</div>


							<div>
								{
									product?.open && session.user.id === product?.userID._id ?
										<div className='flex justify-end pt-2 text-sm'>
											<Button colorScheme='red' mr={1} type='submit' className='text-sm' onClick={handleCloseDeal} >
												Close Deal
											</Button>
											<Button colorScheme='blue' mr={1} type='submit' onClick={() => { setEdit(true) }} className='text-sm' >
												Update
											</Button>
										</div> : null
								}
								{
									product?.open ? null :
										<div className='flex justify-end gap-1 items-center p-1'>
											<FaRegHandshake size={30} color='purple' />
											<span className='text-md font-semibold underline'>Deal Closed</span>
										</div>
								}
								<div className={style['text']}>
									<div className='font-semibold text-2xl'>{product?.productName}</div>
									<p>
										{
											product?.description
										}
									</p>
								</div>
								<h6 className="text-sm font-bold text-gray-800 pl-4">Email: {product?.userID.email}</h6>
								<h1 className="text-2xl font-bold text-gray-800 flex justify-end pr-8">₹ {product?.cost}</h1>
								<div className='flex flex-wrap justify-end text-sm items-center pr-4'>
									<Link passHref href={`/profile/${product?.userID._id}`}>
										<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1 items-center p-4'>
											{product?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
												:
												<img className='rounded-xl border border-black cursor-pointer' src={`${product?.userID.image}`} alt="" width={24} height={24} />}
											{product?.userID.name}
										</span>
									</Link>
									<span className="font-semibold mb-4">
										{new Date(product?.date).toLocaleString()}
									</span>
								</div>
							</div>

						</div>

					)

				}
			</article>
		</>

	)
}

const TheModal = ({ isOpen, setOpen, session, pid = null }) => {
	const [image, setImage] = useState(null)
	const [productName, setProductName] = useState('')
	const [description, setdescription] = useState('')
	const [cost, setCost] = useState(null)
	const [original, setOriginal] = useState(null)

	const onClose = () => {
		setImage(null)
		setProductName('')
		setdescription('')
		setCost(null)
		setOpen(false)
	}

	const handleUpdate = async (e) => {
		e.preventDefault()
		if (description.length === 0 || productName.length === 0 || !cost) {
			alert('Please all fill with the image.')
			return
		}
		const data = new FormData();
		if (image) data.append(`profilePicture`, image);
		data.append(`data`, JSON.stringify({
			productName, description, cost, id: original._id, image: original.image
		}));

		try {
			const res = await axios.put('/api/update/item', data,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			onClose()
			window.location.reload()
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	const handleSubmit = async () => {
		if (description.length === 0 || productName.length === 0 || !cost) {
			alert('Please all fill with the image.')
			return
		}
		const data = new FormData();
		data.append(`profilePicture`, image);
		data.append(`data`, JSON.stringify({
			productName, description, cost, image: 'https://image1.jdomni.in/jdomni_email/searchProduct2.png'
		}));

		try {
			const res = await axios.post('/api/post/sell-item', data,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			onClose()
			window.location.reload()
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	useEffect(() => {
		if (isOpen && pid) {
			axios.get(`/api/fetch/product?id=${pid}`)
				.then(resp => {
					const data = resp.data.data
					setOriginal(data)
					setImage(null)
					setProductName(data.productName)
					setdescription(data.description)
					setCost(data.cost)
				})
				.catch(e => {
					console.error(e)
				})
		}
	}, [isOpen])

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Fill below details with image:</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form className='border shadow-lg' onSubmit={pid ? handleSubmit : handleUpdate}>
							<label htmlFor='productImage'>
								<div className='flex justify-center items-center cursor-pointer'>
									<input type="file" style={{ display: "none" }} accept="image/png ,image/jpeg" id="productImage" onChange={async (e) => {
										e.preventDefault()
										setImage(e.target.files[0])
									}} />
									{
										image ?
											<img height='50px' className='h-64' src={URL.createObjectURL(image)} alt="Sample photo" />
											:
											<img height='50px' className='h-64' src={original?.image || "https://image1.jdomni.in/jdomni_email/searchProduct2.png"} alt="Sample photo" />
									}
								</div>
							</label>
							<div className={style['text'] + ' px-4 py-4'}>
								<div className=' py-4'><Input variant='filled' required value={productName} onChange={e => { setProductName(e.target.value) }} placeholder='Product-Name' className='font-semibold text-2xl' /></div>
								<p>
									<Textarea
										maxLength={150}
										value={description}
										minHeight={'100px'}
										resize={'none'}
										variant={'filled'}
										placeholder='Add Description'
										required
										size='sm'
										onChange={(e => { setdescription(e.target.value) })}
									/>
								</p>
							</div>
							<h6 className="text-sm font-bold text-gray-800 pl-4">Email: {session?.user.email}</h6>
							<div className='flex justify-end items-center py-4'>
								<h1 className="text-2xl font-bold text-gray-800 flex justify-end pr-8 gap-1 items-center">₹ <Input variant='filled' type='number' min="0" placeholder='250.00' required value={cost} onChange={e => { setCost(Math.abs(parseFloat(e.target.value))) }} /></h1>
							</div>
							<div className='flex flex-wrap justify-end text-sm items-center pr-4'>
								<Link passHref href={`/profile/${session?.user.id}`}>
									<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1 items-center p-4'>
										{session?.user.image == null ? <Image src={avatar} alt="" width={24} height={24} />
											:
											<img className='rounded-xl border border-black cursor-pointer' src={`${session?.user.image}`} alt="" width={24} height={24} />}
										{session?.user.name}
									</span>
								</Link>
								<span className="font-semibold">
									{new Date().toLocaleString()}
								</span>
							</div>
						</form>

					</ModalBody>

					<ModalFooter>
						{
							pid ?
								<Button colorScheme='blue' mr={3} onClick={handleUpdate} type='submit' >
									Update
								</Button>
								:
								<Button colorScheme='blue' mr={3} onClick={handleSubmit} type='submit' >
									Post
								</Button>
						}

					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
const tabNames = ['ALL', 'Your']
export default function TradePage({ trades, tab }) {
	trades = JSON.parse(trades)
	const [openModal, setOpenModal] = useState(false);
	const [display, setDisplay] = useState(trades);
	const [costOpt, setCostOpt] = useState(null);
	const [search, setSearch] = useState('');
	const { data, status } = useSession()

	const handleSearch = () => {
		setDisplay(trades.filter(t => {
			let allWords = search.split(' ');
			for (let i = 0; i < allWords.length; i++) {
				if (t.productName.toLowerCase().includes(allWords[i].toLowerCase()) || t.description.toLowerCase().includes(allWords[i].toLowerCase())) {
					return true
				}
			}

			return false
		}))
	}

	useEffect(() => {
		if (costOpt == 'Ascending') {
			const compare2 = (t1, t2) => {
				return (t1.cost) - (t2.cost)
			}
			setDisplay(trades.sort(compare2))
		} else if (costOpt == 'Descending') {
			const compare2 = (t1, t2) => {
				return (t2.cost) - (t1.cost)
			}
			setDisplay(trades.sort(compare2))
		}
		else {
			setDisplay(trades)
		}
	}, [costOpt])

	useEffect(() => {
		setDisplay(trades)
	}, [tab])

	return (
		<>
			<TheModal isOpen={openModal} setOpen={setOpenModal} session={data} />
			<div className='m-auto flex justify-end items-center py-4'>
				<Button leftIcon={<MdSell />} colorScheme='teal' variant='solid' onClick={() => setOpenModal(true)} >Sell Item</Button>
			</div>
			<div className=' flex gap-4 ml-2 mr-2 mt-8 mb-8 text-lg'>
				{
					tabNames.map((item, idx) => {
						return (
							<Link key={idx} passHref href={`/trade?tab=${item.toLowerCase()}`}>
								<span className={`${tab.toLowerCase() == item.toLowerCase() ? 'underline underline-offset-8 decoration-red-500 decoration-4' : null} cursor-pointer hover:text-slate-700`}>
									{item.toUpperCase().replace('_', " ")}
								</span>
							</Link>
						)

					})
				}

			</div>
			<div className='m-auto pt-4 flex justify-between items-center border-b border-t pb-2 mb-4'>
				<div className='px-4 flex-1'>
					<InputGroup size='md'>
						<Input onSubmit={handleSearch} variant='filled' placeholder='Search...' onChange={(e) => setSearch(e.target.value)} />
						<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleSearch}>
								<BsSearch size={16} />
							</Button>
						</InputRightElement>
					</InputGroup>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-black font-semibold'>Cost: </span>
					<Select placeholder='Select option...' onChange={(e) => { setCostOpt(e.target.value) }} >
						<option value='Ascending'>Ascending</option>
						<option value='Descending'>Descending</option>
					</Select>
				</div>
			</div>
			<div className="container pb-4">
				<main className={style['grid']}>
					{
						display.map((trade, idx) => {
							return <Card key={idx} details={trade} session={data} />
						})
					}

				</main>
				{
					display.length ? null :
						<div className='flex justify-center items-center m-auto w-full'>
							<Image src={no_data} alt="" width={500} height={500} />
						</div>
				}
			</div>
		</>
	)
}

export async function getServerSideProps(context) {

	const session: any = await getSession(context)
	const { query } = context
	const { tab } = query
	if (!session || !tab) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}

	try {
		await dbConnect()
		let trades = null
		if (tab.toLowerCase() === 'all') {
			trades = await trade.find({ open: true }).populate('userID')
		}
		else if (tab.toLowerCase() === 'your') {
			trades = await trade.find({ userID: session.user.id }).populate('userID')
		}
		return {
			props: { trades: JSON.stringify(trades), tab },
		}

	} catch (error) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		}
	}



}

TradePage.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}
