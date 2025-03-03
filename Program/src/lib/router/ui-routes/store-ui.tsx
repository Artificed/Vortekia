import StoreDashboard from "@/pages/store/store-dashboard";
import StoreDetailPage from "@/pages/store/store-detail";
import { Route, Routes } from "react-router";

export default function StoreUI() {
  return (
    <Routes>
      <Route path="/" element={<StoreDashboard />} />
      <Route path="/store/:id" element={<StoreDetailPage />} />
      {/* <Route */}
      {/*   path="/transaction-history" */}
      {/*   element={</>} */}
      {/* /> */}
    </Routes>
  );
}
