import { useMemo } from "react";
import { GROUP_LABEL_X, GROUP_LABEL_Y, GROUP_RADIUS, MIN_SCALE } from "./constants";
import { EdgeView } from "./DiagramEdgeView";
import { NodeView } from "./DiagramNodeView";
import { CYCLE_SEC, FLOW_STEP_DELAY_SEC } from "./flow-timing";
import { assignEdgePorts } from "./edge-path";
export function DiagramCanvas({ diagram, selectedId, onSelect, zoom = 1, connectionsLabel = "การเชื่อมต่อ" }) {
    const byId = useMemo(() => {
        const map = {};
        diagram.nodes.forEach((n) => { map[n.id] = n; });
        return map;
    }, [diagram]);
    // ข้ามเส้นที่อ้าง id ไม่มีอยู่จริง (แทนที่จะให้ทั้งหน้าพัง) และเตือนใน console
    const edges = useMemo(() => {
        const valid = [];
        diagram.edges.forEach((e) => {
            if (byId[e.from] && byId[e.to])
                valid.push(e);
            else
                console.warn(`[${diagram.id}] edge อ้างโหนดที่ไม่มี: ${e.from} -> ${e.to}`);
        });
        return valid;
    }, [diagram, byId]);
    const routedEdges = useMemo(() => assignEdgePorts(edges, byId), [edges, byId]);
    const nameOf = (id) => byId[id].lines.join(" ");
    const markerId = `${diagram.id}-arrow`;
    return (<>
      <div className="dg-scroll">
        <svg className="dg" style={{ width: `${zoom * 100}%`, minWidth: Math.round(diagram.width * MIN_SCALE * zoom), "--dg-flow-cycle": `${CYCLE_SEC}s` }} viewBox={`0 0 ${diagram.width} ${diagram.height}`} role="group" aria-label={diagram.label}>
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path className="dg-arrow" d="M0 0L10 5L0 10z"/>
            </marker>
          </defs>
          {diagram.groups.map((g) => (<g key={g.id} className={`dg-group dg-tint-${g.tint}`}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={GROUP_RADIUS}/>
              <text x={g.x + GROUP_LABEL_X} y={g.y + GROUP_LABEL_Y} className="dg-group-label">{g.label}</text>
            </g>))}
          {routedEdges.map((e, index) => {
              const edgeId = `${diagram.id}-${e.from}-${e.fromSide}-${e.to}-${e.toSide}`;
              return <EdgeView key={edgeId} edge={e} from={byId[e.from]} to={byId[e.to]} markerId={markerId} pathId={edgeId} startDelaySec={index * FLOW_STEP_DELAY_SEC}/>;
          })}
          {diagram.nodes.map((n) => (<NodeView key={n.id} node={n} selected={n.id === selectedId} flowStart={diagram.flowStartId === n.id} onSelect={onSelect}/>))}
        </svg>
      </div>
      {/* ข้อความสำหรับ screen reader: บอกว่าโหนดไหนเชื่อมกับโหนดไหน */}
      <ul className="dg-sr-only" aria-label={connectionsLabel}>
        {edges.map((e) => (<li key={`${e.from}-${e.fromSide}-${e.to}-${e.toSide}`}>
            {nameOf(e.from)} → {nameOf(e.to)}{e.label ? ` (${e.label})` : ""}
          </li>))}
      </ul>
    </>);
}
