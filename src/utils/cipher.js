// شيفرة الرموز المشتركة بين كل الغرف
const SYMBOLS = [
  "⌘","⌥","⌦","⌫","⌧","⌬","⌭","⌮","⌯",
  "⌰","⌱","⌲","⌳","⌴","⌵","⌶","⌷","⌸","⌹",
  "⌺","⌻","⌼","⍟","⍜","⍝","⍞","⍠","⍣","⍤",
  "⍥","⍨","⍩","⍪","⍫","⍬","⍭","⍮","⍯","◉",
  "◎","◐","◑","◒","◓","◔","◕","◖","◗","◘",
  "◙","▣","▤","▥","▦","▧","▨","▩","◊","○",
  "◌","◍"
];

const LETTERS = [
  "ا","أ","إ","آ","ب","ت","ث","ج","ح","خ",
  "د","ذ","ر","ز","س","ش","ص","ض","ط","ظ",
  "ع","غ","ف","ق","ك","ل","م","ن","ه","ة",
  "و","ؤ","ي","ى","ئ","ء"
];

export const CIPHER_MAP = {};
LETTERS.forEach((letter, i) => { CIPHER_MAP[letter] = SYMBOLS[i]; });

export const KEYS = {
  patience: { plain: "أريد", label: "مفتاح الصبر" },
  contact:  { plain: "التواصل", label: "مفتاح التواصل" },
  time:     { plain: "المساء", label: "مفتاح الوقت" },
  day:      { plain: "الخميس", label: "مفتاح اليوم" }
};

// تشفير أي نص: كل حرف عربي يتحول لرمز، وبين الكلمات فاصل مرئي " | "
export function encodeText(text) {
  return [...text]
    .map((ch) => (CIPHER_MAP[ch] ? CIPHER_MAP[ch] : ch))
    .join(" ")
    .replace(/ {2,}/g, " | ");
}

// رموز المفتاح الجاهزة للعرض والنسخ
export function keySymbols(keyName) {
  return encodeText(KEYS[keyName].plain);
}

// تطبيع النص للمقارنة أثناء التحقق
export function norm(text) {
  return (text || "").toString().trim().replace(/\s+/g, " ").toLowerCase();
}
