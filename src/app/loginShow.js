"use client"
import React from 'react'
import "./globals.css"
import { useRouter } from 'next/navigation'

function LoginShow({setShowLoginPrompt}) {
    
    const router = useRouter()
 
    return (
        <div className="login-prompt">
           <div className="login-prompt-container">
          <button onClick={()=>setShowLoginPrompt(false)} className='cancelLogin'>X</button>
            <div>
             <h2>Please Log In</h2>
             <p>To continue shopping, please log in to your account.</p>
             </div>
             <div>
             <button onClick={()=>router.push("/Components/Auth/UserAuthentication")} className="login-button">Log In</button>
          </div>
          </div>
        </div>
  )
}

export default LoginShow