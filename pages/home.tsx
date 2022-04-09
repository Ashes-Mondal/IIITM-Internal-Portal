import Editor from '../components/Editor'


export default function Home() {

  return <>
    <h1 className='text-2xl'>home</h1>
  </>

}

Home.auth = {
  role: "user",
  unauthorized: "/", // redirect to this url
}
