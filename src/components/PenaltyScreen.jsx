import Timer from "./Timer";

// شاشة الانتظار العقابي بعد الفشل (تزداد 3 دقائق مع كل فشل)
export default function PenaltyScreen({ left, total, reason, fails }) {
  return (
    <div className="overlay">
      <div className="panel panel-danger">
        <h2>فشلت في التحدي</h2>
        {reason && <p className="muted">{reason}</p>}
        <p>
          يجب عليك الانتظار <strong>{Math.round(total / 60)} دقائق</strong> قبل إعادة المحاولة.
        </p>
        <p className="muted">محاولات فاشلة: {fails}</p>
        <Timer seconds={left} label="الوقت المتبقي" danger />
      </div>
    </div>
  );
}
