"use client";
import React, { use } from "react";
import style from "./order.module.scss";
import { useState, useEffect } from "react";
import { fetchOrdersDataDB } from "./orderFetchFunction";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Scroller from "@/app/Scroller/scroller";
import MiniScroller from "../miniScroller/page";

function OrdersPage() {
  const [orderData, setOrderData] = useState([]);
  const [userData, setUserData] = useState([]);
 const [loading,setLoading] = useState(true);

  console.log(orderData)
  const router = useRouter();
  const fetchOrdersData = async () => {
    let getData = await fetchOrdersDataDB();
    setOrderData(getData.result);
    return getData;
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      let token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      } else {
        try {
          let req = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/api/Orders`,
            { token: token }
          );
          if (req) {
            setUserData(req.data.result);
          }
          return req;
        } catch (error) {
          console.log("Error in fetching orders:", error);
        }
      }
    };
    fetchOrders();
  }, []);


  const handleUrl = (url)=>{
     router.push(url)
  }  

  setTimeout(()=>{
    setLoading(false)
  },1000)
  

  return (
    <>
    {loading ? (
        <div className={style.loading}>
          <MiniScroller/>
        </div>
      ) : userData && userData.length === 0 ? (
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          No Orders Available <Link style={{ color: "blue" }} href="/">Order Now</Link>
        </h1>
      ) : (<div className={style.ordersPage}>
      <h3>Orders page</h3>
      <div className={style.orderTable}>
      <table className={style.order_table}>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Order ID</th>
          <th>Email</th>
          <th>Amount</th>
          <th>Details Link</th>
        </tr>
      </thead>
      <tbody>
        {userData &&  userData.map((order ,i) => { 
          return  <tr key={order._id}>
            <td>{i+1}.</td>
            <td>{order.orderId}</td>
            <td>{order.email.slice(0,9)}</td>
            <td>₹{order.amount}</td>
            <td>
                <p onClick={()=>handleUrl(`/Components/Orders/${order._id}`)}>Details</p>
            </td>
          </tr>
           })}
      </tbody>
    </table>
      </div>
    </div>)}
</>  );
}

export default OrdersPage;
