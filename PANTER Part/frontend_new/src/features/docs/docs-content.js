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
        role: "ระบบเป้าหมายเป็นเครื่องมือสำหรับครู; UI prototype ปัจจุบันใช้ข้อมูลจำลองและมีหน้าสาธิตเพิ่มเติม",
        details: [
            "ระบบเป้าหมายมีหน้าข้อมูล หน้าตรวจ/จัดตาราง และหน้าผลลัพธ์สำหรับครู",
            "prototype มีหน้ากลุ่มนักเรียนเพื่อสาธิต แต่ไม่ใช่ขอบเขตระบบเป้าหมายตาม restart/",
            "การนำเข้า ส่งออก และตารางใน prototype ยังทำงานกับข้อมูลตัวอย่าง ไม่ได้เรียก server หรือ engine จริง",
        ],
    },
    server: {
        id: "server",
        title: "App / server",
        tech: "Node.js · node:http · child_process · node:sqlite (ตามแผน)",
        role: "โปรแกรมเดียวบนเครื่อง รับคำขอที่ 127.0.0.1 และประสานงาน ingest, engine, output และ storage",
        details: [
            "ตรวจคำขอและ route ไปยัง ingest, engine หรือ output โดยไม่ย้ายกฎธุรกิจมาไว้ใน route",
            "Node เรียก Python + OR-Tools CP-SAT เป็น child process โดยรับส่ง JSON ผ่าน stdin/stdout",
            "ใช้ node:sqlite เก็บ input และประวัติ run ตามแผน; prototype ปัจจุบันยังไม่เชื่อม server หรือ storage",
        ],
    },
    ingest: {
        id: "ingest",
        title: "Ingest",
        tech: "ExcelJS · form · paste",
        role: "แปลงข้อมูลที่ครูให้เป็น confirmed problem ตาม shapes.md",
        details: [
            "ระยะแรกอ่าน .xlsx และรับข้อมูลจาก form หรือ paste; CSV/PDF อยู่ในงานภายหลังตาม stack.md",
            "ครูตรวจการจับคู่คอลัมน์และแก้รายการที่ต้อง review ก่อนยืนยัน",
            "AI เป็นตัวเลือกปิดไว้โดยปริยาย ใช้เสนอค่าให้ครูตรวจเมื่อผ่าน spike SP5; ไม่ได้จัดตาราง",
        ],
    },
    engine: {
        id: "engine",
        title: "Scheduling engine",
        tech: "Node.js · Python 3.12.3 · OR-Tools CP-SAT 9.15.6755",
        role: "Node วิเคราะห์และเตรียม lessons; CP-SAT เลือกเวลา ครู และห้องร่วมกัน; JavaScript checker ตรวจผลแยกอิสระ",
        details: [
            "Python ใช้ CP-SAT สร้างโมเดล hard constraints และค้นหา assignment แบบร่วมกัน ไม่ใช่การค้นหาเวลาแล้วค่อยจัดทรัพยากรสองเฟส",
            "solver ใช้ worker เดียวและ seed คงที่; searchLimit หมายถึงหยุดก่อนพิสูจน์ ไม่ใช่ infeasible",
            "การปรับ soft score และ score history ยังเป็นงานที่วางแผนไว้ ไม่ได้อยู่ในการเชื่อมต่อปัจจุบัน",
        ],
    },
    output: {
        id: "output",
        title: "Output",
        tech: "ExcelJS (อ่าน .xlsx; export วางแผน) · PDF ยังรอทดสอบ",
        role: "สร้างมุมมอง รายงาน ประวัติ run และไฟล์จากผลลัพธ์เดียวกัน",
        details: [
            "มุมมองตามกลุ่ม ครู ห้อง หรือวิชา พร้อมรายงานกฎและภาระครู",
            "ส่งออกตารางได้เฉพาะ run ที่เลือกและผ่าน independent checker",
            "งาน PDF เริ่มประเมิน pdfmake กับ Sarabun; ต้องยืนยันการแสดงอักษรไทยและอังกฤษก่อนเลือกใช้",
            "saved-run, score-history และ export pipeline ยังไม่ครบใน TimeTableMaker 1.0",
        ],
    },
    storage: {
        id: "storage",
        title: "SQLite storage",
        tech: "node:sqlite · data/ (ignored)",
        role: "เก็บ input ปัจจุบันและ run history บนเครื่องเดียว",
        details: [
            "หนึ่งฐานข้อมูล SQLite ใน data/ สำหรับสถานะที่เปลี่ยนแปลงได้",
            "problem.json และ result.json เป็นสัญญาข้อมูลและรูปแบบ fixture ไม่ใช่ไฟล์เก็บสถานะสด",
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
        body: "ระบบเสนอการจับคู่คอลัมน์ ครูตรวจและแก้รายการที่ไม่ชัดเจน; AI เป็นตัวเลือกภายหลังและต้องให้ครูยืนยัน",
    },
    {
        title: "ยืนยันโจทย์",
        page: "Data",
        output: "confirmed problem (SQLite ตามแผน)",
        body: "ยืนยันได้เมื่อ review ว่าง; การบันทึกสถานะจริงลง SQLite ยังไม่เชื่อมในเว็บต้นแบบ",
    },
    {
        title: "ตรวจความเป็นไปได้",
        page: "Generate",
        output: "Analysis",
        body: "ตรวจเงื่อนไขจำเป็นอย่างรวดเร็ว; ผลว่าเป็นไปได้หมายถึงยังไม่ถูกตัดสินว่าเป็นไปไม่ได้ ไม่ใช่การรับประกันว่าจะหาตารางพบ",
    },
    {
        title: "ค้นหา จัดทรัพยากร และตรวจตาราง",
        page: "Generate",
        output: "ผล solver และ checker",
        body: "Python + CP-SAT เลือกเวลา ครู และห้องพร้อมกันในโมเดลเดียว; JavaScript checker ตรวจ hard rules แยกอิสระ การปรับคะแนนยังเป็นงานอนาคต",
    },
    {
        title: "ดูผลและส่งออก",
        page: "Results",
        output: "มุมมองและรายงาน; file export ตามแผน",
        body: "ทุกมุมมองมาจากผลตรวจเดียวกัน; ตามแผน export ได้เฉพาะ run ที่ feasible และผ่าน checker แต่ pipeline ยังไม่ครบ",
    },
];
export const ENGINE_STEPS = [
    {
        name: "Validate input",
        goal: "ตรวจ shape และค่าของ confirmed problem ใน Node.js",
        check: ["ข้อมูลผิดรูปแบบหยุดด้วย invalidInput", "engine ไม่อ่าน spreadsheet โดยตรง"],
        fail: "invalidInput",
    },
    {
        name: "Analyze",
        goal: "ตรวจเงื่อนไขจำเป็นด้วย JavaScript ก่อนเรียก solver",
        check: ["เช่น จำนวนคาบและข้อจำกัดเวลาคงที่", "ผ่านแล้วหมายถึงยังไม่พบข้อขัดแย้งที่พิสูจน์ได้"],
        fail: "infeasible",
    },
    {
        name: "Prepare lessons",
        goal: "แปลง course เป็น lesson block ใน Node.js",
        check: ["ทฤษฎีแชร์กลุ่มในชั้นปี; ปฏิบัติแยกตามกลุ่ม", "คงช่วงเวลาบังคับไว้ในข้อมูล"],
        fail: "invalidInput",
    },
    {
        name: "Build CP-SAT model",
        goal: "Python สร้าง candidate และ hard constraints ในโมเดลเดียว",
        check: ["candidate ระบุวัน เวลา ครู และห้องที่ใช้ได้", "โมเดลรวมข้อจำกัดกลุ่มและทรัพยากร"],
        fail: "invalidInput",
    },
    {
        name: "Solve jointly",
        goal: "CP-SAT เลือกเวลา ครู และห้องร่วมกัน",
        check: ["ใช้ worker เดียวและ seed คงที่", "time limit ที่ไม่มีคำตอบคือ searchLimit"],
        fail: "searchLimit",
    },
    {
        name: "Map solver outcome",
        goal: "แปลงผล CP-SAT เป็นสถานะตามสัญญาข้อมูล",
        check: ["INFEASIBLE ใช้เมื่อ solver พิสูจน์ได้", "UNKNOWN เมื่อหมดเวลาต้องไม่ถูกเรียก infeasible"],
        fail: "searchLimit",
    },
    {
        name: "Independent check",
        goal: "JavaScript checker คำนวณ hard rules ซ้ำโดยแยกจาก solver",
        check: ["ตรวจทุก hard rule กับ candidate", "ไม่ผ่านคือข้อบกพร่องของระบบ ไม่ใช่หลักฐานว่า input จัดไม่ได้"],
        fail: "validationFailed",
    },
];
export const STATUSES = [
    { code: "feasible", icon: "✓", label: "จัดได้", meaning: "มีตารางที่ผ่าน independent checker" },
    { code: "infeasible", icon: "▲", label: "พิสูจน์แล้วว่าจัดไม่ได้", meaning: "analysis พบเหตุที่จำเป็น หรือ CP-SAT พิสูจน์ว่าไม่มี assignment ที่ทำตามข้อจำกัด" },
    { code: "searchLimit", icon: "◷", label: "ถึงขีดจำกัดการค้นหา", meaning: "ยังไม่พบคำตอบก่อนถึง limit; ไม่ได้แปลว่าจัดไม่ได้" },
    { code: "invalidInput", icon: "!", label: "ข้อมูลไม่ถูกต้อง", meaning: "ข้อมูลไม่ตรงรูปแบบหรือมีค่าที่ใช้ไม่ได้; หยุดก่อนค้นหา" },
    { code: "validationFailed", icon: "×", label: "ตรวจผลไม่ผ่าน", meaning: "เป็นข้อบกพร่องของ engine; ห้ามแสดงตารางเป็นผลสำเร็จ" },
];
export const PRINCIPLES = [
    "ทำงานบนเครื่องเดียวและรับการเชื่อมต่อที่ 127.0.0.1",
    "Node.js/JavaScript ทำแอปและ checker; Python ใช้เฉพาะ OR-Tools CP-SAT solver ตามแผน",
    "analysis ที่ผ่านไม่รับประกันว่าจะพบตาราง; searchLimit ไม่เท่ากับ infeasible",
    "ตารางต้องผ่าน independent checker ก่อนปรับคะแนน แสดงผล หรือส่งออก",
    "SQLite เป็นที่เก็บสถานะตามแผนและยังไม่เชื่อมใน prototype; JSON เป็น data contract และ test fixture",
    "เว็บ prototype ใช้ข้อมูลจำลอง; ไม่มีผลจัดตารางจริงหรือ backend ที่เชื่อมต่อ",
];
export const SECTIONS = [
    { id: "overview", label: "ภาพรวม" },
    { id: "architecture", label: "สถาปัตยกรรมระบบ" },
    { id: "workflow", label: "ลำดับการทำงาน" },
    { id: "engine", label: "เอนจินจัดตาราง" },
    { id: "search-flow", label: "การทำงานของ CP-SAT" },
    { id: "result-flow", label: "การตัดสินสถานะ" },
    { id: "data-flow", label: "การไหลของข้อมูล" },
    { id: "statuses", label: "สถานะของผลลัพธ์" },
];
export const DOCS_TEXTS = {
    title: "แผนสถาปัตยกรรมระบบ",
    intro: "เอกสารนี้ยึดตาม restart/ และอธิบายระบบตามแผน โดยเน้นให้ตรงกับสถานะปัจจุบันของ prototype: UI ทำงานได้แบบ demo แต่ยังไม่ได้เชื่อม server หรือ scheduling engine จริง",
    tocLabel: "สารบัญ",
    archHint: "เลือกกล่องในแผนภาพเพื่อดูหน้าที่ของแต่ละส่วน",
    searchHint: "แผนภาพนี้สรุปการสร้างโมเดล CP-SAT และการแปลผล solver; คลิกกล่องเพื่อดูรายละเอียด",
    resultHint: "ต้องมี candidate ที่ผ่าน independent checker จึงเป็น feasible; searchLimit ไม่ใช่ infeasible",
    dataHint: "อ่านลำดับหลักจากบนลงล่าง; แยกทางบันทึก input และผล run ลง SQLite ตามแผน ส่วน prototype ยังใช้ข้อมูลจำลอง",
    techLabel: "เทคโนโลยี",
    stepWord: "ขั้นที่",
    outputLabel: "ข้อมูลที่ส่งต่อ",
    failLabel: "ผลเมื่อพบปัญหา",
    statusCol: "สถานะ",
    meaningCol: "ความหมาย",
    principlesTitle: "หลักการสำคัญ",
};
