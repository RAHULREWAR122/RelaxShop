"use client";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import style from "../style.module.scss";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LoadingScroller from "../../laodingScroller/page";

function UserAuth() {
  const [showRegister, setShowRegister] = useState("login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [conformPassword, setConformPassword] = useState("");
  const [checkEmails, setGetEmails] = useState([]);
  const [wait, setWait] = useState(false);
  const route = useRouter();

  const handleShowRegisterForm = (state) => {
    setShowRegister(state);
    toast.success(`Please ${state}`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  useEffect(() => {
    getAllEmail();
  }, []);

  const getAllEmail = async () => {
    try {
      const checkEmailExist = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/User`);
      if(checkEmailExist.data){
        setGetEmails(checkEmailExist.data.result);
      }
      return checkEmailExist.data;
      
    } catch (error) {
      toast.error(`try again later.`, {
        position: "top-right",
        autoClose: 1000,
      });
      route.push("/") 
      return;
    }
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    setWait(true);
    if (
      data.name === "" ||
      data.email === "" ||
      data.password === "" ||
      conformPassword === ""
    ) {
      toast.error(`All fields are required`, {
        position: "top-right",
        autoClose: 1000,
      });
      setWait(false);
      return;
    }
   

    if (data.password !== conformPassword) {
      toast.error(`Passwords do not match`, {
        position: "top-right",
        autoClose: 1000,
      });
      setWait(false);
      return;
    }
    toast.success(`Wait...`, { position: "top-right", autoClose: 1000 });
    try {
      const existEmail =
        checkEmails && checkEmails.find((item) => item.email === data.email);
      if (existEmail) {
        setTimeout(() => {
          toast.success(`User Already Exist, Please Login`, {
            position: "top-right",
            autoClose: 1000,
          });
          setWait(false);
        }, 1500);
        return;
      }

      const req = await axios.post(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/User`, data);
      if (req.data.success) {
        setTimeout(() => {
          toast.success(`User Register Successfully`, {
            position: "top-right",
            autoClose: 1000,
          });
          setTimeout(() => {
          setShowRegister("login")
          }, 2400);

          setWait(false);
          return req;
        }, 1000);
      }
      return;
    } catch (error) {
      toast.error(`Oops!, Something went Wrong. try Again`, {
        position: "top-right",
        autoClose: 1000,
      });
      setWait(false);
      return;
    }
  };

  return (
    <div className={style.userForm}>
      <ToastContainer position="top-right" autoClose={1000} />
      <div className={ style.selectBtn}>
        <button className={showRegister ==="login" ?  style.defaultBtn : null}  onClick={() => handleShowRegisterForm("login")}>LOGIN</button>
        <button className={showRegister ==="register" ?  style.defaultBtn : null} onClick={() => handleShowRegisterForm("register")}>
          REGISTER
        </button>
      </div>
     
      {showRegister === "login" && <Login showRegister ={showRegister} setShowRegister ={setShowRegister} />}
      {showRegister === "register" && (
   
   <section className={style.registerForm}>
          <form>
            <input
              type="text"
              name="name"
              onChange={handleOnChange}
              required
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              onChange={handleOnChange}
              required
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              onChange={handleOnChange}
              required
              placeholder="Password"
            />
            <input
              type="password"
              name="conformPassword"
              onChange={(e) => setConformPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
            <div>
              <p>
                I have Already an Account{" "}
                <span onClick={() => handleShowRegisterForm("login")}>
                  Login?
                </span>{" "}
              </p>
            </div>
            <button onClick={handleUserRegister}>
              {wait === true ? "Wait..." : "REGISTER"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

function Login({setShowRegister}) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [wait, setWait] = useState(false);
  const route = useRouter();

 
  useEffect(()=>{
    
    if(localStorage.getItem("token")){
     setTimeout(()=>{
       route.push(process.env.NEXT_PUBLIC_HOST_NAME)
     },100)
    
    }
})

  const [loading , setLoading] = useState(false);

  const path = usePathname();
  const handleUrl = (url)=>{
      setLoading(true);
      if(path === url){
        setLoading(false)
      }   
      route.push(url);
  }


  const handleShowRegisterForm = (state) => {
    setShowRegister(state);
    toast.success(`Please ${state}`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setWait(true);
    
    if(data.email === "rrewar756@gmail.com" && data.password === "Rahul_09062004"){
       const adminToken = "xyz_rr_Token";
       localStorage.setItem("adminToken", adminToken);
       route.push("/AdminPage/dashboard");
       return;
    }
   
    if (data.email === "" || data.password === "") {
      toast.error(`both fields are required`, {
        position: "top-right",
        autoClose: 1000,
      });
      setWait(false);
      return;
    }

    const req = await axios.post(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Login`, data);
    try {
       toast.success(`Wait...`, {
        position: "top-right",
        autoClose: 1000,
      });

      if (req.data.success) {
        localStorage.setItem("token" , req.data.token);
        localStorage.setItem("myUser" ,  JSON.stringify(req.data.myUser) )
        setTimeout(() => {
          toast.success(`User Login Successfully`, {
            position: "top-right",
            autoClose: 1300,
          });           
          setWait(false);
        }, 1000);
         return;
      }else if (!req.data.success) {
        setTimeout(() => {
          toast.error(`${req.data.result}`, {
            position: "top-left",
            autoClose: 1000,
          });
          setWait(false);
        }, 1300);
        return;
      }
    } catch (err) {
      setTimeout(() => {
        toast.error(`${req.data.result}`, {
          position: "top-left",
          autoClose: 1000,
        });
        setWait(false);
      }, 1300);
      return;
    }
     data.email ="";
     data.password = "";

  };

  return (
    <>
      {loading && <LoadingScroller/>}
      <section className={style.login}>
        <form action="">
          <input
            type="email"
            name="email"
            onChange={handleOnChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            onChange={handleOnChange}
            placeholder="Password"
          />
          <div>
            <p>
              <input type="checkbox" name="" id="rememberMe" />
              <span>Remember Me</span>
            </p>
            <span onClick={()=>handleUrl("/Components/forgotPassword")} className={style.forgot}>Forgot Password?</span>
          </div>
          <button onClick={handleLogin}>
            {wait === true ? "Wait..." : "SIGN IN"}
          </button>
        </form>
        <div className={style.register}>
          <p>
            Not a Member?{" "}
            <span  onClick={() => handleShowRegisterForm("register")}>
              Register
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

export default UserAuth;
