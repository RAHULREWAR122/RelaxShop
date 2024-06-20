import { NextResponse } from "next/server";
import { Product } from "@/app/MongoDb/Products";


const { db } = require("@/app/MongoDb/mongoose");
const {mongoose } = require("mongoose");

export  async function GET(req ,content){     
    await mongoose.connect(db);
    let data = await Product.find({ availableQty: { $gt: 0 } });
   
    if(data && data.length > 0){
         return NextResponse.json({result : data , status: 200, success : true});
    }else{
        return NextResponse.json({result : "Data not found" , status: 404, success : false});
    }
}

export async function POST(req ,content){     
    const payload = await req.json();
    await mongoose.connect(db);
    let products = new Product(payload.formData);
    let result  = await products.save();
    const {title , price , imgs , desc , thumbnail , category , rating , availableQty  } = payload.formData

    if(title != "" || price != "" || imgs != "" || desc != "" || thumbnail !== ""  || rating !== "" || availableQty !== "" || category !== ""  && result ){
        return NextResponse.json({result : result , status : 200 ,success : true })  
    }else{
        return NextResponse.json({result :"Something went wrong" , status : 404 ,success : false })
  }
}

