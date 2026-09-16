import { useEffect, useState } from "react";
import Timer from "./Timer";
import KeyDisplay from "./KeyDisplay";
import CipherTable from "./CipherTable";
import { encodeText, keySymbols, KEYS, norm } from "../utils/cipher";

const MESSAGE = "احضر معك قبعة Red Hat ولا تنسها";
const ENC_MESSAGE = encodeText(MESSAGE);
const CHALLENGE_SECONDS = 180; // 3:00

// الغرفة الثانية: فك تشفير الرسالة قبل انتهاء 3 دقائق
export default function Room2({ hasKey, paused, onFail, onSuccess, resetSignal }) {
  const [phase, setPhase] = useState(hasKey ? "gate" : "locked"); // gate | challenge | success
  const [gateValue, setGateValue] = useState("");
  const [gateError, setGateError] = useState(false);
  const [secs, setSecs] = useState(CHALLENGE_SECONDS);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // إعادة الضبط بعد انتهاء عقوبة الانتظار
  useEffect(() => {
    setPhase(hasKey ? "gate" : "locked");
    setGateValue("");
    setGateError(false);
    setSecs(CHALLENGE_SECONDS);
    setAnswer("");
    setWrong(false);
    setShowTable(false);
  }, [resetSignal, hasKey]);

  // مؤقت 3 دقائق أثناء التحدي — يتجمد أثناء الانتظار العقابي حتى لا يُحسب فشل مزدوج
  useEffect(() => {
    if (phase !== "challenge" || paused) return;
    if (secs <= 0) {
      onFail("انتهى الوقت المحدد (3 دقائق)");
      return;
    }
    const id = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, secs, paused]);

  const submitGate = () => {
    const ok =
      norm(gateValue) === norm(keySymbols("patience")) ||
      norm(gateValue) === norm(KEYS.patience.plain);
    if (ok) {
      setGateError(false);
      setPhase("challenge");
    } else {
      setGateError(true);
    }
  };

  const submitAnswer = () => {
    if (norm(answer) === norm(MESSAGE)) {
      setPhase("success"); // يتوقف المؤقت تلقائياً لأن phase تتغير
    } else {
      setWrong(true);
      onFail("رسالة غير صحيحة");
    }
  };

  return (
    <div className="room room-2">
      <h1 className="room-title">الغرفة الثانية</h1>

      {phase === "locked" && (
        <div className="panel">
          <p>لا يمكنك الدخول… تحتاج مفتاح الصبر أولاً.</p>
        </div>
      )}

      {phase === "gate" && (
        <div className="panel">
          <p>أدخل رموز مفتاح الصبر لفتح الغرفة:</p>
          <input
            className="input"
            dir="ltr"
            value={gateValue}
            onChange={(e) => setGateValue(e.target.value)}
            placeholder="⌘ ⌥ ⌦ …"
          />
          {gateError && <p className="error">مفتاح خاطئ، تحقق من الرموز التي نسختها.</p>}
          <button className="btn" onClick={submitGate}>فتح الغرفة</button>
        </div>
      )}

      {phase === "challenge" && (
        <div className="panel panel-wide">
          <Timer seconds={secs} label="المؤقت" danger={secs <= 30} />
          <p>فك تشفير الرسالة التالية قبل انتهاء الوقت:</p>
          <div className="enc-message" dir="ltr">{ENC_MESSAGE}</div>
          <div className="row">
            <button className="btn btn-small" onClick={() => setShowTable((v) => !v)}>
              {showTable ? "إخفاء مفتاح التشفير" : "تلميح: مفتاح التشفير"}
            </button>
          </div>
          {showTable && <CipherTable />}
          <input
            className="input"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setWrong(false); }}
            placeholder="اكتب الرسالة المخفية هنا…"
          />
          {wrong && <p className="error">الرسالة غير صحيحة.</p>}
          <button className="btn" onClick={submitAnswer}>تحقق</button>
        </div>
      )}

      {phase === "success" && (
        <div className="panel">
          <h2>أحسنت! توقف المؤقت.</h2>
          <KeyDisplay symbols={keySymbols("contact")} label="مفتاح التواصل" />
          <button className="btn" onClick={onSuccess}>التالي: الغرفة الثالثة</button>
        </div>
      )}
    </div>
  );
}
