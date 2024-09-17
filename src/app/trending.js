// import React, { useEffect } from "react";
// import style from "./landing.module.scss";
// import { useRouter, usePathname } from "next/navigation";

// function Trending({ data, progress, setProgress }) {
//   const router = useRouter();
//   const pathName = usePathname();

//   const handleUrl = (url) => {
//     console.log(pathName);
//     console.log(url);
//     setProgress(70);
//     if (pathName === url) {
//       setTimeout(() => {
//         setProgress(100);
//       }, 400);
//     }
//     router.push(url);
//     return;
//   };
//   useEffect(() => {
//     setTimeout(() => {
//       setProgress(100);
//     }, 100);
//   }, []);

//   return (
//     <div className={style.cards}>
//       {data.slice(5,30).map((item, i) => {
//         return (
//           <div
//             key={i}
//             onClick={() => handleUrl(`/Components/AllPages/${item._id}`)}
//             className={style.card}
//           >
//             <div className={style.img}>
//               <img src={item.thumbnail} alt="" />
//             </div>
//             <div className={style.title}>{item.title.slice(0, 15) + "..."}</div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default Trending;


import React, { useEffect } from "react";
import style from "./landing.module.scss";
import { useRouter, usePathname } from "next/navigation";

function Trending({ data, progress, setProgress }) {
  const router = useRouter();
  const pathName = usePathname();

  const handleUrl = (url) => {
    console.log(pathName);
    console.log(url);
    setProgress(70);
    if (pathName === url) {
      setTimeout(() => {
        setProgress(100);
      }, 400);
    }
    router.push(url);
    return;
  };

  useEffect(() => {
    setTimeout(() => {
      setProgress(100);
    }, 100);
  }, []);

  // Shuffle the data array to ensure different products are displayed on each refresh
  const shuffledData = [...data].sort(() => Math.random() - 1);

  return (
    <div className={style.cards}>
      {shuffledData.slice(5, 30).map((item, i) => {
        return (
          <div
            key={i}
            onClick={() => handleUrl(`/Components/AllPages/${item._id}`)}
            className={style.card}
          >
            <div className={style.img}>
              <img src={item.thumbnail} alt="" />
            </div>
            <div className={style.title}>{item.title.slice(0, 15) + "..."}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Trending;
