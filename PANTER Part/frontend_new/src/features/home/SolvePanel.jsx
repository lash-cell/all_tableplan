import { useEffect, useRef } from "react";
import { Icon } from "../../components/Icon";

const STEPS = [
    { name: "Plan", text: "วิเคราะห์ความเป็นไปได้" },
    { name: "Act", text: "ค้นหาตำแหน่งวาง" },
    { name: "Validate", text: "ตรวจซ้ำทุกกฎ" },
];

export function SolvePanel({ stage = -1, onRun, resultText = "" }) {
    const timer = useRef(0);
    useEffect(() => () => window.clearTimeout(timer.current), []);

    const running = stage >= 0 && stage < STEPS.length;
    const done = stage >= STEPS.length;
    const progress = stage < 0 ? 0 : (stage + (running ? 0.5 : 0)) / STEPS.length;

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
      <div className="hm-solve__actions">
        <button type="button" className="hm-btn hm-btn-secondary" onClick={onRun} disabled={running} aria-busy={running}>
          <Icon name="play" size={18}/>{running ? "กำลังประมวลผล…" : "เริ่มประมวลผล"}
        </button>
      </div>
      {done && (<div className="hm-banner hm-banner--ok tt-enter" role="status">
          <Icon name="check" size={22} strokeWidth={2} className="hm-banner__icon"/>
          <div><strong>ผลลัพธ์พร้อมใช้งาน</strong> {resultText || "Plan → Act → Validate ผ่านเช็คตามข้อมูลตัวอย่าง"}</div>
        </div>)}
    </section>);
}
