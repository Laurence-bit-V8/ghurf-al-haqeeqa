import { useEffect, useState } from "react";

// غرفة التهنئة الأخيرة: الرسالة تظهر 5 ثوانٍ، ثم تُمحى، ثم تُغلق الغرفة تلقائياً
export default function FinalRoom({ onClose }) {
  const [erased, setErased] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setErased(true), 5000); // محو الرسالة
    const t2 = setTimeout(onClose, 8000);               // الإغلاق التلقائي + منع الدخول مجدداً
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="room room-final">
      {!erased ? (
        <div className="panel panel-final">
          <h2>احترام الإطار وجلب معك المفتاح</h2>
          <p className="muted">…</p>
        </div>
      ) : (
        <div className="panel">
          <h2>تم محو الرسالة</h2>
          <p className="muted">جارٍ إغلاق الغرفة…</p>
        </div>
      )}
    </div>
  );
}
