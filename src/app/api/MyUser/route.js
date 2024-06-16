import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db } from "@/app/MongoDb/mongoose";
import CryptoJS from "crypto-js";
import { User } from "@/app/MongoDb/User";

export async function GET(req,content){
    await mongoose.connect(db);
    let data = await User.find();

    if(data){
         return NextResponse.json({result : data , status: 200, success : true});
    }else{
        return NextResponse.json({result : "Data not found" , status: 404, success : false});
    } 
}

export async function POST(req,content){
       
    const payload = await req.json();
     
    const {userData , token} = payload;
    let user = jwt.verify(token , process.env.JWT_SECRET);
    
   
    let dbUser = await User.findOne({email : user.email})
    const { email ,pinCode , phone , name } = dbUser;
    

    if(!dbUser){
        return NextResponse.json({result : "Error User Not found" , success : false , statue : 404})
    }

    if(user && dbUser){
         return NextResponse.json({result :{name , email , phone, pinCode } , success : true , statue : 200})
    }else{
        
        return NextResponse.json({result : "Error in Update User" , success : false , statue : 404})
    }

}

export async function PUT(req, content){
    const payload = await req.json();
    const {pinCode, email , phone , name , token} = payload;
    let user = jwt.verify(token , process.env.JWT_SECRET);
    
    let filter = await User.findOne({email : email});
    let userId = filter._id;
    
    const dbUser = await User.findByIdAndUpdate(filter._id , {name : name , pinCode  , phone })
    
   if(!token){
        return NextResponse.json({result : "Can't Update You!" , success : false , statue : 404})
    }
    if(dbUser){
         return NextResponse.json({result : {name , email , phone, pinCode }, success : true , statue : 200})
    }else{
        return NextResponse.json({result : "Error in Update User" , success : false , statue : 404})
    }
}
