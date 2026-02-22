import { Suspense } from "react";
import ListWatcher from "@/app/page/ListWatcher"

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListWatcher />
    </Suspense>
  );
}