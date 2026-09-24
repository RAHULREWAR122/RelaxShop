"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import { makeStore } from "./store";
import { CART_KEY, cartKey, hydrateCart, loadCart, mergeCarts } from "./cartSlice";
import { api } from "@/lib/client/api";
import { readSession, saveSession, clearSession } from "@/lib/client/session";

const ProductsContext = createContext({ products: [], loading: true, error: null, refresh: () => {} });
const SessionContext = createContext({ session: null, ready: false, signIn: () => {}, signOut: () => {} });

export const useProducts = () => useContext(ProductsContext);
export const useSession = () => useContext(SessionContext);

// `initial` is the list the server rendered the page with; without it the list is fetched here.
function ProductsProvider({ initial, children }) {
  const [state, setState] = useState(() =>
    initial ? { products: initial, loading: false, error: null } : { products: [], loading: true, error: null }
  );
  const hasInitial = useRef(Boolean(initial));

  const refresh = useCallback(async () => {
    const res = await api("/api/Products");
    setState({
      products: res.success && Array.isArray(res.result) ? res.result : [],
      loading: false,
      error: res.success ? null : res.result,
    });
  }, []);

  useEffect(() => {
    if (!hasInitial.current) refresh();
  }, [refresh]);

  return <ProductsContext.Provider value={{ ...state, refresh }}>{children}</ProductsContext.Provider>;
}

function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const s = readSession();
      if (!s) clearStale();
      setSession(s);
      setReady(true);
    };
    const clearStale = () => {
      try {
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("myUser");
        }
      } catch {}
    };
    sync();
    window.addEventListener("relax:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("relax:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Sign out automatically when the token expires.
  useEffect(() => {
    if (!session?.exp) return;
    const ms = session.exp * 1000 - Date.now();
    const timer = setTimeout(clearSession, Math.min(Math.max(ms, 0), 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [session]);

  const value = {
    session,
    ready,
    signIn: saveSession,
    signOut: clearSession,
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// Swaps in the signed-in user's saved bag. Signing out leaves it saved and shows an
// empty guest bag; signing back in restores it, plus anything added as a guest.
function CartOwnerSync() {
  const dispatch = useDispatch();
  const { session, ready } = useSession();
  const owner = session?.email || null;

  useEffect(() => {
    if (!ready) return;
    let items = loadCart(cartKey(owner));
    if (owner) {
      const guest = loadCart(CART_KEY);
      if (guest.length) {
        items = mergeCarts(items, guest);
        try {
          localStorage.removeItem(CART_KEY);
        } catch {}
      }
    }
    dispatch(hydrateCart({ items, owner }));
  }, [ready, owner, dispatch]);

  return null;
}

export function DataProvider({ initialProducts, children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <SessionProvider>
        <CartOwnerSync />
        <ProductsProvider initial={initialProducts}>
          {children}
          <ToastContainer position="bottom-right" autoClose={2200} hideProgressBar newestOnTop transition={Slide} theme="light" />
        </ProductsProvider>
      </SessionProvider>
    </Provider>
  );
}
