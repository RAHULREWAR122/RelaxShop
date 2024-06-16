"use client"
import Image from 'next/image'
import React from 'react'
import style from "./cart.module.scss"
import { useRouter } from 'next/navigation'


function MtCart() {
  
  const route = useRouter();

  const handleRoute = (url)=>{
     route.push(url)
  }

  return (
    <div className={style.mtCart}>
        <div className={style.cartImg}>
          <Image src="/mtCart.jpeg" height={300} width={250} alt='Empty Cart Image'/>
        </div>
        <div className={style.text}>
            <h3>Your cart is empty</h3>   
            
            <h4>Just relax, let us help you find some first-class products</h4>
            <button onClick={()=>handleRoute("/")}>Start Shopping</button>
            
        </div>

    </div>
  )
}

export default MtCart