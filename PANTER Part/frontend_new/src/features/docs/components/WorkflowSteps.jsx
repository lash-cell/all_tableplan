import { DOCS_TEXTS, FLOW_STEPS } from "../docs-content";
export function WorkflowSteps() {
    return (<ol className="doc-flow">
      {FLOW_STEPS.map((s, i) => (<li key={s.title} className="doc-flow__item">
          <span className="doc-flow__num" aria-label={`${DOCS_TEXTS.stepWord} ${i + 1}`}>{i + 1}</span>
          <div>
            <h3>{s.title} <span className="doc-badge">{s.page}</span></h3>
            <p>{s.body}</p>
            <p className="doc-muted">{DOCS_TEXTS.outputLabel}: {s.output}</p>
          </div>
        </li>))}
    </ol>);
}
