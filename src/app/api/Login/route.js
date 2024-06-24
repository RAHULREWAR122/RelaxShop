import { NextResponse } from "next/server";
import { User } from "@/app/MongoDb/User";
import CryptoJS from "crypto-js";
const jwt = require("jsonwebtoken");

import { db } from "@/app/MongoDb/mongoose";
import mongoose from "mongoose";

export async function GET(req, content) {
  await mongoose.connect(db);

  let data = await User.find();

  if (data) {
    return NextResponse.json({ result: data, status: 200, success: true });
  } else {
    return NextResponse.json({
      result: "Data not found",
      status: 404,
      success: false,
    });
  }
}

export async function POST(req, res) {
  try {
  const payload = await req.json();

  let user = new User(payload);
  let result = await User.findOne({ email: user.email });
  
  if (result) {
    const bytes = CryptoJS.AES.decrypt(
      result.password,
      process.env.ENCRYPTION_KEY
    );
    let decPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (payload.email === result.email && payload.password === decPassword) {
      let myUser = { email: result.email, name: result.name };
      const maxExpirationTime = 7 * 24 * 60 * 60;
      const expirationTime = maxExpirationTime;
      
      let token = jwt.sign(
        { email: result.email, name: result.name },
        process.env.JWT_SECRET,
        { expiresIn: expirationTime }
      );
      return NextResponse.json({ success: true, token, myUser });
    }
    return NextResponse.json({ result: "Invalid email or Password", success: false });
  } else {
    return NextResponse.json({
      result: "User Not found",
      status: 404,
      success: false,
    });
  }
  } catch (error) {
    return NextResponse.json({ result: "something went wrong!, please try after few min. later.", success: false });  
  }
}
