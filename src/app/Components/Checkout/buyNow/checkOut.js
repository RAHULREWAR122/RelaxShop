"use client";
import React, { useEffect, useState } from "react";
import style from "./buy.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  increaseQuantity,
  decreaseQuantity,
  setCartItems,
  getCartFromLocalStorage,
} from "@/app/Redux/cartSlice";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 } from "uuid";
import SHA256 from "crypto-js/sha256";
import Link from "next/link";
import MiniScroller from "../../miniScroller/page";

function CheckOut({ mainItem }) {
  const [disabled, setDisabled] = useState(true);
  const [addressData , setAddressData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
    complectAddress: "",
    feedback: "",
  });
  

  const [searchPin, setSearchPin] = useState("");
  const [myUserD, setMyUserD] = useState({ name: null, email: null });

  const token = localStorage.getItem("token");
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(cartSelector);

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    } else {
      router.push('/');
    }
  }, [token]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_NAME}/api/MyUser`,
        { token: token }
      );
      const { email, name, phone, pinCode } = response.data.result;
      if (response.data.success) {
        setAddressData((prevData) => ({
          ...prevData,
          email,
          name,
          phone,
          pinCode
        }));
        setSearchPin(pinCode)

      } else {
        setSearchPin("")
        setAddressData((prevData) => ({
          ...prevData,
          email: '',
          name: '',
          phone: '',
          pinCode: ''
        }));
        console.error("Fetch User Details Failed:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchPinCode(searchPin);
  }, [searchPin]);

  const handlePinCodeChange = (e) => {
    const pin = e.target.value;
    if (/^\d{0,6}$/.test(pin)) {
      setSearchPin(pin);
      if (pin.length === 6) {
        fetchPinCode(pin);
      } else if (pin.length < 6) {
        setAddressData((prevData) => ({
          ...prevData,
          country: "",
          state: "",
          district: "",
          city: "",
          complectAddress: "",
        }));
      }
    }
  };

  const fetchPinCode = async (pin) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const pinData = response.data;
      
      if (pinData && pinData[0].Status === "Success") {
        const { Country, State, District, Name, Pincode } =
          pinData[0].PostOffice[0];
        
        setAddressData((prevData) => ({
          ...prevData,
          country: Country,
          state: State,
          district: District,
          city: Name,
          complectAddress: `${Name},${District},${State},${Country}-${Pincode}`,
        }));
      } else {
        setAddressData((prevData) => ({
          ...prevData,
          pinCode: pin,
        }));
      }
    } catch (error) {
      setAddressData((prevData) => ({
        ...prevData,
        pinCode: "",
      }));
      return;
    }
    
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitAddress = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const { name, email } = addressData;
    if (!tok) {
      if (name.length >= 3 && email.length >= 11) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  }, [addressData]);

  useEffect(() => {
    if (addressData.phone.length !== 10) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [addressData]);

  const handleSaveMyAddressInfo = (e) => {};

  useEffect(() => {
    dispatch(setCartItems(getCartFromLocalStorage()));
  
  }, [dispatch]);
  
  if(addressData.email === ""){
     return <MiniScroller/>
 }


  const totalQuantity = items.reduce((total, item) => total + item.qty, 0);
  
  const { totalPrice, discount, newTotal } = items.reduce(
    (accumulator, item) => {
      const itemTotal = item.price * item.qty;

      let itemDiscount = 0;

      if (totalQuantity >= 2 && totalQuantity <= 10) {
        itemDiscount = itemTotal * 0.1;
      } else if (totalQuantity >= 11 && totalQuantity <= 16) {
        itemDiscount = itemTotal * 0.14;
      } else if (totalQuantity >= 17 && totalQuantity <= 24) {
        itemDiscount = itemTotal * 0.18;
      } else if (totalQuantity > 24) {
        itemDiscount = itemTotal * 0.24;
      }

      accumulator.totalPrice += itemTotal;
      accumulator.discount += itemDiscount;
      accumulator.newTotal += itemTotal - itemDiscount;

      return accumulator;
    },
    { totalPrice: 0, discount: 0, newTotal: 0 }
  );

  const disInPer = ((discount / totalPrice) * 100).toFixed(2);

  const handleIncreaseQty = (id, newQty) => {
    dispatch(increaseQuantity({ id }));
  };
  const handleDecreaseQty = (id) => {
    dispatch(decreaseQuantity({ id }));
  };

  const payInfo = ["SUCCESS", "FAILURE", "SUCCESS"];

  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!token) {
      toast.error(`Please login.`, {
        position: "top-right",
        autoClose: 1000,
      });
      router.push("/Components/Auth/UserAuthentication");
    } else {
      const { email, complectAddress } = addressData;

      const transitionId = "Tr-" + v4().toString(36).slice(-6);
      const randomPayInfo = payInfo[Math.floor(Math.random() * payInfo.length)];

      const payload = {
        email: email || myUserD.email,
        orderId: transitionId,
        paymentInfo: randomPayInfo,
        products: items.map((item) => ({
          title: item.title,
          price: item.price,
          qty: item.qty,
          img: item.thumbnail,
        })),
        dis: discount,
        address: complectAddress,
        amount: newTotal.toFixed(0),
        status: "SUCCESS",
      };

      try {
        if (randomPayInfo === "SUCCESS") {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/api/status`,
            payload
          );
          if (response.data.success) {
            for (const product of mainItem) {
              const localItem = items.find((item) => item._id === product._id);

              if (localItem) {
                if (localItem.qty <= product.availableQty) {
                  const reducedQuantityResponse = await axios.put(
                    `${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products/${product._id}`,
                    {
                      availableQty: product.availableQty - localItem.qty,
                    }
                  );

                  if (!reducedQuantityResponse.data.success) {
                    console.error(
                      `Failed to update quantity for product with ID: ${product._id}`
                    );
                  }
                  localStorage.removeItem("cart");
                  toast.success(`Yeh, Payment Success.`, {
                    position: "top-right",
                    autoClose: 1000,
                  });
                  router.push("/Components/Orders");
                } else {
                  toast.error(`Sorry! The maximum quantity limit has been exceeded for one or more items.`, {
                    position: "top-right",
                    autoClose: 1000,
                  });
                }
              }
            }
          } else {
            toast.error(`Payment failed. Please try again later.`, {
              position: "top-right",
              autoClose: 1000,
            });
      
          }
        } else {
          toast.error(`Payment failed.`, {
            position: "top-right",
            autoClose: 1000,
          });
    
        }
      } catch (error) {
        toast.error(`Sorry, Please try again later.`, {
          position: "top-right",
          autoClose: 1000,
        });
  
       return;
      }
    }
  };

  return (
    <>
      {items.length === 0 && (
        <h1>
          No Items in Your Cart, Please{" "}
          <Link
            style={{ color: "blue", borderBottom: "1px solid brown" }}
            href="/"
          >
            Continue Shopping
          </Link>
        </h1>
      )}
      {items.length >= 1 && (
        <>
          <div className={style.form}>
            <h2>1. Delivery Address</h2>
            <form action="">
                
              <input
                  type="text"
                  name="name"
                  value={addressData.name}
                  id=""
                  readOnly
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={addressData.email}
                  readOnly
                  placeholder="Email"
                />
              <input
                type="number"
                name="pinCode"
                value={searchPin}
                id=""
                maxLength={6}
                onChange={handlePinCodeChange}
                placeholder="PinCode"
              />
              <input
                type="number"
                name="phone"
                value={addressData.phone}
                id=""
                onChange={handleSubmitAddress}
                placeholder="Phone"
              />
              <input
                type="text"
                name="country"
                value={addressData.country}
                id=""
                onChange={handleInputChange}
                disabled
                placeholder="Country"
              />
              <input
                type="text"
                name="state"
                value={addressData.state}
                id=""
                onChange={handleInputChange}
                disabled
                placeholder="State"
              />
              <input
                type="text"
                name="district"
                value={addressData.district}
                id=""
                onChange={handleInputChange}
                disabled
                placeholder="District"
              />
              <input
                type="text"
                name="city"
                value={addressData.city}
                id=""
                onChange={handleInputChange}
                disabled
                placeholder="City"
              />
              <input
                type="text"
                name="complectAddress"
                value={addressData.complectAddress}
                id=""
                onChange={handleInputChange}
                disabled
                placeholder="Complect Address"
              />
              <input
                type="text"
                name="feedback"
                value={addressData.feedback}
                id=""
                onChange={handleSubmitAddress}
                placeholder="Please Share Your Feedback with us."
              />
            </form>
          </div>

          <div className={style.cartItems}>
            {items.length > 0 && (
              <div className={style.cartItems}>
                <h2>2. Reviews Cart Items</h2>
                {items &&
                  items.map((item, i) => {
                    return (
                      <div key={i} className={style.item}>
                        <div className={style.oneItem}>
                          <img src={item.thumbnail} alt={item.title} />
                          <div className={style.info}>
                            <h3>{item.title}</h3>
                            <h4>₹ {item.price * item.qty}</h4>
                            <h4 className={style.qty}>
                              Qty :{" "}
                              <CiCircleMinus
                                onClick={() => handleDecreaseQty(item._id)}
                                className={`${
                                  item.qty === 1 ? style.qty1 : "qtyUpdate"
                                } `}
                              />
                              <span>{item.qty}</span>{" "}
                              <CiCirclePlus
                                onClick={() => handleIncreaseQty(item._id)}
                                className="qtyUpdate"
                              />
                            </h4>
                          </div>
                        </div>

                        <div className={style.sold}>
                          <p>
                            Sold by &nbsp;:<span>Relax Shop</span>
                          </p>
                          <p>Free Delivery</p>
                        </div>
                      </div>
                    );
                  })}
                <div className={style.buyPrd}>
                  <h3>Total Amount :{totalPrice} </h3>
                  <h3>Discount :{disInPer}% </h3>
                  <h3>Pay Total Amount : {newTotal.toFixed(0)}</h3>
                  <button
                    disabled={disabled}
                    className={disabled ? style.disabled : null}
                    onClick={(e) => handlePayment(e)}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default CheckOut;
