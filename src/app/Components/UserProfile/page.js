"use client";
import React, { useEffect, useState } from "react";
import "./uStyle.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import ProfileSetting from "./profileSetting";
import OrdersInfo from "./orders";
import Address from "./address";
import OrdersPage from "../Orders/page";
import style from "./profileSetting.module.scss";
import { FaUserAstronaut } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";

export default function Profile() {
  const [userOrders, setUserOrders] = useState([]);
  

  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    pinCode: "",
    phone: "",
    password: "",
    cPassword: "",
    nwPassword: "",
  });
  const [listState, setListState] = useState("profile_setting");

  console.log(listState);
  const handleListData = (data) => {
    setListState(data);
  };


  let token = localStorage.getItem("token");
  let router = useRouter();

  useEffect(() => {
    if (!token) {
      console.log("Token Null");
      
      router.push("/");
      return;
    } else {
      fetchUserDetails();
    }
  }, [token]);
  

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/api/MyUser`,
        { token: token }
      );
      if (response.data.success) {
        const { email, name, phone, pinCode } = response.data.result;

        setUserData((prevUserData) => ({
          ...prevUserData,
          email: email,
          name: name,
          phone: phone,
          pinCode: pinCode,
        }));
      } else {
        console.error("Fetch User Details Failed:", response.data.error);
        setUserData((prevUserData) => ({
          ...prevUserData,
          email: "",
          name: "",
          phone: "",
          pinCode: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/api/MyUser`,
        {
          token: token,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          pinCode: userData.pinCode,
        }
      );

      if (response.data.success) {
        toast.success(`Profile Update Successfully`, {
          position: "top-right",
          autoClose: 1000,
        });
        console.log(response.data);
      } else {
        toast.error(response.data.result, {
          position: "top-right",
          autoClose: 1000,
        });
      }
      return;
    } catch (error) {
      console.log("Error updating user:", error);
      return;
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      if (userData.cPassword === userData.nwPassword) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_HOST_NAME}/api/updatePassword`,
          {
            token: token,
            email: userData.email,
            password: userData.password,
            cPassword: userData.cPassword,
            nwPassword: userData.nwPassword,
          }
        );

        if (response.data.success) {
          toast.success(`Password Update Successfully`, {
            position: "top-right",
            autoClose: 1000,
          });

          return;
        } else {
          toast.error(`Error in Update user`, {
            position: "top-right",
            autoClose: 1000,
          });

          return;
        }
      } else {
        toast.error(`Password Not Matches`, {
          position: "top-right",
          autoClose: 1000,
        });
        return;
      }
    } catch (error) {
      console.log("Error updating user:", error.message);
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} />
      <div className={style.container}>
        <div className={style.row}>
          <div className={style.col}>
            <div className={style.author_card}>
              <div
                className={style.author_card_cover}
                style={{
                  backgroundImage:
                    "url(https://bootdey.com/img/Content/flores-amarillas-wallpaper.jpeg)",
                }}
              ></div>
              <div className={style.author_card_profile}>
                <div className={style.author_card_avatar}>
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt="Daniel Adams"
                  />
                </div>
                <div className="author-card-details">
                  <h5 className="author-card-name text-lg">
                   {userData.name}
                  </h5>
                  <span className="author-card-position">
                    {userData.email}
                  </span>
                </div>
              </div>
            </div>
            <div className={style.wizard}>
              <nav className={style.list_group}>
                <a
                  className={
                    listState === "Orders"
                      ? `${style.list_group_item} ${style.active}`
                      : style.list_group_item
                  }
                  href="#/"
                  onClick={() => handleListData("Orders")}
                >
                  <div className={style.ord}>
                    <div>
                      <div className="d-inline-block font-weight-medium text-uppercase">
                       <GiShoppingCart  className={style.icon}/>
                        Orders
                      </div>
                    </div>
                    <span>{userOrders.length}</span>
                  </div>
                </a>
                <a
                  className={
                    listState === "profile_setting"
                      ? `${style.list_group_item} ${style.active}`
                      : style.list_group_item
                  }
                  href="#/"
                  onClick={() => handleListData("profile_setting")}
                >
                  <FaUserAstronaut className={style.icon}/>Profile Settings
                </a>
              </nav>
            </div>
          </div>
           <div className={style.aboutUserDetails}>
               <div className={style.info}>
               <h3>{userData.name}</h3>
               <span style={{fontSize:".7rem"}}>{userData.email}</span>
               </div>
               <div className={style.links}>
                  <ul>
                    <li className={listState === "profile_setting" ? style.activeList: null} onClick={() => handleListData("profile_setting")}>Profile</li>
                    <li className={listState === "Orders" ? style.activeList : null} onClick={() => handleListData("Orders")}>Orders</li>
                    </ul>  
               </div>
           </div>
          <div className={style.pages}>
              

            {listState === "Orders" && (
              <OrdersInfo
              />
            )}
            {listState === "profile_setting" && (
              <ProfileSetting
                userData={userData}
                handleChange={handleChange}
                handleUpdatePassword={handleUpdatePassword}
                handleUpdateUser={handleUpdateUser}
              />
            )}
            {listState === "address" && <Address />}
          </div>
        </div>
      </div>
    </div>
  );
}
