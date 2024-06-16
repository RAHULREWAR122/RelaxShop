import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Orders } from "@/app/MongoDb/Orders";
import { db } from "@/app/MongoDb/mongoose";
import { Product } from "@/app/MongoDb/Products";


export  async function GET(req ,content){     
    await mongoose.connect(db);
    let data = await Orders.find();
    
    if(data){
         return NextResponse.json({result : data , status: 200, success : true});
     }else{
        return NextResponse.json({result : "Data not found" , status: 404, success : false});
    }
}

export async function POST(req,res){ 
    const payload = await req.json();
    await mongoose.connect(db);
    let orders = new Orders(payload);    
    let result = await orders.save();
    if(payload.paymentInfo === "SUCCESS"){
      return NextResponse.json({result : result , status : 200 , success: true})  
    }else{
        return NextResponse.json({result :"Something went wrong" , status : 404 ,success : false })
  }
}
