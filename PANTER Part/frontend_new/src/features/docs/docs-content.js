// ข้อมูลหน้านี้สรุปแผนใน restart/; ไม่ได้หมายความว่า UI ต้นแบบเชื่อมระบบเหล่านั้นแล้ว
export const DIAGRAM_ROWS = [
    ["ui"],
    ["server"],
    ["ingest", "engine", "output", "storage"],
];
export const LINK_LABELS = ["HTTP /api", "เรียกส่วนงานตาม route"];
export const NODES = {
    ui: {
        id: "ui",
        title: "หน้าจอผู้จัดตาราง",
        tech: "React · Vite · JavaScript",
        role: "หน้าข้อมูล หน้าจัดตาราง และหน้าผลลัพธ์; ไม่มีหน้าสำหรับนักเรียน",
        details: [
            "แสดงข้อมูลและสถานะที่ server ส่งกลับ ไม่คำนวณกฎจัดตารางในหน้าจอ",
            "การบันทึกถาวรและประวัติ run อยู่ที่ server/SQLite ไม่ใช่ localStorage",
            "สิ่งที่เห็นในต้นแบบยังเป็นข้อมูลจำลองและยังไม่เชื่อม API",
        ],
    },
    server: {
        id: "server",
        title: "App / server",
        tech: "Node.js · node:http · worker_threads · node:sqlite",
        role: "โปรแกรมเดียวบนเครื่อง รับคำขอที่ 127.0.0.1 และประสานงานส่วนต่าง ๆ",
        details: [
            "ตรวจคำขอและ route ไปยัง ingest, engine หรือ output โดยไม่ย้ายกฎธุรกิจมาไว้ใน route",
            "ใช้ worker thread สำหรับงานจัดตารางที่ใช้เวลานานและยกเลิก run ได้",
            "เก็บโจทย์ปัจจุบันและประวัติ run ใน SQLite; run เก็บสำเนา input ของตัวเอง",
        ],
    },
    ingest: {
        id: "ingest",
        title: "Ingest",
        tech: "ExcelJS · form · paste",
        role: "แปลงข้อมูลที่ครูให้เป็น confirmed problem ตาม shapes.md",
        details: [
            "ช่วงแรกอ่าน .xlsx, รับข้อมูลจาก form หรือ paste ตาราง",
            "ครูตรวจการจับคู่คอลัมน์และแก้รายการที่ต้อง review ก่อนยืนยัน",
            "AI เป็นตัวช่วยเสนอคำตีความที่ครูต้องอนุมัติ ไม่ได้จัดตาราง; CSV/PDF อยู่ในงานภายหลัง",
        ],
    },
    engine: {
        id: "engine",
        title: "Scheduling engine",
        tech: "JavaScript · CSP · backtracking",
        role: "วิเคราะห์ ค้นหาตาราง จัดห้อง/ครู และตรวจผลอย่างอิสระ",
        details: [
            "แบ่ง lesson ตามทฤษฎี/ปฏิบัติ วางคาบบังคับ แล้วค้นหาเวลาและทรัพยากร",
            "ตัวตรวจ hard rules แยกจากตัวค้นหา; ตารางที่ตรวจไม่ผ่านเป็น system defect",
            "ปรับปรุงคะแนนหลังได้ตารางที่ผ่านกฎเท่านั้น และใช้ seed ที่บันทึกไว้",
        ],
    },
    output: {
        id: "output",
        title: "Output",
        tech: "ExcelJS · PDF library รอผลทดสอบ",
        role: "สร้างมุมมอง รายงาน ประวัติ run และไฟล์จากผลลัพธ์เดียวกัน",
        details: [
            "มุมมองตามกลุ่ม ครู ห้อง หรือวิชา พร้อมรายงานกฎและภาระครู",
            "ส่งออกตารางได้เฉพาะ run ที่เลือกและผ่าน independent checker",
            "ยังไม่เลือกเครื่องมือ PDF จนกว่าจะทดสอบการแสดงอักษรไทย",
        ],
    },
    storage: {
        id: "storage",
        title: "SQLite storage",
        tech: "node:sqlite · data/ (ignored)",
        role: "เก็บ input ปัจจุบันและ run history บนเครื่องเดียว",
        details: [
            "หนึ่งฐานข้อมูล SQLite ใน data/; ไม่ใช้ JSON files เป็น live storage",
            "problem.json และ result.json ยังคงเป็น data contracts และ test fixtures",
            "แก้ input ปัจจุบันแล้วต้องไม่เปลี่ยนสำเนาของ run ก่อนหน้า",
        ],
    },
};
export const FLOW_STEPS = [
    {
        title: "ป้อนข้อมูล",
        page: "Data",
        output: "ข้อมูลจาก form, .xlsx หรือ paste",
        body: "ครูกรอกข้อมูล อัปโหลด .xlsx หรือ paste แถวจาก spreadsheet; PDF และ CSV ยังไม่อยู่ในระยะแรก",
    },
    {
        title: "จับคู่และตรวจข้อมูล",
        page: "Data",
        output: "ข้อมูลที่ผ่าน review",
        body: "ระบบเสนอการจับคู่คอลัมน์ ครูตรวจและแก้รายการที่ไม่ชัดเจน; AI เสนอได้แต่ครูต้องยืนยันเอง",
    },
    {
        title: "ยืนยันโจทย์",
        page: "Data",
        output: "confirmed problem ใน SQLite",
        body: "ยืนยันได้เมื่อ review ว่าง; การแก้ข้อมูลภายหลังทำให้ต้องยืนยันใหม่",
    },
    {
        title: "ตรวจความเป็นไปได้",
        page: "Generate",
        output: "Analysis",
        body: "ตรวจเงื่อนไขจำเป็นอย่างรวดเร็ว; ผลว่าเป็นไปได้หมายถึงยังไม่ถูกตัดสินว่าเป็นไปไม่ได้ ไม่ใช่การรับประกันว่าจะหาตารางพบ",
    },
    {
        title: "ค้นหาและตรวจตาราง",
        page: "Generate",
        output: "Run และ progress",
        body: "server เริ่ม worker เพื่อค้นหา ตรวจ hard rules อย่างอิสระ และปรับคะแนนหลังพบตารางที่ถูกต้อง; searchLimit ไม่ใช่ infeasible",
    },
    {
        title: "ดูผลและส่งออก",
        page: "Results",
        output: "มุมมอง รายงาน และไฟล์ของ run ที่เลือก",
        body: "ทุกมุมมองมาจากผลตรวจเดียวกัน; export ตารางได้เฉพาะ run ที่ feasible และผ่าน checker",
    },
];
export const ENGINE_STEPS = [
    {
        name: "Analyze",
        goal: "ตรวจเงื่อนไขจำเป็นก่อนค้นหา",
        check: ["ปริมาณคาบต่อกลุ่มและข้อจำกัดเวลา", "ผลผ่านหมายถึงยังไม่พบเหตุที่พิสูจน์ว่าเป็นไปไม่ได้"],
        fail: "infeasible",
    },
    {
        name: "Prepare",
        goal: "สร้าง lesson ภายใน engine จาก confirmed problem",
        check: ["ตรวจรูปแบบและค่าของ input", "ทฤษฎีแชร์กลุ่มในชั้นปี; ปฏิบัติแยกตามกลุ่ม"],
        fail: "invalidInput",
    },
    {
        name: "Fixed lessons",
        goal: "จอง lesson ที่มีวันและเวลาบังคับ",
        check: ["ตรวจการชนกัน", "เงื่อนไขที่วางไม่ได้รายงานเป็นเหตุ ไม่ปลอมตารางสำเร็จ"],
        fail: "infeasible",
    },
    {
        name: "Search times",
        goal: "ค้นหาเวลาโดยวางวันจากคาบแรกและ backtrack",
        check: ["พิจารณาคาบเรียน พัก และการเลิกเรียน", "ใช้ forward checking; หยุดที่ limit อย่างซื่อตรง"],
        fail: "searchLimit",
    },
    {
        name: "Assign resources",
        goal: "จัดห้องแล้วจึงจัดครูให้ candidate timetable",
        check: ["ทรัพยากรต้องว่างในช่วงเวลาที่ใช้", "ถ้าจัดไม่ได้ให้ย้อนกลับไปลอง candidate อื่น"],
        fail: "infeasible",
    },
    {
        name: "Independent check",
        goal: "คำนวณ hard rules ซ้ำด้วย checker ที่แยกจากตัวค้นหา",
        check: ["ตรวจทุก hard rule กับ candidate", "ไม่ผ่านคือข้อบกพร่องของระบบ ไม่ใช่หลักฐานว่า input จัดไม่ได้"],
        fail: "validationFailed",
    },
    {
        name: "Improve",
        goal: "ลด soft penalties หลังมีตารางที่ผ่าน checker",
        check: ["รับเฉพาะการเปลี่ยนที่ยังผ่าน hard rules", "ใช้ fixed seed เพื่อให้ทำซ้ำได้"],
        fail: "validationFailed",
    },
    {
        name: "Recheck",
        goal: "ตรวจผลสุดท้ายก่อนส่งให้ output",
        check: ["ตรวจ hard rules อีกครั้ง", "ห้ามแสดงหรือส่งออกตารางที่ไม่ผ่าน"],
        fail: "validationFailed",
    },
];
export const STATUSES = [
    { code: "feasible", icon: "✓", label: "จัดได้", meaning: "มีตารางที่ผ่าน independent checker" },
    { code: "infeasible", icon: "▲", label: "พิสูจน์แล้วว่าจัดไม่ได้", meaning: "analysis หรือการค้นหาที่ครบถ้วนพบข้อขัดแย้ง" },
    { code: "searchLimit", icon: "◷", label: "ถึงขีดจำกัดการค้นหา", meaning: "ยังไม่พบคำตอบก่อนถึง limit; ไม่ได้แปลว่าจัดไม่ได้" },
    { code: "invalidInput", icon: "!", label: "ข้อมูลไม่ถูกต้อง", meaning: "input ไม่ตรงรูปแบบหรือมีค่าที่ใช้ไม่ได้" },
    { code: "validationFailed", icon: "×", label: "ตรวจผลไม่ผ่าน", meaning: "เป็นข้อบกพร่องของ engine; ห้ามแสดงตารางเป็นผลสำเร็จ" },
];
export const PRINCIPLES = [
    "ทำงานบนเครื่องเดียวและรับการเชื่อมต่อที่ 127.0.0.1",
    "JavaScript เป็นภาษาเดียว; engine และ routes ทำงานตามสัญญาข้อมูลใน shapes.md",
    "analysis ที่ผ่านไม่รับประกันว่าจะพบตาราง; searchLimit ไม่เท่ากับ infeasible",
    "ตารางต้องผ่าน independent checker ก่อนปรับคะแนน แสดงผล หรือส่งออก",
    "ไม่มีหน้าสำหรับนักเรียน; optional AI ช่วยตีความข้อมูลเท่านั้นและต้องให้ครูอนุมัติ",
];
export const SECTIONS = [
    { id: "overview", label: "ภาพรวม" },
    { id: "architecture", label: "สถาปัตยกรรมระบบ" },
    { id: "workflow", label: "ลำดับการทำงาน" },
    { id: "engine", label: "เอนจินจัดตาราง" },
    { id: "statuses", label: "สถานะของผลลัพธ์" },
];
export const DOCS_TEXTS = {
    title: "แผนสถาปัตยกรรมระบบ",
    intro: "เอกสารนี้ยึดตาม restart/ และอธิบายระบบตามแผน; หน้าจอใน PANTER Part ยังเป็นต้นแบบ ไม่ได้เชื่อม server หรือ engine",
    tocLabel: "สารบัญ",
    archHint: "เลือกกล่องในแผนภาพเพื่อดูหน้าที่ของแต่ละส่วน",
    techLabel: "เทคโนโลยี",
    stepWord: "ขั้นที่",
    outputLabel: "ข้อมูลที่ส่งต่อ",
    failLabel: "ผลเมื่อพบปัญหา",
    statusCol: "สถานะ",
    meaningCol: "ความหมาย",
    principlesTitle: "หลักการสำคัญ",
};
