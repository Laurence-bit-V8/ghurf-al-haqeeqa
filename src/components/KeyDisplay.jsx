import { useState } from "react";
import { copyText } from "../utils/clipboard";

// عرض المفتاح (رموز) مع زر نسخ
export default function KeyDisplay({ symbols, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyText(symbols);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="key-display key-pop">
      {label && <div className="key-label">{label}</div>}
      <div className="key-symbols" dir="ltr">{symbols}</div>
      <button className="btn btn-small" onClick={handleCopy}>
        {copied ? "✔ تم النسخ" : "نسخ المفتاح"}
      </button>
    </div>
  );
}
