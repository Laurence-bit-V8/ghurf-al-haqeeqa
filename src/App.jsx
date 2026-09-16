import { useEffect, useRef, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import Room1 from "./components/Room1";
import Congrats from "./components/Congrats";
import Room2 from "./components/Room2";
import Room3 from "./components/Room3";
import DayRoom from "./components/DayRoom";
import Room4 from "./components/Room4";
import MapRoom from "./components/MapRoom";
import FinalRoom from "./components/FinalRoom";
import PenaltyScreen from "./components/PenaltyScreen";

const LOCK_KEY = "ghrf_lock_token"; // توكن منع الدخول (أكتفي)
const DONE_KEY = "ghrf_done_token"; // توكن إنهاء التحدي
const TOTAL_SECONDS = 20 * 60; // المؤقت المشترك

export default function App() {
  const [blocked, setBlocked] = useState(() => localStorage.getItem(LOCK_KEY) === "1");
  const [done, setDone] = useState(() => localStorage.getItem(DONE_KEY) === "1");
  const [step, setStep] = useState("room1");
  const [keys, setKeys] = useState({ patience: false, contact: false, time: false, day: false });
  const [failCount, setFailCount] = useState(0);
  const failRef = useRef(0);
  const [penalty, setPenalty] = useState(null); // { until, total, reason }
  const [penaltyLeft, setPenaltyLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [timerRunning, setTimerRunning] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const [room1Ready, setRoom1Ready] = useState(false); // تظهر بعد 60 ثانية

  // ---------- المؤقت المشترك: ينقص منك كل ثانية ولا يتوقف بين الغرف ----------
  useEffect(() => {
    if (!timerRunning || blocked || done || penalty || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, blocked, done, penalty, secondsLeft <= 0]);

  // ---------- عداد العقوبة ----------
  useEffect(() => {
    if (!penalty) return;
    setPenaltyLeft(Math.max(0, Math.ceil((penalty.until - Date.now()) / 1000)));
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((penalty.until - Date.now()) / 1000));
      setPenaltyLeft(left);
      if (left <= 0) {
        setPenalty(null);
        setResetSignal((r) => r + 1); // إعادة ضبط الغرفة الحالية للمحاولة من جديد
      }
    }, 1000);
    return () => clearInterval(id);
  }, [penalty]);

  // الفشل: انتظار 3 دقائق، ومع كل فشل جديد تُضاف 3 دقائق
  const triggerPenalty = (reason) => {
    failRef.current += 1;
    setFailCount(failRef.current);
    const secs = 180 * failRef.current;
    setPenalty({ until: Date.now() + secs * 1000, total: secs, reason });
  };

  const grantKey = (name) => setKeys((k) => ({ ...k, [name]: true }));

  const restart = () => {
    localStorage.removeItem(DONE_KEY);
    setDone(false);
    setStep("room1");
    setKeys({ patience: false, contact: false, time: false, day: false });
    failRef.current = 0;
    setFailCount(0);
    setPenalty(null);
    setSecondsLeft(TOTAL_SECONDS);
    setTimerRunning(true);
    setResetSignal((r) => r + 1);
  };

  // ---------- شاشات الحالات الخاصة ----------
  if (blocked) {
    return (
      <div className="room room-dark">
        <div className="panel panel-danger">
          <h2>اخترت أن تكتفي</h2>
          <p>تم إنهاء التحدي نهائياً، ومُنع دخولك مجدداً.</p>
          <p className="muted">للدخول من جديد يجب حذف التوكن المخزن.</p>
          <button
            className="btn"
            onClick={() => { localStorage.removeItem(LOCK_KEY); setBlocked(false); }}
          >
            حذف التوكن والدخول من جديد
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="room room-dark">
        <div className="panel">
          <h2>أنهيت التحدي</h2>
          <p>أُغلقت الغرفة تلقائياً ولا يمكنك الدخول مجدداً.</p>
          <button className="btn" onClick={restart}>إعادة التحدي من البداية</button>
        </div>
      </div>
    );
  }

  if (secondsLeft <= 0 && timerRunning) {
    return (
      <div className="room room-dark">
        <div className="panel panel-danger">
          <h2>انتهى الوقت المشترك</h2>
          <p>سحب منك الوقت كل ما تبقى… انتهت المهمة.</p>
          <button className="btn" onClick={restart}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  const rooms = ["room1", "room2", "room3", "day", "room4", "map", "final"];
  const labels = ["الصبر", "الثانية", "الثالثة", "اليوم", "الرابعة", "الخريطة", "الختام"];
  const currentIdx = ["room1", "congrats", "room2", "room3", "day", "room4", "map", "final"].indexOf(step);

  return (
    <div className="app">
      {(step !== "room1" || room1Ready) && (
        <header className="app-header">
          <h1 className="app-title">الغرف الحقيقية المغلقة</h1>
          <Timer seconds={secondsLeft} label="المؤقت المشترك" danger={secondsLeft <= 120} />
        </header>
      )}

      {step !== "room1" && (
      <nav className="progress">
        {rooms.map((r, i) => (
          <span
            key={r}
            className={"progress-dot" + (i <= currentIdx ? " active" : "")}
            title={labels[i]}
          />
        ))}
      </nav>
      )}

      <main className="app-main">
        {step === "room1" && <Room1 onReady={() => setRoom1Ready(true)} onPass={() => setStep("congrats")} />}

        {step === "congrats" && (
          <Congrats
            onContinue={() => { grantKey("patience"); setStep("room2"); }}
            onSettle={() => { localStorage.setItem(LOCK_KEY, "1"); setBlocked(true); }}
          />
        )}

        {step === "room2" && (
          <Room2
            hasKey={keys.patience}
            paused={!!penalty}
            onFail={triggerPenalty}
            onSuccess={() => { grantKey("contact"); setStep("room3"); }}
            resetSignal={resetSignal}
          />
        )}

        {step === "room3" && (
          <Room3
            canEnter={keys.patience && keys.contact}
            paused={!!penalty}
            onFail={triggerPenalty}
            onAddTime={(s) => setSecondsLeft((v) => v + s)}
            onGetTimeKey={() => grantKey("time")}
            onGoNext={() => setStep("day")}
            resetSignal={resetSignal}
          />
        )}

        {step === "day" && (
          <DayRoom
            onSuccess={() => { grantKey("day"); setStep("room4"); }}
            onFail={triggerPenalty}
            resetSignal={resetSignal}
          />
        )}

        {step === "room4" && (
          <Room4
            canEnter={keys.time && keys.day}
            onEnter={() => setStep("map")}
            resetSignal={resetSignal}
          />
        )}

        {step === "map" && <MapRoom onFinish={() => setStep("final")} resetSignal={resetSignal} />}

        {step === "final" && (
          <FinalRoom onClose={() => { localStorage.setItem(DONE_KEY, "1"); setDone(true); }} />
        )}
      </main>

      {penalty && (
        <PenaltyScreen
          left={penaltyLeft}
          total={penalty.total}
          reason={penalty.reason}
          fails={failCount}
        />
      )}
    </div>
  );
}
