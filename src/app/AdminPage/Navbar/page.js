"use client"
import React from 'react'
import { MdOutlineMenu } from "react-icons/md";
import style from "../Aside/aside.module.scss"
import { useRouter } from 'next/navigation';


function AdminNavbar({setShowAside}) {
  const route = useRouter(); 
  const handleLogOut =()=>{
      localStorage.removeItem("adminToken");
      route.push("/")
  }
  
  return (
    <div className={style.nav}>
     <MdOutlineMenu onClick={() => setShowAside(true)} className={style.adminMenu} />  
     <div className={style.logoutAdmin}>
       <button onClick={handleLogOut}>
         Logout
       </button>
      </div> 
    </div>
  )
}

export default AdminNavbar