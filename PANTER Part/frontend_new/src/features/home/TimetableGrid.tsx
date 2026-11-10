import type { CSSProperties } from "react";
import { Icon } from "../../components/Icon";
import {
  BLOCKS, DAYS, KIND_TINT, LUNCH_PERIOD, MAX_PERIOD, PERIODS,
} from "./home-data";

const at = (col: number, row: number, span = 1, i?: number): CSSProperties => ({
  gridColumn: span > 1 ? `${col} / span ${span}` : col,
  gridRow: row,
  ...(i === undefined ? {} : ({ "--i": i } as CSSProperties)),
});

/** กริดแนวนอน: แถว = วัน, คอลัมน์ = คาบ (DESIGN_SYSTEM §3 TimetableGrid) */
export function TimetableGrid({ label }: { label: string }) {
  const taken = new Set<string>();
  BLOCKS.forEach((b) => { for (let p = b.start; p < b.start + b.len; p++) taken.add(`${b.day}-${p}`); });

  const cells = [];
  for (let d = 0; d < DAYS.length; d++) {
    for (let p = 1; p <= PERIODS; p++) {
      const pos = at(p + 1, d + 2);
      if (p === LUNCH_PERIOD) cells.push(<div key={`l${d}`} className="hm-tt__lunch" style={pos}>พัก</div>);
      else if (p > MAX_PERIOD) cells.push(<div key={`o${d}-${p}`} className="hm-tt__off" style={pos} aria-hidden="true" />);
      else if (!taken.has(`${d}-${p}`)) cells.push(<div key={`e${d}-${p}`} className="hm-tt__empty" style={pos} aria-hidden="true" />);
    }
  }

  return (
    <div className="hm-tt tt-stagger" role="grid" aria-label={label}>
      {DAYS.map((day, d) => <div key={day} className="hm-tt__day" style={at(1, d + 2)}>{day}</div>)}
      {Array.from({ length: PERIODS }, (_, k) => (
        <div key={k} className="hm-tt__period" style={at(k + 2, 1)}>คาบ {k + 1}</div>
      ))}
      {cells}
      {BLOCKS.map((b, i) => (
        <button
          key={`${b.day}-${b.start}`}
          type="button"
          className={`hm-blk hm-tint-${KIND_TINT[b.kind]}`}
          style={at(b.start + 1, b.day + 2, b.len, i)}
          aria-label={`${b.name} ${DAYS[b.day]} คาบ ${b.start}-${b.start + b.len - 1}${b.locked ? " ล็อกตามโจทย์" : ""}`}
        >
          {b.locked && <Icon name="lock" size={14} strokeWidth={2} className="hm-blk__lock" />}
          <b>{b.code}</b>
          {b.name}<br />{b.room}
        </button>
      ))}
    </div>
  );
}