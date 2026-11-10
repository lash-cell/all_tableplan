import { CORNER_RADIUS } from "./constants";
const isHorizontal = (s) => s === "l" || s === "r";
export function anchor(n, side) {
    const cx = n.x + n.w / 2;
    const cy = n.y + n.h / 2;
    if (side === "l")
        return { x: n.x, y: cy };
    if (side === "r")
        return { x: n.x + n.w, y: cy };
    if (side === "t")
        return { x: cx, y: n.y };
    return { x: cx, y: n.y + n.h };
}
function orthogonalPoints(a, aSide, b, bSide) {
    const aH = isHorizontal(aSide);
    const bH = isHorizontal(bSide);
    if (aH && bH) {
        if (a.y === b.y)
            return [a, b];
        const mx = (a.x + b.x) / 2;
        return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
    }
    if (!aH && !bH) {
        if (a.x === b.x)
            return [a, b];
        const my = (a.y + b.y) / 2;
        return [a, { x: a.x, y: my }, { x: b.x, y: my }, b];
    }
    return aH ? [a, { x: b.x, y: a.y }, b] : [a, { x: a.x, y: b.y }, b];
}
const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
function toward(p, q, len) {
    const k = len / dist(p, q);
    return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k };
}
function roundedPath(pts) {
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i];
        const before = toward(p, pts[i - 1], Math.min(CORNER_RADIUS, dist(pts[i - 1], p) / 2));
        const after = toward(p, pts[i + 1], Math.min(CORNER_RADIUS, dist(p, pts[i + 1]) / 2));
        d += ` L${before.x} ${before.y} Q${p.x} ${p.y} ${after.x} ${after.y}`;
    }
    const last = pts[pts.length - 1];
    return `${d} L${last.x} ${last.y}`;
}
export function buildEdge(a, aSide, b, bSide) {
    const pts = orthogonalPoints(a, aSide, b, bSide);
    const label = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    return { d: roundedPath(pts), label, vertical: pts[0].x === pts[1].x };
}
