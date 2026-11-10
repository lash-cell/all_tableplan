import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import DocsPage from "./pages/DocsPage";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";

export default function App() {
    return (<Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/student" element={<StudentPage />}/>
      <Route path="/docs" element={<AppShell><DocsPage /></AppShell>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>);
}
