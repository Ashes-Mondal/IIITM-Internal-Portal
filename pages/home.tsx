import { Box, Button, Collapse, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { MdNotificationAdd } from 'react-icons/md';
import { AiFillCaretDown } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import avatar from '../images/avatar2.svg'


export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const { isOpen, onToggle } = useDisclosure()

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("Notification");

    channel.bind("notify-event", function (data) {

    });

    return () => {
      pusher.unsubscribe("Notification");
    };
  }, []);

  return <>
    <div className='m-auto flex justify-end items-center py-4'>
      <Button leftIcon={<MdNotificationAdd size={20} />} colorScheme='purple' variant='solid' onClick={() => setOpenModal(true)} >Notify</Button>
    </div>
    <div className='flex'>
      <Button onClick={onToggle} className='flex-1 flex' >
        <span className='flex-1'>
          General
        </span>
        <span>
          {isOpen ? <AiFillCaretDown /> : <AiOutlinePlus />}
        </span>
      </Button>
    </div>
    <Collapse in={isOpen} animateOpacity>
      <Box
        p='40px'
        color='#343148FF'
        mb='4'
        bg='#D7C49EFF'
        rounded='md'
        shadow='md'
      >
        The Collapse component is used to create regions of content that can expand/collapse with a simple animation. It helps to hide content that's not immediately relevant to the user.
        <div className='flex flex-wrap justify-end text-sm items-center pr-4'>
          <Link passHref href={`/profile/0`}>
            <span className='cursor-pointer text-white hover:text-sky-400 flex gap-1 items-center p-4 underline'>
            <Image src={avatar} alt="" width={24} height={24} />Ashes Mondal
            </span>
          </Link>
          <span className="font-semibold">
            {new Date().toLocaleString()}
          </span>
        </div>
      </Box>
    </Collapse>

  </>

}
/**
 * 
 * {product?.userID.image == null ? <Image src={avatar} alt="" width={24} height={24} />
                :
                <img className='rounded-xl border border-black cursor-pointer' src={`${product?.userID.image}`} alt="" width={24} height={24} />}
              {product?.userID.name}
 */

Home.auth = {
  role: "user",
  unauthorized: "/", // redirect to this url
}
