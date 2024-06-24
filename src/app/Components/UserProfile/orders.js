"use client";
import Scroller from "@/app/Scroller/scroller";
import { useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
import style from "../Orders/order.module.scss";
import axios from "axios";
import { fetchOrdersDataDB } from "../Orders/orderFetchFunction";
import MiniScroller from "../miniScroller/page";

function OrdersInfo() {
  const router = useRouter();
  const [userOrders, setUserOrders] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdersData = async () => {
    let getData = await fetchOrdersDataDB();
    setOrderData(getData.result);
    return getData;
  };
 
  
  if(userOrders.length >= 1){
    setTimeout(()=>{
      setLoading(false)  
    },900) 
 }else if(userOrders.length === 0){
       setTimeout(()=>{
          setLoading(false)
       },5000)    
 }
  

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
            setUserOrders(req.data.result);
          }
          return req;
        } catch (error) {
          return;
        }
      }
    };
    fetchOrders();
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (!userOrders) {
    return <MiniScroller />;
  }
  

  


  return (
    <>
      {loading ? (
        <MiniScroller />
      ) : userOrders && userOrders.length === 0 ? (
        <h1 style={{ textAlign: "center", marginTop: "0px" }}>
          No Orders Available
        </h1>
      ) : (
        <div className={style.ordersPage}>
          <div className={style.orderTable}>
            <table className={style.order_table}>
              <thead>
                <tr style={{ fontSize: ".8rem" }}>
                  <th>S.No</th>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {userOrders &&
                  userOrders.map((order, i) => {
                    return (
                      <tr style={{ fontSize: ".8rem" }} key={order._id}>
                        <td>{i + 1}.</td>
                        <td>{order.orderId}</td>
                        <td>{order.email.slice(0, 9)}</td>
                        <td>₹{order.amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersInfo;
