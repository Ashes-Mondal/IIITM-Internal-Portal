import { Box, Button, Collapse, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { MdNotificationAdd } from 'react-icons/md';
import { AiFillCaretDown } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import avatar from '../images/avatar2.svg'
import nnr from '../images/nnr.png'
import notify from '../images/notify.png'

import er from '../images/emergencyr.png'


import { getSession, useSession } from 'next-auth/react';
import dbConnect from '../lib/dbConnect';
import notifications from '../models/notifications';
import { Radio, RadioGroup } from '@chakra-ui/react'


const TheModal = ({ isOpen, setOpen, session }) => {
  const [value, setValue] = useState('0')
  const [title, setTitle] = useState('')
  const [notification, setnotification] = useState('')

  const onClose = () => {
    setTitle('')
    setnotification('')
    setOpen(false)
  }


  const handleSubmit = async () => {
    if (notification.length === 0 || title.length === 0) {
      alert('Please fill all details...')
      return
    }

    try {
      const res = await axios.post('/api/pusher', { title, notification, value: parseInt(value) });
      onClose()
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fill below to notify all:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className='border shadow-lg' onSubmit={handleSubmit}>
              <div className={' px-4'}>
                <div className=' py-4'>
                  <RadioGroup onChange={setValue} value={value}>
                    <Stack direction='row'>
                      <Radio value={'0'}>Normal</Radio>
                      <Radio value={'1'}>Emergency</Radio>
                    </Stack>
                  </RadioGroup>
                </div>
                <div className=' py-4'><Input variant='filled' required value={title} onChange={e => { setTitle(e.target.value) }} placeholder='Title' /></div>
                <p>
                  <Textarea
                    maxLength={500}
                    value={notification}
                    minHeight={'200px'}
                    resize={'none'}
                    variant={'filled'}
                    placeholder='Write what you want to notify...'
                    required
                    size='sm'
                    onChange={(e => { setnotification(e.target.value) })}
                  />
                </p>
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

            <Button colorScheme='blue' mr={3} onClick={handleSubmit} type='submit' >
              Broadcast
            </Button>


          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}


export default function Home({ notifications, emergencyNotifications }) {
  notifications = JSON.parse(notifications)
  emergencyNotifications = JSON.parse(emergencyNotifications)

  const { data: session, status } = useSession()
  const [openModal, setOpenModal] = useState(false);
  const { isOpen, onToggle } = useDisclosure()
  const [emergencies, setEmergencies] = useState(emergencyNotifications || [])
  const [normal, setNormal] = useState(notifications || [])
  const [openEModal, setOpenEModal] = useState(false);


  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("Notification");

    channel.bind("normal-notify-event", function (data) {
      setNormal([data, ...normal])
    });
    channel.bind("emergency-notify-event", function (data) {
      setEmergencies([data, ...emergencies])
    });

    setTimeout(() => {
      onToggle()
    }, 500);

    return () => {
      pusher.unsubscribe("Notification");
    };
  }, []);

  return <>
    <TheModal isOpen={openModal} setOpen={setOpenModal} session={session} />
    <div className='m-auto flex justify-end items-center py-4'>
      <Button leftIcon={<MdNotificationAdd size={20} />} colorScheme='purple' variant='solid' onClick={() => setOpenModal(true)} >Notify</Button>
    </div>

    <div className='pl-4 text-2xl font-semibold flex justify-between'>
      Emergencies ({emergencies.length})
      <span className='cursor-pointer' onClick={() => { setOpenEModal(!openEModal) }}>
        <span>
          {openEModal ? <AiFillCaretDown /> : <AiOutlinePlus />}
        </span>
      </span>
    </div>
    <div className='pb-8'>
      <Collapse in={openEModal} animateOpacity className='pb-8'>
        {emergencies.map((notification, idx) => {
          if (idx % 2) {
            return (
              <>
                <Box
                  p='40px'
                  color='#F7F5F2'
                  mt='4'
                  bg='#712B75'
                  rounded='md'
                  shadow='md'
                >
                  <div className='text-xl font-semibold'>{notification.title}</div>
                  {
                    notification.notification
                  }
                  <div className='flex flex-wrap justify-end text-sm items-center pr-4'>
                    <Link passHref href={`/profile/0`}>
                      <span className='cursor-pointer  hover:text-sky-400 flex gap-1 items-center p-4 underline'>
                        {
                          notification?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
                            :
                            <img className='rounded-xl border border-black cursor-pointer' src={`${notification?.userID.image}`} alt="" width={24} height={24} />
                        }
                        {notification?.userID.name}
                      </span>
                    </Link>
                    <span className="font-semibold">
                      {new Date(notification?.date).toLocaleString()}
                    </span>
                  </div>
                </Box>
              </>
            )
          }
          else {
            return (
              <>
                <Box
                  p='40px'
                  color='#F7F5F2 '
                  mt='4'
                  bg='#F24A72'
                  rounded='md'
                  shadow='md'
                >
                  <div className='text-xl font-semibold'>{notification.title}</div>
                  {
                    notification.notification
                  }
                  <div className='flex flex-wrap justify-end text-sm items-center pr-4'>
                    <Link passHref href={`/profile/0`}>
                      <span className='cursor-pointer  hover:text-sky-400 flex gap-1 items-center p-4 underline'>
                        {
                          notification?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
                            :
                            <img className='rounded-xl border border-black cursor-pointer' src={`${notification?.userID.image}`} alt="" width={24} height={24} />
                        }
                        {notification?.userID.name}
                      </span>
                    </Link>
                    <span className="font-semibold">
                      {new Date(notification?.date).toLocaleString()}
                    </span>
                  </div>
                </Box>
              </>
            )
          }
        })}
      </Collapse>
    </div>


    <div className='flex justify-center items-center flex-col'>
      {
        emergencies.length ? null : (
          <>
            <div className='font-semibold text-xl'> No Emergencies</div>
            <Image src={er} alt="" width={300} height={300} />
          </>
        )
      }
    </div>


    <div className='flex mt-8'>
      <Button onClick={onToggle} className={'flex-1 flex' + ` ${!isOpen ? 'mb-8' : ''}`} >
        <span className='flex-1'>
          Notifications ({normal.length})
        </span>
        <span>
          {isOpen ? <AiFillCaretDown /> : <AiOutlinePlus />}
        </span>
      </Button>
    </div>
    <Collapse in={isOpen} animateOpacity className='pb-8'>
      {normal.map((notification, idx) => {
        if (idx % 2) {
          return (
            <>
              <Box
                p='40px'
                color='#343148FF'
                mt='4'
                bg='#D7C49EFF'
                rounded='md'
                shadow='md'
              >
                <div className='text-xl font-semibold'>{notification.title}</div>
                {
                  notification.notification
                }
                <div className='flex flex-wrap justify-end text-sm items-center pr-4'>
                  <Link passHref href={`/profile/0`}>
                    <span className='cursor-pointer text-black hover:text-sky-400 flex gap-1 items-center p-4 underline'>
                      {
                        notification?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
                          :
                          <img className='rounded-xl border border-black cursor-pointer' src={`${notification?.userID.image}`} alt="" width={24} height={24} />
                      }
                      {notification?.userID.name}
                    </span>
                  </Link>
                  <span className="font-semibold">
                    {new Date(notification?.date).toLocaleString()}
                  </span>
                </div>
              </Box>
            </>
          )
        }
        else {
          return (
            <>
              <Box
                p='40px'
                color='#D7C49EFF '
                mt='4'
                bg='#343148FF'
                rounded='md'
                shadow='md'
              >
                <div className='text-xl font-semibold'>{notification.title}</div>
                {
                  notification.notification
                }
                <div className='flex flex-wrap justify-end text-sm items-center pr-4'>
                  <Link passHref href={`/profile/0`}>
                    <span className='cursor-pointer  hover:text-sky-400 flex gap-1 items-center p-4 underline'>
                      {
                        notification?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
                          :
                          <img className='rounded-xl border border-black cursor-pointer' src={`${notification?.userID.image}`} alt="" width={24} height={24} />
                      }
                      {notification?.userID.name}
                    </span>
                  </Link>
                  <span className="font-semibold">
                    {new Date(notification?.date).toLocaleString()}
                  </span>
                </div>
              </Box>
            </>
          )
        }
      })}

      <div className='flex justify-center items-center flex-col'>
        {

          normal.length ? null :
            (
              <>
                <Image src={notify} alt="" width={300} height={250} />
                <div className='font-semibold text-xl'> No Notifications Yet</div>
              </>
            )
        }
      </div>
    </Collapse>


  </>

}

export async function getServerSideProps(context) {

  const session: any = await getSession(context)
  if (!session) {
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
    const notify = await notifications.find({ type: 'Normal' }).populate('userID').sort({ date: -1 })
    const Enotify = await notifications.find({ type: 'Emergency' }).populate('userID').sort({ date: -1 })
    return {
      props: { notifications: JSON.stringify(notify), emergencyNotifications: JSON.stringify(Enotify) },
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

Home.auth = {
  role: "user",
  unauthorized: "/", // redirect to this url
}
