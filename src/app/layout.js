import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css"
import "react-toastify/dist/ReactToastify.css";
import { DataProvider } from "./Redux/provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RelaxShop",
  description :"RelaxShop , Shop affordable fashion at RelaxShop ,Discover budget-friendly electronics, Find cheap home furniture, Best deals on men's and women's clothing, Affordable prices on top-quality items, RelaxShop: Your destination for low-cost fashion and gadgets, Buy discount fashion and electronics online, RelaxShop budget fashion ,RelaxShop affordable electronics,RelaxShop cheap furniture,RelaxShop discount clothing,RelaxShop low-cost gadgets, Best deals on men's and women's t-shirts, Best cheap jeans for men and women, Affordable girls' jeans online,Where to buy discount saris,Low-cost lehengas for weddings,Budget-friendly shoes for everyday wear, Affordable headphones with great sound quality, Cheap home office chairs, Inexpensive furniture for small apartments",
  keywords: "RelaxShop, relaxshop, relaxShop, relax shop , Shop affordable fashion at RelaxShop ,Discover budget-friendly electronics, Find cheap home furniture, Best deals on men's and women's clothing, Affordable prices on top-quality items, RelaxShop: Your destination for low-cost fashion and gadgets, Buy discount fashion and electronics online, RelaxShop budget fashion ,RelaxShop affordable electronics,RelaxShop cheap furniture,RelaxShop discount clothing,RelaxShop low-cost gadgets, Best deals on men's and women's t-shirts, Best cheap jeans for men and women, Affordable girls' jeans online,Where to buy discount saris,Low-cost lehengas for weddings,Budget-friendly shoes for everyday wear, Affordable headphones with great sound quality, Cheap home office chairs, Inexpensive furniture for small apartments",
};

export default function RootLayout({ children }) {
  
  
  return (
    <html lang="en">
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"/>
       
      <body className={inter.className}>
        <DataProvider>
        {children}
        </DataProvider>
        </body>
    </html>
  );
}
