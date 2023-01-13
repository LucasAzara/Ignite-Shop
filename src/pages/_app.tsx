// Props
import type { AppProps } from 'next/app'
// CSS
import { globalStyles } from '../styles/global'
import { Container, Header } from '../styles/pages/app'
// Logo
import logo from '../assets/logo.svg'
// Next Image
import Image from 'next/image'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>  
        <Image src={logo.src} alt="" width={logo.width} height={logo.height} />
      </Header> 
      <Component {...pageProps} />
    </Container>
  )
}
