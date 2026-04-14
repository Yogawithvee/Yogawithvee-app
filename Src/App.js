import { useState, useEffect, useRef } from "react";
const API_BASE = "https://d542ea31-6771-4dde-b6fb-561a441f6278-00-36r4x3ckrn51h.picard.replit.dev";
const SYMPTOMS = [
{ id: "fatigue", label: "Fatigue", icon: " ", desc: "Constant tiredness, low en
{ id: "anxiety", label: "Anxiety", icon: " ", desc: "Racing thoughts, overwhel
{ id: "poor_sleep", label: "Poor Sleep", icon: " ", desc: "Waking at night, restless
{ id: "brain_fog", label: "Brain Fog", icon: " ", desc: "Difficulty concentrating"
{ id: "hot_flushes", label: "Hot Flushes", icon: " ", desc: "Sudden heat, sweating" },
{ id: "joint_pain", label: "Joint Stiffness", icon: " ", desc: "Aches, reduced mobility"
{ id: "mood_swings", label: "Mood Shifts", icon: " ", desc: "Emotional waves, irritabi
{ id: "stress", label: "High Stress", icon: " ", desc: "Nervous system overwhelm"
];
const FALLBACK_PLANS = {
fatigue: {
title: "Gentle Restoration Flow",
subtitle: "A practice that works with your energy, not against it.",
type: "Movement + Breath",
focus: "Nervous system rest and energy recovery.",
science_note: "The British Menopause Society confirms that restorative yoga reduces fatig
steps: [
{ name: "Legs Up The Wall", duration: "2 minutes", seconds: 120, instruction: "Lie near
{ name: "Extended Exhale Breathing", duration: "2 minutes", seconds: 120, instruction:
{ name: "Body Scan Rest", duration: "1 minute", seconds: 60, instruction: "Starting at
],
affirmation: "Your body is not failing you. It is asking for something different — and yo
},
anxiety: {
title: "Nervous System Reset",
subtitle: "Calm is not something you find. It is something you return to.",
type: "Breathwork + Grounding",
focus: "Cortisol regulation and vagal activation.",
science_note: "Harvard Medical School research shows yoga significantly reduces cortisol
steps: [
{ name: "Box Breathing", duration: "2 minutes", seconds: 120, instruction: "Inhale 4 ·
{ name: "Child's Pose", duration: "2 minutes", seconds: 120, instruction: "Kneel { name: "Grounding Press", duration: "1 minute", seconds: 60, instruction: "Sit or lie
and fo
],
affirmation: "This feeling is temporary. Your nervous system knows how to return to calm
},
poor_sleep: {
title: "Before Bed Wind-Down",
subtitle: "Signal to your body that it is safe to rest.",
type: "Breathwork + Restorative",
focus: "Nervous system downregulation for deeper sleep.",
science_note: "NIH research confirms yoga nidra and extended exhale breathing improve sle
steps: [
{ name: "Supine Twist", duration: "90 seconds each side", seconds: 180, instruction: "L
{ name: "4-7-8 Breathing", duration: "2 minutes", seconds: 120, instruction: "Inhale fo
{ name: "Yoga Nidra Body Scan", duration: "1 minute", seconds: 60, instruction: "Eyes c
],
affirmation: "You have done enough today. Your body knows how to rest — let it.",
},
};
export default function App() {
const [screen, setScreen] = useState("home");
const [selected, setSelected] = useState([]);
const [plan, setPlan] = useState(null);
const [activeTimer, setActiveTimer] = useState(null);
const [installPrompt, setInstallPrompt] = useState(null);
const [showInstall, setShowInstall] = useState(false);
const intervalRef = useRef(null);
// PWA install prompt capture
useEffect(() => {
const handler = (e) => {
e.preventDefault();
setInstallPrompt(e);
setShowInstall(true);
};
window.addEventListener("beforeinstallprompt", handler);
return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);
const handleInstall = async () => {
if (!installPrompt) return;
installPrompt.prompt();
const { outcome } = await installPrompt.userChoice;
if (outcome === "accepted") setShowInstall(false);
};
const toggleSymptom = (id) =>
setSelected((prev) =>
prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : pr
);
const generatePlan = async () => {
setScreen("loading");
setPlan(null);
const symptomLabels = selected.map((id) => SYMPTOMS.find((s) => s.id === id)?.label);
try {
const res = await fetch(`${API_BASE}/api/generate-plan`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ symptoms: symptomLabels }),
});
if (!res.ok) throw new Error("Server error");
const data = await res.json();
setPlan(data.plan);
setScreen("result");
} catch {
const key = selected[0];
setPlan(FALLBACK_PLANS[key] || FALLBACK_PLANS.fatigue);
setScreen("result");
}
};
const startTimer = (stepIndex, seconds) => {
if (intervalRef.current) clearInterval(intervalRef.current);
setActiveTimer({ stepIndex, remaining: seconds, total: seconds, done: false });
intervalRef.current = setInterval(() => {
setActiveTimer((prev) => {
if (!prev || prev.remaining <= 1) {
clearInterval(intervalRef.current);
return prev ? { ...prev, remaining: 0, done: true } : null;
}
});
}, 1000);
return { ...prev, remaining: prev.remaining - 1 };
};
useEffect(() => () => clearInterval(intervalRef.current), []);
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
--sage:#7A8C6E; --sage-l:#B5C4A8; --sage-p:#EAF0E5;
--clay:#C17F5A; --clay-l:#E8C5A8; --clay-p:#FBF2EA;
--stone:#3D3830; --stone-m:#7C7267; --stone-l:#C4BDB5;
--cream:#FAF7F2; --white:#FFFFFF;
}
html { scroll-behavior: smooth; }
body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--stone); -we
/* PWA INSTALL BANNER */
.install-banner { position:fixed; bottom:0; left:0; right:0; background:var(--stone); pad
.install-text { font-size:13px; color:var(--cream); line-height:1.4; flex:1; }
.install-text strong { display:block; font-size:14px; margin-bottom:2px; }
.install-btn { background:var(--clay); color:var(--cream); border:none; padding:10px 20px
.install-dismiss { background:none; border:none; color:var(--stone-l); font-size:20px; cu
/* iOS INSTALL HINT */
.ios-hint { position:fixed; bottom:20px; left:16px; right:16px; background:var(--stone);
.ios-hint p { font-size:13px; color:var(--cream); line-height:1.6; }
.ios-hint strong { color:var(--clay-l); }
.ios-close { float:right; background:none; border:none; color:var(--stone-l); font-size:1
/* HOME */
.home { min-height:100dvh; background:var(--stone); display:flex; flex-direction:column;
.home::before { content:''; position:absolute; inset:0; background: radial-gradient(ellip
.orb { width:110px; height:110px; border-radius:50%; background:radial-gradient(circle at
@keyframes breathe { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.08);opa
.home-tag { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--sag
.home-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(40px,10vw,68px); font-
.home-h1 em { font-style:italic; color:var(--clay-l); }
.home-sub { font-size:13px; font-weight:300; color:var(--stone-l); margin-bottom:44px; ma
/* BUTTONS */
.btn { display:inline-block; border:none; cursor:pointer; font-family:'DM Sans',sans-seri
.btn-primary { background:var(--clay); color:var(--cream); padding:16px 40px; font-size:1
.btn-primary:active { background:#A86B47; transform:scale(0.98); }
.btn-primary:disabled { background:var(--stone-m); cursor:not-allowed; transform:none; }
.btn-ghost { background:transparent; color:var(--stone-m); border:1px solid rgba(61,56,48
.btn-ghost:active { border-color:var(--sage); color:var(--sage); }
.btn-timer { background:var(--sage); color:#fff; padding:9px 18px; font-size:10px; .btn-timer.done { background:var(--clay); }
letter
/* SELECT */
.screen { min-height:100dvh; background:var(--cream); padding:36px 20px 100px; max-width:
.nav-row { display:flex; justify-content:space-between; align-items:center; margin-bottom
.back-btn { background:none; border:none; font-size:12px; color:var(--stone-m); cursor:po
.logo { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--stone); }
.logo em { font-style:italic; color:var(--sage); }
.screen-tag { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--s
.screen-h2 { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:400; col
.screen-h2 em { font-style:italic; color:var(--clay); }
.screen-sub { font-size:13px; color:var(--stone-m); line-height:1.65; margin-bottom:24px;
.grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
.sym-card { background:var(--white); border:1.5px solid rgba(61,56,48,.1); border-radius:
.sym-card:active { transform:scale(0.97); }
.sym-card.on { border-color:var(--sage); background:var(--sage-p); }
.sym-icon { font-size:22px; margin-bottom:8px; }
.sym-label { font-size:13px; font-weight:500; color:var(--stone); margin-bottom:3px; }
.sym-desc { font-size:11px; color:var(--stone-m); line-height:1.5; }
.sym-check { position:absolute; top:12px; right:12px; width:18px; height:18px; border-rad
.tags { display:flex; flex-wrap:wrap; gap:8px; min-height:28px; margin-bottom:14px; }
.tag { background:var(--sage-p); border:1px solid var(--sage-l); color:var(--sage); font-
.count { font-size:12px; color:var(--stone-m); text-align:center; margin-bottom:20px; }
/* LOADING */
.loading { min-height:100dvh; background:var(--stone); display:flex; flex-direction:colum
.dots { display:flex; gap:14px; margin-bottom:36px; }
.dot { width:10px; height:10px; border-radius:50%; background:var(--sage-l); animation:pu
.dot:nth-child(2) { animation-delay:.2s; background:var(--clay-l); }
.dot:nth-child(3) { animation-delay:.4s; }
@keyframes pulse { 0%,100%{transform:scale(.6);opacity:.4} 50%{transform:scale(1);opacity
.loading-h { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; col
.loading-s { font-size:13px; color:var(--stone-l); line-height:1.7; max-width:260px; }
.loading-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top
.loading-tag { background:rgba(181,196,168,.12); border:1px solid rgba(181,196,168,.25);
/* RESULT */
.result-hero { background:var(--stone); padding:44px 24px 36px; text-align:center; positi
.result-hero::before { content:''; position:absolute; inset:0; background:radial-gradient
.r-type { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--sage-
.r-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,7vw,48px); font-w
.r-sub { font-size:13px; color:var(--stone-l); line-height:1.7; max-width:320px; margin:0
.r-meta { display:flex; gap:28px; justify-content:center; position:relative; }
.r-meta-v { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; colo
.r-meta-k { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--ston
.r-body { max-width:600px; margin:0 auto; padding:0 20px 80px; }
.sci { background:var(--sage-p); border-left:3px solid var(--sage); padding:13px 16px; ma
.steps-lbl { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--st
.steps-lbl::after { content:''; flex:1; height:1px; background:var(--stone-l); opacity:.2
.step-card { background:var(--white); border:1px solid rgba(61,56,48,.08); border-radius:
.step-card.active { border-color:var(--sage); background:var(--sage-p); }
.step-top { display:flex; align-items:flex-start; margin-bottom:8px; }
.step-n { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; color:
.step-nm { font-size:14px; font-weight:500; color:var(--stone); margin-bottom:2px; }
.step-dur { font-size:11px; color:var(--sage); letter-spacing:1px; text-transform:upperca
.step-txt { font-size:13px; color:var(--stone-m); line-height:1.7; margin-bottom:8px; }
.step-br { background:rgba(122,140,110,.12); padding:7px 12px; border-radius:2px; font-si
.timer-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.timer-disp { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; co
.bar-wrap { background:rgba(61,56,48,.08); border-radius:100px; height:3px; overflow:hidd
.bar { height:100%; background:var(--sage); border-radius:100px; transition:width 1s line
.affirm { background:var(--stone); padding:32px 24px; margin:28px 0; border-radius:2px; t
.affirm::before { content:'"'; font-family:'Cormorant Garamond',serif; font-size:110px; c
.affirm p { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:300; colo
.affirm-auth { font-size:10px; letter-spacing:2px; color:var(--sage-l); margin-top:14px;
.actions { display:flex; gap:10px; margin-top:4px; }
.actions .btn-primary, .actions .btn-ghost { flex:1; text-align:center; display:block; pa
@media (max-width:360px) {
.grid { grid-template-columns: 1fr 1fr; }
.home-h1 { font-size:36px; }
}
`;
// iOS detection for custom install hint
const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isInStandalone = window.matchMedia("(display-mode: standalone)").matches;
const [showIosHint, setShowIosHint] = useState(false);
useEffect(() => {
if (isIos && !isInStandalone) {
const timer = setTimeout(() => setShowIosHint(true), 3000);
return () => clearTimeout(timer);
}
}, []);
return (
<>
<style>{css}</style>
{/* Android install banner */}
{showInstall && !isInStandalone && (
<div className="install-banner">
<div className="install-text">
<strong>Add to Home Screen</strong>
Install for quick access — no App Store needed
</div>
<button className="install-btn" onClick={handleInstall}>Install</button>
<button className="install-dismiss" onClick={() => setShowInstall(false)}>×</button
</div>
)}
{/* iOS install hint */}
{showIosHint && !isInStandalone && (
<div className="ios-hint">
<button className="ios-close" onClick={() => setShowIosHint(false)}>×</button>
<p>
To install: tap the <strong>Share button ↑</strong> at the bottom of your browser
</p>
</div>
)}
{/* HOME */}
{screen === "home" && (
<div className="home">
<div className="orb" />
<div className="home-tag">@_yogawithv_</div>
<h1 className="home-h1">How are you<br /><em>feeling today?</em></h1>
<p className="home-sub">Select your symptoms. Receive a personalised 5-minute yoga
<button className="btn btn-primary" onClick={() => setScreen("select")}>Begin</butt
</div>
)}
{/* SELECT */}
{screen === "select" && (
<div className="screen">
<div className="nav-row">
<button className="back-btn" onClick={() => setScreen("home")}>← Back</button>
<div className="logo"><em>yoga</em>withv</div>
</div>
<div className="screen-tag">Your Practice</div>
<h2 className="screen-h2">What's your body<br /><em>telling you right now?</em></h2
<p className="screen-sub">Choose up to 4 symptoms. Your practice will be shaped aro
<div className="grid">
{SYMPTOMS.map((s) => (
<div key={s.id} className={`sym-card ${selected.includes(s.id) ? "on" : ""}`} o
{selected.includes(s.id) && <div className="sym-check">✓</div>}
<div className="sym-icon">{s.icon}</div>
<div className="sym-label">{s.label}</div>
<div className="sym-desc">{s.desc}</div>
</div>
))}
</div>
<div className="tags">
{selected.map((id) => <span key={id} className="tag">{SYMPTOMS.find((s) => </div>
<p className="count">{selected.length}/4 symptoms selected</p>
<button className="btn btn-primary" style={{ width: "100%", padding: "18px" }} disa
Create My Practice →
</button>
</div>
s.id =
)}
{/* LOADING */}
{screen === "loading" && (
<div className="loading">
<div className="dots">
<div className="dot" /><div className="dot" /><div className="dot" />
</div>
<h2 className="loading-h">Creating your practice…</h2>
<p className="loading-s">Shaping a 5-minute flow around exactly how you're feeling
<div className="loading-tags">
{selected.map((id) => <span key={id} className="loading-tag">{SYMPTOMS.find((s) =
</div>
</div>
)}
{/* RESULT */}
{screen === "result" && plan && (
<div>
<div className="result-hero">
<div className="r-type">{plan.type} · 5 Minutes</div>
<h1 className="r-title">{plan.title}</h1>
<p className="r-sub">{plan.subtitle}</p>
<div className="r-meta">
<div><span className="r-meta-v">{plan.steps?.length}</span><span className="r-m
<div><span className="r-meta-v">5</span><span className="r-meta-k">Minutes</spa
<div><span className="r-meta-v">{selected.length}</span><span className="r-meta
</div>
</div>
<div className="r-body">
{plan.science_note && <div className="sci"> {plan.science_note}</div>}
<div className="steps-lbl">Your Practice</div>
{plan.steps?.map((step, i) => {
const isActive = activeTimer?.stepIndex === i;
const isDone = isActive && activeTimer.done;
const progress = isActive ? (activeTimer.remaining / activeTimer.total) * 100 :
return (
<div key={i} className={`step-card ${isActive ? "active" : ""}`}>
<div className="step-top">
<div className="step-n">{String(i + 1).padStart(2, "0")}</div>
<div>
<div className="step-nm">{step.name}</div>
<div className="step-dur">{step.duration}</div>
</div>
</div>
<div className="step-txt">{step.instruction}</div>
{step.breath && <div className="step-br"> {step.breath}</div>}
<div className="timer-row">
{isActive && !isDone && <span className="timer-disp">{fmt(activeTimer.rem
{isDone && <span className="timer-disp" style={{ color: "var(--clay)" }}>
<button
className={`btn btn-timer ${isDone ? "done" : ""}`}
onClick={() => {
if (isDone) setActiveTimer(null);
else if (isActive) { clearInterval(intervalRef.current); setActiveTim
else startTimer(i, step.seconds || 60);
}}
>
{isDone ? "Next →" : isActive ? "Stop" : "Start Timer"}
</button>
</div>
{isActive && !isDone && (
<div className="bar-wrap">
<div className="bar" style={{ width: `${progress}%` }} />
</div>
)}
</div>
);
})}
{plan.affirmation && (
<div className="affirm">
<p>{plan.affirmation}</p>
<div className="affirm-auth">— V · @_yogawithv_</div>
</div>
)}
<div className="actions">
<button className="btn btn-primary" onClick={() => { setSelected([]); setPlan(n
New Practice
</button>
<button className="btn btn-ghost" onClick={() => { setSelected([]); setPlan(nul
Home
</button>
</div>
</div>
</div>
)}
</>
);
}
