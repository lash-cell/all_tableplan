import { ICON_CHIP, ICON_INSET, ICON_SIZE, ICON_VIEWBOX, LINE_HEIGHT, NODE_RADIUS, TEXT_INSET } from "./constants";
import { ICONS } from "./icons";
function Shape({ node }) {
    const { x, y, w, h, shape } = node;
    if (shape === "diamond") {
        const pts = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
        return <polygon className="dg-shape" points={pts}/>;
    }
    const rx = shape === "pill" ? h / 2 : NODE_RADIUS;
    return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={rx}/>;
}
export function NodeView({ node, selected, onSelect }) {
    const { x, y, w, h, shape, tint, lines, icon, id } = node;
    const cy = y + h / 2;
    const hasIcon = Boolean(icon) && shape !== "diamond";
    const textX = hasIcon ? x + TEXT_INSET : x + w / 2;
    const top = cy - ((lines.length - 1) * LINE_HEIGHT) / 2;
    const scale = ICON_SIZE / ICON_VIEWBOX;
    const onKey = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(id);
        }
    };
    return (<g className={`dg-node dg-${shape} dg-tint-${tint}${selected ? " is-selected" : ""}`} role="button" tabIndex={0} aria-pressed={selected} aria-label={lines.join(" ")} onClick={() => onSelect(id)} onKeyDown={onKey}>
      <Shape node={node}/>
      {hasIcon && icon && (<g aria-hidden="true">
          <rect className="dg-chip" x={x + ICON_INSET} y={cy - ICON_CHIP / 2} width={ICON_CHIP} height={ICON_CHIP} rx={8}/>
          <g transform={`translate(${x + ICON_INSET + (ICON_CHIP - ICON_SIZE) / 2} ${cy - ICON_SIZE / 2}) scale(${scale})`}>
            <path className="dg-icon" d={ICONS[icon]}/>
          </g>
        </g>)}
      <text className="dg-text" textAnchor={hasIcon ? "start" : "middle"} dominantBaseline="central">
        {lines.map((line, i) => (<tspan key={line} x={textX} y={top + i * LINE_HEIGHT} className={i === 0 ? "dg-text-main" : "dg-text-sub"}>
            {line}
          </tspan>))}
      </text>
    </g>);
}
