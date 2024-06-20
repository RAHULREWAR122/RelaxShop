"use client"

import React ,{useEffect, useState} from 'react'
import style from "./aside.module.scss"
import { MdCancel } from "react-icons/md";
import { MdAddCard } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { AiOutlineProduct } from "react-icons/ai";
import { usePathname, useRouter } from 'next/navigation';
import AdminNavbar from '../Navbar/page';
import LoadingBar from 'react-top-loading-bar'


function Aside() {
  const [showAside , setShowAside] = useState(false)
  const [progress, setProgress] = useState(0)
    
  const route = useRouter();
  let pathName = usePathname();
 
  useEffect(()=>{
        setProgress(100)
  },[pathName])

  const handleRouter = (url)=>{    
        setProgress(70)
        route.push(url);
        if(pathName === url){
          setTimeout(()=>{
             setProgress(100) 
          },100)       
        }
  }


  return (<>
   <LoadingBar
        className={style.progressBar}
        color='blue'
        progress={progress}
        waitingTime={380}
        height={4}
        shadow={true}
        onLoaderFinished={() => setProgress(0)}
      />
     <AdminNavbar  setShowAside={setShowAside}/>
      <div  className={`${style.asideBar} ${showAside ? style.show : ''}`}>
         <aside className={style.aside}>
          <MdCancel onClick={() => setShowAside(false)} className={style.cancel} />
          <div className={style.links}>
            <ul className={style.ul}>
              <li onClick={() => {handleRouter('/AdminPage/AddProducts') , setShowAside(false)}}>
                <span><MdAddCard /></span> <span>Add Products</span>
              </li>
              <li onClick={() => {handleRouter('/AdminPage/allProducts') , setShowAside(false)}}>
                <span><AiOutlineProduct /></span><span>All Products</span>
              </li>
              <li onClick={() => {handleRouter('/AdminPage/AllOrders'), setShowAside(false)}}>
                <span><TiShoppingCart /></span><span>All Orders</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

    </>)
}

export default Aside