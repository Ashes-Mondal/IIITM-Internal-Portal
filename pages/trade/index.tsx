import { Button, Select, Spinner, Input, Textarea } from '@chakra-ui/react'
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
import { useSession } from 'next-auth/react';
const Card = ({ pid = 0 }) => {
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		axios.get(`/api/fetch/product?id=${pid}`).then(resp => { setProduct(resp.data.data); setLoading(false) }).catch(e => console.error(e))
		setLoading(false)
	}, [])
	return (
		<article className={`${loading ? 'h-64 flex items-center justify-center' : ''}`}>
			{loading ? <Spinner /> :
				(
					<>
						<img src="https://picsum.photos/600/400?image=1083" alt="Sample photo" />
						<div className={style['text']}>
							<div className='font-semibold text-2xl'>Heading</div>
							<p>
								Collaboratively administrate empowered markets via plug-and-play networks.Collaboratively administrate empowered markets via plug-and-play neCollabora
							</p>
						</div>
						<h6 className="text-sm font-bold text-gray-800 pl-4">Email:</h6>
						<h1 className="text-2xl font-bold text-gray-800 flex justify-end pr-8">₹ 250.00</h1>
						<div className='flex flex-wrap justify-end text-sm items-center pr-4'>
							<Link passHref href={`/profile/${product?.userID._id}`}>
								<span className='cursor-pointer text-sky-600 hover:text-blue-400 flex gap-1 items-center p-4'>
									{product?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
										:
										<img className='rounded-xl border border-black cursor-pointer' src={`${product?.userID.image}`} alt="" width={24} height={24} />}
									{product?.userID.name} Ashes-Mondal
								</span>
							</Link>
							<span className="font-semibold">
								{new Date().toLocaleString()}
							</span>
						</div>
					</>

				)

			}
		</article>
	)
}

const TheModal = ({ isOpen, setOpen, session }) => {
	const [image, setImage] = useState(null)
	const [productName, setProductName] = useState('')
	const [description, setdescription] = useState('')
	const [cost, setCost] = useState(null)

	const onClose = () => {
		setImage(null)
		setProductName('')
		setdescription('')
		setCost(null)
		setOpen(false)
	}
	const onPost = (e) => {
		e.preventDefault()
		onClose()
	}

	const handleAvatarSubmit = async (file) => {
		if (!file) {
			return
		}
		const data = new FormData();
		data.append(`productImage`, file);
		data.append(`link`, image);

		try {
			const res = await axios.put('/api/update-profile/avatar', data,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);
			if (res.data.error) {
				console.error(res.data.error)
				alert(res.data.error)
			}
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Fill to start selling:</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form className='border shadow-lg' onSubmit={onPost}>
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
											<img height='50px' className='h-64' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNfVmXySPJQ-xv4oY0in48YpkLIA8_yyj95p6uLW53EqTBBQAESYi68ElFFzo6dvmERXc&usqp=CAU" alt="Sample photo" />
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
						<Button colorScheme='blue' mr={3} onSubmit={onPost} type='submit' >
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default function TradePage({ }) {
	const [openModal, setOpenModal] = useState(false);
	const { data, status } = useSession()
	return (
		<>
			<TheModal isOpen={openModal} setOpen={setOpenModal} session={data} />
			<div className='m-auto flex justify-end items-center py-4'>
				<Button leftIcon={<MdSell />} colorScheme='teal' variant='solid' onClick={() => setOpenModal(true)} >Sell Item</Button>
			</div>
			<div className='m-auto pt-4 flex justify-between items-center border-b border-t pb-2 mb-4'>
				<div className='px-4 flex-1'>
					<Input variant='filled' placeholder='Search...' />
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-black font-semibold'>Cost: </span>
					<Select placeholder='Select option...'>
						<option value='Ascending'>Ascending</option>
						<option value='Descending'>Descending</option>
					</Select>
				</div>
			</div>
			<div className="container pb-4">
				<main className={style['grid']}>

					<Card />


				</main>
			</div>
		</>
	)

}

TradePage.auth = {
	role: "user",
	unauthorized: "/", // redirect to this url
}
