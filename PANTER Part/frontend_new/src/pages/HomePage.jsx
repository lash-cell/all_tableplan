import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { GROUP_LABEL, LEGEND, LUNCH_PERIOD, MAX_PERIOD, STATS } from "../features/home/home-data";
import { SolvePanel } from "../features/home/SolvePanel";
import { StatTile } from "../features/home/StatTile";
import { TimetableGrid } from "../features/home/TimetableGrid";
const VIEWS = ["กลุ่ม", "ครู", "ห้อง", "วิชา"];
export default function HomePage() {
    const [view, setView] = useState(0);
    const onTabKey = (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft")
            return;
        e.preventDefault();
        const next = (view + (e.key === "ArrowRight" ? 1 : VIEWS.length - 1)) % VIEWS.length;
        setView(next);
        document.getElementById(`view-tab-${next}`)?.focus();
    };
    return (<AppShell>
      <header className="hm-head tt-enter">
        <h1>สวัสดี ผู้จัดตาราง</h1>
        <p>หน้าจอนี้เป็นต้นแบบภาพและใช้ข้อมูลจำลอง ยังไม่มี API, server หรือ engine เชื่อมต่อ</p>
        <div className="hm-toolbar">
          <label className="hm-search">
            <Icon name="search" size={20}/>
            <input type="search" placeholder="ค้นหากลุ่ม ครู ห้อง หรือวิชา…" aria-label="ค้นหา" disabled/>
          </label>
          <button type="button" className="hm-btn hm-btn-primary" disabled title="ต้นแบบยังไม่ได้เชื่อม API">
            <Icon name="upload" size={18}/>นำเข้าไฟล์
          </button>
          <button type="button" className="hm-btn hm-btn-secondary" disabled title="ต้นแบบยังไม่ได้เชื่อม API">
            ส่งออก Excel
          </button>
          <button type="button" className="hm-btn hm-btn-ghost" disabled title="ยังไม่เลือกเครื่องมือ PDF">
            ส่งออก PDF
          </button>
        </div>
      </header>

      <section className="hm-grid tt-stagger" aria-label="สรุปข้อมูลจำลอง">
        {STATS.map((s, i) => (<div key={s.label} style={{ "--i": i }} className="hm-grid__item">
            <StatTile {...s}/>
          </div>))}
      </section>

      <section className="hm-card" aria-labelledby="tt-title">
        <div className="hm-row">
          <h2 id="tt-title">ตารางตัวอย่าง · {GROUP_LABEL}</h2>
          <div className="hm-seg" role="tablist" aria-label="มุมมอง" onKeyDown={onTabKey}>
            {VIEWS.map((v, i) => (<button key={v} id={`view-tab-${i}`} type="button" role="tab" aria-selected={i === view} tabIndex={i === view ? 0 : -1} onClick={() => setView(i)}>{v}</button>))}
          </div>
        </div>
        {view === 0 ? (<>
            <TimetableGrid label={`ตารางตัวอย่าง ${GROUP_LABEL}`}/>
            <div className="hm-legend" aria-label="คำอธิบายสี">
              {LEGEND.map((l) => <span key={l.label} className={`hm-chip hm-tint-${l.tint}`}>{l.label}</span>)}
            </div>
            <p className="hm-note">ข้อมูลสาธิตกำหนดพักไว้ที่คาบ {LUNCH_PERIOD} และสิ้นสุดคาบ {MAX_PERIOD}; ไม่ใช่ผลจากโจทย์หรือ engine</p>
          </>) : (<p className="hm-note" role="tabpanel">มุมมอง “{VIEWS[view]}” จะแสดงเมื่อเชื่อมข้อมูลจริง</p>)}
      </section>

      <SolvePanel />
    </AppShell>);
}
