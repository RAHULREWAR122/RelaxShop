"use client";
import React, { useEffect, useState } from "react";
import style from "./nav.module.scss";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LoadingBar from 'react-top-loading-bar'
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [selectCat, setSelectCat] = useState("men");
  const [menuClose, setMenu] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [user, setUser] = useState({ value: null });
  const [userAccount, setUserAccount] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  let pathName = usePathname();
  const searchPar = useSearchParams();
  const getToken = searchPar.get("token");

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        handleLogOut();
        router.push("/");
      } else {
        setUser({ value: token });
        const timeUntilExpiry = (decodedToken.exp - currentTime) * 1000;
        const logoutTimer = setTimeout(() => {
          handleLogOut();
        }, timeUntilExpiry);
        setProgress(100);
        return () => clearTimeout(logoutTimer);
      }
    } else {
      setUser({ value: null });
      setProgress(100);
      return;
    }
  }, [pathName, router]);

  const [title, setTitle] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchSearchTitle();
  }, []);

  const fetchSearchTitle = async () => {
    try {
      const req = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products`);
      if (req.data.success) {
        setTitle(req.data.result);
      }
    } catch (error) {
      return;
    }
  };

  const handleInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      setFilteredData([]);
    } else {
      const filteredResults = title.filter(item =>
        item.title.toLowerCase().includes(searchTerm)
      );
      setFilteredData(filteredResults);
    }
    return;
  };

  const handleCleanSearch = () => {
    setFilteredData([]);
    setSearchTerm('');
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUser({ value: null });
    setTimeout(() => {
      router.push("/");
      setProgress(100);
    }, 100);
  };

  const handleRoutes = (url) => {
    setProgress(70);
    if (pathName === url) {
      setTimeout(() => {
        setProgress(100);
      }, 400);
    }
    router.push(url);
    return;
  };

  const handleSelectCategory = (category) => {
    setSelectCat(category);
    setTimeout(() => {
      setProgress(100);
    }, 100);
  };

  const handleMenuButton = () => {
    setMenu(!menuClose);
  };

  const handleUserAccount = () => {
    setUserAccount(!userAccount);
  };

  const handleShowSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <>
      {pathName === "/Components/forgotPassword" && getToken ? null :

        <nav className={style.nav}>
          <LoadingBar
            className={style.progressBar}
            color='#f11946'
            progress={progress}
            waitingTime={380}
            height={3}
            shadow={true}
            onLoaderFinished={() => setProgress(0)}
          />

          <div className={style.topNav}>
            <div className={style.logo}>
              <h3><Link href="/"> Relax Shop</Link></h3>
            </div>
            <div className={style.men_women}>
              <h4
                onClick={() => handleSelectCategory("men")}
                className={selectCat === "men" ? style.active : ""}
              >
                Men&apos;s
              </h4>
              <h4
                onClick={() => handleSelectCategory("women")}
                className={selectCat === "women" ? style.active : ""}
              >
                Women&apos;s
              </h4>
            </div>
            <div className={style.right}>
              <div className={style.searchInp}>
                <input type="text" name="" value={searchTerm}
                  onChange={handleInputChange} id="" placeholder="Search Item here" />
                <CiSearch className={style.searcher} />
              </div>
              {searchTerm && filteredData.length >= 0 && <div className={style.titleList}>
                {filteredData.length === 0 && <div className={style.itemNotAvailable}>
                  <h3>item not found
                  </h3>
                </div>}
                {filteredData.slice(0, 7).map((item, i) => {
                  return <ul key={i}>
                    <li onClick={() => { handleRoutes(`/Components/AllPages/${item._id}`); handleCleanSearch(); }}>{item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}
                      <img src={item.thumbnail} alt={item.title} />
                    </li>
                  </ul>
                })}
              </div>
              }
            </div>
            <div className={style.user_cart}>
              <span>
                <h4 onClick={() => handleRoutes("/Components/Cart")}>
                  <IoBagOutline />
                </h4>
              </span>
              <span>
                {!user.value && (
                  <button
                    onClick={() =>
                      handleRoutes("/Components/Auth/UserAuthentication")
                    }
                    className={style.login}
                  >
                    Login
                  </button>
                )}

                {user.value && (
                  <FaRegUser
                    onMouseOver={() => setUserAccount(true)}
                    onMouseLeave={() => setUserAccount(false)}
                  />
                )}

                {userAccount && (
                  <div
                    onMouseOver={() => setUserAccount(true)}
                    onMouseLeave={() => setUserAccount(false)}
                    className={style.account}
                  >
                    <ul>
                      <li onClick={() => setUserAccount(false)}>
                        <span onClick={() => handleRoutes("/Components/UserProfile")}> my Profile</span>
                      </li>
                      <hr />
                      <li onClick={() => setUserAccount(false)}>
                        <span onClick={() => handleRoutes("/Components/Orders")}> my Orders</span>
                      </li>
                      <hr />
                      <li onClick={() => setUserAccount(false)}>
                        <span onClick={handleLogOut}> LogOut</span>
                      </li>
                    </ul>
                  </div>
                )}
              </span>
            </div>

            <div className={style.menu}>
              <span>
                <IoMenu onClick={handleMenuButton} />
              </span>
            </div>

          </div>
          <div
            className={menuClose ? style.categoryNavLinks : style.categoryNavLinks1}
          >
            <aside className={style.linksNav}>
              {/* Mens */}
              <span className={menuClose === false ? style.close : style.closeMenu}>
                <IoIosCloseCircleOutline onClick={handleMenuButton} />
              </span>
              <div className={style.men_women_links}>
                <h4
                  onClick={() => handleSelectCategory("men")}
                  className={selectCat === "men" ? style.active : ""}
                >
                  Men&apos;s
                </h4>
                <h4
                  onClick={() => handleSelectCategory("women")}
                  className={selectCat === "women" ? style.active : ""}
                >
                  Women&apos;s
                </h4>
              </div>

              {selectCat === "men" && (
                <div className={style.men}>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Men/t_Shirts");
                      handleMenuButton();
                    }}
                  >
                    <span>tShirts</span>
                    <img
                      src="/navImgs/mT1.webp"
                      alt="men TShirt"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Men/Lower");
                      handleMenuButton();
                    }}
                  >
                    <span>Lower</span>
                    <img
                      src="/navImgs/lower.webp"
                      alt="Lower"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Men/Jeans");
                      handleMenuButton();
                    }}
                  >
                    <span>Jeans</span>
                    <img
                      src="/navImgs/mJ.webp"
                      alt="men Jeans"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Men/Shirts");
                      handleMenuButton();
                    }}
                  >
                    <span>Shirts</span>
                    <img
                      src="/navImgs/Shirt.webp"
                      alt="men Shirt"
                      height={90}
                      width={90}
                    />
                  </li>
                </div>
              )}

              {selectCat === "women" && (
                <div className={style.men}>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Women/t_Shirts");
                      handleMenuButton();
                    }}
                  >
                    <span>Girls tShirts</span>
                    <img
                      src="/navImgs/wT.webp"
                      alt="women tShirts"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Women/Jeans");
                      handleMenuButton();
                    }}
                  >
                    <span>Jeans</span>
                    <img
                      src="/navImgs/wJ.webp"
                      alt="women Jeans"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Women/Sari");
                      handleMenuButton();
                    }}
                  >
                    <span>Sari</span>
                    <img
                      src="/navImgs/Sari.webp"
                      alt="Sari"
                      height={90}
                      width={90}
                    />
                  </li>
                  <li
                    onClick={() => {
                      handleRoutes("/Components/AllPages/Women/Langha");
                      handleMenuButton();
                    }}
                  >
                    <span>Lehnga</span>
                    <img
                      src="/navImgs/Lehnga.webp"
                      alt="Lehnga"
                      height={90}
                      width={90}
                    />
                  </li>
                </div>
              )}
              <div className={style.others}>
                <li onClick={() => { handleRoutes("/Components/AllPages/Shoes"); handleMenuButton(); }}>
                  <span>Shoes</span>
                  <img
                    src="/navImgs/shoes.webp"
                    alt="shoes"
                    height={90}
                    width={90}
                  />
                </li>
                <li onClick={() => { handleRoutes("/Components/AllPages/Electric"); handleMenuButton(); }}>
                  <span>Electric</span>
                  <img
                    src="/navImgs/watch.webp"
                    alt="Electric"
                    height={90}
                    width={90}
                  />
                </li>
                <li onClick={() => { handleRoutes("/Components/AllPages/Hoodies"); handleMenuButton(); }}>
                  <span>Hoodies</span>
                  <img
                    src="/navImgs/hoodie.webp"
                    alt="Hoodies"
                    height={90}
                    width={90}
                  />
                </li>
                <li onClick={() => { handleRoutes("/Components/AllPages/Jewelry"); handleMenuButton(); }}>
                  <span>Jewelry</span>
                  <img
                    src="/navImgs/Jewelry.webp"
                    alt="Jewelry"
                    height={90}
                    width={90}
                  />
                </li>
                <li onClick={() => { handleRoutes("/Components/AllPages/Furniture"); handleMenuButton(); }}>
                  <span>Furniture</span>
                  <img
                    src="/navImgs/furniture.webp"
                    alt="Furniture"
                    height={90}
                    width={90}
                  />
                </li>
              </div>
            </aside>
          </div>
        </nav>
      }</>
  );
}

export default Navbar;


