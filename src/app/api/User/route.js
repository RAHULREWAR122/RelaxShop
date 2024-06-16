import { NextResponse } from "next/server";
// import User from "@/app/MongoDb/User";
import { User } from "@/app/MongoDb/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const { db } = require("@/app/MongoDb/mongoose");
const {mongoose } = require("mongoose");

export  async function GET(req ,content){     
    await mongoose.connect(db);
    let data = await User.find();
 
    if(data){
         return NextResponse.json({result : data , status: 200, success : true});
    }else{
        return NextResponse.json({result : "Data not found" , status: 404, success : false});
    }
}


export async function POST(req ,content){     
    const payload = await req.json();
    await mongoose.connect(db);
    const {name , email} = payload;

    let user = new User({name , email , password : CryptoJS.AES.encrypt(payload.password , process.env.ENCRYPTION_KEY).toString()});
    let result = await user.save();
     
    if(payload.name != "" || payload.email != "" || payload.password != ""){
        return NextResponse.json({result : result , status : 200 ,success : true })  
    }else{
        return NextResponse.json({result :"Error in SignUp" , status : 404 , success : false })
  }
}
