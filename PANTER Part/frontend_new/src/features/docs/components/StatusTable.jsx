import { DOCS_TEXTS, STATUSES } from "../docs-content";
export function StatusTable() {
    return (<div className="doc-scroll">
      <table className="doc-table">
        <thead>
          <tr><th>{DOCS_TEXTS.statusCol}</th><th>{DOCS_TEXTS.meaningCol}</th></tr>
        </thead>
        <tbody>
          {STATUSES.map((s) => (<tr key={s.code}>
              <td><span aria-hidden="true">{s.icon} </span>{s.label} <code>{s.code}</code></td>
              <td>{s.meaning}</td>
            </tr>))}
        </tbody>
      </table>
    </div>);
}
