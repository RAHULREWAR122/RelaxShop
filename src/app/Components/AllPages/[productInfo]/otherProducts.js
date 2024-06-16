"use client";
import React from "react";

import { CiStar } from "react-icons/ci";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

function OtherProducts({ data }) {
  const [categoryWiseData, setCategoryWiseData] = useState([]);

  let showCategoryData =
    categoryWiseData && categoryWiseData.map((item) => item);

  let filteredData =
    showCategoryData &&
    showCategoryData.filter((item) => item.category === data.category);

  useEffect(() => {
    showData();
  }, []);

  const showData = async () => {
    try {
      const req = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products`);
      if (req.data.success) {
        setCategoryWiseData(req.data.result);
      }
      return req.data;
    } catch (error) {
      console.log("Error in fetching Data");
    }
  };
  if(!filteredData){
     return <h2>Loading...</h2>
  }
   
  
  return (
    <div className="cards">
      {filteredData &&
        filteredData.slice(0, 16).map((item, i) => {
          return (
            <Link key={i} href={`/Components/AllPages/${item._id}`}>
              <div className={item.availableQty > 0 ? "card" : `qty0`}>
                <div className="img">
                  <img src={item.thumbnail} alt="Hoodie" />
                  <span className="leftQty">+{item.availableQty} more</span>
                </div>
                <p className="title">{item.title}</p>
                <h3 className="price">
                  <span>₹</span> {item.price}
                  <span className="onwards">onwards</span>
                </h3>
                <p className="delivery">Free Delivery</p>
                <div className="rating">
                  <strong>{item.rating}</strong>
                  <span className="star">
                    <CiStar className="star" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

export default OtherProducts;
