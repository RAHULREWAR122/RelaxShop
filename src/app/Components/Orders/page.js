"use client";
import OrdersList from "@/components/OrdersList/OrdersList";
import useRequireAuth from "@/components/useRequireAuth";

export default function OrdersPage() {
  const session = useRequireAuth();

  if (!session) {
    return (
      <div className="page-loader">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="container page" style={{ maxWidth: 920 }}>
      <span className="eyebrow">{session.role === "admin" ? "All customers" : "Your account"}</span>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        Your <em>orders</em>
      </h1>
      <OrdersList />
    </div>
  );
}
