import { ARCH_DETAILS, ARCH_DIAGRAM, ARCH_INITIAL_ID } from "../diagrams";
import { DOCS_TEXTS } from "../docs-content";
import { DiagramView } from "./DiagramView";

const ARCHITECTURE_SECTIONS = [
    {
        id: "stack",
        title: "1. Tech Stack",
        items: [
            "เว็บต้นแบบที่เปิดดูอยู่นี้ใช้ React 19, Vite 8, React Router 7 และ JavaScript ตาม dependency ของโปรเจกต์",
            "สถาปัตยกรรมเป้าหมายใช้ Node.js (JavaScript) เป็นแอปและ server; ใช้ Python 3.12.3 กับ OR-Tools CP-SAT 9.15.6755 เฉพาะโปรแกรม solver",
            "ExcelJS เป็นเครื่องมืออ่านไฟล์ .xlsx; การเขียน Excel วางแผนไว้ ส่วน PDF ยังรอทดสอบ pdfmake กับฟอนต์ Sarabun",
            "AI ผ่าน Groq เป็นตัวเลือกตามแผนสำหรับเสนอความหมายของข้อมูลเท่านั้น; ปิดไว้โดยปริยายและไม่ได้เชื่อมใน prototype",
        ],
    },
    {
        id: "frontend",
        title: "2. Frontend",
        items: [
            "React สร้างหน้าจอและส่วนประกอบที่โต้ตอบได้; React Router แยกเส้นทางหน้า เช่น หน้าต้นแบบและ Documentation",
            "Vite ใช้พัฒนาและ build เว็บต้นแบบ",
            "Frontend ปัจจุบันแสดงข้อมูลตัวอย่างและสถานะจำลอง ยังไม่ได้เรียก API, server หรือ engine จัดตารางจริง",
        ],
    },
    {
        id: "backend",
        title: "3. Backend",
        items: [
            "ขณะนี้ในเว็บต้นแบบยังไม่มี backend ที่เชื่อมต่อใช้งานจริง; ตามแผนจะใช้ Node.js และ HTTP server ในตัว node:http รับคำขอเฉพาะ 127.0.0.1",
            "Node.js รับผิดชอบ routes, ตรวจข้อมูล, ingest, วิเคราะห์เงื่อนไข, เตรียม lessons และตรวจผลด้วย JavaScript checker",
            "Node เรียก Python solver เป็น child process โดยส่ง JSON ผ่าน stdin/stdout; ไม่ได้ใช้ web framework เพิ่ม",
        ],
    },
    {
        id: "database",
        title: "4. Database",
        items: [
            "แผนกำหนด SQLite ผ่าน node:sqlite ซึ่งเป็นโมดูลใน Node.js; เว็บต้นแบบปัจจุบันยังไม่ได้เชื่อมฐานข้อมูล",
            "เมื่อพัฒนาแล้ว ฐานข้อมูลในโฟลเดอร์ data/ ที่ไม่ commit จะเก็บข้อมูลโจทย์ปัจจุบันและประวัติ run พร้อมสำเนา input กับผลลัพธ์ของแต่ละ run",
            "problem.json และ result.json เป็นสัญญาข้อมูลและ test fixtures ไม่ใช่ไฟล์เก็บสถานะจริงของแอป",
        ],
    },
    {
        id: "algorithm",
        title: "5. Algorithm",
        items: [
            "ใช้ OR-Tools CP-SAT (constraint programming / SAT-based optimization) เพื่อค้นหาตารางที่ทำตาม hard constraints; ไม่ใช่ MRV/backtracking สองเฟสแบบแผนเดิม",
            "Node ตรวจเงื่อนไขจำเป็นและสร้าง lesson; Python สร้างตัวเลือกวัน/เวลา/ครู/ห้อง แล้วให้ CP-SAT เลือกพร้อมกันในโมเดลเดียว ภายใต้กฎรูปแบบวัน เวลา fixed การชนกัน ความพร้อมใช้ ประเภทห้อง และภาระครู",
            "ใช้ solver worker เดียวและ seed คงที่; ผลที่ถูกต้องต้องผ่าน JavaScript independent checker ก่อนจะแสดงเป็น feasible",
            "ถ้าหยุดเพราะ time limit โดยยังไม่มีคำตอบ ให้รายงาน searchLimit ไม่ใช่ infeasible; ตัวเชื่อม TimeTableMaker 1.0 ยังต้องแปลงชื่อ timeout จาก Python ให้ตรงสัญญานี้",
            "การปรับคะแนนหลังได้ตารางและ score history ยังไม่ได้ทำ",
        ],
    },
    {
        id: "workflow",
        title: "6. System Workflow",
        steps: [
            "ครูกรอกข้อมูล อัปโหลด .xlsx หรือวางข้อมูลจาก spreadsheet",
            "Ingest อ่านและจับคู่คอลัมน์ ตรวจค่าที่ไม่ชัดเจน แล้วให้ครูแก้และยืนยันข้อมูล",
            "Node.js ตรวจ input วิเคราะห์เงื่อนไขจำเป็น และเตรียม lessons; ถ้าพิสูจน์ว่าจัดไม่ได้ก็รายงานสาเหตุได้ทันที",
            "Node ส่ง JSON ให้ Python + CP-SAT ค้นหาการจัดเวลา ครู และห้องร่วมกัน",
            "JavaScript checker ตรวจ hard rules อีกครั้ง; ผลที่ไม่ผ่านเป็นข้อผิดพลาด ไม่แสดงเป็นตารางสำเร็จ",
            "Output เตรียมตารางและรายงานจากผลที่ตรวจแล้ว; การเก็บ run ถาวรและส่งออกไฟล์ยังเป็นงานตามแผน",
        ],
    },
    {
        id: "components",
        title: "7. Core Components",
        items: [
            "Frontend — หน้าจอ Data, Check/Generate, Results และ Settings ตามระบบเป้าหมาย; หน้าจอใน prototype ยังใช้ข้อมูลจำลอง",
            "Ingest — อ่านไฟล์/ข้อมูลที่ครูป้อน จับคู่ฟิลด์ ตรวจสอบ และสร้าง confirmed problem; AI เป็นตัวเลือกเสนอคำแปลความหมายเท่านั้นและต้องให้ครูอนุมัติ",
            "Engine — Node วิเคราะห์และเตรียม lessons, Python CP-SAT ค้นหาคำตอบ, JavaScript checker ตรวจผลอย่างอิสระ",
            "App/server — ตรวจคำขอและประสานแต่ละโมดูล; route ไม่เป็นที่เก็บกฎธุรกิจ",
            "Output — เตรียมมุมมองตามกลุ่ม/ครู/ห้อง/วิชาและรายงาน; Excel/PDF export และ run history ยังไม่ครบใน TimeTableMaker 1.0",
            "Storage — SQLite เป็นที่เก็บข้อมูลในเครื่องตามแผน; prototype ปัจจุบันยังไม่เชื่อมต่อ",
        ],
    },
];

export function ArchitectureDiagram() {
    return (
        <div className="doc-architecture">
            <p className="doc-muted doc-architecture__notice">
                สถานะให้ชัดเจน: เว็บ Documentation นี้เป็น React prototype ที่ใช้ข้อมูลตัวอย่าง ส่วน backend,
                ฐานข้อมูล และ solver ด้านล่างคือสถาปัตยกรรมเป้าหมายที่ระบุไว้ใน restart/ ยังไม่ได้เชื่อมครบในเว็บนี้
            </p>
            <div className="doc-architecture__grid">
                {ARCHITECTURE_SECTIONS.map((section) => (
                    <section
                        key={section.id}
                        className={`doc-architecture__section${["algorithm", "workflow", "components"].includes(section.id) ? " doc-architecture__wide" : ""}`}
                        aria-labelledby={`architecture-${section.id}`}
                    >
                        <h3 id={`architecture-${section.id}`}>{section.title}</h3>
                        {section.steps ? (
                            <ol>
                                {section.steps.map((step) => <li key={step}>{step}</li>)}
                            </ol>
                        ) : (
                            <ul>
                                {section.items.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
            <h3 className="doc-architecture__diagram-title">แผนภาพ System Architecture</h3>
            <DiagramView diagram={ARCH_DIAGRAM} details={ARCH_DETAILS} hint={DOCS_TEXTS.archHint} initialId={ARCH_INITIAL_ID}/>
        </div>
    );
}
