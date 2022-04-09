import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import planet from '../images/planet.svg'
import avatar from '../images/avatar2.svg'
import stackOverflowColor from '../images/stackoverflow-color.svg'
import trade from '../images/trade.png'
import complaint from '../images/complaint.png'



export default function Header() {
	const [open, set_open] = useState(false)
	const { data: session, status } = useSession()
	const user: { user?: string, id?: string, email?: string, image?: string } = session.user

	return <>
		<nav
			className="
					header
					sticky top-0 z-[100] 
					flex flex-wrap
					items-center
					justify-between
					w-full
					py-4
					md:py-0
					px-4
					md:h-{58}
					text-lg text-gray-700
					bg-white
        "
		>
			<Link passHref href="/">
				<span className="flex flex-wrap cursor-pointer
					items-center
					justify-around">
					<Image src={planet} alt="" width={40} height={40} />
					IIITM
				</span>
			</Link>

			<svg
				onClick={() => set_open(!open)}
				xmlns="http://www.w3.org/2000/svg"
				id="menu-button"
				className="h-6 w-6 cursor-pointer md:hidden block"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					width={2}
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>

			<div className={(open ? "w-full md:flex md:items-center md:w-auto" : "hidden w-full md:flex md:items-center md:w-auto") + ""} id="menu">
				<ul
					className="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0"
				>
					{/* <li>
							<Link passHref href="/blogs">
								<span onClick={() => set_open(false)} className="cursor-pointer md:p-4 py-2 block hover:text-purple-400">
									Blogs
								</span>
							</Link>
						</li> */}
					<li>
						<Link passHref href="/stackoverflow?tab=all">
							<span onClick={() => set_open(false)} className="cursor-pointer md:p-4 py-2 block hover:text-purple-400 flex gap-0.5">
								<Image src={stackOverflowColor} alt="" width={24} height={24} />
								stackoverflow
							</span>
						</Link>
					</li>
					<li>
						<Link passHref href="/report">
							<span onClick={() => set_open(false)} className="cursor-pointer md:p-4 py-2 block hover:text-purple-400 flex gap-0.5">
								<Image src={complaint} alt="" width={24} height={24} />
								Report
							</span>
						</Link>
					</li>
					<li>
						<Link passHref href="/trade">
							<span onClick={() => set_open(false)} className="cursor-pointer md:p-4 py-2 block hover:text-purple-400 flex gap-0.5">
								<Image src={trade} alt="" width={24} height={24} />
								Trade
							</span>
						</Link>
					</li>
					<li>
						<div className="h-full flex flex-wrap items-center justify-between gap-5 block">
							<Link passHref href={`/profile/${user.id}`}>
								<span onClick={() => set_open(false)} className="flex cursor-pointer items-center gap-2 hover:text-purple-400">
									{
										session?.user.image ?
											<img className="cursor-pointer rounded-xl border border-black" src={`${session?.user.image}`} alt="" width={30} height={30} /> :
											<Image className="cursor-pointer border border-black" src={avatar} alt="" width={30} height={30} />
									}
									<span>{session?.user.name || session?.user.email.split("@")[0]}</span>
								</span>
							</Link>
							<button type='submit' onClick={async (e) => {
								e.preventDefault()
								await signOut({ callbackUrl: `${window.location.origin}` })
							}}
								className="h-full cursor-pointer bg-red-500 hover:bg-red-400 focus:bg-red-400 text-white font-semibold px-4 py-3"
							>
								SignOut
							</button>
						</div>
					</li>
				</ul>
			</div>
		</nav>
	</>
}