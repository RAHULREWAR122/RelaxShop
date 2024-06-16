import React from "react";
import style from "./loadingScroller.module.css";
import Image from "next/image";


function LoadingScroller() {
  return (
    <div className={style.loadingScroller}>
    <div className={style.scroller}>
       <Image src="/miniLoader.gif" alt="Loading..." height={100} width={100} className={style.loader} />
     </div>
     </div> 
  );
}

export default LoadingScroller;
