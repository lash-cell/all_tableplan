import { useState } from "react";
import "./diagram.css";
import { DiagramCanvas } from "./DiagramCanvas";
export function DiagramView({ diagram, details, hint, initialId }) {
    const [selectedId, setSelectedId] = useState(initialId);
    const info = details[selectedId];
    return (<div className="dg-view">
      <p className="doc-muted">{hint}</p>
      <DiagramCanvas diagram={diagram} selectedId={selectedId} onSelect={setSelectedId}/>
      {info && (<div className="doc-detail" aria-live="polite">
          <h3>{info.title}</h3>
          {info.meta && <p className="doc-muted">{info.meta}</p>}
          <p>{info.body}</p>
          {info.items && <ul>{info.items.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>)}
    </div>);
}
