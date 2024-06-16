"use client";
import React from 'react'
// import  "./uStyle.css"
import { ToastContainer, toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
import style from "./profileSetting.module.scss"



function ProfileSetting({userData , handleChange ,handleUpdatePassword , handleUpdateUser}) {

    return (
      <>
      <form className={style.form_row}>
      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-fn">Name</label>
          <input
            className="form-control"
            name="name"
            value={userData.name}
            onChange={handleChange}
            type="text"
            id="account-fn"
            required
          />
        </div>
      </div>
      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-ln">Pincode</label>
          <input
            className="form-control"
            name="pinCode"
            value={userData.pinCode}
            onChange={handleChange}
            type="text"
            id="account-ln"
            required
          />
        </div>
      </div>
      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-email">E-mail Address</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={userData.email}
            id="account-email"
            readOnly
            disabled
          />
        </div>
      </div>
      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-phone">Phone Number</label>
          <input
            className="form-control"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            type="text"
            id="account-phone"
            required
          />
        </div>
      </div>
      <br />
      <div className={style.form_col_full}>
        <div className={style.form_group}>
          <button
            className="btn btn-primary"
            type="button"
            data-toast=""
            data-toast-position="topRight"
            data-toast-type="success"
            data-toast-icon="fe-icon-check-circle"
            data-toast-title="Success!"
            data-toast-message="Your profile updated successfully."
            onClick={handleUpdateUser}
          >
            Update Profile
          </button>
        </div>
      </div>
    <div className={style.passwordUpdate}>
      <div className={style.oldPass}>
        <div className={style.form_group}>
          <label htmlFor="account-pass">Old Password</label>
          <input
            className="form-control"
            name="password"
            value={userData.password}
            onChange={handleChange}
            type="password"
            id="account-pass"
          />
        </div>
      </div>

      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-confirm-pass">New Password</label>
          <input
            className="form-control"
            name="nwPassword"
            type="password"
            value={userData.nwPassword}
            onChange={handleChange}
            id="account-confirm-pass"
          />
        </div>
      </div>
      <div className={style.form_col}>
        <div className={style.form_group}>
          <label htmlFor="account-confirm-pass">Confirm Password</label>
          <input
            className="form-control"
            name="cPassword"
            type="password"
            value={userData.cPassword}
            onChange={handleChange}
            id="account-confirm-pass"
          />
        </div>
      </div>
      <br />
      <div className={style.updateBtn}>
          <button
            className="btn btn-primary"
            data-toast=""
            data-toast-position="topRight"
            data-toast-type="success"
            data-toast-icon="fe-icon-check-circle"
            data-toast-title="Success!"
            data-toast-message="Password updated successfully."
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
       </div>
      </div>
    </form>
    </>  )
}

export default ProfileSetting


