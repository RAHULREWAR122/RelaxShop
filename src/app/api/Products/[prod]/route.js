import { Product } from "@/app/MongoDb/Products";
import { db } from "@/app/MongoDb/mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, content) {
  const prId = content.params.prod;
  const filter = { _id: prId };
  await mongoose.connect(db);
  const result = await Product.findById(filter);

  if (result) {
    return NextResponse.json({ result, status: 200, success: true });
  }else{    
    return NextResponse.json({result:`User Data Not Found with this id : ${prId}` , status : 404 , success :false});
  }
}


export async function PUT(req, content) {
  const prId = content.params.prod;
  const filter = { _id: prId };

  const payload = await req.json();
  await mongoose.connect(db);

  const result = await Product.findOneAndUpdate(filter, payload);
  if(payload !== ""){
      return NextResponse.json({ result, status: 200, success: true });
  } else{
    return NextResponse.json({ result:"Something went wrong..." , status: 404, success: false });    
  }

}


export async function DELETE(req,content){
    const prId = content.params.prod;
    const data = {_id : prId};
    await mongoose.connect(db);
    const result = await Product.deleteOne(data);
    
   
    if(result){
       return NextResponse.json({result ,status:200 ,success :true})
    }else{
      
      return NextResponse.json({result:"Error in delete" ,status:404 ,success :false})
    }
}
