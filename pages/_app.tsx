import type { AppProps /*, AppContext */ } from 'next/app'
import '../styles/globals.scss'
import '../styles/Login.scss'
import '../styles/Loading.scss'
import 'react-quill/dist/quill.snow.css'
import { SessionProvider, useSession } from 'next-auth/react'
import Header from '../components/Header'
import Loading from '../components/Loading'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps | any) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        {Component.auth ? (
          <Auth>
            <Head>
              <title>IIITM INTERNAL PORTAL</title>
            </Head>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <>
            <Head>
              <title>IIITM INTERNAL PORTAL</title>
            </Head>
            <Component {...pageProps} />
          </>
        )}
      </ChakraProvider>
    </SessionProvider >
  )
}

export default MyApp

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true })
  const isUser = !!session?.user

  if (isUser) {
    return <>
      <Header />
      <div className='page_wrapper'>
        {children}
      </div>
    </>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <Loading />
}
