import { DIAGRAM_ROWS, DOCS_TEXTS, ENGINE_STEPS, LINK_LABELS, NODES, STATUSES } from "./docs-content";
const [[ui], [server], [ingest, engine, output, storage]] = DIAGRAM_ROWS;
export const ARCH_INITIAL_ID = ui;
export const ARCH_DETAILS = Object.fromEntries(Object.entries(NODES).map(([id, node]) => [
    id,
    { title: node.title, meta: node.tech, body: node.role, items: [...node.details] },
]));
const leafX = [32, 212, 392, 572];
export const FLOW_STEPS = [
    { from: ui, fromSide: "b", to: server, toSide: "t", label: LINK_LABELS[0] },
    { from: server, fromSide: "b", to: ingest, toSide: "t", label: LINK_LABELS[1] },
    { from: server, fromSide: "b", to: engine, toSide: "t" },
    { from: server, fromSide: "b", to: output, toSide: "t" },
    { from: server, fromSide: "b", to: storage, toSide: "t" },
];
export const ARCH_DIAGRAM = {
    id: "architecture",
    label: "แผนภาพสถาปัตยกรรมระบบ",
    flowStartId: ui,
    width: 760,
    height: 580,
    groups: [
        { id: "machine", label: "เครื่องของผู้ใช้ · ทำงานในเครื่องเดียว", x: 8, y: 8, w: 744, h: 564, tint: "slate" },
        { id: "backend", label: "App / server และส่วนงานหลังบ้าน", x: 24, y: 140, w: 712, h: 412, tint: "sky" },
    ],
    nodes: [
        { id: ui, lines: ["Teacher UI", "React · Vite · JavaScript"], x: 180, y: 52, w: 400, h: 64, shape: "box", tint: "mint", icon: "monitor" },
        { id: server, lines: ["App / server", "Node.js · node:http · Python child process"], x: 180, y: 196, w: 400, h: 64, shape: "box", tint: "lavender", icon: "server" },
        { id: ingest, lines: ["Ingest", ".xlsx · form · paste"], x: leafX[0], y: 468, w: 164, h: 64, shape: "box", tint: "peach", icon: "upload" },
        { id: engine, lines: ["Engine", "CP-SAT · independent check"], x: leafX[1], y: 468, w: 164, h: 64, shape: "box", tint: "rose", icon: "cpu" },
        { id: output, lines: ["Output", "views · report · export"], x: leafX[2], y: 468, w: 164, h: 64, shape: "box", tint: "butter", icon: "table" },
        { id: storage, lines: ["SQLite (planned)", "local input · run history"], x: leafX[3], y: 468, w: 164, h: 64, shape: "box", tint: "mint", icon: "database" },
    ],
    edges: FLOW_STEPS,
};
const STEP_VIEW = [
    { id: "analyze", name: "Validate input", sub: "ตรวจข้อมูลใน Node.js", icon: "layers", tint: "sky" },
    { id: "prepare", name: "Analyze", sub: "ตรวจเงื่อนไขจำเป็น", icon: "table", tint: "butter" },
    { id: "fixed", name: "Prepare lessons", sub: "สร้าง lesson ภายใน", icon: "alert", tint: "peach" },
    { id: "search", name: "Build CP-SAT model", sub: "candidate + hard rules", icon: "cpu", tint: "lavender" },
    { id: "assign", name: "Solve jointly", sub: "เวลา · ครู · ห้อง", icon: "plug", tint: "mint" },
    { id: "improve", name: "Map outcome", sub: "feasible / searchLimit / ...", icon: "layers", tint: "butter" },
    { id: "check", name: "Independent check", sub: "JavaScript hard-rule checker", icon: "check", tint: "success" },
];
const column = (index) => 16 + index * 188;
const stepY = 140;
const failY = 290;
const statusInfo = (code, fallback) => {
    const status = STATUSES.find((item) => item.code === code);
    return { title: code, meta: status?.label, body: status?.meaning ?? fallback };
};
export const ENGINE_INITIAL_ID = "analyze";
export const ENGINE_DETAILS = {
    start: {
        title: "Confirmed problem",
        body: "Engine รับ problem object ที่ยืนยันแล้วตามสัญญาใน shapes.md ไม่อ่าน spreadsheet โดยตรง",
    },
    ok: statusInfo("feasible", "ตารางผ่านการตรวจทุก hard rule"),
    ...Object.fromEntries(ENGINE_STEPS.flatMap((step, index) => [
        [STEP_VIEW[index].id, {
                title: `${index + 1}. ${step.name}`,
                body: step.goal,
                items: [...step.check],
                meta: `${DOCS_TEXTS.failLabel}: ${step.fail}`,
            }],
        [`fail-${index}`, statusInfo(step.fail, `${DOCS_TEXTS.failLabel}: ${step.fail}`)],
    ])),
};
const engineNodes = [
    { id: "start", lines: ["Confirmed problem"], x: column(0), y: 24, w: 164, h: 44, shape: "pill", tint: "slate" },
    { id: "ok", lines: ["feasible"], x: column(STEP_VIEW.length - 1), y: 24, w: 164, h: 44, shape: "pill", tint: "success" },
    ...STEP_VIEW.map((step, index) => ({
        id: step.id,
        lines: [step.name, step.sub],
        x: column(index),
        y: stepY,
        w: 164,
        h: 64,
        shape: "box",
        tint: step.tint,
        icon: step.icon,
    })),
    ...ENGINE_STEPS.map((step, index) => ({
        id: `fail-${index}`,
        lines: [step.fail === "feasible" ? "keep first result" : step.fail],
        x: column(index),
        y: failY,
        w: 164,
        h: 44,
        shape: "pill",
        tint: step.fail === "validationFailed" ? "danger" : step.fail === "feasible" ? "success" : "warning",
    })),
];
const engineEdges = [
    { from: "start", fromSide: "b", to: STEP_VIEW[0].id, toSide: "t" },
    ...STEP_VIEW.slice(0, -1).map((step, index) => ({
        from: step.id,
        fromSide: "r",
        to: STEP_VIEW[index + 1].id,
        toSide: "l",
    })),
    { from: STEP_VIEW[STEP_VIEW.length - 1].id, fromSide: "t", to: "ok", toSide: "b", label: "ผ่านทุกกฎ" },
    ...STEP_VIEW.map((step, index) => ({
        from: step.id,
        fromSide: "b",
        to: `fail-${index}`,
        toSide: "t",
        label: step.fail === "feasible" ? "ไม่ดีขึ้น" : "ส่งผลตามสถานะ",
        dashed: true,
    })),
];
export const ENGINE_DIAGRAM = {
    id: "engine-flow",
    label: "ขั้นตอนของเอนจินจัดตาราง",
    width: column(STEP_VIEW.length - 1) + 180,
    height: 354,
    groups: [],
    nodes: engineNodes,
    edges: engineEdges,
};

export const SEARCH_INITIAL_ID = "search-start";
export const SEARCH_DETAILS = {
    "search-start": {
        title: "รับ problem ที่ยืนยันแล้ว",
        body: "Node.js ตรวจข้อมูลและเตรียม lessons ก่อนส่งโจทย์ให้ Python solver",
    },
    candidates: {
        title: "สร้าง candidate placements",
        body: "สร้างตัวเลือกวันและเวลา พร้อมครูและห้องที่ใช้ได้สำหรับแต่ละ lesson; fixed time จำกัดตัวเลือกให้เหลือช่วงที่กำหนด",
    },
    model: {
        title: "ประกอบ hard constraints",
        body: "โมเดลรวมรูปแบบวันและการครอบคลุมคาบของกลุ่ม, เวลา fixed, การไม่ชนกัน, availability, ประเภทห้อง และ workload ที่เปิดใช้",
    },
    solve: {
        title: "ค้นหาด้วย OR-Tools CP-SAT",
        body: "CP-SAT เลือกเวลา ครู และห้องพร้อมกันในโมเดลเดียว ใช้ worker เดียวและ seed คงที่ พร้อม time limit",
    },
    outcome: {
        title: "อ่านผล solver",
        body: "FEASIBLE/OPTIMAL ส่ง candidate ไป checker; INFEASIBLE ใช้เมื่อพิสูจน์ได้; UNKNOWN ที่หมดเวลาโดยไม่มีคำตอบเป็น searchLimit",
    },
    infeasible: {
        title: "infeasible",
        body: "CP-SAT พิสูจน์ว่าไม่มี assignment ที่ทำตาม constraints ของโจทย์เดิมได้",
    },
    searchLimit: {
        title: "searchLimit",
        body: "หยุดเพราะถึง time limit โดยยังไม่มีคำตอบ; นี่ไม่ใช่หลักฐานว่าจัดตารางไม่ได้",
    },
    checker: {
        title: "ตรวจ candidate อย่างอิสระ",
        body: "JavaScript checker คำนวณ hard rules ซ้ำโดยไม่ใช้โค้ดตรวจร่วมกับโมเดล solver",
    },
    feasible: {
        title: "feasible",
        body: "รายงานเป็นตารางสำเร็จได้เมื่อ independent checker ผ่าน hard rules ทุกข้อ",
    },
    validationFailed: {
        title: "validationFailed",
        body: "candidate ไม่ผ่าน checker เป็นข้อบกพร่องของระบบ ห้ามนำไปแสดงหรือส่งออกเป็นตารางสำเร็จ",
    },
};
export const SEARCH_DIAGRAM = {
    id: "search-flow",
    label: "การสร้างโมเดลและประมวลผลด้วย CP-SAT",
    width: 1000,
    height: 850,
    groups: [],
    nodes: [
        { id: "search-start", lines: ["Confirmed problem", "ตรวจและเตรียมใน Node.js"], x: 380, y: 20, w: 260, h: 64, shape: "box", tint: "slate" },
        { id: "candidates", lines: ["สร้าง candidate", "วัน · เวลา · ครู · ห้อง"], x: 380, y: 115, w: 260, h: 64, shape: "box", tint: "sky" },
        { id: "model", lines: ["รวม hard constraints", "กลุ่ม · fixed · availability"], x: 380, y: 210, w: 260, h: 64, shape: "box", tint: "lavender" },
        { id: "solve", lines: ["OR-Tools CP-SAT", "เลือกตัวแปรร่วมกัน"], x: 380, y: 305, w: 260, h: 64, shape: "box", tint: "butter" },
        { id: "outcome", lines: ["มี candidate", "หรือพิสูจน์ผลได้หรือไม่"], x: 410, y: 405, w: 200, h: 104, shape: "diamond", tint: "peach" },
        { id: "infeasible", lines: ["infeasible", "พิสูจน์ว่าไม่มีคำตอบ"], x: 20, y: 425, w: 230, h: 64, shape: "pill", tint: "danger" },
        { id: "searchLimit", lines: ["searchLimit", "หมดเวลา ≠ infeasible"], x: 750, y: 425, w: 230, h: 64, shape: "pill", tint: "warning" },
        { id: "checker", lines: ["Independent checker", "ตรวจ hard rules ใน JS"], x: 410, y: 565, w: 200, h: 104, shape: "diamond", tint: "success" },
        { id: "feasible", lines: ["feasible", "ผ่าน checker"], x: 280, y: 745, w: 210, h: 64, shape: "pill", tint: "success" },
        { id: "validationFailed", lines: ["validationFailed", "ห้ามแสดงเป็นผลสำเร็จ"], x: 550, y: 745, w: 250, h: 64, shape: "pill", tint: "danger" },
    ],
    edges: [
        { from: "search-start", fromSide: "b", to: "candidates", toSide: "t" },
        { from: "candidates", fromSide: "b", to: "model", toSide: "t" },
        { from: "model", fromSide: "b", to: "solve", toSide: "t" },
        { from: "solve", fromSide: "b", to: "outcome", toSide: "t" },
        { from: "outcome", fromSide: "l", to: "infeasible", toSide: "r", label: "พิสูจน์ว่าไม่มี" },
        { from: "outcome", fromSide: "r", to: "searchLimit", toSide: "l", label: "หมดเวลา ไม่มีคำตอบ" },
        { from: "outcome", fromSide: "b", to: "checker", toSide: "t", label: "พบ candidate" },
        { from: "checker", fromSide: "l", to: "feasible", toSide: "r", label: "ผ่าน" },
        { from: "checker", fromSide: "r", to: "validationFailed", toSide: "l", label: "ไม่ผ่าน" },
    ],
};

export const RESULT_INITIAL_ID = "result-start";
export const RESULT_DETAILS = {
    "result-start": {
        title: "ตัดสินสถานะของ Run",
        body: "ใช้ input validation, ผลวิเคราะห์/ค้นหา และผลจาก independent checker; สถานะที่ไม่ใช่ feasible ไม่มีตารางให้แสดงหรือส่งออก",
    },
    input: {
        title: "ข้อมูลถูกต้องหรือไม่",
        body: "ถ้าไม่ตรงรูปแบบหรือมีค่าที่ใช้ไม่ได้ ให้ invalidInput และหยุดก่อนค้นหา",
    },
    invalid: { title: "invalidInput", body: "รายงานข้อมูลที่ผิด; ไม่มีตารางให้แสดงหรือส่งออก" },
    analysis: {
        title: "Analysis พิสูจน์ว่าเป็นไปไม่ได้หรือไม่",
        body: "ถ้าพบข้อจำเป็นที่ขัดกัน ให้ infeasible พร้อมสาเหตุ; การผ่าน analysis ไม่ได้รับประกันว่าจะหาตารางพบ",
    },
    infeasible: { title: "infeasible", body: "ใช้เมื่อ analysis พบข้อขัดแย้งที่จำเป็น หรือ CP-SAT พิสูจน์ว่าไม่มี assignment ที่ทำตามโมเดลได้" },
    candidate: {
        title: "มี candidate timetable หรือไม่",
        body: "ถ้าไม่มี ให้แยกผลที่ CP-SAT พิสูจน์ว่า infeasible ออกจากการหยุดเพราะ time limit ซึ่งเป็น searchLimit",
    },
    "complete-infeasible": {
        title: "CP-SAT พิสูจน์ว่า infeasible",
        body: "ไม่มี assignment ที่เป็นไปตาม hard constraints ของโมเดล จึงรายงาน infeasible พร้อมสาเหตุ",
    },
    searchLimit: { title: "searchLimit", body: "หยุดก่อนพิสูจน์ว่ามีหรือไม่มีคำตอบ; ห้ามเรียกสถานะนี้ว่า infeasible" },
    checker: {
        title: "Independent checker ผ่านทุก hard rule หรือไม่",
        body: "checker แยกจากตัวค้นหา; ตารางจะแสดงเป็นผลสำเร็จได้ก็ต่อเมื่อผ่าน",
    },
    validationFailed: { title: "validationFailed", body: "เป็นข้อบกพร่องของระบบ; ห้ามแสดงหรือส่งออก candidate นี้เป็นตารางสำเร็จ" },
    feasible: { title: "feasible", body: "มี candidate ที่จัดทรัพยากรและผ่าน independent checker แล้ว จึงเปิดมุมมองและ export ได้" },
};
export const RESULT_DIAGRAM = {
    id: "result-flow",
    label: "ผังตัดสินสถานะผลลัพธ์",
    width: 960,
    height: 850,
    groups: [],
    nodes: [
        { id: "result-start", lines: ["เริ่มตัดสิน", "สถานะของ Run"], x: 360, y: 20, w: 240, h: 58, shape: "box", tint: "slate" },
        { id: "input", lines: ["Input ถูกต้อง", "หรือไม่"], x: 380, y: 110, w: 200, h: 104, shape: "diamond", tint: "sky" },
        { id: "invalid", lines: ["invalidInput", "หยุดก่อนค้นหา"], x: 40, y: 130, w: 220, h: 68, shape: "pill", tint: "warning" },
        { id: "analysis", lines: ["Analysis พิสูจน์ว่า", "จัดไม่ได้หรือไม่"], x: 380, y: 270, w: 200, h: 104, shape: "diamond", tint: "sky" },
        { id: "infeasible", lines: ["infeasible", "analysis / CP-SAT พิสูจน์"], x: 40, y: 290, w: 220, h: 68, shape: "pill", tint: "danger" },
        { id: "candidate", lines: ["มี candidate", "timetable หรือไม่"], x: 380, y: 430, w: 200, h: 104, shape: "diamond", tint: "sky" },
        { id: "searchLimit", lines: ["searchLimit", "ไม่ใช่ข้อพิสูจน์"], x: 700, y: 450, w: 220, h: 68, shape: "pill", tint: "warning" },
        { id: "complete-infeasible", lines: ["infeasible", "CP-SAT พิสูจน์ว่าไม่มีคำตอบ"], x: 40, y: 450, w: 220, h: 68, shape: "pill", tint: "danger" },
        { id: "checker", lines: ["Independent checker", "ผ่านทุก hard rule หรือไม่"], x: 380, y: 590, w: 200, h: 104, shape: "diamond", tint: "success" },
        { id: "validationFailed", lines: ["validationFailed", "ห้ามแสดง / export"], x: 700, y: 610, w: 220, h: 68, shape: "pill", tint: "danger" },
        { id: "feasible", lines: ["feasible", "แสดงและ export ได้"], x: 370, y: 760, w: 220, h: 68, shape: "pill", tint: "success" },
    ],
    edges: [
        { from: "result-start", fromSide: "b", to: "input", toSide: "t" },
        { from: "input", fromSide: "l", to: "invalid", toSide: "r", label: "ไม่ผ่าน" },
        { from: "input", fromSide: "b", to: "analysis", toSide: "t", label: "ผ่าน" },
        { from: "analysis", fromSide: "l", to: "infeasible", toSide: "r", label: "พิสูจน์ได้" },
        { from: "analysis", fromSide: "b", to: "candidate", toSide: "t", label: "ยังไม่พิสูจน์" },
        { from: "candidate", fromSide: "l", to: "complete-infeasible", toSide: "r", label: "ไม่พบ + solver พิสูจน์" },
        { from: "candidate", fromSide: "r", to: "searchLimit", toSide: "l", label: "ไม่พบ + ชน limit" },
        { from: "candidate", fromSide: "b", to: "checker", toSide: "t", label: "พบ" },
        { from: "checker", fromSide: "r", to: "validationFailed", toSide: "l", label: "ไม่ผ่าน" },
        { from: "checker", fromSide: "b", to: "feasible", toSide: "t", label: "ผ่าน" },
    ],
};

export const DATA_INITIAL_ID = "data-input";
export const DATA_DETAILS = {
    "data-input": {
        title: "แหล่งข้อมูล",
        body: "ระยะแรกใช้ .xlsx, form หรือ paste; .csv และ PDF เป็นงานภายหลังตาม stack.md",
    },
    ingest: {
        title: "Ingest และ review",
        body: "อ่านข้อมูล จับคู่คอลัมน์ แสดงตัวอย่าง และให้ครูแก้รายการ review ก่อน confirm; AI เป็นทางเลือกหลัง spike SP5",
    },
    problem: {
        title: "problem.json contract",
        body: "Input data มี groups, courses, teachers, rooms, time, off, review และ confirmed; engine รับ object นี้ ไม่รับไฟล์ spreadsheet",
    },
    storage: {
        title: "SQLite storage",
        body: "แผนกำหนด SQLite ใน data/ สำหรับ input ปัจจุบันและ run history; prototype ยังไม่เชื่อมฐานข้อมูล และ problem.json/result.json เป็น contract กับ test fixture",
    },
    engine: {
        title: "Engine",
        body: "Node.js วิเคราะห์และเตรียม lessons; Python + CP-SAT เลือกเวลา ครู และห้องพร้อมกัน; JavaScript checker ตรวจ hard rules อย่างอิสระ",
    },
    checker: {
        title: "Independent checker",
        body: "ตรวจ hard rules โดยไม่ใช้โค้ดร่วมกับตัวค้นหา; violations ระบุ rubricId, constraint, message และตำแหน่งที่เกี่ยวข้อง",
    },
    result: {
        title: "result.json / SolveResult",
        body: "สัญญาผลลัพธ์ประกอบด้วย status, lessons, analysis, report, assumptions และ solver stats; scoreHistory เป็นงานอนาคต",
    },
    output: {
        title: "Output views และ export",
        body: "ตามแผน Output สร้าง View จาก result และสำเนา input ของ run; run history และไฟล์ export ยังไม่ครบใน TimeTableMaker 1.0",
    },
    ui: {
        title: "หน้าจอ",
        body: "หน้าจอแสดง View/Report ที่ได้จาก output; prototype ปัจจุบันเป็น demo จากข้อมูลตัวอย่าง ไม่ได้เชื่อม API หรือ engine จริง",
    },
};
export const DATA_DIAGRAM = {
    id: "data-flow",
    label: "แผนภาพการไหลของข้อมูล",
    width: 1000,
    height: 780,
    groups: [],
    nodes: [
        { id: "data-input", lines: ["Input", ".xlsx · form · paste"], x: 300, y: 20, w: 220, h: 64, shape: "box", tint: "peach", icon: "upload" },
        { id: "ingest", lines: ["Ingest", "match · review · confirm"], x: 300, y: 116, w: 220, h: 64, shape: "box", tint: "butter", icon: "table" },
        { id: "problem", lines: ["Problem JSON", "groups · courses · time"], x: 300, y: 212, w: 220, h: 64, shape: "box", tint: "sky", icon: "table" },
        { id: "engine", lines: ["Engine", "CP-SAT joint solve"], x: 300, y: 308, w: 220, h: 64, shape: "box", tint: "lavender", icon: "cpu" },
        { id: "checker", lines: ["Independent checker", "hard rules · violations"], x: 300, y: 404, w: 220, h: 64, shape: "box", tint: "success", icon: "check" },
        { id: "result", lines: ["SolveResult", "status · lessons · report"], x: 300, y: 500, w: 220, h: 64, shape: "box", tint: "mint", icon: "table" },
        { id: "output", lines: ["Output", "View · report · export planned"], x: 300, y: 596, w: 220, h: 64, shape: "box", tint: "butter", icon: "table" },
        { id: "ui", lines: ["UI", "แสดงผลจาก Output"], x: 300, y: 692, w: 220, h: 64, shape: "box", tint: "mint", icon: "monitor" },
        { id: "storage", lines: ["SQLite (planned) · data/", "input · run history"], x: 700, y: 344, w: 220, h: 64, shape: "box", tint: "slate", icon: "database" },
    ],
    edges: [
        { from: "data-input", fromSide: "b", to: "ingest", toSide: "t" },
        { from: "ingest", fromSide: "b", to: "problem", toSide: "t" },
        { from: "problem", fromSide: "b", to: "engine", toSide: "t" },
        { from: "engine", fromSide: "b", to: "checker", toSide: "t" },
        { from: "checker", fromSide: "b", to: "result", toSide: "t" },
        { from: "result", fromSide: "b", to: "output", toSide: "t" },
        { from: "output", fromSide: "b", to: "ui", toSide: "t" },
        { from: "problem", fromSide: "r", to: "storage", toSide: "l", label: "บันทึก input" },
        { from: "result", fromSide: "r", to: "storage", toSide: "b", label: "เก็บ run" },
    ],
};
