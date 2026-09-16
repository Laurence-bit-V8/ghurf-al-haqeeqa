// مؤقت عرض مشترك (دقائق:ثواني)
export default function Timer({ seconds, label, danger }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div className={"timer" + (danger ? " timer-danger" : "")}>
      {label && <span className="timer-label">{label}</span>}
      <span className="timer-digits">
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}
