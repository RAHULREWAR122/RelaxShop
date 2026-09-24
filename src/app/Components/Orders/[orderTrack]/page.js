import { Suspense } from "react";
import OrderDetail from "./OrderDetail";

export const metadata = { title: "Order details" };

export default function Page({ params }) {
  return (
    <Suspense fallback={<div className="page-loader"><span className="spinner" /></div>}>
      <OrderDetail id={params.orderTrack} />
    </Suspense>
  );
}
