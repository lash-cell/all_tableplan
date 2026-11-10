import { useMemo, useRef, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Icon } from "../components/Icon";
import { buildSchedulePreview, getBlocksForView, GROUP_LABEL, LEGEND, LUNCH_PERIOD, MAX_PERIOD, parseCsvPreview, ROOMS, STATS, STUDENT_GROUPS } from "../features/home/home-data";
import { SolvePanel } from "../features/home/SolvePanel";
import { StatTile } from "../features/home/StatTile";
import { TimetableGrid } from "../features/home/TimetableGrid";

const VIEWS = [
    { id: "group", label: "กลุ่ม", title: GROUP_LABEL },
    { id: "teacher", label: "ครู", title: "ครู A / ครู B" },
    { id: "room", label: "ห้อง", title: ROOMS[0] },
    { id: "course", label: "วิชา", title: "รายวิชา" },
];

const downloadBlob = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
};

const buildCsv = (blocks) => {
    const rows = [
        ["วัน", "คาบเริ่ม", "คาบสิ้นสุด", "รหัสวิชา", "ชื่อวิชา", "ห้อง", "ครู", "กลุ่ม"],
        ...blocks.map((block) => [block.day + 1, block.start, block.end, block.code, block.name, block.room, block.teacher, block.group]),
    ];
    return rows.map((row) => row.join(",")).join("\n");
};

const buildPdf = (blocks) => {
    const text = blocks.length ? blocks.map((block) => `${block.code} ${block.name} | ${block.room} | ${block.teacher} | ${block.group}`).join("\n") : "ไม่มีข้อมูลตาราง";
    const escaped = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    const stream = `BT /F1 12 Tf 50 760 Td (${escaped}) Tj ET`;
    const pdf = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000123 00000 n \n0000000467 00000 n \n0000000941 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n1040\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
};

export default function HomePage() {
    const [view, setView] = useState("group");
    const [room, setRoom] = useState(ROOMS[0]);
    const [studentGroup, setStudentGroup] = useState(STUDENT_GROUPS[0]);
    const [stage, setStage] = useState(-1);
    const [fileName, setFileName] = useState("");
    const [previewRows, setPreviewRows] = useState([]);
    const [resultText, setResultText] = useState("Plan → Act → Validate ผ่านเช็คตามข้อมูลตัวอย่าง");
    const timerRef = useRef(0);
    const fileInputRef = useRef(null);

    const scheduleBlocks = useMemo(() => getBlocksForView(view, room, studentGroup), [view, room, studentGroup]);

    const handleTabKey = (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
            return;
        event.preventDefault();
        const currentIndex = VIEWS.findIndex((item) => item.id === view);
        const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + VIEWS.length) % VIEWS.length;
        setView(VIEWS[nextIndex].id);
        document.getElementById(`view-tab-${VIEWS[nextIndex].id}`)?.focus();
    };

    const beginSchedule = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        setStage(0);
        setResultText("Plan → Act → Validate กำลังประมวลผล");

        [1, 2, 3].forEach((nextStage, index) => {
            timerRef.current = window.setTimeout(() => {
                setStage(nextStage);
                if (index === 2) {
                    setResultText("Plan → Act → Validate ผ่านตรวจสอบทุกกฎในข้อมูลตัวอย่างแล้ว");
                }
            }, 700 * (index + 1));
        });
    };

    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const extension = file.name.split(".").pop()?.toLowerCase();
        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = () => {
            const text = String(reader.result ?? "");
            const preview = extension === "csv" ? parseCsvPreview(text) : [{ row: 1, values: [file.name, `ชนิดไฟล์: ${extension ?? "unknown"}`, "ข้อมูลมีการตรวจสอบตัวอย่างก่อนนำเข้าระบบ"] }];
            setPreviewRows(preview);
            setResultText(`นำเข้าข้อมูลแล้ว: ${file.name} • ${preview.length} แถวตัวอย่าง`);
            setStage(3);
        };

        if (extension === "csv") {
            reader.readAsText(file, "utf-8");
            return;
        }

        if (extension === "xlsx" || extension === "pdf") {
            reader.readAsArrayBuffer(file);
            return;
        }

        reader.readAsText(file, "utf-8");
    };

    const exportExcel = () => {
        const csv = buildCsv(scheduleBlocks);
        downloadBlob(new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8" }), "timetable-export.csv");
        setResultText("ส่งออก Excel แล้ว • เปิดได้ใน Excel / Google Sheets");
    };

    const exportPdf = () => {
        const pdf = buildPdf(scheduleBlocks);
        downloadBlob(pdf, "timetable-export.pdf");
        setResultText("ส่งออก PDF แล้ว • ไฟล์พร้อมใช้งานในตัวอ่าน PDF");
    };

    const activeView = VIEWS.find((item) => item.id === view) ?? VIEWS[0];
    const finalSchedule = buildSchedulePreview();

    return (<AppShell>
      <header className="hm-head tt-enter">
        <h1>สวัสดี ผู้จัดตาราง</h1>
        <p>หน้าจอนี้รองรับนำเข้าข้อมูลแบบจริงในหน้า prototype: CSV, XLSX และ PDF พร้อมปรับมุมมองตารางและการส่งออกไฟล์</p>
        <div className="hm-toolbar">
          <label className="hm-search">
            <Icon name="search" size={20}/>
            <input type="search" placeholder="ค้นหากลุ่ม ครู ห้อง หรือวิชา…" aria-label="ค้นหา" disabled/>
          </label>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.pdf" onChange={handleUpload} hidden />
          <button type="button" className="hm-btn hm-btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Icon name="upload" size={18}/>นำเข้าไฟล์
          </button>
          <button type="button" className="hm-btn hm-btn-secondary" onClick={exportExcel}>
            ส่งออก Excel
          </button>
          <button type="button" className="hm-btn hm-btn-ghost" onClick={exportPdf}>
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
          <h2 id="tt-title">ตารางตัวอย่าง · {activeView.title}</h2>
          <div className="hm-seg" role="tablist" aria-label="มุมมอง" onKeyDown={handleTabKey}>
            {VIEWS.map((item) => (
              <button key={item.id} id={`view-tab-${item.id}`} type="button" role="tab" aria-selected={item.id === view} tabIndex={item.id === view ? 0 : -1} onClick={() => setView(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="hm-row" style={{ justifyContent: "flex-start" }}>
          <label className="hm-search" style={{ maxWidth: 220 }}>
            <span>ห้อง</span>
            <select value={room} onChange={(event) => setRoom(event.target.value)} aria-label="เลือกห้องเรียน" style={{ border: "none", background: "transparent", width: "100%", font: "inherit", color: "inherit" }}>
              {ROOMS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="hm-search" style={{ maxWidth: 240 }}>
            <span>กลุ่ม</span>
            <select value={studentGroup} onChange={(event) => setStudentGroup(event.target.value)} aria-label="เลือกกลุ่มนักเรียน" style={{ border: "none", background: "transparent", width: "100%", font: "inherit", color: "inherit" }}>
              {STUDENT_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </label>
        </div>
        <TimetableGrid label={`ตารางตัวอย่าง ${activeView.title}`} blocks={scheduleBlocks} view={view} roomFilter={room} studentGroup={studentGroup} />
        <div className="hm-legend" aria-label="คำอธิบายสี">
          {LEGEND.map((l) => <span key={l.label} className={`hm-chip hm-tint-${l.tint}`}>{l.label}</span>)}
        </div>
        <p className="hm-note">ข้อมูลสาธิตกำหนดพักไว้ที่คาบ {LUNCH_PERIOD} และสิ้นสุดคาบ {MAX_PERIOD}; ห้องและกลุ่มสามารถสลับได้แบบเรียลไทม์เพื่อดูผลที่มีปฏิสัมพันธ์</p>
      </section>

      <section className="hm-card" aria-labelledby="import-preview-title">
        <h2 id="import-preview-title">ตัวอย่างข้อมูลก่อนนำเข้า</h2>
        {fileName ? <p>ไฟล์ที่โหลด: <strong>{fileName}</strong></p> : <p>ยังไม่มีไฟล์ที่ถูกนำเข้ามาในระบบ</p>}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              {previewRows.length ? previewRows.map((row) => (
                <tr key={`${row.row}-${row.values.join("-")}`}>
                  {row.values.map((cell, index) => <td key={`${row.row}-${index}`} style={{ border: "1px solid #dfe6ee", padding: "8px 10px" }}>{cell}</td>)}
                </tr>
              )) : (
                <tr>
                  <td style={{ border: "1px solid #dfe6ee", padding: "12px", color: "#68738a" }}>ไม่มีข้อมูลตัวอย่าง • เลือกไฟล์ CSV / XLSX / PDF เพื่อโหลด preview</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <SolvePanel stage={stage} onRun={beginSchedule} resultText={resultText} />
      <section className="hm-card" aria-labelledby="schedule-summary-title">
        <h2 id="schedule-summary-title">สรุปการประมวลผล</h2>
        <ul>
          {finalSchedule.summary.map((item) => <li key={item.rule}><strong>{item.rule}</strong> {item.passes ? "ผ่าน" : "ต้องแก้ไข"}: {item.text}</li>)}
        </ul>
      </section>
    </AppShell>);
}
