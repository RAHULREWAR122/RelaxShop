"use client";
import { Provider } from "react-redux";
import store from "./store";
import { fetchData } from "../Components/AllPages/fetchData";
import { useEffect, useState } from "react";
import Scroller from "../Scroller/scroller";

export function DataProvider({ children }) {
  const [getData, setGetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const data = await fetchData();
      if (data) {
        setGetData(data.result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <Provider store={store}>
      {isLoading ? <Scroller /> : <>{children}</>}
    </Provider>
  );
}
