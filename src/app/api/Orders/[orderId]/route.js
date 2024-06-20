import { db } from "@/app/MongoDb/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Orders } from "@/app/MongoDb/Orders";

export async function GET(req, content) {
  const prId = content.params.orderId;
  const filter = { _id: prId };
  await mongoose.connect(db);
  const result = await Orders.findById(filter);

  if (result) {
    return NextResponse.json({ result, status: 200, success: true });
  }else{    
    return NextResponse.json({result:`Order Not Found : ${prId}` , status : 404 , success :false});
  }
}


export async function PUT(req, content) {
  const prId = content.params.orderId;
  const filter = { _id: prId };

  const payload = await req.json();
  await mongoose.connect(db);

  const result = await Orders.findOneAndUpdate(filter, payload);
  if(payload !== ""){
      return NextResponse.json({ result, status: 200, success: true });
  } else{
    return NextResponse.json({ result:"Something went wrong..." , status: 404, success: false });    
  }

}


export async function DELETE(req,connect){
  const prId = connect.params.orderId;
  const data = {_id : prId};
  await mongoose.connect(db);
  const result = await Orders.deleteOne(data);
  
  

  if(result){
     return NextResponse.json({result ,status:200 ,success :true})
  }else{
    
    return NextResponse.json({result:"Error in delete" ,status:404 ,success :false})
  }
}