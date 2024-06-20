import axios from "axios";
 

export const fetchData = async () => {
  try {
    let req = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products`);
    if(req.data){
      
      return req.data.result;
    }
    return;
  }catch (error) {
    console.log("") 
    return;
  }
};

