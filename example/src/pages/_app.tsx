import '@/styles/globals.css'
import { AppProps } from 'next/app'
import { Layout } from '@/components/dom/Layout'

export default function App({ Component, pageProps = { title: 'Home' } }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}