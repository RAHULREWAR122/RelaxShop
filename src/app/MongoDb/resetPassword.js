import mongoose from "mongoose";


const ForgotPasswordSchema = new mongoose.Schema({

       email : {type :String  ,required : true , unique : true},
       token :{type :String , required : true}
})


export const ResetPassword = mongoose.models.forgot || mongoose.model("forgot", ForgotPasswordSchema);


