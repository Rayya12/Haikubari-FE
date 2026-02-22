import { Suspense } from "react";
import VerifOTP from "../page/VerifyOTP"; // adjust path as needed

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifOTP />
    </Suspense>
  );
}