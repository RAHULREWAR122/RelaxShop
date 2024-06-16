import React from "react";
import style from "./miniScroller.module.css";
import Image from "next/image";


function MiniScroller() {
  return (
    <div className={style.scroller}>
      <Image src="/miniLoader.gif" alt="Loading..." height={100} width={100} className={style.loader} />
     </div>
  );
}

export default MiniScroller;
