import { Orders } from "@/app/MongoDb/Orders";
import { db } from "@/app/MongoDb/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, content) {
    const prId = content.params.order;
    const filter = { _id: prId };
    await mongoose.connect(db);
    const result = await Orders.findById(filter);
  
    if (result) {
      return NextResponse.json({ result, status: 200, success: true });
    }else{    
      return NextResponse.json({result:`User Data Not Found with this id : ${prId}` , status : 404 , success :false});
    }
  }