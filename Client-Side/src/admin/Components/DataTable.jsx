const DataTable = ({ title, columns, rows, emptyMessage = "No recent records to show." }) => (
  <section className="panel data-panel">
    <div className="panel-heading">
      <h2>{title}</h2>
    </div>
    {rows.length === 0 ? (
      <p className="empty-state">{emptyMessage}</p>
    ) : (
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default DataTable;
