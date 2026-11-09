const DashboardChart = ({ months, requests, complaints }) => {
  const chartWidth = 560;
  const chartHeight = 194;
  const padding = { top: 18, right: 14, bottom: 28, left: 32 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const maximum = Math.max(5, ...requests, ...complaints);
  const scaleMaximum = Math.ceil(maximum / 5) * 5;
  const x = (index) =>
    padding.left + (plotWidth * index) / Math.max(months.length - 1, 1);
  const y = (value) =>
    padding.top + plotHeight - (value / scaleMaximum) * plotHeight;
  const pointsFor = (values) =>
    values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) =>
    Math.round(scaleMaximum * fraction)
  );

  return (
    <section className="panel chart-panel" aria-labelledby="request-chart-title">
      <div className="panel-heading">
        <div>
          <h2 id="request-chart-title">Service requests &amp; complaints</h2>
          <p>Activity over the last six months</p>
        </div>
        <div className="chart-legend" aria-label="Chart legend">
          <span><i className="legend-dot legend-dot--blue" />Service requests</span>
          <span><i className="legend-dot legend-dot--green" />Complaints</span>
        </div>
      </div>
      <div className="chart-scroll">
        <svg
          className="dashboard-chart"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Monthly service requests and complaints"
        >
          <defs>
            <linearGradient id="request-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2482f5" stopOpacity=".18" />
              <stop offset="100%" stopColor="#2482f5" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((tick, index) => {
            const tickY = padding.top + (plotHeight * index) / 4;
            return (
              <g key={`${tick}-${index}`}>
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={tickY}
                  y2={tickY}
                  className="chart-grid-line"
                />
                <text x={padding.left - 9} y={tickY + 4} textAnchor="end" className="chart-axis-label">
                  {ticks[4 - index]}
                </text>
              </g>
            );
          })}
          {months.map((month, index) => (
            <g key={`${month}-${index}`}>
              <line
                x1={x(index)}
                x2={x(index)}
                y1={padding.top}
                y2={padding.top + plotHeight}
                className="chart-grid-line chart-grid-line--vertical"
              />
              <text x={x(index)} y={chartHeight - 7} textAnchor="middle" className="chart-axis-label">
                {month}
              </text>
            </g>
          ))}
          <polygon
            points={`${padding.left},${padding.top + plotHeight} ${pointsFor(requests)} ${chartWidth - padding.right},${padding.top + plotHeight}`}
            fill="url(#request-area)"
          />
          <polyline points={pointsFor(requests)} className="chart-line chart-line--blue" />
          <polyline points={pointsFor(complaints)} className="chart-line chart-line--green" />
          {requests.map((value, index) => (
            <circle key={`request-${index}`} cx={x(index)} cy={y(value)} r="3.5" className="chart-point chart-point--blue">
              <title>{`${months[index]}: ${value} service requests`}</title>
            </circle>
          ))}
          {complaints.map((value, index) => (
            <circle key={`complaint-${index}`} cx={x(index)} cy={y(value)} r="3.5" className="chart-point chart-point--green">
              <title>{`${months[index]}: ${value} complaints`}</title>
            </circle>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default DashboardChart;
