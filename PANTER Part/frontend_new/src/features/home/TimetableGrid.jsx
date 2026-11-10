import { Icon } from "../../components/Icon";
import { CATEGORY_TINT, DAYS, LUNCH_PERIOD, MAX_PERIOD, PERIODS } from "./home-data";

const at = (col, row, span = 1, i) => ({
    gridColumn: span > 1 ? `${col} / span ${span}` : col,
    gridRow: row,
    ...(i === undefined ? {} : { "--i": i }),
});

export function TimetableGrid({ label, blocks, roomFilter, view, studentGroup }) {
    const visibleBlocks = blocks ?? [];
    const taken = new Set();
    visibleBlocks.forEach((b) => {
        for (let p = b.start; p <= b.end; p += 1) {
            taken.add(`${b.day}-${p}`);
        }
    });

    const cells = [];
    for (let d = 0; d < DAYS.length; d += 1) {
        for (let p = 1; p <= PERIODS; p += 1) {
            const pos = at(p + 1, d + 2);
            if (p === LUNCH_PERIOD) {
                cells.push(<div key={`l${d}`} className="hm-tt__lunch" style={pos}>พัก</div>);
            } else if (p > MAX_PERIOD) {
                cells.push(<div key={`o${d}-${p}`} className="hm-tt__off" style={pos} aria-hidden="true"/>);
            } else if (!taken.has(`${d}-${p}`)) {
                cells.push(<div key={`e${d}-${p}`} className="hm-tt__empty" style={pos} aria-hidden="true"/>);
            }
        }
    }

    return (<div className="hm-tt tt-stagger" role="grid" aria-label={label}>
      {DAYS.map((day, d) => <div key={day} className="hm-tt__day" style={at(1, d + 2)}>{day}</div>)}
      {Array.from({ length: PERIODS }, (_, k) => (<div key={k} className="hm-tt__period" style={at(k + 2, 1)}>คาบ {k + 1}</div>))}
      {cells}
      {visibleBlocks.map((b, i) => (
        <button
          key={`${view}-${roomFilter ?? "all"}-${studentGroup ?? "all"}-${b.day}-${b.start}-${b.code}`}
          type="button"
          className={`hm-blk hm-tint-${CATEGORY_TINT[b.category]}`}
          style={at(b.start + 1, b.day + 2, b.end - b.start + 1, i)}
          aria-label={`${b.name} ${DAYS[b.day]} คาบ ${b.start}-${b.end}${b.fixed ? " เวลาบังคับในตัวอย่าง" : ""}`}
        >
          {b.fixed && <Icon name="lock" size={14} strokeWidth={2} className="hm-blk__lock"/>}
          <b>{b.code}</b>
          {b.name}<br />{b.room}
        </button>
      ))}
    </div>);
}
