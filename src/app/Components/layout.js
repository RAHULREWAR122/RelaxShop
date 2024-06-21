"use client"
import React from 'react'
import Navbar from './Navbar/page'
import { usePathname } from 'next/navigation'
import Footer from './Footer/footer';

function Layout({children}) {
   const path= usePathname();
   
  return (
    <>
     {path === "/Components/AdminPage"  ? null : <Navbar/>}
     
      {children}
      {path === "/Components/AdminPage"  ? null : <Footer/>}
     
    </>
  )
  
}

export default Layout