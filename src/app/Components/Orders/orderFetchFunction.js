import axios from "axios";



export async function fetchOrdersDataDB(){
    try {
        let req = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/status`);
        if(req.data){
           return req.data;
        }
     } catch (error) {
        return;
      }  

}
