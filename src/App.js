import { useState, useEffect, useRef } from "react";

const API_BASE = "https://d542ea31-6771-4dde-b6fb-561a441f6278-00-36r4x3ckrn51h.picard.replit.dev";

const SYMPTOMS = [
  { id: "fatigue", label: "Fatigue" },
  { id: "anxiety", label: "Anxiety" },
  { id: "poor_sleep", label: "Poor Sleep" },
  { id: "brain_fog", label: "Brain Fog" },
  { id: "hot_flushes", label: "Hot Flushes" },
  { id: "joint_pain", label: "Joint Stiffness" },
  { id: "mood_swings", label: "Mood Shifts" },
  { id: "stress", label: "High Stress" }
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState([]);
  const [plan, setPlan] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const intervalRef = useRef(null);

  const toggleSymptom = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const generatePlan = async () => {
    setScreen("loading");
    const labels = selected.map((id) => SYMPTOMS.find((s) => s.id === id).label);
    try {
      const res = await fetch(API_BASE + "/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: labels })
      });
      const data = await res.json();
      setPlan(data.plan);
      setScreen("result");
    } catch (e) {
      setPlan({
        title: "Gentle Practice",
        subtitle: "A calming flow for this moment.",
        type: "Movement + Breath",
        science_note: "Yoga supports nervous system regulation during hormonal shifts.",
        steps: [
          { name: "Legs Up The Wall", duration: "2 minutes", seconds: 120, instruction: "Lie near a wall with legs elevated. Close your eyes and breathe naturally." },
          { name: "Extended Exhale", duration: "2 minutes", seconds: 120, instruction: "Inhale for 4, exhale for 8. Repeat 10 times." },
          { name: "Body Scan", duration: "1 minute", seconds: 60, instruction: "Starting at your feet, soften each body part upward." }
        ],
        affirmation: "Your body is asking for something different, and you are listening."
      });
      setScreen("result");
    }
  };

  const startTimer = (idx, seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveTimer({ stepIndex: idx, remaining: seconds, total: seconds, done: false });
    intervalRef.current = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || prev.remaining <= 1) {
          clearInterval(intervalRef.current);
          return prev ? { ...prev, remaining: 0, done: true } : null;
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const fmt = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

  const style = {
    body: { fontFamily: "sans-serif", background: "#FAF7F2", color: "#3D3830", minHeight: "100vh", margin: 0 },
    home: { minHeight: "100vh", background: "#3D3830", color: "#FAF7F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" },
    h1: { fontSize: "42px", fontWeight: 300, marginBottom: "16px" },
    p: { fontSize: "14px", marginBottom: "32px", color: "#C4BDB5", maxWidth: "300px", lineHeight: 1.6 },
    btn: { background: "#C17F5A", color: "#FAF7F2", border: "none", padding: "14px 36px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" },
    screen: { padding: "32px 20px", maxWidth: "600px", margin: "0 auto" },
    h2: { fontSize: "28px", fontWeight: 400, marginBottom: "8px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" },
    card: { background: "white", border: "2px solid #eee", padding: "18px", borderRadius: "2px", cursor: "pointer" },
    cardOn: { background: "#EAF0E5", border: "2px solid #7A8C6E", padding: "18px", borderRadius: "2px", cursor: "pointer" },
    back: { background: "none", border: "none", color: "#7C7267", fontSize: "12px", cursor: "pointer", padding: "8px 0", marginBottom: "16px" },
    step: { background: "white", padding: "20px", marginBottom: "10px", borderRadius: "2px", border: "1px solid #eee" },
    stepName: { fontSize: "14px", fontWeight: 500, marginBottom: "4px" },
    stepDur: { fontSize: "11px", color: "#7A8C6E", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
    stepTxt: { fontSize: "13px", color: "#7C7267", lineHeight: 1.6, marginBottom: "10px" },
    timerBtn: { background: "#7A8C6E", color: "white", border: "none", padding: "8px 16px", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", borderRadius: "2px" },
    affirm: { background: "#3D3830", color: "#FAF7F2", padding: "28px", margin: "24px 0", borderRadius: "2px", textAlign: "center", fontStyle: "italic", fontSize: "18px", lineHeight: 1.5 },
    hero: { background: "#3D3830", color: "#FAF7F2", padding: "36px 20px", textAlign: "center" },
    sci: { background: "#EAF0E5", borderLeft: "3px solid #7A8C6E", padding: "12px 16px", margin: "20px 0", fontSize: "12px", fontStyle: "italic", color: "#7C7267" }
  };

  return (
    <div style={style.body}>
      {screen === "home" && (
        <div style={style.home}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", marginBottom: "16px", color: "#B5C4A8" }}>@_YOGAWITHV_</div>
          <h1 style={style.h1}>How are you<br />feeling today?</h1>
          <p style={style.p}>Select your symptoms. Receive a personalised 5-minute practice.</p>
          <button style={style.btn} onClick={() => setScreen("select")}>Begin</button>
        </div>
      )}

      {screen === "select" && (
        <div style={style.screen}>
          <button style={style.back} onClick={() => setScreen("home")}>â Back</button>
          <h2 style={style.h2}>What is your body telling you?</h2>
          <p style={{ fontSize: "13px", color: "#7C7267", marginBottom: "24px" }}>Select up to 4 symptoms.</p>
          <div style={style.grid}>
            {SYMPTOMS.map((s) => (
              <div key={s.id} style={selected.includes(s.id) ? style.cardOn : style.card} onClick={() => toggleSymptom(s.id)}>
                {s.label}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#7C7267", textAlign: "center", marginBottom: "20px" }}>{selected.length}/4 selected</p>
          <button style={{ ...style.btn, width: "100%", padding: "16px", opacity: selected.length === 0 ? 0.4 : 1 }} disabled={selected.length === 0} onClick={generatePlan}>
            Create My Practice
          </button>
        </div>
      )}

      {screen === "loading" && (
        <div style={style.home}>
          <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Creating your practiceâ¦</h2>
          <p style={style.p}>Shaping a 5-minute flow for you.</p>
        </div>
      )}

      {screen === "result" && plan && (
        <div>
          <div style={style.hero}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", marginBottom: "10px", color: "#B5C4A8" }}>{plan.type} Â· 5 MIN</div>
            <h1 style={style.h1}>{plan.title}</h1>
            <p style={{ color: "#C4BDB5", fontStyle: "italic", fontSize: "13px" }}>{plan.subtitle}</p>
          </div>
          <div style={style.screen}>
            {plan.science_note && <div style={style.sci}>{plan.science_note}</div>}
            {plan.steps && plan.steps.map((s, i) => {
              const active = activeTimer && activeTimer.stepIndex === i;
              const done = active && activeTimer.done;
              return (
                <div key={i} style={style.step}>
                  <div style={style.stepName}>{i + 1}. {s.name}</div>
                  <div style={style.stepDur}>{s.duration}</div>
                  <div style={style.stepTxt}>{s.instruction}</div>
                  <div>
                    {active && !done && <span style={{ marginRight: "10px", fontSize: "20px" }}>{fmt(activeTimer.remaining)}</span>}
                    {done && <span style={{ marginRight: "10px", color: "#C17F5A" }}>â Done</span>}
                    <button style={style.timerBtn} onClick={() => {
                      if (done) setActiveTimer(null);
                      else if (active) { clearInterval(intervalRef.current); setActiveTimer(null); }
                      else startTimer(i, s.seconds || 60);
                    }}>
                      {done ? "Next" : active ? "Stop" : "Start Timer"}
                    </button>
                  </div>
                </div>
              );
            })}
            {plan.affirmation && <div style={style.affirm}>"{plan.affirmation}"</div>}
            <button style={{ ...style.btn, width: "100%", padding: "16px" }} onClick={() => { setSelected([]); setPlan(null); setActiveTimer(null); setScreen("select"); }}>
              New Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
