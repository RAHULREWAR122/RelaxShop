"use client"
import style from "../landing.module.scss"
import React, { useEffect, useState } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaStar } from "react-icons/fa";
import { cartSelector ,addToCart } from "../Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";



const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1324 },
      items: 4 ,
      slidesToSlide: 2
    },
    desktop: {
      breakpoint: { max: 1324, min: 1000 },
      items: 3,
      slidesToSlide: 2
    },
    tablet: {
      breakpoint: { max: 1000, min: 664 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 664, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

import { ToastContainer, toast } from "react-toastify";

function TopOffers({data}) {
   
  const dispatch = useDispatch();
  
  const handleAddToCart = (item) => {
    try {
      dispatch(addToCart(item));
      toast.success("Item Added In Cart", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error in Adding Cart");
      toast.error("Error, item not added in Cart", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };


    
  return (<>
     <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    <Carousel
     transitionDuration={500}
     infinite={true}
     autoPlaySpeed={3000}
     keyBoardControl={true}
     autoPlay
     className={style.carouselShow} responsive={responsive}>
    {data.slice(4,13).map((item,i)=>{
       return  <div key={i} className={style.item}>
       <div className={style.img}>
           <img src={item.thumbnail} alt="" />
       </div>
       <div className={style.info}>
           <h4>{item.title.slice(0,15)+"..."}</h4>            
           <div className={style.other}>
           <span>₹ {item.price}</span>
           <span><FaStar className={style.star} />{item.rating}</span>
           <button onClick={()=>handleAddToCart(item)}>Add to Cart</button>
           </div>
       </div>
    </div> 
       
    })}
   
    </Carousel>
    </>)
}

export default TopOffers