import { CiStar } from 'react-icons/ci';
import Link from 'next/link';
import { fetchData } from '../../fetchData';
import MiniScroller from '@/app/Components/miniScroller/page';


async function TShirts() {  
   
  let data = await fetchData();
  
  let tShirt = data && data.result.filter((item)=>item.category === "mTshirt");
  

  if(!data){
     return <MiniScroller/>
  }
  if(tShirt.length === 0){
     return <h3>item not available now.</h3>
  }


  return (
    <div className="cards">
      {tShirt && tShirt.map((item ,i)=> {
             return (<Link key={item._id} href={`/Components/AllPages/${item._id}`}>
                <div  className={item.availableQty > 0 ? "card" : `qty0`}>
                <div className="img">
                  <img
                    src={item.thumbnail}
                   alt={item.title}
                 />
                 <span className='leftQty'>{item.availableQty > 0 ? " + " + item.availableQty + " more" : "Not Available" }</span>
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
              </Link>  
      )})}  
    </div>
  );
}




export default TShirts;
