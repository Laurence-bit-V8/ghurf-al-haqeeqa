import { useEffect, useState } from "react";
import KeyDisplay from "./KeyDisplay";
import { keySymbols, norm } from "../utils/cipher";

const TARGET_DATE = "18/09/2026";

// غرفة اليوم: استخراج اليوم من درجة الحرارة (28/18)
export default function DayRoom({ onSuccess, onFail, resetSignal }) {
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setAnswer("");
    setWrong(false);
    setSolved(false);
  }, [resetSignal]);

  const submit = () => {
    const n = norm(answer).replace(/\s/g, "").replace(/-/g, "/").replace(/\./g, "/");
    if (n === TARGET_DATE) {
      setSolved(true);
    } else {
      setWrong(true);
      onFail("التاريخ غير صحيح");
    }
  };

  return (
    <div className="room room-day">
      <h1 className="room-title">غرفة اليوم</h1>

      {!solved ? (
        <div className="panel panel-wide">
          <div className="weather">
            <span className="weather-icon">🌡️</span>
            <p>درجة الحرارة اليوم تتراوح بين <strong>28°</strong> و <strong>18°</strong> مئوية.</p>
          </div>
          <p>التحدي: استخرج <strong>اليوم</strong> (التاريخ) من درجة الحرارة.</p>
          <input
            className="input"
            dir="ltr"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setWrong(false); }}
            placeholder="DD/MM/YYYY"
          />
          {wrong && <p className="error">تاريخ خاطئ، فكر في درجتي الحرارة.</p>}
          <button className="btn" onClick={submit}>تحقق</button>
        </div>
      ) : (
        <div className="panel">
          <h2>أحسنت!</h2>
          <p className="result-line">🕕 وقت اللقاء: <strong>6:45</strong> — 📅 اليوم: <strong>18/09/2026</strong></p>
          <KeyDisplay symbols={keySymbols("day")} label="مفتاح اليوم" />
          <button className="btn" onClick={onSuccess}>التالي: الغرفة الرابعة</button>
        </div>
      )}
    </div>
  );
}
