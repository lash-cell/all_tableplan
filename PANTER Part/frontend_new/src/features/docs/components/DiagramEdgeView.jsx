import { memo } from "react";
import { LABEL_GAP } from "./constants";
import { anchor, buildEdge } from "./edge-path";
function EdgeViewBase({ edge, from, to, markerId }) {
    const built = buildEdge(anchor(from, edge.fromSide), edge.fromSide, anchor(to, edge.toSide), edge.toSide);
    const { label, vertical } = built;
    // เส้นเชื่อมเป็นภาพประกอบ: screen reader อ่านจากรายการ "การเชื่อมต่อ" ใน DiagramCanvas แทน
    return (<g aria-hidden="true">
      <path className={`dg-edge${edge.dashed ? " dg-dashed" : ""}`} d={built.d} markerEnd={`url(#${markerId})`}/>
      {edge.label && (<text className="dg-edge-label" x={vertical ? label.x + LABEL_GAP : label.x} y={vertical ? label.y : label.y - LABEL_GAP} textAnchor={vertical ? "start" : "middle"} dominantBaseline="central">
          {edge.label}
        </text>)}
    </g>);
}
export const EdgeView = memo(EdgeViewBase);
