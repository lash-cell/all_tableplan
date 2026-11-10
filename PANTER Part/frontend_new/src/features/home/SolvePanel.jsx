import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/Icon";
const STEPS = [
    { name: "Plan", text: "วิเคราะห์ความเป็นไปได้" },
    { name: "Act", text: "ค้นหาตำแหน่งวาง" },
    { name: "Validate", text: "ตรวจซ้ำทุกกฎ" },
];
const STEP_MS = 900;
/** สถานะ: -1 = ยังไม่เริ่ม · 0..2 = กำลังทำขั้นนั้น · 3 = เสร็จ */
export function SolvePanel() {
    const [stage, setStage] = useState(-1);
    const timer = useRef(0);
    useEffect(() => () => window.clearTimeout(timer.current), []);
    const running = stage >= 0 && stage < STEPS.length;
    const done = stage === STEPS.length;
    const progress = stage < 0 ? 0 : (stage + (running ? 0.5 : 0)) / STEPS.length;
    const advance = (next) => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        timer.current = window.setTimeout(() => {
            setStage(next);
            if (next < STEPS.length)
                advance(next + 1);
        }, reduce ? 0 : STEP_MS);
    };
    const run = () => { setStage(0); advance(1); };
    return (<section className="hm-card" aria-labelledby="solve-title">
      <h2 id="solve-title">จัดตาราง</h2>
      <div className="hm-steps" aria-live="polite">
        {STEPS.map((s, i) => {
            const state = i < stage ? "done" : i === stage ? "active" : "pending";
            return (<div key={s.name} className="hm-step" data-state={state}>
              <span className="hm-dot">
                {state === "done" ? <Icon name="check" size={16} strokeWidth={3} className="hm-dot__check"/> : i + 1}
              </span>
              <span><b>{s.name}</b> {s.text}</span>
            </div>);
        })}
      </div>
      <div className="hm-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }}/></div>
      {/* ปุ่มหลักของหน้านี้คือ "นำเข้าไฟล์" (1 primary ต่อมุมมอง) ปุ่มนี้จึงเป็น secondary */}
      <div className="hm-solve__actions">
        <button type="button" className="hm-btn hm-btn-secondary" onClick={run} disabled={running} aria-busy={running}>
          <Icon name="play" size={18}/>{running ? "กำลังแสดงตัวอย่าง…" : "ดูตัวอย่าง progress"}
        </button>
      </div>
      {done && (<div className="hm-banner hm-banner--ok tt-enter" role="status">
          <Icon name="check" size={22} strokeWidth={2} className="hm-banner__icon"/>
          <div><strong>จบการจำลองหน้าจอ</strong>ไม่ได้เรียก engine และไม่ได้ยืนยันว่าตารางจัดได้จริง</div>
        </div>)}
    </section>);
}
