import { useEffect, useState } from "react";
import { keySymbols, KEYS, norm } from "../utils/cipher";

const COORDS = "29.006401,-10.024011";
const KEY_ORDER = ["patience", "contact", "time", "day"];

// الغرفة الرابعة: إدخال كل المفاتيح حسب الترتيب للحصول على الإحداثيات
export default function Room4({ canEnter, onEnter, resetSignal }) {
  const [locked] = useState(!canEnter);
  const [values, setValues] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setValues(["", "", "", ""]);
    setError(false);
    setUnlocked(false);
    setCopied(false);
  }, [resetSignal]);

  if (locked) {
    return (
      <div className="room room-4">
        <h1 className="room-title">الغرفة الرابعة</h1>
        <div className="panel">
          <p>الغرفة مغلقة… لا يمكن فتحها إلا بجميع المفاتيح الأربعة بالترتيب.</p>
        </div>
      </div>
    );
  }

  const setValue = (i, v) => {
    const next = [...values];
    next[i] = v;
    setValues(next);
    setError(false);
  };

  const submit = () => {
    const ok = KEY_ORDER.every((name, i) => {
      const expect = norm(keySymbols(name));
      const plain = norm(KEYS[name].plain);
      const got = norm(values[i]);
      return got === expect || got === plain;
    });
    if (ok) {
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(COORDS);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = COORDS;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="room room-4">
      <h1 className="room-title">الغرفة الرابعة</h1>

      {!unlocked ? (
        <div className="panel">
          <p>أدخل جميع المفاتيح التي حصلت عليها <strong>حسب الترتيب</strong>:</p>
          {KEY_ORDER.map((name, i) => (
            <input
              key={name}
              className="input"
              dir="ltr"
              value={values[i]}
              onChange={(e) => setValue(i, e.target.value)}
              placeholder={KEYS[name].label}
            />
          ))}
          {error && <p className="error">أحد المفاتيح خاطئ أو الترتيب غير صحيح.</p>}
          <button className="btn" onClick={submit}>تحقق</button>
        </div>
      ) : (
        <div className="panel key-pop">
          <h2>تم فتح الغرفة!</h2>
          <p>إحداثيات مكان اللقاء:</p>
          <div className="coords" dir="ltr">{COORDS}</div>
          <div className="row">
            <button className="btn btn-small" onClick={copyCoords}>
              {copied ? "✔ تم النسخ" : "نسخ الإحداثيات"}
            </button>
            <button className="btn" onClick={onEnter}>دخول</button>
          </div>
        </div>
      )}
    </div>
  );
}
