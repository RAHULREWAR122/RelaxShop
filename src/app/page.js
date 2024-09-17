"use client";
import style from "./landing.module.scss";
import Navbar from "./Components/Navbar/page";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "react-multi-carousel/lib/styles.css";
import TopOffers from "./topOffers/page";
import { FaArrowRight } from "react-icons/fa";
import Trending from "./trending";
import { useState, useEffect } from "react";
import { fetchData } from "./Components/AllPages/fetchData";
import LoadingBar from 'react-top-loading-bar'
import Footer from "./Components/Footer/footer";
import LoginShow from "./loginShow";

const fadeImages = [
  {
    url: "/shopHeroImgs/1.jpg",
    caption: "First Slide",
    h1text: "Trending Girls tShirts in less price and discount offers.",
    pText: "Now Order in Rs. 399",

  },
  {
    url: "/shopHeroImgs/2.jpg",
    caption: "Second Slide",
    h1text: "get heavy discount on Girls Jeans by purchasing 1+",
    pText: "Now Order in Rs. 599",

  },
  {
    url: "/shopHeroImgs/3.jpg",
    caption: "Third Slide",
    h1text: "check latest trendy Clothes.",
    pText: "Now Order in Rs. 299",

  },
  {
    url: "/shopHeroImgs/4.jpg",
    caption: "4 Slide",
    h1text: "get heavy discount on Girls Jeans by purchasing 1+",
    pText: "Now Order in Rs. 199",

  },
  {
    url: "/shopHeroImgs/5.jpg",
    caption: "5 Slide",
    h1text: "Get extra discount to use online payment",
    pText: "",

  },
  {
    url: "/shopHeroImgs/6.jpg",
    caption: "6 Slide",
    h1text: "we are offering you to order electric item to get discount.",
    pText: "Now Order in Rs. 699",

  },
  {
    url: "/shopHeroImgs/7.jpg",
    caption: "7 Slide",
    h1text: "Best quality Sofa .",
    pText: "Now Order in Rs. 399",

  },
  {
    url: "/shopHeroImgs/8.jpg",
    caption: "8 Slide",
    h1text: "Stylish Shoes in less price.",
    pText: "Now Order in Rs. 599",

  },
  {
    url: "/shopHeroImgs/9.jpg",
    caption: "9 Slide",
    h1text: "best Summer tShirts only for you.",
    pText: "Now Order in Rs. 199",
    btnText: "ShopNow",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [progress , setProgress] = useState(0)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
 
  

  const token = localStorage.getItem("token");

  useEffect(() => {
    const hasPromptBeenShown = localStorage.getItem("loginPromptShown");
   
    if (hasPromptBeenShown === "true" && !token) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        localStorage.setItem("loginPromptShown", "false");
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  

  useEffect(() => {
    topOffersData();
    setTimeout(()=>{
      localStorage.removeItem("loginPromptShown");   
    },1500000)
  
  }, []);

  const topOffersData = async () => {
    try {
      const data = await fetchData();
      if (data) {
        setData(data);
      }
    } catch (err) {
      return;
    }
  };

  const handleBeforeChange = (oldIndex, newIndex) => {
    setCurrentIndex(newIndex);
  };

  return (
    <>
       
      <Navbar />
      {showLoginPrompt &&  <LoginShow setShowLoginPrompt={setShowLoginPrompt} />}
      <LoadingBar
            className={style.progressBar}
            color='#f11946'
            progress={progress}
            waitingTime={380}
            height={3}
            shadow={true}
            onLoaderFinished={() => setProgress(0)}
          />
      <div className={style.homePage}>
        <section className={style.hero}>
        <div className="slide-container" id={style.slide_Cont}>
        <Fade className={style.fadeAnimation}  onChange={handleBeforeChange}>
        {fadeImages.map((fadeImage, index) => (
          <div className={style.mainDiv} key={index}>
            <img  className={style.fadeImgs} src={fadeImage.url} />
               {index === currentIndex && (
                    <div className={style.texts}>
                        <div className={style.box}>
                             <h1>{fadeImage.h1text}</h1>
                              <p>{fadeImage.pText}</p>
                           </div>   
                    </div>
                   
                   )}
          </div>
        ))}
        </Fade>
     </div>
        </section>

        <section className={style.topOffers}>
        <h1>Top Holidays Offers <FaArrowRight className={style.arrow}/></h1>
               <TopOffers data={data}/>              
        </section>

        <section className={style.trending}>
          <h1>Season Trendings<FaArrowRight className={style.arrow}/></h1>
       
          <Trending data={data} setProgress={setProgress} progress={progress} />
        </section>

        <section className={style.summerSeason}></section>
      </div>
      {/* <OpenAiAsk/>  */}
      {/* <CustomerSupport/> */}
      <Footer/>
    </>
  );
}
