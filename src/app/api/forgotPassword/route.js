import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { User } from "@/app/MongoDb/User";

export async function POST(req) {
  let data = await req.json();
  const { email, sendMail } = data.data;
  const existUser = await User.findOne({ email: data.data.email});
  
  if(existUser && sendMail) {
    const existUserName = existUser.name;
    const token = generateToken(email);
    return NextResponse.json({ result: {token , existUserName }, success: true, status: 200 });
  
  }else{

    return NextResponse.json({
      result: "User not exits",
      success: false,
      status: 404,
    });
  }
}

function generateToken(email) {
  const payload = {
    email: email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export async function PUT(req, content) {
  try {
    const payload = await req.json();
    const { getToken , password, cPassword} = payload.data;
     
    let user = jwt.verify(getToken, process.env.JWT_SECRET);
  
    let filter = await User.findOne({ email: user.email });
   
    const bytes = CryptoJS.AES.decrypt(
      filter.password,
      process.env.ENCRYPTION_KEY
    );
    
    let incPass = CryptoJS.AES.encrypt(
      password,
      process.env.ENCRYPTION_KEY
    ).toString();
    
    

    if (password === cPassword) {
      await User.findByIdAndUpdate(filter._id, { password: incPass });
      return NextResponse.json({
        result: "Success",
        success: true,
        statue: 200,
     });
    }else{
      return NextResponse.json({
        result: "Passwords do not match",
        success: false,
        statue: 400,
      });
    }
  } catch (error) {
    return NextResponse.json({
      result: "Something went wrong",
      success: false,
      statue: 500,
    });
  }
}
