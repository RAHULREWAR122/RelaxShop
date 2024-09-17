// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Meta Tags */}
        <meta name="description" content="RelaxShop , Low-cost headphones, Low-price headphones earPhone, headphone, Earbuds, earbuds,Buy Wireless Earbuds Online in India, Budget-friendly earphones, Cheap electronic gadgets,Affordable tech accessories" />
        {/* <meta name="keywords" content="RelaxShop, relaxshop, relaxShop, relax shop , Shop affordable fashion at RelaxShop ,Discover budget-friendly electronics, Find cheap home furniture, Best deals on men's and women's clothing, Affordable prices on top-quality items, RelaxShop: Your destination for low-cost fashion and gadgets, Buy discount fashion and electronics online, RelaxShop budget fashion ,RelaxShop affordable electronics,RelaxShop cheap furniture,RelaxShop discount clothing,RelaxShop low-cost gadgets, Best deals on men's and women's t-shirts, Best cheap jeans for men and women, Affordable girls' jeans online,Where to buy discount saris,Low-cost lehengas for weddings,Budget-friendly shoes for everyday wear, Affordable headphones with great sound quality, Cheap home office chairs, Inexpensive furniture for small apartments" /> */}
        <meta name="google-site-verification" content="IFghmjgkKUyhwgPne812P3fN_s9mx4ELjZMrrc5wRj0" />
        <meta name="google-adsense-account" content="ca-pub-5951764174503715"/>
        {/* Google AdSense Script */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5951764174503715"
     crossorigin="anonymous"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-xxxxxxxxxx", 
                enable_page_level_ads: true
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
