// เนื้อหาหน้า Documentation (ข้อความทั้งหมดอยู่ที่นี่ ไม่ฝังในคอมโพเนนต์)
// ที่มา: เอกสารโครงการ 06 (สถาปัตยกรรม), 07 (workflow), 11 (เอนจิน), 13 (สถานะ)

export interface DiagramNode {
  id: string;
  title: string;
  role: string;
  tech: string;
  details: string[];
}

export const DIAGRAM_ROWS: string[][] = [
  ["ui"],
  ["api"],
  ["tools"],
  ["ingest", "storage", "engine"],
];

export const LINK_LABELS: string[] = [
  "fetch (Vite proxy /api → 127.0.0.1:8787)",
  "คำขอที่ผ่านการตรวจแล้ว",
  "เรียกงานหลังบ้านตามชนิดคำขอ",
];

export const NODES: Record<string, DiagramNode> = {
  ui: {
    id: "ui", title: "Browser UI", tech: "React 18 · TypeScript · Vite · React Router",
    role: "หน้าจอที่ผู้ใช้เห็น: Import, Solve, Result และหน้านักเรียน",
    details: [
      "เก็บโจทย์และผลลัพธ์ใน localStorage ให้อยู่หลังรีโหลด",
      "สร้างมุมมองตาราง กลุ่ม/ครู/ห้อง/วิชา จาก entries เอง ไม่เรียก API เพิ่ม",
      "สร้างไฟล์ส่งออก Excel/PDF ฝั่งเบราว์เซอร์",
    ],
  },
  api: {
    id: "api", title: "Algorithm API", tech: "Node.js 24+ · http ในตัว · 127.0.0.1:8787",
    role: "ประตูเดียวของฝั่งหลังบ้าน รับ JSON แล้วส่งต่อ",
    details: [
      "ผูกกับ localhost เท่านั้น ไม่เปิดเครือข่ายภายนอก",
      "เป็น adapter บาง: ตรวจคำขอและ route ไม่มีตรรกะจัดตาราง",
    ],
  },
  tools: {
    id: "tools", title: "Tools layer", tech: "JavaScript ES modules",
    role: "ตรวจคำเรียกและเชื่อม route เข้ากับงานหลังบ้านแต่ละส่วน",
    details: [
      "ตรวจชนิด/ขนาดไฟล์ก่อนส่งต่อ",
      "แยกข้อผิดพลาดของข้อมูลผู้ใช้ ออกจากข้อผิดพลาดของระบบ",
    ],
  },
  ingest: {
    id: "ingest", title: "Ingest", tech: "ExcelJS · pdf.js · ตัวอ่าน CSV + TextDecoder",
    role: "อ่านไฟล์ เดาโครงสร้าง แล้วแปลงเป็น Problem",
    details: [
      "รองรับ .xlsx, .csv (UTF-8 / Windows-874) และ PDF ที่เลือกข้อความได้",
      "ไม่ทำ OCR: PDF สแกนจะแจ้งผู้ใช้",
      "ข้อความที่แปลงไม่ได้เก็บเป็น rawText พร้อมคำเตือน ไม่เดา",
    ],
  },
  storage: {
    id: "storage", title: "Storage", tech: "ไฟล์ในเครื่อง + JSON (ไม่มีฐานข้อมูล)",
    role: "เก็บไฟล์ต้นฉบับ byte ต่อ byte และผลที่ดึงได้",
    details: [
      "แต่ละการนำเข้ามีโฟลเดอร์ของตัวเอง ชื่อสร้างโดยระบบ",
      "metadata.json เขียนเป็นไฟล์สุดท้าย เป็นตัวบอกว่านำเข้าสมบูรณ์",
    ],
  },
  engine: {
    id: "engine", title: "Scheduling engine", tech: "JavaScript ล้วน · deterministic",
    role: "จัดตารางด้วย CSP + backtracking + MRV + forward checking",
    details: [
      "ทำงาน 4 ขั้น: Normalize → Analyze → Place → Validate",
      "ไม่ใช้ LLM และไม่แตะดิสก์ ข้อมูลเข้า → ข้อมูลออก",
      "validator เขียนแยกจากตัววาง เพื่อจับบั๊กของตัววาง",
    ],
  },
};

export interface FlowStep { title: string; page: string; body: string; output: string }

export const FLOW_STEPS: FlowStep[] = [
  { title: "เลือกไฟล์", page: "Import", output: "ไฟล์ .xlsx / .csv / .pdf",
    body: "ผู้ใช้เลือกไฟล์รายวิชาและครู ระบบตรวจชนิดจากนามสกุลและ file signature ก่อนรับไฟล์" },
  { title: "อ่านและตรวจไฟล์", page: "Import", output: "ตัวอย่างร่าง + คำเตือน",
    body: "Ingest ดึงแถว เดาประเภทชีต หัวตาราง คอลัมน์ ชั้นปี กลุ่ม แล้วแสดงตัวอย่างร่างให้ตรวจ" },
  { title: "จัดตาราง", page: "Solve", output: "SolveResult",
    body: "ส่ง Problem เข้าเอนจิน แสดงขั้น Plan → Act → Validate และสถานะระหว่างทาง" },
  { title: "ดูผลและส่งออก", page: "Result", output: "ตาราง 4 มุมมอง + Excel/PDF",
    body: "ดูตารางตามกลุ่ม ครู ห้อง วิชา ดูผลตรวจรายกฎ (R#) แล้วส่งออก นักเรียนดูตารางตนเองที่หน้านักเรียน" },
];

export interface EngineStep { name: string; goal: string; check: string[]; fail: string }

export const ENGINE_STEPS: EngineStep[] = [
  { name: "Normalize", goal: "แปลงระเบียนเป็นโมเดลที่เอนจินใช้",
    check: ["แยก section: ทฤษฎีรวม 1 section, ปฏิบัติแยกต่อกลุ่ม (R4)", "คาบล็อก ห้องที่ใช้ได้ เวลาครูไม่ว่าง"],
    fail: "invalid_input" },
  { name: "Analyze (Plan)", goal: "พิสูจน์ก่อนค้นหาว่าจัดได้หรือไม่",
    check: ["ชั่วโมงลงสัปดาห์ได้ คาบล็อกไม่ชน", "ภาระครูอยู่ในช่วง ทุกกลุ่มเริ่มคาบ 1 ได้"],
    fail: "infeasible" },
  { name: "Place (Act)", goal: "ค้นหาตำแหน่งวางด้วย backtracking + MRV",
    check: ["เลือก section ที่ทางเลือกน้อยที่สุดก่อน (MRV)", "forward check ก่อนยืนยัน ไม่ผ่านให้ undo แล้วลองใหม่"],
    fail: "limit_reached" },
  { name: "Validate", goal: "ตรวจตารางซ้ำด้วยตัวตรวจอิสระ",
    check: ["ตรวจครบกฎ R1–R19", "ไม่ผ่าน = บั๊กของตัววาง ห้ามแสดงว่าสำเร็จ"],
    fail: "ข้อผิดพลาดภายใน" },
];

export interface StatusInfo { code: string; icon: string; label: string; meaning: string }

export const STATUSES: StatusInfo[] = [
  { code: "ok", icon: "✓", label: "สำเร็จ", meaning: "พบตารางและผ่านการตรวจทุกกฎ" },
  { code: "invalid_input", icon: "!", label: "ข้อมูลไม่ถูกต้อง", meaning: "ระเบียนบางรายการผิด แก้ไฟล์แล้วนำเข้าใหม่" },
  { code: "infeasible", icon: "▲", label: "จัดไม่ได้", meaning: "เงื่อนไขขัดกันเอง ระบบบอกสาเหตุและข้อเสนอแก้" },
  { code: "limit_reached", icon: "◷", label: "หมดเวลา", meaning: "ยังไม่พบคำตอบในเพดานที่ตั้ง ไม่ได้แปลว่าจัดไม่ได้" },
];

export const PRINCIPLES: string[] = [
  "ทำงานบนเครื่องเดียว ข้อมูลไม่ถูกส่งออกนอกเครื่อง",
  "ความถูกต้องมาจากอัลกอริทึมและ validator ไม่ใช่ AI",
  "ข้อมูลเดิมให้ผลเดิม เมื่อใช้เพดานจำนวนโหนด",
  "ระบบคืนตารางแรกที่ผ่านกฎ ไม่ใช่ตารางที่ดีที่สุด",
];

export const SECTIONS: { id: string; label: string }[] = [
  { id: "overview", label: "ภาพรวม" },
  { id: "architecture", label: "สถาปัตยกรรมระบบ" },
  { id: "workflow", label: "ลำดับการทำงาน" },
  { id: "engine", label: "เอนจินจัดตาราง" },
  { id: "statuses", label: "สถานะของผลลัพธ์" },
];

export const DOCS_TEXTS = {
  title: "เอกสารอธิบายระบบ",
  intro: "ระบบจัดตารางเรียนอัตโนมัติ นำเข้าข้อมูลรายวิชาและครู จัดตารางตามกฎ แล้วตรวจผลด้วยตัวตรวจอิสระ",
  tocLabel: "สารบัญ",
  archHint: "เลือกกล่องในแผนภาพเพื่อดูหน้าที่ของแต่ละส่วน",
  techLabel: "เทคโนโลยี",
  stepWord: "ขั้นที่",
  outputLabel: "ผลลัพธ์",
  failLabel: "ถ้าไม่ผ่าน",
  statusCol: "สถานะ",
  meaningCol: "ความหมาย",
  principlesTitle: "หลักการสำคัญ",
};
