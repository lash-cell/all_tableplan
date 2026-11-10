import { DIAGRAM_ROWS, DOCS_TEXTS, ENGINE_STEPS, LINK_LABELS, NODES, STATUSES } from "./docs-content";
const [[ui], [server], [ingest, engine, output, storage]] = DIAGRAM_ROWS;
export const ARCH_INITIAL_ID = ui;
export const ARCH_DETAILS = Object.fromEntries(Object.entries(NODES).map(([id, node]) => [
    id,
    { title: node.title, meta: node.tech, body: node.role, items: [...node.details] },
]));
const leafX = [32, 212, 392, 572];
export const ARCH_DIAGRAM = {
    id: "architecture",
    label: "แผนภาพสถาปัตยกรรมระบบ",
    width: 760,
    height: 580,
    groups: [
        { id: "machine", label: "เครื่องของผู้ใช้ · ทำงานในเครื่องเดียว", x: 8, y: 8, w: 744, h: 564, tint: "slate" },
        { id: "backend", label: "App / server และส่วนงานหลังบ้าน", x: 24, y: 140, w: 712, h: 412, tint: "sky" },
    ],
    nodes: [
        { id: ui, lines: ["Teacher UI", "React · Vite · JavaScript"], x: 180, y: 52, w: 400, h: 64, shape: "box", tint: "mint", icon: "monitor" },
        { id: server, lines: ["App / server", "node:http · worker_threads · node:sqlite"], x: 180, y: 196, w: 400, h: 64, shape: "box", tint: "lavender", icon: "server" },
        { id: ingest, lines: ["Ingest", ".xlsx · form · paste"], x: leafX[0], y: 468, w: 164, h: 64, shape: "box", tint: "peach", icon: "upload" },
        { id: engine, lines: ["Engine", "search · check · improve"], x: leafX[1], y: 468, w: 164, h: 64, shape: "box", tint: "rose", icon: "cpu" },
        { id: output, lines: ["Output", "views · report · export"], x: leafX[2], y: 468, w: 164, h: 64, shape: "box", tint: "butter", icon: "table" },
        { id: storage, lines: ["SQLite", "local run history"], x: leafX[3], y: 468, w: 164, h: 64, shape: "box", tint: "mint", icon: "database" },
    ],
    edges: [
        { from: ui, fromSide: "b", to: server, toSide: "t", label: LINK_LABELS[0] },
        { from: server, fromSide: "b", to: ingest, toSide: "t", label: LINK_LABELS[1] },
        { from: server, fromSide: "b", to: engine, toSide: "t" },
        { from: server, fromSide: "b", to: output, toSide: "t" },
        { from: server, fromSide: "b", to: storage, toSide: "t" },
    ],
};
const STEP_VIEW = [
    { id: "analyze", name: "Analyze", sub: "ตรวจเงื่อนไขจำเป็น", icon: "layers", tint: "sky" },
    { id: "prepare", name: "Prepare", sub: "สร้าง lesson ภายใน", icon: "table", tint: "butter" },
    { id: "fixed", name: "Fixed lessons", sub: "จองเวลาบังคับ", icon: "alert", tint: "peach" },
    { id: "search", name: "Search times", sub: "ค้นหาและ backtrack", icon: "cpu", tint: "lavender" },
    { id: "assign", name: "Assign", sub: "ห้องแล้วจึงครู", icon: "plug", tint: "mint" },
    { id: "check", name: "Independent check", sub: "ตรวจ hard rules", icon: "check", tint: "success" },
    { id: "improve", name: "Improve", sub: "ลด soft penalties", icon: "layers", tint: "butter" },
    { id: "recheck", name: "Recheck", sub: "ตรวจก่อนส่งผล", icon: "check", tint: "success" },
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
        body: "Engine รับข้อมูลที่ยืนยันแล้วตามสัญญาใน shapes.md ไม่อ่าน spreadsheet โดยตรง",
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
        lines: [step.fail],
        x: column(index),
        y: failY,
        w: 164,
        h: 44,
        shape: "pill",
        tint: step.fail === "validationFailed" ? "danger" : "warning",
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
        label: "ไม่ผ่าน",
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
