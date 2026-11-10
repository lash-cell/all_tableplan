import type { DetailInfo, DiagramData, DiagramEdge, DiagramNode } from "./components/types";
import {
  DIAGRAM_ROWS, DOCS_TEXTS, ENGINE_STEPS, LINK_LABELS, NODES, STATUSES,
} from "./docs-content";

/* ===================== สถาปัตยกรรมระบบ ===================== */

// id ของโหนดอ้างจาก DIAGRAM_ROWS (ลำดับเดิมในหน้า: UI, API, Tools, แถวล่าง 3 ช่อง)
// ทำให้ข้อความรายละเอียดยังมาจาก NODES ชุดเดิม ไม่ต้องเขียนซ้ำ
const [[ui], [api], [tools], [ingest, storage, engine]] = DIAGRAM_ROWS;

export const ARCH_INITIAL_ID = ui;

export const ARCH_DETAILS: Record<string, DetailInfo> = Object.fromEntries(
  Object.entries(NODES).map(([id, n]) => [
    id,
    { title: n.title, meta: n.tech, body: n.role, items: [...n.details] },
  ]),
);

const LEAF_Y = 468;

export const ARCH_DIAGRAM: DiagramData = {
  id: "arch",
  label: "แผนภาพสถาปัตยกรรมระบบ",
  width: 760,
  height: 580,
  groups: [
    { id: "machine", label: "เครื่องของผู้ใช้ · ข้อมูลไม่ออกนอกเครื่อง", x: 8, y: 8, w: 744, h: 564, tint: "slate" },
    { id: "backend", label: "Backend · Node.js", x: 24, y: 140, w: 712, h: 412, tint: "sky" },
  ],
  nodes: [
    { id: ui, lines: ["Browser UI", "React 18 · TypeScript · Vite · React Router"], x: 180, y: 52, w: 400, h: 64, shape: "box", tint: "mint", icon: "monitor" },
    { id: api, lines: ["Algorithm API", "Node.js 24+ · http ในตัว · 127.0.0.1:8787"], x: 180, y: 196, w: 400, h: 64, shape: "box", tint: "lavender", icon: "server" },
    { id: tools, lines: ["Tools layer", "JavaScript ES modules"], x: 180, y: 316, w: 400, h: 64, shape: "box", tint: "butter", icon: "layers" },
    { id: ingest, lines: ["Ingest", "ExcelJS · pdf.js"], x: 40, y: LEAF_Y, w: 216, h: 64, shape: "box", tint: "peach", icon: "upload" },
    { id: storage, lines: ["Storage", "ไฟล์ในเครื่อง + JSON"], x: 272, y: LEAF_Y, w: 216, h: 64, shape: "box", tint: "mint", icon: "folder" },
    { id: engine, lines: ["Scheduling engine", "CSP + backtracking"], x: 504, y: LEAF_Y, w: 216, h: 64, shape: "box", tint: "rose", icon: "cpu" },
  ],
  edges: [
    { from: ui, fromSide: "b", to: api, toSide: "t", label: LINK_LABELS[0] },
    { from: api, fromSide: "b", to: tools, toSide: "t", label: LINK_LABELS[1] },
    { from: tools, fromSide: "b", to: ingest, toSide: "t", label: LINK_LABELS[2] },
    { from: tools, fromSide: "b", to: storage, toSide: "t" },
    { from: tools, fromSide: "b", to: engine, toSide: "t" },
  ],
};
/* ===================== ผังขั้นตอนของเอนจิน ===================== */

const STEP_VIEW = [
  { id: "normalize", name: "Normalize", sub: "แปลงระเบียบ", icon: "table", tint: "sky" },
  { id: "analyze", name: "Analyze", sub: "เช็กว่าจัดได้ไหม", icon: "layers", tint: "butter" },
  { id: "place", name: "Place", sub: "หาตำแหน่งวาง", icon: "cpu", tint: "peach" },
  { id: "validate", name: "Validate", sub: "ตรวจซ้ำ R1–R19", icon: "check", tint: "lavender" },
] as const;

const COL = (i: number) => 16 + i * 188; // 4 คอลัมน์ กว้าง 164 เว้น 24
const STEP_Y = 140;
const FAIL_Y = 290;

const statusInfo = (code: string, fallback: string): DetailInfo => {
  const s = STATUSES.find((x) => x.code === code);
  return { title: code, meta: s?.label, body: s?.meaning ?? fallback };
};

export const ENGINE_INITIAL_ID = "normalize";

export const ENGINE_DETAILS: Record<string, DetailInfo> = {
  start: {
    title: "Problem",
    body: "ข้อมูลที่ผ่านการอ่านและตรวจไฟล์แล้ว ส่งเข้าเอนจินเป็น Problem",
  },
  ok: statusInfo("ok", "พบตารางและผ่านการตรวจทุกกฎ"),
  ...Object.fromEntries(
    ENGINE_STEPS.flatMap((s, i) => [
      [STEP_VIEW[i].id, {
        title: `${i + 1}. ${s.name}`,
        body: s.goal,
        items: [...s.check],
        meta: `${DOCS_TEXTS.failLabel}: ${s.fail}`,
      }],
      [`fail-${i}`, statusInfo(s.fail, `${DOCS_TEXTS.failLabel}: ${s.fail}`)],
    ]),
  ),
};

const engineNodes: DiagramNode[] = [
  { id: "start", lines: ["Problem"], x: COL(0), y: 24, w: 164, h: 44, shape: "pill", tint: "slate" },
  { id: "ok", lines: ["ok"], x: COL(3), y: 24, w: 164, h: 44, shape: "pill", tint: "success" },
  ...STEP_VIEW.map((s, i): DiagramNode => ({
    id: s.id, lines: [s.name, s.sub], x: COL(i), y: STEP_Y, w: 164, h: 64, shape: "box", tint: s.tint, icon: s.icon,
  })),
  ...ENGINE_STEPS.map((s, i): DiagramNode => ({
    id: `fail-${i}`, lines: [s.fail], x: COL(i), y: FAIL_Y, w: 164, h: 44, shape: "pill",
    tint: i === ENGINE_STEPS.length - 1 ? "danger" : "warning",
  })),
];

const engineEdges: DiagramEdge[] = [
  { from: "start", fromSide: "b", to: STEP_VIEW[0].id, toSide: "t" },
  ...STEP_VIEW.slice(0, -1).map((s, i): DiagramEdge => ({
    from: s.id, fromSide: "r", to: STEP_VIEW[i + 1].id, toSide: "l",
  })),
  { from: STEP_VIEW[3].id, fromSide: "t", to: "ok", toSide: "b", label: "ผ่านทุกกฎ" },
  ...STEP_VIEW.map((s, i): DiagramEdge => ({
    from: s.id, fromSide: "b", to: `fail-${i}`, toSide: "t", label: "ไม่ผ่าน", dashed: true,
  })),
];

export const ENGINE_DIAGRAM: DiagramData = {
  id: "engine-flow",
  label: "ผังขั้นตอนของเอนจินจัดตาราง",
  width: 760,
  height: 354,
  groups: [],
  nodes: engineNodes,
  edges: engineEdges,
};
