import axios from "axios"
import Image from "next/image"
import { GetStaticPaths, GetStaticProps } from "next"
import { useState } from "react"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
// CSS
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"
import Head from "next/head"

interface ProductProps {
  product: {
    id: string
    name: string
    image: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
    
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

    
      <ProductContainer>
        <ImageContainer>
          <Image src={product.image} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.price}</span>

            <p>{product.description}</p>

            <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: 'prod_MLH5Wy0Y97hDAC' }
      }
    ],
    // Blocking, causes the website to wait for a html to generate before displaying and cacheing the results for future uses
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params!.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price;

  const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price.unit_amount! / 100)
  
  return {
    props: {
      product:{
        id: product.id,
        name: product.name,
        active: product.active,
        price: formattedPrice,
        image: product.images[0],
        description: product.description,
        defaultPriceId: price.id
      }
    },
    // revalidate: 60 * 60 * 1 // 1 Hour
  }
}