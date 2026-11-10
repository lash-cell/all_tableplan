import { NavLink } from "react-router-dom";
import "../styles/home.css";
import { Icon } from "./Icon";
const NAV = [
    { to: "/", label: "ต้นแบบ", icon: "grid", end: true },
    { to: "/docs", label: "เอกสาร", icon: "book" },
];
/** โครงหน้า: SidebarNav 96px (เดสก์ท็อป) / แถบล่าง (<768) ตาม DESIGN_SYSTEM §3–4 */
export function AppShell({ children }) {
    return (<div className="hm-app">
      <nav className="hm-side" aria-label="เมนูหลัก">
        <div className="hm-logo" aria-hidden="true">TT</div>
        {NAV.map((n) => (
        // NavLink ใส่ aria-current="page" ให้เองเมื่อเป็นหน้าปัจจุบัน
        <NavLink key={n.to} to={n.to} end={n.end} className="hm-nav">
            <Icon name={n.icon}/>
            {n.label}
          </NavLink>))}
      </nav>
      <main className="hm-main">{children}</main>
    </div>);
}
