import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import DocsPage from "./pages/DocsPage";
import HomePage from "./pages/HomePage";
export default function App() {
    return (<Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/docs" element={<AppShell><DocsPage /></AppShell>}/>
      {/* /import /solve /result ยังไม่มีหน้า: ส่งกลับหน้าแรกไว้ก่อน */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
}
