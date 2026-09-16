import { useEffect, useState } from "react";

const COORDS = "29.006401,-10.024011";
const LAT = 29.006401;
const LON = -10.024011;
const D = 0.05;

// خريطة مكان اللقاء (تحتاج اتصالاً بالإنترنت لتحميل الخريطة)
export default function MapRoom({ onFinish, resetSignal }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    setAnswer("");
    setError(false);
    setMarked(false);
  }, [resetSignal]);

  const submit = () => {
    const n = answer.replace(/\s+/g, "").replace(/،/g, ",");
    if (n === COORDS) {
      setMarked(true);
      setTimeout(onFinish, 1500);
    } else {
      setError(true);
    }
  };

  const bbox = `${LON - D}%2C${LAT - D}%2C${LON + D}%2C${LAT + D}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${LAT}%2C${LON}`;

  return (
    <div className="room room-map">
      <h1 className="room-title">مكان اللقاء</h1>
      <div className="panel panel-wide">
        <iframe
          title="خريطة مكان اللقاء"
          className="map-frame"
          src={src}
          loading="lazy"
        />
        <p>أدخل الإحداثيات لتحديد مكان اللقاء على الخريطة:</p>
        <input
          className="input"
          dir="ltr"
          value={answer}
          onChange={(e) => { setAnswer(e.target.value); setError(false); }}
          placeholder="29.006401,-10.024011"
        />
        {error && <p className="error">إحداثيات خاطئة.</p>}
        {marked && <p className="success">✔ تم تحديد مكان اللقاء!</p>}
        <button className="btn" onClick={submit}>تحديد الموقع</button>
      </div>
    </div>
  );
}
