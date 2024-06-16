import axios from "axios";

export async function fetchOrdersDataDB(){
    try {
        let req = await axios.get("http://localhost:4100/api/status") 
        return req.data;

     } catch (error) {
        console.log("error in fetch order data") 
     }  

}
