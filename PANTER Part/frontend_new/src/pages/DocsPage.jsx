import "../features/docs/docs.css";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ArchitectureDiagram, DataFlowDiagram, DocsToc, EnginePipeline, ResultFlowDiagram, SearchFlowDiagram, StatusTable, WorkflowSteps, } from "../features/docs";
import { DOCS_TEXTS, PRINCIPLES, SECTIONS } from "../features/docs/docs-content";
// เพิ่ม/ลบ/สลับลำดับ section ได้ที่นี่ที่เดียว
const SECTION_VIEWS = [
    { id: "architecture", View: ArchitectureDiagram },
    { id: "workflow", View: WorkflowSteps },
    { id: "engine", View: EnginePipeline },
    { id: "search-flow", View: SearchFlowDiagram },
    { id: "result-flow", View: ResultFlowDiagram },
    { id: "data-flow", View: DataFlowDiagram },
    { id: "statuses", View: StatusTable },
];
const labelOf = (id) => SECTIONS.find((s) => s.id === id)?.label ?? id;
export default function DocsPage() {
    return (
        <div className="doc-layout">
            <DocsToc />
            <article className="doc-body">
                <header id="overview" className="doc-card doc-hero-card" aria-labelledby="overview-title">
                    <div className="doc-page-head">
                        <div>
                            <span className="doc-eyebrow">TIMETABLE MAKER · DOCUMENTATION</span>
                            <h1 id="overview-title">{DOCS_TEXTS.title}</h1>
                        </div>
                        <Link className="hm-btn hm-btn-secondary doc-home-link" to="/">
                            <Icon name="grid" size={18} />กลับหน้าหลัก
                        </Link>
                    </div>
                    <p>{DOCS_TEXTS.intro}</p>
                    <h2 className="doc-h3">{DOCS_TEXTS.principlesTitle}</h2>
                    <ul className="doc-list">
                        {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                </header>

                {SECTION_VIEWS.map(({ id, View }) => (
                    <section key={id} id={id} className="doc-card doc-section-card" aria-labelledby={`${id}-title`}>
                        <h2 id={`${id}-title`}>{labelOf(id)}</h2>
                        <View />
                    </section>
                ))}
            </article>
        </div>
    );
}
