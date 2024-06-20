"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import style from './allProducts.module.scss';

function AllProductsShowPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [disable , setDisable] = useState(false)   

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

  const handlePagination = (selected) => {
    setPage(selected); 
  };

  if (items.length === 0) {
    return <p>Loading...</p>;
  }

  const handleDeleteItem = async (id)=>{
      try {
        let req =  await axios.delete(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products/${id}`)
         console.log(req);
         if(req.data.success){
          alert("item deleted successfully");
          
         }else{
         alert("error in delete item")
         }
      } catch (err) {
         console.log("error in Delete item" , err);
         return;
      }  
  }

  return (
    <>
      <div className={style.allProductsTable}>
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
            {items.slice(page * 8 - 8, page * 8).map((item, index) => (
              <tr key={index}>
                <td>{(page - 1)* 8 + index+1 }.</td>
                <td data-label="Title">{item.title.length >= 15 ? item.title.slice(0, 10) + "..." : item.title}</td>
                <td data-label="Price">₹{item.price}</td>
                <td data-label="Thumbnail">
                  <img src={item.thumbnail} alt={item.title} />
                </td>
                <td data-label="Available Qty">{item.availableQty}</td>
                <td data-label="Action">
                  <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                  
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
      {items.length > 0 && (
        <div className={style.pagination}>
          <button
            className={page > 1 ? style.previous : style.rem}
            onClick={() => handlePagination(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <ul>
          {[...Array(Math.ceil(items.length / 8))].map((_, i) => {
            return (
               <li
                className={page === i + 1 ? style.active : style.selected_pagination}
                onClick={() => handlePagination(i + 1)}
                key={i}
              >
                {i + 1}
              </li>
            );
          })}
         </ul>
          <button
            className={page < Math.ceil(items.length / 8) ? style.next : style.rem}
            onClick={() => handlePagination(page + 1)}
            disabled ={page === Math.ceil(items.length / 8)}
          >
            Next
          </button>
        </div>
      )}
      </div>
    </>
  );
}

export default AllProductsShowPage;
