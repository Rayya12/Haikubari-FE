import { Suspense } from "react";
import VerifToken from "../page/VerifyToken";// adjust path as needed

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifToken/>
    </Suspense>
  );
}