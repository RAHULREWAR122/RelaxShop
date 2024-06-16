"use client"
import React from 'react'
import Navbar from './Navbar/page'
import { usePathname } from 'next/navigation'

function Layout({children}) {
   const path= usePathname();
   
  return (
    <>
     {path === "/Components/AdminPage"  ? null : <Navbar/>}
      {children}
      
    </>
  )
}

export default Layout