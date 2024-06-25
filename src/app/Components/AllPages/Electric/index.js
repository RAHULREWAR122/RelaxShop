
"use client"
import Head from 'next/head';
import { CiStar } from 'react-icons/ci';
import { fetchData } from '../fetchData';
import MiniScroller from '../../miniScroller/page';
import { useEffect , useState } from 'react';
import { useRouter } from 'next/navigation';


 function ElectricItems() {
   const [data , setData] = useState([]);
   const router = useRouter()
   useEffect(()=>{
      fetchElectric();
   },[])

   const fetchElectric = async ()=>{
    try {
      const data = await fetchData();
      setData(data);
      return;
     } catch (error) {
      return;
     }
  }
  
  const electric = data && data.filter((item)=>item.category === "electric"); 
  
  if(!data ){
     return <MiniScroller/>
      
  }

  const handleUrl = (url)=>{
        router.push(url)
   }
   

  return (<>
   <Head>
       <title>RelaxShop | Electric</title>

   </Head>
    <div className="cards">
      {electric.map((item ,i)=> {
             return (<div onClick={()=>handleUrl(`/Components/AllPages/${item._id}`)}  key={i} className={item.availableQty > 0 ? "card" : `qty0`}>
                <div className="img">
                  <img
                    src={item.thumbnail}
                   alt="Hoodie"
                 />
                 <span className='leftQty'>+{item.availableQty} more</span>
               </div>
               <p className="title">{item.title}</p>
               <h3 className="price">
                 <span>₹</span> {item.price} 
                   <span className='onwards'>onwards</span>
               </h3>
               <p className='delivery'>Free Delivery</p>
               <div className="rating">
                 <strong>{item.rating}</strong>
                 <span className="star">
                   <CiStar className='star'/>
                 </span>
               </div>
              </div>  
      )})}  
    </div>
    </>  );
}

export default ElectricItems;
