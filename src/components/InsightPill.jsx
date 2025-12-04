function InsightPill({ label }) {
  return (
    <div className="badge" style={{ background: '#f1f5f9', color: '#0f172a' }}>
      <span style={{ fontSize: 16 }}>📌</span>
      {label}
    </div>
  );
}

export default InsightPill;
