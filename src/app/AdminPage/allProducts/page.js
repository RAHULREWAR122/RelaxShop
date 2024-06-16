"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import style from './allProducts.module.scss';

function AllProductsShowPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products`);
      if (data.success) {
        setItems(data.result);
      }
    } catch (error) {
      console.log("Error in fetching data:", error);
    }
  };

  if (items.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Title</th>
            <th>Price</th>
            <th>Thumbnail</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index+1}.</td>
              <td data-label="Title">{item.title.length >= 15 ? item.title.slice(0,10)+"..." : item.title }</td>
              <td data-label="Price">{item.price}</td>
              <td data-label="Thumbnail">
                <img src={item.thumbnail} alt={item.title} />
              </td>
              <td data-label="Available Qty">{item.availableQty}</td>
              <td data-label="Action">
                <a href={`details-link-${index}`}>Details</a>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllProductsShowPage;
