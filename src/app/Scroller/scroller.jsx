import React from "react";
import style from "./scroller.module.css";
import Image from "next/image";


function Scroller() {
  return (
    <div className={style.scroller}>
      <Image src="/loader.gif" alt="Loading..." height={200} width={200} className={style.loader} />
      <h4>Loading...</h4>
    </div>
  );
}

export default Scroller;
