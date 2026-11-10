import demoData from "./demo-data.json";

export const DAYS = demoData.time.days;
export const PERIODS = demoData.time.periodsPerDay;
export const MAX_PERIOD = demoData.time.lastPeriod;
export const LUNCH_PERIOD = demoData.time.exampleBreakPeriod;
export const GROUP_LABEL = demoData.groupLabel;
export const BLOCKS = demoData.lessons;
export const LEGEND = demoData.legend;
export const STATS = demoData.summary;
export const ROOMS = demoData.rooms;
export const STUDENT_GROUPS = demoData.studentGroups;
export const TEACHERS = demoData.teachers;

export const CATEGORY_TINT = {
  general: "lavender",
  department: "butter",
  activity: "rose",
};

export function getBlocksForView(view, room = ROOMS[0], studentGroup = STUDENT_GROUPS[0]) {
  switch (view) {
    case "teacher":
      return BLOCKS.filter((block) => block.teacher === "ครู A" || block.teacher === "ครู B");
    case "room":
      return BLOCKS.filter((block) => block.room === room);
    case "student":
      return BLOCKS.filter((block) => block.group === studentGroup || block.group === "ม.1-A");
    case "course":
      return BLOCKS.filter((block) => block.category === "general" || block.category === "activity");
    default:
      return BLOCKS;
  }
}

export function buildSchedulePreview() {
  return {
    title: "Timetable Maker — Demo schedule",
    generatedAt: new Date().toISOString(),
    rooms: ROOMS,
    students: STUDENT_GROUPS,
    summary: [
      { rule: "R1", passes: true, text: "One lesson block per subject" },
      { rule: "R2", passes: true, text: "Teacher workload within min/max" },
      { rule: "R3", passes: true, text: "Room availability respected" },
      { rule: "R4", passes: true, text: "Student group assignments valid" },
    ],
    lessons: BLOCKS,
  };
}

export function parseCsvPreview(text) {
  const lines = text
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  return lines.slice(0, 6).map((line, index) => ({
    row: index + 1,
    values: line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((part) => part.replace(/^"|"$/g, "").trim()),
  }));
}
