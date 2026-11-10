import { DATA_DETAILS, DATA_DIAGRAM, DATA_INITIAL_ID, RESULT_DETAILS, RESULT_DIAGRAM, RESULT_INITIAL_ID, SEARCH_DETAILS, SEARCH_DIAGRAM, SEARCH_INITIAL_ID } from "../diagrams";
import { DOCS_TEXTS } from "../docs-content";
import { DiagramView } from "./DiagramView";

export function SearchFlowDiagram() {
    return <DiagramView diagram={SEARCH_DIAGRAM} details={SEARCH_DETAILS} hint={DOCS_TEXTS.searchHint} initialId={SEARCH_INITIAL_ID}/>;
}

export function ResultFlowDiagram() {
    return <DiagramView diagram={RESULT_DIAGRAM} details={RESULT_DETAILS} hint={DOCS_TEXTS.resultHint} initialId={RESULT_INITIAL_ID}/>;
}

export function DataFlowDiagram() {
    return <DiagramView diagram={DATA_DIAGRAM} details={DATA_DETAILS} hint={DOCS_TEXTS.dataHint} initialId={DATA_INITIAL_ID}/>;
}
