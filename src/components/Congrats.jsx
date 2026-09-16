import { useState } from "react";
import KeyDisplay from "./KeyDisplay";
import { keySymbols } from "../utils/cipher";

// غرفة التهنئة بين الغرفة الأولى والثانية
export default function Congrats({ onContinue, onSettle }) {
  const [phase, setPhase] = useState("choice"); // choice | key

  return (
    <div className="room room-congrats">
      <div className="panel">
        <h2>تهانينا لك على صبرك</h2>
        <p>الآن أختر: هل تكمل أم تكتفي بما حققته؟</p>

        {phase === "choice" && (
          <div className="row">
            <button className="btn" onClick={() => setPhase("key")}>
              أكمل
            </button>
            <button className="btn btn-danger" onClick={onSettle}>
              أكتفي
            </button>
          </div>
        )}

        {phase === "key" && (
          <div className="key-pop">
            <KeyDisplay
              symbols={keySymbols("patience")}
              label="مفتاح الصبر — رموز يمكن حلها واستخراج رسالة مخفية (ليس إجبارياً)"
            />
            <p className="note">
              حافظ على هذا المفتاح فهو وسيلتك الوحيدة للعبور
            </p>
            <button className="btn" onClick={onContinue}>
              التالي: الغرفة الثانية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
