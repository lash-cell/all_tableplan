import { memo, useLayoutEffect, useRef, useState } from "react";
import { LABEL_GAP } from "./constants";
import { buildEdge } from "./edge-path";
import { getFlowParticleSchedule, SPAWN_INTERVAL_SEC } from "./flow-timing";
function EdgeViewBase({ edge, from, to, markerId, pathId, startDelaySec }) {
    const built = buildEdge(from, edge.fromSide, to, edge.toSide, edge.via, edge.fromOffset, edge.toOffset);
    const { label, vertical } = built;
    const pathRef = useRef(null);
    const [pathLength, setPathLength] = useState(0);
    useLayoutEffect(() => {
        setPathLength(pathRef.current?.getTotalLength() ?? 0);
    }, [built.d]);
    const schedule = getFlowParticleSchedule(pathLength);
    // เส้นเชื่อมเป็นภาพประกอบ: screen reader อ่านจากรายการ "การเชื่อมต่อ" ใน DiagramCanvas แทน
    return (<g aria-hidden="true">
      <path ref={pathRef} id={pathId} className={`dg-edge${edge.dashed ? " dg-dashed" : ""}`} d={built.d} markerEnd={`url(#${markerId})`}/>
      {Array.from({ length: schedule.particles }, (_, index) => {
          const begin = `${startDelaySec + index * SPAWN_INTERVAL_SEC}s`;
          const duration = `${schedule.cycleSec}s`;
          const keyTimes = `0;${schedule.travelKeyTime};1`;
          return <circle key={index} className="dg-flow-dot" r="5">
              <animate attributeName="visibility" values="visible;hidden;hidden" keyTimes={keyTimes} calcMode="discrete" dur={duration} begin={begin} repeatCount="indefinite"/>
              <animateMotion dur={duration} calcMode="linear" keyPoints="0;1;1" keyTimes={keyTimes} begin={begin} repeatCount="indefinite">
                <mpath href={`#${pathId}`}/>
              </animateMotion>
            </circle>;
      })}
      {edge.label && (<text className="dg-edge-label" x={vertical ? label.x + LABEL_GAP : label.x} y={vertical ? label.y : label.y - LABEL_GAP} textAnchor={vertical ? "start" : "middle"} dominantBaseline="central">
          {edge.label}
        </text>)}
    </g>);
}
export const EdgeView = memo(EdgeViewBase);
