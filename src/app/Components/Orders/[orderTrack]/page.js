"use client";
import React, { useEffect, useState } from "react";
import style from "../order.module.scss";
import { fetchOrdersDataDB } from "../orderFetchFunction";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import MiniScroller from "../../miniScroller/page";
   


function OrderTrack({ params }) {
  const [orderData, setOrderData] = useState([]);
  const [selectItem , setSelectItem] = useState(0);

  const router = useRouter();

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      const getData = await fetchOrdersDataDB();
      setOrderData(getData.result);
    } catch (error) {
     return;
    }
  };

  let item =
    orderData &&
    orderData.find((item) => item._id === String(params.orderTrack));

  if (!item) {
    return <MiniScroller/>;
  }

  const handleSelectItem = (i)=>{
     setSelectItem(i);
  }
  
  const handleUrl = (url)=>{
    router.push(url)
 }  
  
  const { email, orderId, amount, paymentInfo, address, products , dis } = item;

  return (<>
     <h1 onClick={()=>handleUrl("/Components/Orders")} className={style.back}><IoMdArrowBack/></h1>
     <div className={style.OrderPage}>
      <section className={style.singleItem}>
        <div className={style.info}>
          <h5>RelaxShop.com</h5>
          <h2>OrderId : #{orderId}</h2>
          <p>
            Your Order has been Successfully Placed. your Payment Status is{" "}
            <strong>{paymentInfo}</strong>
          </p>

          <div className={style.itemsInfo}>
            <table>
              <thead>
                <tr>
                  <th>sr.No</th>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
              {products.map((item ,i)=>{
                     return <tr className={selectItem === i ? style.active : null} key={i} onClick={()=>handleSelectItem(i)}>
                     <td>{i+1}.</td>
                     <td>{item.title.length > 20 ? item.title.slice(0,13)+"..." : item.title} </td>
                     <td>{item.qty}</td>
                     <td>₹ {item.price * item.qty }</td>
                   </tr>
                   })}
              </tbody>
            </table>
          </div>
          <h4>Discount {dis}</h4>
          <h3>Total Amount :₹ {amount}</h3>
        </div>
        <div className={style.thumbnail}>
        {selectItem !== null && (
            <img src={products[selectItem].img} alt={products[selectItem].title} />
          )}
          
        </div>
      </section>
    </div>
    </>  );
}

export default OrderTrack;
