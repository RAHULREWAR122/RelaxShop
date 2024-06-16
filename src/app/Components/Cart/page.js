"use client";
import React, { useEffect, useState } from "react";
import MtCart from "./mtCart";
import style from "./cart.module.scss";


import { useDispatch, useSelector } from "react-redux";
import { cartSelector, removeFromCart  , setCartItems , getCartFromLocalStorage} from "@/app/Redux/cartSlice";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { clearCart,  increaseQuantity,
  decreaseQuantity,
 } from "@/app/Redux/cartSlice";

import { usePathname, useRouter } from "next/navigation";
import MiniScroller from "../miniScroller/page";
import LoadingScroller from "../laodingScroller/page";

function Cart() {
  const [loading , setLoading] = useState(false);
  const dispatch = useDispatch();
  const items = useSelector(cartSelector);
   
  const notItemImg = items.map((item) => !item.thumbnail);
  if (!notItemImg) {
    return <h1>Loading...</h1>;
  }
  
  useEffect(() => {
    dispatch(setCartItems(getCartFromLocalStorage()));
  }, [dispatch]);


  const route = useRouter();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncreaseQty = (id, newQty) => {
    dispatch(increaseQuantity({ id }));
  };
  const handleDecreaseQty = (id) => {
    dispatch(decreaseQuantity({ id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const pathName = usePathname(); 
  
  const handleContinue = (url) => {
    setLoading(true)
    if(pathName === url){
       setLoading(false)
    }
      route.push(url);
  };

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

  const disInPer = parseInt((discount / totalPrice) * 100).toFixed(2);

  return (
    <div className={style.cartPage}>
      {loading  && <LoadingScroller/>}
      {items.length >= 1 && (
        <div className={style.cartItems}>
          <div className={style.flex}>
            <h2>Product Details</h2>
            <button onClick={handleClearCart} className={style.clearBtn}>
              Clear Cart
            </button>
          </div>
          {items &&
            items.map((item, i) => {
              return (
                <div key={i} className={style.item}>
                  <div className={style.oneItem}>
                    <img src={item.thumbnail} alt={item.title} />
                    <div className={style.info}>
                      <h3>
                        {item.title.length > 10
                          ? item.title.slice(0, 14) + "..."
                          : item.title}
                      </h3>
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
                      <button onClick={() => handleRemoveFromCart(item._id)}>
                        X Remove
                      </button>
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
        </div>
      )}

      {items.length >= 1 && (
        <div className={style.priceDetails}>
          <h2>Price Details</h2>

          <div className={style.totalPrice}>
            <p>Total Product Price</p>
            <p>+ ₹ {totalPrice}</p>
          </div>
          <div className={style.orderTotal}>
            <h5>Total Discount {disInPer}%</h5>
            <strong>₹ {parseInt(discount)}</strong>
          </div>
          <div className={style.orderTotal}>
            <h4>Order Total </h4>
            <strong>+ ₹ {parseInt(newTotal)}</strong>
          </div>
          <div className={style.conBtn}>
            <button
              onClick={() => handleContinue("/Components/Checkout/buyNow")}
              className={style.continue}
            >
             {loading ? "loading..." : "Continue"}
            </button>
          </div>
        </div>
      )}

      {items.length < 1 && <MtCart />}
    </div>
  );
}

export default Cart;
