import React from 'react'
import style from "./buy.module.scss"
import CheckOut from './checkOut';
import { fetchData } from '@/app/Components/AllPages/fetchData';
import MiniScroller from '../../miniScroller/page';

export const metadata = {
  title : "CheckOut Page",
}
  
async function BuyNow() {
  let mainItem = await fetchData();
 
  

if(!mainItem){
     return <MiniScroller/>  
}


  return (<>
     {mainItem &&       
      <div className={style.buyNowPage}>
      <h2>CheckOut your product</h2>
     <hr />
        <CheckOut mainItem = {mainItem}/>
    </div>
   }
 </> )
}

export default BuyNow;

