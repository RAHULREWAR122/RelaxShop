"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../allProducts/allProducts.module.scss";

function AllOrdersShowPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [showFullEmail, setShowFullEmail] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState(null);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);
  const [prods, setProds] = useState([]);
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Orders`);
      if (data.success) {
        setItems(data.result);
      }
    } catch (error) {
      console.log("Error in fetching data:", error);
    }
  };

  const handlePagination = (selected) => {
    setPage(selected);
  };

  const handleCheckClick = (index) => {
    setSelectedOrderInfo(index);
    setProds(items[index].products); 
  };

  if (items.length === 0) {
    return <p>Loading...</p>;
  }

  return (
      <>
    
      <div className={style.allProductsTable}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Trans. Id</th>
              <th>Amount Received</th>
              <th>Email</th>
              <th>Payment Status</th>
              <th>Address</th>
              <th>Total Orders Check</th>
            </tr>
          </thead>
          <tbody>
            {items.slice(page * 8 - 8, page * 8).map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{(page - 1) * 8 + index + 1}.</td>
                  <td>{item.orderId}</td>
                  <td>₹{item.amount}</td>
                  <td
                    onMouseEnter={() => setShowFullEmail(index)}
                    onMouseLeave={() => setShowFullEmail(null)}
                  >
                    {item.email.slice(0, 9) + "..."}
                    {showFullEmail === index && (
                      <span className={style.detail}>{item.email}</span>
                    )}
                  </td>
                  <td>{item.paymentInfo}</td>
                  <td
                    onMouseEnter={() => setShowFullAddress(index)}
                    onMouseLeave={() => setShowFullAddress(null)}
                  >
                    {item.address.slice(0, 15) + "..."}
                    {showFullAddress === index && (
                      <span className={style.detail}>{item.address}</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleCheckClick(index)}>Check</button>
                  </td>
                </tr> 
                {selectedOrderInfo === index && (
                  <tr>
                    <td colSpan={7} className={style.aboutOrder}>
                      <div className={style.orderInfo}>
                      <h4 onClick={() => setSelectedOrderInfo(null)}>X</h4>
                        <div className={style.showOrderDet}> 
                        {prods.map((orderInfo, i) => (
                          <div key={i} className={style.itemShowInfo}>
                            <div className={style.imgs}>
                                   <img src={orderInfo.img} alt={orderInfo.title} />
                            </div>
                            <div className={style.infos}>
                               <h3>{orderInfo.title.slice(0,14)+"..."}</h3> 
                               <h5>Rs. {orderInfo.price * orderInfo.qty}</h5> 
                               <hp>Qty. {orderInfo.qty}</hp> 
 
                            </div>

                          </div>
                        ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {items.length > 0 && (
          <div className={items.length <= 8 ? style.lessThen : style.pagination}>
            <button
              className={page > 1 ? style.previous : style.rem}
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <ul>
              {[...Array(Math.ceil(items.length / 8))].map((_, i) => (
                <li
                  className={
                    page === i + 1 ? style.active : style.selected_pagination
                  }
                  onClick={() => handlePagination(i + 1)}
                  key={i}
                >
                  {i + 1}
                </li>
              ))}
            </ul>
            <button
              className={
                page < Math.ceil(items.length / 8) ? style.next : style.rem
              }
              onClick={() => handlePagination(page + 1)}
              disabled={page === Math.ceil(items.length / 8)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AllOrdersShowPage;
