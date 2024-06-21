"use client"
import React from 'react'
import "./error.css"
import Link from 'next/link'

function ErrorPage() {
  return (
    <div className='errorPage'>
         <div className="mid">
            <h1>404</h1>
            <h2>OOPS! PAGE NOT FOUND</h2>
            <h3><strong>Sorry, the page you are looking for does not exist. Please Return to <a href="/">Home Page</a></strong></h3>
            <div>
                <button><Link className="nav" href="/">RETURN HOME</Link></button>
            </div>
         </div>
    </div>
  )
}

export default ErrorPage