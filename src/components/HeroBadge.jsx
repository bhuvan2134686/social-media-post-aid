function HeroBadge({ label }) {
  return (
    <div className="badge" style={{ background: '#ecfeff', color: '#0b7285' }}>
      <span style={{ fontSize: 18 }}>⚡</span>
      {label}
    </div>
  );
}

export default HeroBadge;
