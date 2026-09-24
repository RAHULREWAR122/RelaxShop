import { Suspense } from "react";
import AuthScreen from "./AuthScreen";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loader"><span className="spinner" /></div>}>
      <AuthScreen />
    </Suspense>
  );
}
