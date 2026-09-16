import { useEffect, useState } from "react";
import Timer from "./Timer";
import KeyDisplay from "./KeyDisplay";
import { keySymbols, KEYS, norm } from "../utils/cipher";

const FRENCH_TEXT =
  "Le rendez-vous a lieu lorsque la grande aiguille pointe le chiffre neuf, " +
  "tandis que la petite aiguille se cache entre six et sept : " +
  "il ne manque qu'un quart d'heure avant sept heures du soir.";

const CHOICE_SECONDS = 5;

// الغرفة الثالثة: خياران خلال 5 ثوانٍ، ثم استخراج وقت اللقاء من نص فرنسي
export default function Room3({ canEnter, paused, onFail, onAddTime, onGetTimeKey, onGoNext, resetSignal }) {
  const [phase, setPhase] = useState(canEnter ? "gate" : "locked");
  const [k1, setK1] = useState("");
  const [k2, setK2] = useState("");
  const [gateError, setGateError] = useState(false);
  const [choiceLeft, setChoiceLeft] = useState(CHOICE_SECONDS);
  const [timeAnswer, setTimeAnswer] = useState("");
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setPhase(canEnter ? "gate" : "locked");
    setK1(""); setK2(""); setGateError(false);
    setChoiceLeft(CHOICE_SECONDS);
    setTimeAnswer(""); setWrong(false);
  }, [resetSignal, canEnter]);

  // مؤقت الاختيار (5 ثوانٍ) — يتجمد أثناء الانتظار العقابي
  useEffect(() => {
    if (phase !== "choice" || paused) return;
    if (choiceLeft <= 0) {
      onFail("انتهى وقت الاختيار (5 ثوانٍ)");
      return;
    }
    const id = setInterval(() => setChoiceLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, choiceLeft, paused]);

  const submitGate = () => {
    const ok1 =
      norm(k1) === norm(keySymbols("patience")) || norm(k1) === norm(KEYS.patience.plain);
    const ok2 =
      norm(k2) === norm(keySymbols("contact")) || norm(k2) === norm(KEYS.contact.plain);
    if (ok1 && ok2) {
      setGateError(false);
      setPhase("choice");
    } else {
      setGateError(true);
    }
  };

  const chooseAddTime = () => {
    onAddTime(30);
    setPhase("timeChallenge");
  };

  const chooseDirectKey = () => {
    onGetTimeKey();
    setPhase("directKey");
  };

  const submitTime = () => {
    const n = norm(timeAnswer).replace(/\s/g, "");
    if (["6:45", "06:45", "18:45"].includes(n)) {
      onGetTimeKey();
      setPhase("gotKey");
    } else {
      setWrong(true);
      onFail("وقت اللقاء غير صحيح");
    }
  };

  return (
    <div className="room room-3">
      <h1 className="room-title">الغرفة الثالثة</h1>

      {phase === "locked" && (
        <div className="panel"><p>الغرفة مغلقة… تحتاج مفتاحي الصبر والتواصل معاً.</p></div>
      )}

      {phase === "gate" && (
        <div className="panel">
          <p>أدخل المفتاحين معاً لفتح الغرفة:</p>
          <input className="input" dir="ltr" value={k1} onChange={(e) => setK1(e.target.value)} placeholder="مفتاح الصبر" />
          <input className="input" dir="ltr" value={k2} onChange={(e) => setK2(e.target.value)} placeholder="مفتاح التواصل" />
          {gateError && <p className="error">أحد المفتاحين خاطئ.</p>}
          <button className="btn" onClick={submitGate}>فتح الغرفة</button>
        </div>
      )}

      {phase === "choice" && (
        <div className="panel panel-wide">
          <Timer seconds={choiceLeft} label="اختر خلال" danger />
          <p>هل ترغب في:</p>
          <div className="row">
            <button className="btn" onClick={chooseAddTime}>إضافة 30 ثانية للمؤقت</button>
            <button className="btn" onClick={chooseDirectKey}>الحصول على مفتاح الوقت</button>
          </div>
        </div>
      )}

      {phase === "timeChallenge" && (
        <div className="panel panel-wide">
          <p className="muted">تمت إضافة 30 ثانية للمؤقت المشترك.</p>
          <h3>التحدي: استخرج وقت اللقاء من النص الفرنسي</h3>
          <p className="french" dir="ltr">{FRENCH_TEXT}</p>
          <input
            className="input"
            dir="ltr"
            value={timeAnswer}
            onChange={(e) => { setTimeAnswer(e.target.value); setWrong(false); }}
            placeholder="HH:MM"
          />
          {wrong && <p className="error">وقت خاطئ.</p>}
          <button className="btn" onClick={submitTime}>تحقق من الوقت</button>
        </div>
      )}

      {phase === "directKey" && (
        <div className="panel">
          <p>اتبع المفتاح لتعرف الوقت</p>
          <button className="btn" onClick={() => setPhase("gotKey")}>عرض مفتاح الوقت</button>
        </div>
      )}

      {phase === "gotKey" && (
        <div className="panel">
          <KeyDisplay symbols={keySymbols("time")} label="مفتاح الوقت" />
          <button className="btn" onClick={onGoNext}>التالي: غرفة اليوم</button>
        </div>
      )}
    </div>
  );
}
