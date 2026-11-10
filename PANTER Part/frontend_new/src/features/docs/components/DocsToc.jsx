import { DOCS_TEXTS, SECTIONS } from "../docs-content";

const TOC_ICONS = {
    overview: "◫",
    architecture: "▣",
    workflow: "⇄",
    engine: "⚙",
    statuses: "✓",
};

export function DocsToc() {
    return (
        <nav className="doc-toc" aria-label={DOCS_TEXTS.tocLabel}>
            <strong className="doc-toc__title">{DOCS_TEXTS.tocLabel}</strong>
            <ul>
                {SECTIONS.map((s) => (
                    <li key={s.id}>
                        <a href={`#${s.id}`} className="doc-toc__link">
                            <span className="doc-toc__icon" aria-hidden="true">{TOC_ICONS[s.id] ?? "•"}</span>
                            <span>{s.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
