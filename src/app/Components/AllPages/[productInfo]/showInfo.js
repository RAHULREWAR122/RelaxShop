"use client";
import React, { useEffect, useState } from "react";
import style from "./prod.module.scss";
import { CiStar } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import OtherProducts from "./otherProducts";
import { addToCart, cartSelector, clearCart } from "@/app/Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import LoadingScroller from "../../laodingScroller/page";
import ShowLoginModel from "../../showLoginModel/page";




function ShowInfo({ newData, params }) {
  const [mainImg, setMainImg] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const id = params.productInfo;
  const pathName = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setProgress(0);
  }, [pathName]);

  if (!newData) {
    return <h2>Loading...</h2>;
  }

  const data = newData.find((item) => item._id === String(id));
  const imgs = data?.imgs || [];

  if (!data) {
    return <h2>Loading...</h2>;
  }

  const handleImageClick = (image) => {
    setMainImg(image);
  };

  const handleAddToCart = (item) => {
    try {
      dispatch(addToCart(item));
      toast.success("Item Added In Cart", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error in Adding Cart");
      toast.error("Error, item not added in Cart", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let checkToken = localStorage.getItem("token");

  const handleBuyProduct = (url) => {
    setLoading(true);
    if (pathName === url) {
      setLoading(false);
      router.push(pathName);
    }
    if (checkToken) {
      router.push(url);
      dispatch(clearCart());
    } else {
      setLoading(false);
    }

    return;
  };

  const handleAddCartAndBuy = (item) => {
    if (checkToken) {
      dispatch(addToCart(item));
      setShowModel(false);
    } else {
      setShowModel(true);
    }
  };


  return (
    <>
      {showModel && <ShowLoginModel setShowModel={setShowModel} />}
      {loading && <LoadingScroller />}
      <div className={style.infoPage}>
        <LoadingBar
          className={style.progressBar}
          color="red"
          progress={progress}
          waitingTime={380}
          height={3}
          shadow={true}
          onLoaderFinished={() => setProgress(0)}
        />

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
        <div className={style.imgsInfo}>
          <div className={style.mainImg}>
            <img src={mainImg || data.thumbnail} alt={data.title} />
          </div>
          <div className={style.dummyImgs}>
            {imgs.map((item, ind) => (
              <img
                key={ind}
                src={item}
                alt={item.title}
                onClick={() => handleImageClick(item)}
              />
            ))}
          </div>

          <div className={style.btns}>
            <button
              onClick={() => handleAddToCart({ ...data, availableQty: 1 })}
            >
              <IoCartOutline className={style.cart} /> Add To Cart
            </button>
            <button
              onClick={() => {
                handleBuyProduct(`/Components/Checkout/buyNow`),
                  handleAddCartAndBuy({ ...data, availableQty: 1 });
              }}
            >
              <MdNavigateNext className={style.navigate} /> Buy Now
            </button>
          </div>
        </div>

        <div className={style.aboutItems}>
          <div className={style.basicDet}>
            <h2>{data.title}</h2>
            <h4>₹ {data.price}</h4>
            <h3 className={style.rating}>
              {data.rating} <CiStar className={style.star} />
            </h3>
            <p>Free Delivery</p>
          </div>
          <div className={style.prdDetails}>
            <h2>Product Details</h2>
            <h4>Name: {data.title}</h4>
            <h4>Price: {data.price}</h4>
            <h4>Net Quantity: {data.availableQty}</h4>
            <h4>Country of Origin: India</h4>
            <h4>Description: {data.desc}</h4>
          </div>
        </div>
      </div>

      <div className={style.similarData}>
        <h2>People also viewed</h2>
        <OtherProducts data={data} />
      </div>
    </>
  );
}

export default ShowInfo;
