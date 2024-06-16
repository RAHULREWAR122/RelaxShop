import React from 'react'
import { fetchData } from '../fetchData'
import ShowInfo from './showInfo';

async function ProductInfo({params}) {
   
  const data =await fetchData(); 
  const newData = data && data.result;
  
  if(!newData){
     return <h2>Loading...</h2>
  }
  
  
  return (
    <div>
        <ShowInfo newData = {newData}  params ={params}/>        
    </div>
  )
}

export default ProductInfo