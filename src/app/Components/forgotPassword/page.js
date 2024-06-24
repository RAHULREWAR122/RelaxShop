"use client";
import React from "react";
import style from "./forgot.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";


function ForgotPassword() {
  const [emailData, setEmailData] = useState({
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    cPassword: "",
  });
  const [showPage, setShowPage] = useState(false);
  let [getToken , setGetToken] = useState('')
  const [showResetPage , setShowResetPage] = useState(false);
  const [reqResetPassUser , setReqResetPassUser] = useState("")
  
  let token = localStorage.getItem("token");
  useEffect(()=>{
        if(token){
            router.push("/")
        }
  },[token])

  const router = useRouter();
  const searchPar = useSearchParams();
   

  let checkToken = searchPar.get("token");
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSendMail = async () => {
    let data = {
      email: emailData.email,
      sendMail: true,
    };
    

    if (emailData.email.length >= 12  ) {
      toast.success('Wait...', {
        position: "top-right",
        autoClose: 1100,
        theme: "light",
      }); 
      let req = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/api/forgotPassword`,
        { data: data }
      );
      if (req.data.success) {
        setGetToken(req.data.result.token)  
        
        setReqResetPassUser(req.data.result.existUserName)
         toast.success('Request Send Successfully', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
          setTimeout(()=>{
            setShowPage(true)
            setShowResetPage(false)

          },2000)
      
        } else {
        toast.error('Sorry!, User not found', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
          });
      }
      return;
    } else {
      toast.error('please write your email correctly.', {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
        });
    }
    setEmailData({
      ...emailData,
      email: "",
    });
    return;
  };
  
  const handleReset = async () => {
    let { password, cPassword } = passwordData;
     
    if (password === cPassword && password.length >= 1) {
      let data = {
        password: password,
        cPassword: cPassword,
        getToken: checkToken,
      };
      toast.success('Wait...', {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      }); 
     
      try {
        let req = await axios.put(
          `${process.env.NEXT_PUBLIC_HOST_NAME}/api/forgotPassword`,
          { data: data }
        );
        if (req.data.success) {        
          toast.success('Password Reset Successfully, Please Login Now.', {
            position: "top-right",
            autoClose: 1000,
            theme: "light",
          });
          setTimeout(()=>{
            router.push("/Components/Auth/UserAuthentication");
          },1200);
        } else {
          toast.error('Please try again...', {
            position: "top-right",
            autoClose: 1000,
            theme: "light",
          });
              
        }
        setTimeout(()=>{
        setPasswordData({
          ...passwordData,
          password: "",
          cPassword: "",
        });
      },1500)
      localStorage.removeItem("validToken"); 
     
      return;

      } catch (error) {
        toast.error('OOps!, something went wrong.', {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
        return
      }
    } else {
        
      toast.error('check your password again.', {
        position: "top-right",
        autoClose: 1000,
        theme: "light",
      }); 
      return;
     }
  };


  return (
    <div
      className={
        showPage ? style.forgotPasswordPageTrue : style.forgotPasswordPage
      }
    >
      {showPage && <div className={style.linkPage}>
        <span onClick={()=>setShowPage(false)} className={style.cancel}>X</span>
        <h4>Dear <span style={{color:"orange"}}>{reqResetPassUser}</span></h4>
        <p>
          You recently requested to reset your password for your{" "}
          <span className={style.highlight}>RelaxShop.netlify.app</span>{" "}
          account. To complete the process, please click the link below. This
          link will only be valid for the next 10 minutes.
        </p>
        <Link onClick={()=>{setShowPage(false) , setShowResetPage(true)}} href={`${process.env.NEXT_PUBLIC_HOST_NAME}/Components/forgotPassword?token=${getToken}`} className={style.resetLink}>
          Click here to Reset Password
        </Link>
        <br />
        <br />
        <br />
        <p>Thank you,</p>
        <span className={style.teamName}>RelaxShop.netlify.app Team</span>
      </div>}
      <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      <div className={style.forgotPage}>
        <div
          className={
            passwordData.password.length >= 2 &&
            passwordData.password === passwordData.cPassword
              ? style.matched
              : style.myPage
          }
        >
          <h4>RelaxShop</h4>
          {!showResetPage && checkToken === null && (
            <div className={style.sendEmail}>
              <label htmlFor="email">Write your email here</label>
              <input
                type="email"
                value={emailData.email}
                name="email"
                onChange={handleChange}
                id="email"
                placeholder="abc@gmail.com"
              />
              <Button onClick={handleSendMail}>Continue</Button>
            </div>
          )}
          {checkToken && (
            <div className={style.resetPassword}>
              <label htmlFor="email">Reset your password</label>
              <input
                type="password"
                value={passwordData.password}
                name="password"
                onChange={handleChange}
                placeholder="New Password"
              />
              <input
                type="password"
                value={passwordData.cPassword}
                name="cPassword"
                onChange={handleChange}
                placeholder="conform New Password"
              />
              {passwordData.password !== passwordData.cPassword && (
                <span className={style.msgErr}>password not matches</span>
              )}
              {passwordData.password &&
                passwordData.password === passwordData.cPassword && (
                  <span className={style.msgSuccess}>password matched</span>
                )}

              <button onClick={handleReset}>Reset</button>
            </div>
          )}
          {!showResetPage && (
            <div className={style.orLogin}>
              <span>or</span>
              <h4 onClick={()=>router.push("/Components/Auth/UserAuthentication")} className={style.loginBtn}>Login?</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
