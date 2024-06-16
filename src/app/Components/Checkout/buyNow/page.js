import React from 'react'
import style from "./buy.module.scss"
import { fetchData } from '@/app/Components/AllPages/fetchData';
import CheckOut from './checkOut';

export const metadata = {
  title : "CheckOut Page",
}
  
async function BuyNow() {
  let mainItem = await fetchData();
  
if(!mainItem.result){
     return <h1>Wait...</h1>  
}
  

  return (<>
      
      <div className={style.buyNowPage}>
      <h2>CheckOut your product</h2>
     <hr />
        <CheckOut mainItem = {mainItem.result}/>
    </div>
 </> )
}

export default BuyNow;