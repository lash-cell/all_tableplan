import { ARCH_DETAILS, ARCH_DIAGRAM, ARCH_INITIAL_ID } from "../diagrams";
import { DOCS_TEXTS } from "../docs-content";
import { DiagramView } from "./DiagramView";
export function ArchitectureDiagram() {
    return (<DiagramView diagram={ARCH_DIAGRAM} details={ARCH_DETAILS} hint={DOCS_TEXTS.archHint} initialId={ARCH_INITIAL_ID}/>);
}
