const StatCard = ({ icon, label, value, trend, tone = "blue" }) => (
  <article className={`stat-card stat-card--${tone}`}>
    <div className="stat-card__icon" aria-hidden="true">
      {icon}
    </div>
    <div className="stat-card__content">
      <p>{label}</p>
      <strong>{value}</strong>
      {trend && <span>{trend}</span>}
    </div>
  </article>
);

export default StatCard;
