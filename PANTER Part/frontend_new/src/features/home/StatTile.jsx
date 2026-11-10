import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** ตัวเลขนับขึ้น 360ms ครั้งแรกที่ปรากฏ (ข้ามเมื่อผู้ใช้ปิดแอนิเมชัน) */
function useCountUp(to, duration = 360) {
    const [n, setN] = useState(() => (to === 0 || reduceMotion() ? to : 0));
    useEffect(() => {
        if (to === 0 || reduceMotion()) {
            const raf = requestAnimationFrame(() => setN(to));
            return () => cancelAnimationFrame(raf);
        }
        let raf = 0;
        const t0 = performance.now();
        const tick = (t) => {
            const k = Math.min(1, (t - t0) / duration);
            setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
            if (k < 1)
                raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to, duration]);
    return n;
}
export function StatTile({ tint, icon, value, label }) {
    const n = useCountUp(value);
    return (<div className="hm-card hm-stat tt-lift">
      <div className={`hm-stat__icon hm-tint-${tint}`}><Icon name={icon} size={22}/></div>
      <b aria-label={`${value}`}>{n}</b>
      <span>{label}</span>
    </div>);
}
