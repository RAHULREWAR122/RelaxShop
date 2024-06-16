import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

       name : {type :String  ,required : true},
       email : {type :String  ,required : true , unique : true},
       password : {type :String  ,required : true},
       pinCode :{type :String , default :""},
       phone :{type :String , default :"" },
 
})


export const User = mongoose.models.users || mongoose.model("users", UserSchema);

