import { DOCS_TEXTS, SECTIONS } from "../docs-content";

export function DocsToc() {
  return (
    <nav className="doc-toc" aria-label={DOCS_TEXTS.tocLabel}>
      <strong>{DOCS_TEXTS.tocLabel}</strong>
      <ul>
        {SECTIONS.map((s) => (
          <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
