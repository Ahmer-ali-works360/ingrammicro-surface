//src/app/create-demo-kit/page.tsx 



import CreateDemoKitClient from "./CreateDemoKitClient";
import { Suspense } from "react";

export default function CreateDemoKitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateDemoKitClient />
    </Suspense>
  );
}