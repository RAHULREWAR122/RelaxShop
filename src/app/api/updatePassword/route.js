import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db } from "@/app/MongoDb/mongoose";
// import CryptoJS from "crypto-js";
import { User } from "@/app/MongoDb/User";


import CryptoJS from "crypto-js";

export async function PUT(req, content) {
    try {
        const payload = await req.json();
        const { email, password, cPassword, nwPassword, token } = payload;
         
        let user = jwt.verify(token, process.env.JWT_SECRET);
       
        let filter = await User.findOne({ email: user.email });
        
        const bytes = CryptoJS.AES.decrypt(filter.password, process.env.ENCRYPTION_KEY);
        const decPassword = bytes.toString(CryptoJS.enc.Utf8);

       
        let incPass = CryptoJS.AES.encrypt(nwPassword, process.env.ENCRYPTION_KEY).toString();

      
        if (decPassword === password && nwPassword === cPassword) {
            let dbUser = await User.findByIdAndUpdate(filter._id, { password: incPass });
            return NextResponse.json({ result: dbUser, success: true, statue: 200 });
        } else {
            return NextResponse.json({ result: "Passwords do not match", success: false, statue: 400 });
        }
    } catch (error) {
        return NextResponse.json({ result: "Something went wrong", success: false, statue: 500 });
    }
}
