// CSS
import { HomeContainer, Product } from '../styles/pages/home'
// Next Image
import Image from 'next/image'
// Slider
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
// Stripe
import { stripe } from '../lib/stripe'
import Stripe from 'stripe'

// interface
interface IProducts {
  id: string,
  name: string,
  active: boolean,
  price: number,
  image: string
}

interface IHome {
  products: IProducts[]
}


export default function Home({products}: IHome) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  });
  return (
    <HomeContainer  ref={sliderRef} className="keen-slider">
      {products.map(product => {
        return (
          <Product className="keen-slider__slide">
            <Image src={product.image} width={520} height={480} alt="" />

            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
         </Product>
        )
      })}
    </HomeContainer>
  )
}

export async function getServerSideProps() {

  const data = await stripe.products.list({
    expand: ['data.default_price']
  }).then(response => response.data)

  const products = data.map(product => {

    const price = product.default_price as Stripe.Price

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price.unit_amount! / 100)

    return {
      id: product.id,
      name: product.name,
      active: product.active,
      price: formattedPrice,
      image: product.images[0] 
    }
  })

  return {
    props: {
      products: products
    }, 
  }
}