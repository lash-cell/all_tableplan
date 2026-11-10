import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { LEGEND, STATS } from "../features/home/home-data";
import { SolvePanel } from "../features/home/SolvePanel";
import { StatTile } from "../features/home/StatTile";
import { TimetableGrid } from "../features/home/TimetableGrid";

const VIEWS = ["กลุ่ม", "ครู", "ห้อง", "วิชา"] as const;

export default function HomePage() {
  const [view, setView] = useState(0);

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (view + (e.key === "ArrowRight" ? 1 : VIEWS.length - 1)) % VIEWS.length;
    setView(next);
    document.getElementById(`view-tab-${next}`)?.focus();
  };

  return (
    <AppShell>
      <header className="hm-head tt-enter">
        <h1>สวัสดี ผู้จัดตาราง</h1>
        <p>มาจัดตารางเรียนให้ลงตัวกันเถอะ — ข้อมูลในหน้านี้เป็นตัวอย่าง ยังไม่ได้เชื่อมกับเอนจิน</p>
        <div className="hm-toolbar">
          <label className="hm-search">
            <Icon name="search" size={20} />
            <input type="search" placeholder="ค้นหากลุ่ม ครู ห้อง หรือวิชา…" aria-label="ค้นหา" />
          </label>
          <button type="button" className="hm-btn hm-btn-primary"><Icon name="upload" size={18} />นำเข้าไฟล์</button>
          <button type="button" className="hm-btn hm-btn-secondary">ส่งออก Excel</button>
          <button type="button" className="hm-btn hm-btn-ghost">ส่งออก PDF</button>
        </div>
      </header>

      <section className="hm-grid tt-stagger" aria-label="สรุป">
        {STATS.map((s, i) => (
          <div key={s.label} style={{ "--i": i } as CSSProperties} className="hm-grid__item">
            <StatTile {...s} />
          </div>
        ))}
      </section>

      <section className="hm-card" aria-labelledby="tt-title">
        <div className="hm-row">
          <h2 id="tt-title">ตารางเรียน · ทค.1/1</h2>
          <div className="hm-seg" role="tablist" aria-label="มุมมอง" onKeyDown={onTabKey}>
            {VIEWS.map((v, i) => (
              <button
                key={v} id={`view-tab-${i}`} type="button" role="tab"
                aria-selected={i === view} tabIndex={i === view ? 0 : -1}
                onClick={() => setView(i)}
              >{v}</button>
            ))}
          </div>
        </div>
        {view === 0 ? (
          <>
            <TimetableGrid label="ตารางเรียน ทค.1/1" />
            <div className="hm-legend" aria-label="คำอธิบายสี">
              {LEGEND.map((l) => <span key={l.label} className={`hm-chip hm-tint-${l.tint}`}>{l.label}</span>)}
            </div>
            <p className="hm-note">ปวช.1 เรียนไม่เกินคาบ 9 — คาบ 10–11 แสดงเป็นลายขีดเพื่อให้เห็นขอบเขตของระดับชั้น</p>
          </>
        ) : (
          <p className="hm-note" role="tabpanel">มุมมอง “{VIEWS[view]}” จะแสดงเมื่อเชื่อมข้อมูลจริง</p>
        )}
      </section>

      <SolvePanel />
    </AppShell>
  );
}
