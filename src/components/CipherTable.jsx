import { CIPHER_MAP } from "../utils/cipher";

// جدول مفتاح التشفير (تلميح لفك الرموز)
export default function CipherTable() {
  const entries = Object.entries(CIPHER_MAP);
  return (
    <div className="cipher-table-wrap">
      <div className="cipher-title">مفتاح التشفير</div>
      <div className="cipher-table">
        {entries.map(([letter, symbol]) => (
          <div className="cipher-cell" key={letter}>
            <span className="cipher-letter">{letter}</span>
            <span className="cipher-symbol" dir="ltr">{symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
