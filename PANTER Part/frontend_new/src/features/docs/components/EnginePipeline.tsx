import { ENGINE_DETAILS, ENGINE_DIAGRAM, ENGINE_INITIAL_ID } from "../diagrams";
import { DiagramView } from "./DiagramView";

export function EnginePipeline() {
  return (
    <DiagramView
      diagram={ENGINE_DIAGRAM}
      details={ENGINE_DETAILS}
      hint="เลือกขั้นตอนเพื่อดูรายละเอียด หรือเลือกสถานะด้านล่างเพื่อดูว่าเกิดเมื่อไร"
      initialId={ENGINE_INITIAL_ID}
    />
  );
}
