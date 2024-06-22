import React from "react";
import style from "./footer.module.css";
import { FaFacebook, FaTwitter, FaInstagram ,FaLinkedin ,FaGithub } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";

function Footer() {
  const searchPar = useSearchParams();
  const getToken = searchPar.get("token");
  
   const pathName = usePathname();
  return (
    <>
     {pathName === "/Components/forgotPassword" && getToken ? null : 


    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerSection}>
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            gravida dolor sed velit fringilla, eu vestibulum elit tristique.
          </p>
        </div>
        <div className={style.footerSection}>
          <h2>Quick Links</h2>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/Components/Cart">Cart</Link>
            </li>
            <li>
              <Link href="/Components/AllPages/Shoes">Shoes</Link>
            </li>
            <li>
              <Link href="/Components/AllPages/Electric">Electric</Link>
            </li>
            <li>
              <Link href="/Components/AllPages/Furniture">Furniture</Link>
            </li>
            <li>
              <Link href="/Components/AllPages/Hoodies">Hoodies</Link>
            </li>
          </ul>
        </div>
        <div className={style.footerSection}>
          <h2>Follow Us</h2>
          <div className={style.socialLinks}>
            <a target="_blank" href="https://www.facebook.com">
              <FaFacebook />
            </a>
            <a target="_blank" href="https://www.linkedin.com/in/rahul-rewar-202517276/">
              <FaLinkedin/>
            </a>
            <a target="_blank" href="https://github.com/RAHULREWAR122">
              <FaGithub />
            </a>

          </div>
        </div>
      </div>
      <div className={style.bottomFooter}>
        <p>&copy; 2024 Your E-commerce. All rights reserved.</p>
      </div>
    </footer>}
  </>);
}

export default Footer;
