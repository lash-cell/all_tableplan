import type { ComponentType } from "react";
import "../features/docs/docs.css";
import {
  ArchitectureDiagram, DocsToc, EnginePipeline, StatusTable, WorkflowSteps,
} from "../features/docs";
import { DOCS_TEXTS, PRINCIPLES, SECTIONS } from "../features/docs/docs-content";

// เพิ่ม/ลบ/สลับลำดับ section ได้ที่นี่ที่เดียว
const SECTION_VIEWS: { id: string; View: ComponentType }[] = [
  { id: "architecture", View: ArchitectureDiagram },
  { id: "workflow", View: WorkflowSteps },
  { id: "engine", View: EnginePipeline },
  { id: "statuses", View: StatusTable },
];

const labelOf = (id: string) => SECTIONS.find((s) => s.id === id)?.label ?? id;

export default function DocsPage() {
  return (
    <div className="doc-layout">
      <DocsToc />
      <article className="doc-body">
        <header id="overview" aria-labelledby="overview-title">
          <h1 id="overview-title">{DOCS_TEXTS.title}</h1>
          <p>{DOCS_TEXTS.intro}</p>
          <h2 className="doc-h3">{DOCS_TEXTS.principlesTitle}</h2>
          <ul>
            {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </header>

        {SECTION_VIEWS.map(({ id, View }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>{labelOf(id)}</h2>
            <View />
          </section>
        ))}
      </article>
    </div>
  );
}