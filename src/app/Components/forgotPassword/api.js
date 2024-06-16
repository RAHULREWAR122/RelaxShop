export const sendEmailData = async (data)=>{
      fetch(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/forgotPassword` ,{
         method : "POST",
         body : JSON.stringify(data),
         headers :{
             "Content-Type" :  "application/json",
             "Accept" : "application/json",
         }
     })    
}
