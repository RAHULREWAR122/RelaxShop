"use client";
import React from "react";
import style from "./showLoginModel.module.scss";
import { useRouter } from "next/navigation";

function ShowLoginModel({ setShowModel }) {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/Components/Auth/UserAuthentication");
  };
  
  
  return (
    <div className={style.model}>
      <div className={style.modalContent}>
        <button className={style.closeBtn} onClick={() => setShowModel(false)}>
          X
        </button>
        <h2>You are not logged in</h2>
        <p>Please login to continue your purchase.</p>
        <button className={style.loginButton} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default ShowLoginModel;
