import { Suspense } from "react";
import { BilliardScheduler } from "./pages/BilliardScheduler";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BilliardScheduler />
    </Suspense>
  );
}