import axios from "axios";

export const fetchData = async () => {
  try {
    let req = await axios.get(`${process.env.NEXT_PUBLIC_HOST_NAME}/api/Products` ,{ cache: 'force-cache' });
    if (req.data) {
      return req.data.result;
    }
    return [];
  } catch (error) {
    return [];
  }
};
