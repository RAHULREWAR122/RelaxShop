import { Suspense } from "react";
import ResetFlow from "./ResetFlow";

export const metadata = { title: "Reset password" };

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loader"><span className="spinner" /></div>}>
      <ResetFlow />
    </Suspense>
  );
}
