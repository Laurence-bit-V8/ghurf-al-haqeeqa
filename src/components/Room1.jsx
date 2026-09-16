import { useEffect, useState } from "react";

// الغرفة الأولى: غرفة الصبر — فارغة تماماً (حتى بدون مؤقت مشترك في الأعلى)
// بعد 60 ثانية يظهر كل شيء: العنوان + زر العبور
export default function Room1({ onReady, onPass }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      onReady(); // إظهار المؤقت المشترك في الأعلى
    }, 60000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="room room-white">
      {ready && (
        <>
          <h1 className="room-title room-title-light">غرفة الصبر</h1>
          <button className="btn btn-appear" onClick={onPass}>
            عبور
          </button>
        </>
      )}
    </div>
  );
}
