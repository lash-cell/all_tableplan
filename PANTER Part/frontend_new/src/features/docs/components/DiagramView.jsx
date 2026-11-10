import { useState } from "react";
import "./diagram.css";
import { DiagramCanvas } from "./DiagramCanvas";
export function DiagramView({ diagram, details, hint, initialId }) {
    const [selectedId, setSelectedId] = useState(initialId);
    const [zoom, setZoom] = useState(1);
    const info = details[selectedId];
    return (<div className="dg-view">
      <p className="doc-muted">{hint}</p>
      <div className="dg-controls" role="group" aria-label="ควบคุมการซูมแผนภาพ">
        <button type="button" aria-label="ซูมออก" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} disabled={zoom <= 0.5}>−</button>
        <output aria-live="polite" aria-label="ระดับการซูม">{Math.round(zoom * 100)}%</output>
        <button type="button" aria-label="ซูมเข้า" onClick={() => setZoom((value) => Math.min(2, value + 0.25))} disabled={zoom >= 2}>+</button>
        <button type="button" className="dg-reset" onClick={() => setZoom(1)} disabled={zoom === 1}>รีเซ็ต</button>
      </div>
      <DiagramCanvas diagram={diagram} selectedId={selectedId} onSelect={setSelectedId} zoom={zoom}/>
      {info && (<div className="doc-detail" aria-live="polite">
          <h3>{info.title}</h3>
          {info.meta && <p className="doc-muted">{info.meta}</p>}
          <p>{info.body}</p>
          {info.items && <ul>{info.items.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>)}
    </div>);
}
