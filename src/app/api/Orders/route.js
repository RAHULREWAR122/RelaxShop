import { Orders } from "@/app/MongoDb/Orders";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(req, content) {
  try {
    const {token} =await req.json();
     if (!token) {
      return NextResponse.json({ error: "Token is missing", status: 400, success: false });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = data; 
   
    const orders = await Orders.find({ email: email });

    return NextResponse.json({ result: orders, status: 200, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500, success: false });
  }
}
