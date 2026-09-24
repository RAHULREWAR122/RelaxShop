"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector, cartHydratedSelector, syncWithCatalog } from "@/app/Redux/cartSlice";
import { useProducts } from "@/app/Redux/provider";
import { priceLines } from "@/lib/pricing";

// The bag, kept in step with live prices and stock, plus its totals.
export default function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(cartSelector);
  const hydrated = useSelector(cartHydratedSelector);
  const { products, loading } = useProducts();

  useEffect(() => {
    if (hydrated && !loading && products.length) dispatch(syncWithCatalog(products));
  }, [hydrated, loading, products, dispatch]);

  const available = useMemo(() => items.filter((l) => !l.unavailable), [items]);
  const totals = useMemo(() => priceLines(available), [available]);

  return {
    items,
    available,
    totals,
    ready: hydrated && !loading,
    hasUnavailable: items.some((l) => l.unavailable),
  };
}
