/* Unit 6 lesson app — student self-study + teacher mode. Vanilla JS, no build step. */
(function () {
"use strict";
const U = window.UNIT, CFG = window.M3_CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ICON = k => `../assets/icons/${k}.png`;

const SKILLS = [
  { k: "vocab", name: "Vocabulary", th: "คำศัพท์", icon: "az", c: "var(--c-vocab)" },
  { k: "listening", name: "Listening", th: "การฟัง", icon: "headphones2", c: "var(--c-listening)" },
  { k: "reading", name: "Reading", th: "การอ่าน", icon: "openbook", c: "var(--c-reading)" },
  { k: "grammar", name: "Grammar", th: "ไวยากรณ์", icon: "books", c: "var(--c-grammar)" },
  { k: "speaking", name: "Speaking", th: "การพูด", icon: "mic", c: "var(--c-speaking)" },
  { k: "writing", name: "Writing", th: "การเขียน", icon: "notepad", c: "var(--c-writing)" }
];
const SK = Object.fromEntries(SKILLS.map(s => [s.k, s]));

/* ---------------- storage ---------------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let me = LS.get("m3:me", null);
const pkey = () => `m3:${U.id}:${me ? [me.name, me.cls, me.no].join("|") : "guest"}`;
let P = null;
function loadP() { P = Object.assign({ steps: {}, quiz: {}, post: null, writing: null, unitSent: false }, LS.get(pkey(), {})); }
function saveP() { LS.set(pkey(), P); }
function markStep(skill, step) { P.steps[skill] = P.steps[skill] || {}; if (!P.steps[skill][step]) { P.steps[skill][step] = true; saveP(); } }

/* ---------------- toast ---------------- */
function toast(t, ms = 2600) {
  let d = $(".toast"); if (!d) { d = document.createElement("div"); d.className = "toast"; document.body.appendChild(d); }
  d.textContent = t; d.style.display = "block"; clearTimeout(d._t); d._t = setTimeout(() => d.style.display = "none", ms);
}

/* ---------------- sending results ---------------- */
function queue() { return LS.get("m3:queue", []); }
async function postRow(row) {
  if (!CFG.supabaseUrl) throw new Error("no config");
  const r = await fetch(`${CFG.supabaseUrl}/rest/v1/${CFG.table}`, {
    method: "POST", keepalive: true,
    headers: { apikey: CFG.supabaseKey, Authorization: `Bearer ${CFG.supabaseKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
async function send(row) {
  row = Object.assign({ unit: U.id, student_name: me.name, class: me.cls, student_no: me.no }, row);
  try { await postRow(row); return true; }
  catch (e) { const q = queue(); q.push(row); LS.set("m3:queue", q.slice(-50)); return false; }
}
async function flushQueue() {
  const q = queue(); if (!q.length) return; const left = [];
  for (const row of q) { try { await postRow(row); } catch (e) { left.push(row); } }
  LS.set("m3:queue", left);
}

/* ---------------- speech: text-to-speech ---------------- */
let VOICES = [];
function loadVoices() { try { VOICES = speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang)); } catch (e) { VOICES = []; } }
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function voice(i) {
  if (!VOICES.length) return null;
  const pref = VOICES.filter(v => /en-(US|GB)/i.test(v.lang));
  const list = pref.length ? pref : VOICES;
  return list[i % list.length];
}
function say(text, o = {}) {
  return new Promise(res => {
    if (!("speechSynthesis" in window)) { toast("อุปกรณ์นี้ไม่รองรับเสียงอ่าน"); return res(); }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ""));
      u.lang = "en-US"; u.rate = o.rate || 0.9; u.pitch = o.pitch || 1;
      const v = voice(o.voice || 0); if (v) u.voice = v;
      u.onend = res; u.onerror = res;
      speechSynthesis.speak(u);
    } catch (e) { res(); }
  });
}
function stopSay() { try { speechSynthesis.cancel(); } catch (e) {} }

/* ---------------- speech: recognition (needs mic, https) ---------------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listen() {
  return new Promise((res, rej) => {
    if (!SR) return rej("unsupported");
    stopSay();
    const r = new SR(); r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 3; r.continuous = false;
    let done = false;
    r.onresult = e => { done = true; res(Array.from(e.results[0]).map(a => a.transcript)); };
    r.onerror = e => { done = true; rej(e.error || "error"); };
    r.onend = () => { if (!done) rej("no-speech"); };
    try { r.start(); } catch (e) { rej("start"); }
    setTimeout(() => { try { r.stop(); } catch (e) {} }, 9000);
  });
}
const SR_MSG = {
  unsupported: "เบราว์เซอร์นี้ตรวจการพูดไม่ได้ ใช้ Chrome หรือ Edge (Android/คอมพิวเตอร์) หรือ Safari บน iPhone",
  "not-allowed": "ยังไม่ได้อนุญาตไมโครโฟน กดรูปกุญแจที่แถบที่อยู่ แล้วอนุญาต Microphone",
  "no-speech": "ไม่ได้ยินเสียง ลองพูดดังขึ้นอีกนิด", "audio-capture": "ไม่พบไมโครโฟน", network: "ต้องต่ออินเทอร์เน็ตเพื่อตรวจการพูด"
};
function norm(s) {
  return String(s).toLowerCase().replace(/[’`]/g, "'").replace(/n't\b/g, " not").replace(/'ve\b/g, " have").replace(/'m\b/g, " am")
    .replace(/'re\b/g, " are").replace(/'d\b/g, " would").replace(/'s\b/g, "s").replace(/travelled/g, "traveled")
    .replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
}
function similarity(target, heard) {
  const a = norm(target).split(" "), b = norm(heard).split(" ");
  const m = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = a[i - 1] === b[j - 1] ? m[i - 1][j - 1] + 1 : Math.max(m[i - 1][j], m[i][j - 1]);
  return m[a.length][b.length] / a.length;
}
/* Mic button helper: returns {best, alts} or null */
async function micTry(btn, target, outEl, pass = 0.7) {
  btn.classList.add("rec"); const old = btn.innerHTML; btn.innerHTML = "🔴 กำลังฟัง… พูดเลย";
  try {
    const alts = await listen();
    const best = alts.map(t => ({ t, s: similarity(target, t) })).sort((x, y) => y.s - x.s)[0];
    const ok = best.s >= pass;
    if (outEl) { outEl.className = "heard " + (ok ? "ok" : "bad"); outEl.innerHTML = `ได้ยินว่า: “${esc(best.t)}” · ตรง ${Math.round(best.s * 100)}% ${ok ? "✅ เยี่ยม!" : "🔁 ลองอีกครั้ง ฟังตัวอย่างก่อนก็ได้"}`; }
    return Object.assign(best, { ok, alts });
  } catch (e) {
    if (outEl) { outEl.className = "heard bad"; outEl.textContent = window.M3_PREVIEW ? "หน้าตัวอย่างนี้ใช้ไมโครโฟนไม่ได้ เปิดลิงก์ GitHub Pages เพื่อฝึกพูดจริง" : (SR_MSG[e] || "ตรวจเสียงไม่ได้ ลองใหม่อีกครั้ง"); }
    return null;
  } finally { btn.classList.remove("rec"); btn.innerHTML = old; }
}

/* ---------------- scoring ---------------- */
function quizPct(k) { const q = P.quiz[k]; return q && q.first ? q.first.s / q.first.m : null; }
function unitScore() {
  let total = 0, done = 0;
  for (const s of SKILLS) { const p = quizPct(s.k); if (p != null) { total += p * U.points[s.k]; done++; } }
  return { total: Math.round(total * 100) / 100, done };
}
function recordQuiz(k, s, m, detail) {
  const q = P.quiz[k] = P.quiz[k] || {};
  const first = !q.first;
  if (first) q.first = { s, m, at: Date.now() };
  if (!q.best || s / m > q.best.s / q.best.m) q.best = { s, m };
  q.tries = (q.tries || 0) + 1; saveP();
  send({ kind: "quiz", skill: k, score: s, max_score: m, detail: Object.assign({ attempt: q.tries, counted: first }, detail || {}) });
  const us = unitScore();
  if (us.done === SKILLS.length && !P.unitSent) {
    P.unitSent = true; saveP();
    send({ kind: "unit", skill: "all", score: us.total, max_score: 10, detail: Object.fromEntries(SKILLS.map(x => [x.k, P.quiz[x.k].first])) });
  }
  return first;
}

/* ================= QUIZ ENGINE ================= */
/* items: {q, o, a, why, pic, audio, text, type:"text", ans}  opts: {title, onDone(score,max,log), practice, two} */
function quiz(el, items, opts = {}) {
  let i = 0, score = 0; const log = [];
  const order = items.map(it => it.o ? shuffle(it.o.map((t, k) => ({ t, k }))) : null);
  function render() {
    const it = items[i];
    el.innerHTML = `<div class="card qcard">
      <div class="row" style="justify-content:space-between"><span class="qn">${opts.title ? esc(opts.title) + " · " : ""}ข้อ ${i + 1} / ${items.length}</span>
        <span class="dots">${items.map((_, k) => `<i class="${log[k] ? (log[k].ok ? "r" : "w") : ""} ${k === i ? "c" : ""}"></i>`).join("")}</span></div>
      ${it.pic ? `<div class="qpic">${it.pic}</div>` : ""}
      ${it.audio ? `<div class="row" style="margin:8px 0"><button class="btn s p" data-a="play">🔊 ฟัง</button><button class="btn s" data-a="slow">🐢 ฟังช้า</button></div>` : ""}
      ${it.text ? `<div class="tip" style="background:#f4f0ff;border-color:#d9cdf7">${esc(it.text)}</div>` : ""}
      <div class="qt">${it.q}</div>
      ${it.type === "text"
        ? `<input class="inp" id="qin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="พิมพ์คำตอบ"><div class="row" style="margin-top:10px"><button class="btn p" data-a="check">ตรวจคำตอบ</button></div>`
        : `<div class="opts ${opts.two || it.o.length === 2 ? "two" : ""}">${order[i].map((x, k) => `<button class="opt" data-k="${x.k}">${String.fromCharCode(65 + k)}. ${esc(x.t)}</button>`).join("")}</div>`}
      <div id="fb"></div>
      <div class="qnav"><span></span><button class="btn p hide" data-a="next">${i === items.length - 1 ? "ดูผล" : "ข้อต่อไป →"}</button></div>
    </div>`;
    if (it.audio) setTimeout(() => say(it.audio), 250);
    el.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "play") say(it.audio);
      else if (b.dataset.a === "slow") say(it.audio, { rate: 0.6 });
      else if (b.dataset.a === "check") { const v = $("#qin", el).value; if (!v.trim()) return toast("พิมพ์คำตอบก่อน"); answer(it.ans.map(norm).includes(norm(v)), v); }
      else if (b.dataset.a === "next") { i++; if (i < items.length) render(); else finish(); }
      else if (b.dataset.k !== undefined && !b.disabled) {
        const k = +b.dataset.k; $$(".opt", el).forEach(x => { x.disabled = true; if (+x.dataset.k === it.a) x.classList.add("right"); });
        if (k !== it.a) b.classList.add("wrong");
        answer(k === it.a, it.o[k]);
      }
    };
    const inp = $("#qin", el); if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === "Enter") $('[data-a="check"]', el).click(); }; }
  }
  function answer(ok, given) {
    const it = items[i]; if (log[i]) return;
    log[i] = { ok, given, skill: it.skill }; if (ok) score++;
    const right = it.type === "text" ? it.ans[0] : it.o[it.a];
    $("#fb", el).innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ ถูกต้อง!" : `❌ คำตอบที่ถูก: <b>${esc(right)}</b>`}${it.why ? `<br>${esc(it.why)}` : ""}</div>`;
    const ck = $('[data-a="check"]', el); if (ck) ck.disabled = true;
    const n = $('[data-a="next"]', el); n.classList.remove("hide"); n.focus();
    $$(".dots i", el)[i].className = ok ? "r c" : "w c";
  }
  function finish() { stopSay(); opts.onDone && opts.onDone(score, items.length, log); }
  render();
}

/* ---------------- result card after a scored quiz ---------------- */
function quizResult(el, k, s, m, counted, again) {
  const pts = U.points[k] * s / m;
  el.innerHTML = `<div class="card result">
    <img src="${ICON(SK[k].icon)}" alt="" style="width:110px;height:86px;object-fit:contain">
    <h3>ข้อสอบย่อย ${SK[k].name} (${SK[k].th})</h3>
    <div class="big">${s} / ${m}</div>
    <p>${counted ? `บันทึกเป็นคะแนนเก็บ <b>${pts.toFixed(2)} / ${U.points[k]}</b> คะแนน และส่งให้ครูแล้ว` : `เป็นการทำซ้ำเพื่อฝึก · คะแนนเก็บยังใช้ครั้งแรก (${P.quiz[k].first.s}/${P.quiz[k].first.m})`}</p>
    <p class="muted">${s / m >= 0.7 ? "🎉 ผ่านเกณฑ์ 70%" : "ยังไม่ถึง 70% ทบทวนขั้นก่อนหน้าแล้วลองทำใหม่ได้"}</p>
    <div class="row" style="justify-content:center"><button class="btn" id="again">ทำอีกครั้ง (ฝึก)</button><a class="btn p" href="#map">กลับแผนที่บทเรียน</a></div></div>`;
  $("#again", el).onclick = again;
}
function runSkillQuiz(el, k, items, extra) {
  quiz(el, items, { title: "ข้อสอบย่อย", onDone: (s, m, log) => {
    const counted = recordQuiz(k, s, m, { wrong: log.map((x, n) => x.ok ? null : n + 1).filter(Boolean) });
    markStep(k, "quiz");
    quizResult(el, k, s, m, counted, () => runSkillQuiz(el, k, items, extra));
  } });
}

/* ================= VIEWS ================= */
function show(id) { $$(".view").forEach(v => v.classList.toggle("on", v.id === "v-" + id)); window.scrollTo(0, 0); }
function whoLine() { $("#who").innerHTML = me ? `${esc(me.name)}<br>${esc(me.cls)} เลขที่ ${esc(me.no)}` : ""; }

/* ---------- start ---------- */
function viewStart() {
  const v = $("#v-start");
  v.innerHTML = `<div class="hero"><img src="${ICON("u6")}" alt=""><div>
      <p class="pill">Get Involved! ม.3 · Unit 6</p><h1>Experience</h1>
      <p class="q"><span class="wdyt">WDYT?</span>${esc(U.wdyt)}</p></div></div>
    <div class="card" style="max-width:560px">
      <h3>ลงชื่อเข้าเรียน</h3><p class="muted" style="margin-top:4px">ใช้ชื่อจริงเพื่อให้ครูได้รับคะแนน ข้อมูลความคืบหน้าเก็บไว้ในเครื่องนี้</p>
      <form id="f" class="opts" style="margin-top:10px">
        <input class="inp" name="name" placeholder="ชื่อ–นามสกุล" maxlength="80" required value="${me ? esc(me.name) : ""}">
        <div class="row"><input class="inp" name="cls" placeholder="ห้อง เช่น ม.3/1" maxlength="20" required style="flex:1" value="${me ? esc(me.cls) : ""}">
        <input class="inp" name="no" placeholder="เลขที่" maxlength="10" required inputmode="numeric" style="width:120px" value="${me ? esc(me.no) : ""}"></div>
        <button class="btn p" type="submit">เริ่มเรียน →</button>
      </form>
    </div>`;
  $("#f").onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target);
    me = { name: f.get("name").trim(), cls: f.get("cls").trim(), no: f.get("no").trim() };
    if (!me.name || !me.cls || !me.no) return toast("กรอกให้ครบ");
    LS.set("m3:me", me); loadP(); whoLine(); location.hash = "#map";
  };
  show("start");
}

/* ---------- map ---------- */
const STATION_STEPS = {
  vocab: [["see", "ดูรูป ฟัง พูดตาม"], ["hear", "ฟังแล้วเลือก 2 ตัวเลือก"], ["learn", "ดูรูป + คำ พูดตาม"], ["review", "ทบทวน 70%"], ["context", "ศัพท์ในประโยค"], ["quiz", "ข้อสอบย่อย"]],
  listening: [["practice", "ฝึกฟัง"], ["quiz", "ข้อสอบย่อย"]],
  reading: [["read", "อ่าน"], ["own", "ตอบด้วยคำของเรา"], ["quiz", "ข้อสอบย่อย"]],
  grammar: [["discover", "ค้นพบกฎ"], ["mistakes", "จุดที่ผิดบ่อย"], ["build", "แต่งประโยค 4 ระดับ"], ["quiz", "ข้อสอบย่อย"]],
  speaking: [["model", "พูดตามบทสนทนา"], ["phrases", "สำนวนสำคัญ"], ["quiz", "ข้อสอบย่อย"]],
  writing: [["discover", "who / where / which"], ["model", "ตัวอย่างโปสการ์ด"], ["write", "เขียนโปสการ์ด"], ["quiz", "ข้อสอบย่อย"]]
};
function stepsDone(k) { const s = P.steps[k] || {}; return STATION_STEPS[k].filter(x => s[x[0]]).length; }
function viewMap() {
  const us = unitScore();
  const v = $("#v-map");
  v.innerHTML = `<div class="hero"><img src="${ICON("u6")}" alt=""><div style="flex:1">
      <p class="pill">Unit 6 · ${esc(U.th)}</p><h1>Experience</h1>
      <p class="q"><span class="wdyt">WDYT?</span>${esc(U.wdyt)}</p>
      <div class="score-strip"><span class="big-score">${us.total.toFixed(2)}</span><span>/ 10 คะแนนเก็บ<br><small class="muted">ข้อสอบย่อยทำแล้ว ${us.done}/6 ทักษะ</small></span>
      <a class="btn s" href="#summary">📊 สรุปผลของฉัน</a></div></div></div>
    <details class="card" style="margin-bottom:14px"><summary style="cursor:pointer;font:600 18px Kanit">🎯 จุดประสงค์ และวิธีเรียน</summary>
      <ol>${U.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ol>
      <p class="muted">เรียนทีละสถานี ทุกสถานีจบด้วยข้อสอบย่อย 8 ข้อ (นับคะแนนครั้งแรก ทำซ้ำเพื่อฝึกได้) · คะแนนเก็บ: ศัพท์ 2 · ฟัง 2 · อ่าน 1 · ไวยากรณ์ 2 · พูด 1.5 · เขียน 1.5 = 10 · ปิดท้ายด้วยข้อสอบหลังเรียน 20 ข้อ เพื่อดูว่าควรพัฒนาทักษะใด</p></details>
    <div class="stations">
      ${SKILLS.map((s, n) => { const d = stepsDone(s.k), t = STATION_STEPS[s.k].length, q = P.quiz[s.k];
        return `<a class="st ${q && q.first ? "done" : ""}" style="--c:${s.c};text-decoration:none" href="#${s.k}"><span class="n">${n + 1}</span>
        <img src="${ICON(s.icon)}" alt=""><b>${s.name}</b><small>${s.th} · ${U.points[s.k]} คะแนน</small>
        <div class="bar"><i style="width:${d / t * 100}%"></i></div>
        <span class="stat">${q && q.first ? `ข้อสอบย่อย ${q.first.s}/${q.first.m}` : `${d}/${t} ขั้น`}</span></a>`; }).join("")}
      <a class="st ${P.post ? "done" : ""}" style="--c:var(--c-posttest);text-decoration:none" href="#posttest"><span class="n">7</span>
        <img src="${ICON("trophy")}" alt=""><b>Post-test</b><small>ข้อสอบหลังเรียน 20 ข้อ · วิเคราะห์จุดที่ต้องพัฒนา</small>
        <span class="stat">${P.post ? `ทำแล้ว ${P.post.s}/20` : "ยังไม่ได้ทำ"}</span></a>
      <a class="st" style="--c:var(--rose);text-decoration:none" href="#slides"><span class="n">📽️</span>
        <img src="${ICON("u6")}" alt=""><b>สไลด์บทเรียน</b><small>เปิดดูสไลด์ทุกหน้า เลือกหน้าได้ และกดดูเฉลยแบบฝึกเพื่อทบทวนเอง</small>
        <span class="stat">${(window.SLIDES || []).length} หน้า</span></a>
    </div>`;
  show("map");
}

/* ---------- station shell ---------- */
function station(k, stepKey) {
  const s = SK[k], steps = STATION_STEPS[k];
  const cur = steps.find(x => x[0] === stepKey) ? stepKey : steps[0][0];
  const v = $("#v-station");
  v.style.setProperty("--c", s.c);
  v.innerHTML = `<div class="sh"><img src="${ICON(s.icon)}" alt=""><div><span class="k">สถานี ${SKILLS.indexOf(s) + 1} · ${U.points[k]} คะแนน</span><h2>${s.name} · ${s.th}</h2></div></div>
    <div class="steps">${steps.map(([sk, t], n) => `<button data-s="${sk}" class="${sk === cur ? "on" : ""} ${(P.steps[k] || {})[sk] ? "ok" : ""}">${n + 1}. ${t}</button>`).join("")}</div>
    <div id="body"></div>
    <div class="qnav" id="snav"></div>`;
  $(".steps", v).onclick = e => { const b = e.target.closest("button"); if (b) { stopSay(); station(k, b.dataset.s); } };
  const idx = steps.findIndex(x => x[0] === cur);
  const nav = $("#snav", v);
  nav.innerHTML = `${idx > 0 ? `<button class="btn" data-go="${steps[idx - 1][0]}">← ${steps[idx - 1][1]}</button>` : `<a class="btn" href="#map">← แผนที่บทเรียน</a>`}
    ${idx < steps.length - 1 ? `<button class="btn p" data-go="${steps[idx + 1][0]}">${steps[idx + 1][1]} →</button>` : `<a class="btn p" href="#map">กลับแผนที่ →</a>`}`;
  nav.onclick = e => { const b = e.target.closest("[data-go]"); if (b) { stopSay(); markStep(k, cur === "quiz" ? "_" : cur); station(k, b.dataset.go); } };
  show("station");
  STATIONS[k][cur]($("#body", v), k);
}

/* ================= STATIONS ================= */
const STATIONS = {};

/* ---------- VOCABULARY ---------- */
function vSetBar(el, onChange) {
  const cur = LS.get(pkey() + ":vset", U.vocabSets[0].k);
  const bar = document.createElement("div"); bar.className = "steps"; bar.style.marginBottom = "4px";
  bar.innerHTML = U.vocabSets.map(x => `<button data-v="${x.k}" class="${x.k === cur ? "on" : ""}">${esc(x.name)} · ${esc(x.th)} (${U.vocab.filter(w => w.set === x.k).length})</button>`).join("");
  bar.onclick = e => { const b = e.target.closest("button"); if (b) { LS.set(pkey() + ":vset", b.dataset.v); onChange(); } };
  el.appendChild(bar);
  return U.vocab.filter(w => w.set === cur);
}
function vSetNext(k, step) {
  const cur = LS.get(pkey() + ":vset", U.vocabSets[0].k), i = U.vocabSets.findIndex(x => x.k === cur);
  const done = LS.get(pkey() + ":vdone:" + step, []); if (!done.includes(cur)) done.push(cur); LS.set(pkey() + ":vdone:" + step, done);
  if (done.length >= U.vocabSets.length) markStep(k, step);
  return i < U.vocabSets.length - 1 ? U.vocabSets[i + 1] : null;
}
STATIONS.vocab = {
  see(el, k) {
    el.innerHTML = ""; const words = vSetBar(el, () => STATIONS.vocab.see(el, k));
    const box = document.createElement("div"); el.appendChild(box); let i = 0;
    const render = () => {
      const w = words[i]; let shown = false;
      box.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="counter">ภาพที่ ${i + 1} / ${words.length}</span>
        <span class="muted" style="font-size:15px">ดูรูป → ฟังเสียง → พูดตาม (ยังไม่เห็นคำ)</span></div>
        <div class="fc" style="margin-top:10px"><div class="pic">${w.pic}</div><div>
          <div class="w" id="ww" style="color:#d9c3cb">? ? ?</div><div class="th" id="wt">&nbsp;</div>
          <div class="row" style="margin:12px 0"><button class="btn p" id="pl">🔊 ฟัง</button><button class="btn" id="sl">🐢 ช้า</button><button class="btn g mic" id="mc">🎤 พูดตาม</button><button class="btn" id="rv">👁 ดูคำ</button></div>
          <div id="hd"></div></div></div>
        <div class="qnav"><button class="btn" id="pv" ${i === 0 ? "disabled" : ""}>← ก่อนหน้า</button><button class="btn p" id="nx">${i === words.length - 1 ? "จบชุดนี้ →" : "ภาพต่อไป →"}</button></div></div>`;
      const reveal = () => { if (shown) return; shown = true; $("#ww", box).textContent = w.w; $("#ww", box).style.color = ""; $("#wt", box).textContent = w.th; };
      setTimeout(() => say(w.w), 200);
      $("#pl", box).onclick = () => say(w.w); $("#sl", box).onclick = () => say(w.w, { rate: 0.55 });
      $("#rv", box).onclick = reveal;
      $("#mc", box).onclick = async e => { const r = await micTry(e.currentTarget, w.w, $("#hd", box), 0.66); if (r) reveal(); };
      $("#pv", box).onclick = () => { i--; render(); };
      $("#nx", box).onclick = () => { if (i < words.length - 1) { i++; render(); } else {
        const nx = vSetNext(k, "see");
        box.innerHTML = `<div class="card result"><h3>จบชุดนี้แล้ว 🎉</h3><p>${nx ? `ต่อด้วยชุด ${esc(nx.name)} หรือไปฝึกฟังแล้วเลือกคำ` : "ครบทุกชุดแล้ว"}</p>
          <div class="row" style="justify-content:center">${nx ? `<button class="btn" id="ns">ชุดต่อไป: ${esc(nx.name)}</button>` : ""}<button class="btn p" id="go">ฟังแล้วเลือก 2 ตัวเลือก →</button></div></div>`;
        const ns = $("#ns", box); if (ns) ns.onclick = () => { LS.set(pkey() + ":vset", nx.k); STATIONS.vocab.see(el, k); };
        $("#go", box).onclick = () => station(k, "hear");
      } };
    };
    render();
  },
  hear(el, k) {
    el.innerHTML = ""; const words = vSetBar(el, () => STATIONS.vocab.hear(el, k));
    const box = document.createElement("div"); el.appendChild(box);
    const items = shuffle(words).map(w => {
      const pool = words.length > 1 ? words : U.vocab;
      const other = shuffle(pool.filter(x => x !== w))[0]; const o = shuffle([w.w, other.w]);
      return { audio: w.w, q: "🎧 ฟังเสียง แล้วเลือกคำที่ได้ยิน", o, a: o.indexOf(w.w), why: `${w.pic}  ${w.w} = ${w.th}` };
    });
    quiz(box, items, { title: "ฟังแล้วเลือก", two: true, onDone: (s, m) => {
      const nx = vSetNext(k, "hear");
      box.innerHTML = `<div class="card result"><div class="big">${s}/${m}</div><p>${s / m >= 0.7 ? "ฟังได้แม่นมาก!" : "ลองฟังชุดนี้อีกรอบ"}</p>
        <div class="row" style="justify-content:center"><button class="btn" id="ag">ฟังชุดนี้อีกรอบ</button>${nx ? `<button class="btn" id="ns">ชุดต่อไป: ${esc(nx.name)}</button>` : ""}<button class="btn p" id="go">ดูรูป + คำ พูดตาม →</button></div></div>`;
      $("#ag", box).onclick = () => STATIONS.vocab.hear(el, k);
      const ns = $("#ns", box); if (ns) ns.onclick = () => { LS.set(pkey() + ":vset", nx.k); STATIONS.vocab.hear(el, k); };
      $("#go", box).onclick = () => station(k, "learn");
    } });
  },
  learn(el, k) {
    el.innerHTML = ""; const words = vSetBar(el, () => STATIONS.vocab.learn(el, k));
    const box = document.createElement("div"); el.appendChild(box); let i = 0;
    const render = () => {
      const w = words[i];
      box.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><span class="counter">คำที่ ${i + 1} / ${words.length}</span>
        <span class="muted" style="font-size:15px">ดูรูป + คำ → ฟัง → พูดตาม → อ่านประโยค</span></div>
        <div class="fc" style="margin-top:10px"><div class="pic">${w.pic}</div><div>
          <div class="w">${esc(w.w)}</div><div class="th">${esc(w.th)}</div>
          <div class="row" style="margin:12px 0"><button class="btn p" id="pl">🔊 ฟัง</button><button class="btn" id="sl">🐢 ช้า</button><button class="btn g mic" id="mc">🎤 พูดตาม</button></div>
          <div id="hd"></div>
          <div class="ex">📝 ${esc(w.ex)} <button class="btn s" id="pe">🔊</button> <button class="btn s g mic" id="me">🎤</button></div><div id="he"></div></div></div>
        <div class="qnav"><button class="btn" id="pv" ${i === 0 ? "disabled" : ""}>← ก่อนหน้า</button><button class="btn p" id="nx">${i === words.length - 1 ? "จบชุดนี้ →" : "คำต่อไป →"}</button></div></div>`;
      setTimeout(() => say(w.w), 200);
      $("#pl", box).onclick = () => say(w.w); $("#sl", box).onclick = () => say(w.w, { rate: 0.55 });
      $("#pe", box).onclick = () => say(w.ex);
      $("#mc", box).onclick = e => micTry(e.currentTarget, w.w, $("#hd", box), 0.66);
      $("#me", box).onclick = e => micTry(e.currentTarget, w.ex, $("#he", box), 0.7);
      $("#pv", box).onclick = () => { i--; render(); };
      $("#nx", box).onclick = () => { if (i < words.length - 1) { i++; render(); } else {
        const nx = vSetNext(k, "learn");
        if (nx) { LS.set(pkey() + ":vset", nx.k); toast("ต่อด้วยชุด " + nx.name); STATIONS.vocab.learn(el, k); } else station(k, "review");
      } };
    };
    render();
  },
  review(el, k) {
    const st = LS.get(pkey() + ":recall", {});   // word -> {r:right, n:seen}
    const pctKnown = () => Math.round(U.vocab.filter(w => st[w.w] && st[w.w].last).length / U.vocab.length * 100);
    const round = () => {
      const weak = U.vocab.filter(w => !(st[w.w] && st[w.w].last));
      const pool = shuffle(weak).slice(0, 10).concat(shuffle(U.vocab.filter(w => !weak.includes(w)))).slice(0, 10);
      const items = pool.map(w => { const other = shuffle(U.vocab.filter(x => x !== w))[0]; const o = shuffle([w.w, other.w]);
        return { pic: w.pic, q: `จำได้ไหม? <b>${esc(w.th)}</b>`, o, a: o.indexOf(w.w), _w: w.w, why: w.ex }; });
      quiz(el, items, { title: "ทบทวนความจำ", two: true, onDone: (s, m, log) => {
        log.forEach((x, n) => { const w = items[n]._w; st[w] = st[w] || { r: 0, n: 0 }; st[w].n++; if (x.ok) st[w].r++; st[w].last = x.ok; });
        LS.set(pkey() + ":recall", st);
        const rp = Math.round(s / m * 100), known = pctKnown(), pass = rp >= 70;
        if (pass) markStep(k, "review");
        const missed = items.filter((_, n) => !log[n].ok);
        el.innerHTML = `<div class="card result"><h3>รอบนี้จำได้ ${rp}%</h3>
          <div class="bar" style="height:16px;border-radius:8px;background:#f4e3e8;overflow:hidden;margin:12px auto;max-width:420px"><i style="display:block;height:100%;width:${known}%;background:${known >= 70 ? "var(--ok)" : "var(--rose)"}"></i></div>
          <p>จำศัพท์ทั้งหมดได้ <b>${known}%</b> ของ ${U.vocab.length} คำ</p>
          <p>${pass ? "🎉 ผ่านเกณฑ์ 70% แล้ว ไปฝึกศัพท์ในประโยคต่อได้" : "ยังไม่ถึง 70% ทบทวนคำที่พลาดแล้วลองอีกรอบ"}</p>
          ${missed.length ? `<div class="words" style="justify-content:center">${missed.map(x => `<button class="wd" data-say="${esc(x._w)}">${esc(x._w)} 🔊</button>`).join("")}</div>` : ""}
          <div class="row" style="justify-content:center"><button class="btn ${pass ? "" : "p"}" id="ag">ทบทวนอีกรอบ</button>${pass ? `<button class="btn p" id="go">ศัพท์ในประโยค →</button>` : ""}</div></div>`;
        $$("[data-say]", el).forEach(b => b.onclick = () => say(b.dataset.say));
        $("#ag", el).onclick = round; const g = $("#go", el); if (g) g.onclick = () => station(k, "context");
      } });
    };
    el.innerHTML = `<div class="card"><h3>ทบทวนจนจำได้ 70%</h3><p>ระบบจะสุ่มคำที่ยังจำไม่ได้มาถามก่อน รอบละ 10 คำ ต้องได้อย่างน้อย 7/10 จึงผ่าน</p>
      <p>ตอนนี้จำได้ <b>${pctKnown()}%</b></p><button class="btn p" id="st">เริ่มทบทวน</button></div>`;
    $("#st", el).onclick = round;
  },
  context(el, k) {
    const items = U.context.map(c => ({ q: c.s.replace("___", "<b>_____</b>"), o: c.o, a: c.a, why: c.s.replace("___", c.o[c.a]), _full: c.s.replace("___", c.o[c.a]) }));
    quiz(el, items, { title: "ศัพท์ในประโยค", two: true, onDone: (s, m) => {
      markStep(k, "context");
      el.innerHTML = `<div class="card"><h3>ได้ ${s}/${m} · ฟังและพูดตามประโยคทั้งหมด</h3><div class="opts" style="margin-top:10px">
        ${items.map((x, n) => `<div class="row"><button class="btn s" data-n="${n}">🔊</button><button class="btn s g mic" data-m="${n}">🎤</button><span style="font-size:19px">${esc(x._full)}</span></div><div id="h${n}"></div>`).join("")}</div>
        <div class="row" style="margin-top:12px"><button class="btn p" id="go">ไปข้อสอบย่อย →</button></div></div>`;
      el.onclick = e => { const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.n) say(items[+b.dataset.n]._full);
        if (b.dataset.m) micTry(b, items[+b.dataset.m]._full, $("#h" + b.dataset.m, el));
        if (b.id === "go") station(k, "quiz"); };
    } });
  },
  quiz(el, k) { runSkillQuiz(el, k, U.vocabQuiz); }
};

/* ---------- LISTENING ---------- */
function dialogue(el, d, opts = {}) {
  let hidden = opts.hidden !== false, playing = false;
  const voices = {}; let vn = 0;
  d.lines.forEach(([sp]) => { if (!(sp in voices)) voices[sp] = vn++; });
  el.innerHTML = `<div class="player"><button class="btn p" data-a="all">▶ ฟังทั้งบท</button><button class="btn" data-a="slow">🐢 ฟังช้า</button>
      <button class="btn" data-a="stop">⏹ หยุด</button><button class="btn" data-a="tx">${hidden ? "👁 แสดงบทพูด" : "🙈 ซ่อนบทพูด"}</button></div>
    <div class="dlg">${d.lines.map(([sp, t], n) => `<div class="line ${voices[sp] % 2 ? "b" : ""}" data-n="${n}"><span class="sp">${esc(sp)}</span><span class="tx ${hidden ? "blur" : ""}">${esc(t)}</span></div>`).join("")}</div>`;
  const play = async rate => {
    playing = true;
    for (let n = 0; n < d.lines.length && playing; n++) {
      $$(".line", el).forEach(x => x.classList.toggle("now", +x.dataset.n === n));
      const [sp, t] = d.lines[n];
      await say(t, { rate, voice: voices[sp], pitch: voices[sp] % 2 ? 1.1 : 0.95 });
      await new Promise(r => setTimeout(r, 250));
    }
    playing = false; $$(".line", el).forEach(x => x.classList.remove("now"));
  };
  el.onclick = e => {
    const b = e.target.closest("[data-a]"), ln = e.target.closest(".line");
    if (b) {
      if (b.dataset.a === "all") play(0.9); else if (b.dataset.a === "slow") play(0.65);
      else if (b.dataset.a === "stop") { playing = false; stopSay(); }
      else if (b.dataset.a === "tx") { hidden = !hidden; $$(".tx", el).forEach(x => x.classList.toggle("blur", hidden)); b.textContent = hidden ? "👁 แสดงบทพูด" : "🙈 ซ่อนบทพูด"; }
    } else if (ln) { const [sp, t] = d.lines[+ln.dataset.n]; playing = false; say(t, { voice: voices[sp] }); }
  };
}
STATIONS.listening = {
  practice(el, k) {
    const L = U.listening;
    el.innerHTML = `<div class="tip">💡 <b>Subskill:</b> ${L.tip}</div>
      <div class="card"><h3>🎧 ${esc(L.practice.title)}</h3><p class="muted">ฟัง 1–2 รอบก่อนเปิดบทพูด กดที่บรรทัดเพื่อฟังทีละประโยค</p><div id="dl"></div></div>
      <h3 style="margin:18px 0 8px">ฝึกตอบ: คำถามใช้คำต่างจากที่ได้ยิน</h3><div id="pq"></div>`;
    dialogue($("#dl", el), L.practice);
    quiz($("#pq", el), L.practice.qs, { title: "ฝึกฟัง", two: true, onDone: (s, m) => {
      markStep(k, "practice");
      $("#pq", el).innerHTML = `<div class="card result"><div class="big">${s}/${m}</div><p>เปิดบทพูดแล้วอ่านตามเพื่อดูว่าคำในคำถามกับในบทต่างกันอย่างไร</p><button class="btn p" id="go">ไปข้อสอบย่อย →</button></div>`;
      $("#go", el).onclick = () => station(k, "quiz");
    } });
  },
  quiz(el, k) {
    const L = U.listening.quiz;
    el.innerHTML = `<div class="card"><h3>🎧 ${esc(L.title)}</h3><p class="muted">ฟังได้หลายรอบ บทพูดถูกซ่อนไว้ระหว่างสอบ</p><div id="dl"></div></div><div id="qz" style="margin-top:16px"></div>`;
    const dl = $("#dl", el); dialogue(dl, L);
    const tx = $('[data-a="tx"]', dl); if (tx) tx.classList.add("hide");
    runSkillQuiz($("#qz", el), k, L.qs);
  }
};

/* ---------- READING ---------- */
function passage(el) {
  const R = U.reading; let sn = 0; const sents = [];
  el.innerHTML = `<div class="card passage"><h3 style="margin-bottom:10px">📖 ${esc(R.title)}</h3>
    <div class="player"><button class="btn p" id="ra">▶ ฟังทั้งเรื่อง</button><button class="btn" id="rs">⏹ หยุด</button><span class="muted" style="font-size:15px">แตะประโยคเพื่อฟังทีละประโยค</span></div>
    ${R.text.map(p => `<p>${p.split(/(?<=[.!?”])\s+/).map(s => { sents.push(s); return `<span class="sn" data-i="${sn++}">${esc(s)}</span>`; }).join(" ")}</p>`).join("")}</div>`;
  let playing = false;
  $("#ra", el).onclick = async () => { playing = true; for (let i = 0; i < sents.length && playing; i++) { $$(".sn", el).forEach(x => x.classList.toggle("say", +x.dataset.i === i)); await say(sents[i]); } playing = false; $$(".sn", el).forEach(x => x.classList.remove("say")); };
  $("#rs", el).onclick = () => { playing = false; stopSay(); };
  $$(".sn", el).forEach(x => x.onclick = () => { playing = false; $$(".sn", el).forEach(y => y.classList.remove("say")); x.classList.add("say"); say(sents[+x.dataset.i]).then(() => x.classList.remove("say")); });
}
STATIONS.reading = {
  read(el, k) {
    el.innerHTML = `<div class="tip">💡 <b>Subskill:</b> ${U.reading.tip}</div><div id="ps"></div>
      <div class="card" style="margin-top:14px"><h3>ก่อนไปต่อ: คิดตาม</h3><ol><li>Fon เริ่มทำอะไรเมื่อสองปีก่อน?</li><li>อะไรที่ทำให้ Fon อยากลองสิ่งใหม่?</li><li>ประโยคไหนในเรื่องใช้ <b>has/have + V3</b> ขีดเส้นใต้ในใจอย่างน้อย 3 ประโยค</li></ol></div>`;
    passage($("#ps", el)); markStep(k, "read");
  },
  own(el, k) {
    el.innerHTML = `<div class="tip">💡 เลือกคำตอบที่ <b>ใช้คำพูดของตัวเอง</b> สั้นและตรงคำถาม ไม่คัดลอกทั้งประโยคจากเรื่อง</div><div id="ps"></div><div id="oq" style="margin-top:14px"></div>`;
    passage($("#ps", el));
    quiz($("#oq", el), U.reading.practice, { title: "ตอบด้วยคำของเรา", onDone: (s, m) => {
      markStep(k, "own");
      $("#oq", el).innerHTML = `<div class="card result"><div class="big">${s}/${m}</div><p>ลองพูดคำตอบของคุณเองออกเสียง: “Fon's website helps teens …”</p><button class="btn p" id="go">ไปข้อสอบย่อย →</button></div>`;
      $("#go", el).onclick = () => station(k, "quiz");
    } });
  },
  quiz(el, k) { el.innerHTML = `<div id="ps"></div><div id="qz" style="margin-top:14px"></div>`; passage($("#ps", el)); runSkillQuiz($("#qz", el), k, U.reading.quiz); }
};

/* ---------- GRAMMAR ---------- */
const V3 = "been gone eaten seen swum ridden flown met written sung done made built baked acted traveled taken played visited tried cooked learned learnt bought watched recorded slept climbed danced won read heard had given driven drunk spoken broken known grown thrown fallen forgotten got gotten left lost found caught taught brought kept sent spent stood worn sat run come become begun drawn shown flown jumped finished started lived worked studied stayed listened tasted used painted".split(" ");
function checkFree(n, s) {
  const t = norm(s), w = t.split(" ");
  const hasPP = w.some((x, i) => (x === "have" || x === "has") && w.slice(i + 1, i + 4).some(y => V3.includes(y)));
  const v3After = w.some((x, i) => (x === "have" || x === "has") && w.slice(i + 1, i + 4).some(y => V3.includes(y)));
  const wrongV2 = /\b(have|has)( never| ever| not)? (went|ate|saw|swam|rode|flew|sang|did|wrote|took|was|were)\b/.test(t);
  const heShe = /\b(he|she|it) have\b/.test(t);
  if (w.length < 4) return [false, "เขียนให้ยาวขึ้นอีกนิด อย่างน้อย 4 คำ"];
  if (wrongV2) return [false, "หลัง have/has ต้องใช้ V3 เช่น gone, eaten, seen, swum, ridden, flown, sung"];
  if (heShe) return [false, "he / she / it ใช้ has"];
  if (/\bnot never\b|\bhave not never\b/.test(t)) return [false, "never ใช้ซ้อนกับ not ไม่ได้"];
  if (/\b(yesterday|last|ago|in 20\d\d)\b/.test(t)) return [false, "Present perfect ไม่บอกเวลาเจาะจง ตัดคำบอกเวลา (yesterday, last…, ago) ออก"];
  if (n === 0 && (!hasPP || /\bnever\b/.test(t))) return [false, "ใช้ I have / I've + V3 แบบบอกเล่า เช่น I've ridden a horse."];
  if (n === 1 && !(/\bnever\b/.test(t) && v3After)) return [false, "ใช้ I've never + V3 เช่น I've never seen snow."];
  if (n === 2 && !(/^(have|has) \w+( \w+)? ever\b/.test(t) && v3After && /\?\s*$/.test(s.trim()))) return [false, "เริ่มด้วย Have you ever + V3 … และจบด้วย ?"];
  return [true, "✅ ประโยคถูกโครงสร้างแล้ว เยี่ยม!"];
}
STATIONS.grammar = {
  discover(el, k) {
    const G = U.grammar; let i = 0;
    const render = () => {
      const d = G.discover[i];
      el.innerHTML = `<div class="card qcard"><span class="qn">Discovery guide · ขั้นที่ ${i + 1} / ${G.discover.length}</span> <span class="lv lv${d.lv === 1 ? 1 : d.lv === 2 ? 2 : 4}">${["", "ง่าย", "กลาง", "ยาก"][d.lv]}</span> <b>${esc(d.topic)}</b>
        <h3 style="margin:6px 0 10px">1) สังเกตตัวอย่าง</h3><ul class="ex-list">${d.show.map(x => `<li>${x} <button class="btn s" data-say="${esc(x.replace(/<[^>]+>/g, ""))}">🔊</button></li>`).join("")}</ul>
        <h3 style="margin:6px 0 10px">2) ตอบคำถาม</h3><div class="qt" style="font-size:21px">${esc(d.q)}</div>
        <div class="opts">${d.o.map((x, n) => `<button class="opt" data-k="${n}">${esc(x)}</button>`).join("")}</div>
        <div id="rl"></div>
        <div class="qnav"><button class="btn" id="pv" ${i === 0 ? "disabled" : ""}>← ก่อนหน้า</button><button class="btn p hide" id="nx">${i === G.discover.length - 1 ? "ไปดูจุดที่ผิดบ่อย →" : "ขั้นต่อไป →"}</button></div></div>`;
      el.onclick = e => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.say) say(b.dataset.say);
        else if (b.dataset.k !== undefined) {
          const ok = +b.dataset.k === d.a;
          b.classList.add(ok ? "right" : "wrong");
          if (ok) { $$(".opt", el).forEach(x => x.disabled = true); $("#rl", el).innerHTML = `<div class="rule">💡 <b>สรุปกฎ:</b> ${d.rule}</div>`; $("#nx", el).classList.remove("hide"); }
          else { b.disabled = true; $("#rl", el).innerHTML = `<div class="fb bad">ยังไม่ใช่ ลองดูตัวอย่างอีกครั้งแล้วเลือกใหม่</div>`; }
        }
        else if (b.id === "pv") { i--; render(); }
        else if (b.id === "nx") { if (i < G.discover.length - 1) { i++; render(); } else { markStep(k, "discover"); station(k, "mistakes"); } }
      };
    };
    render();
  },
  mistakes(el, k) {
    const M = U.grammar.mistakes; let i = 0, right = 0;
    const render = () => {
      const m = M[i];
      el.innerHTML = `<div class="card qcard"><span class="qn">จับผิด · ${i + 1} / ${M.length} · ถูก ${right}</span>
        <div class="qt">ประโยคนี้ผิด 1 จุด แตะคำที่ผิด</div>
        <div class="words">${m.s.map((w, n) => `<button class="wd" data-n="${n}">${esc(w)}</button>`).join("")}</div>
        <div id="fb"></div><div class="qnav"><span></span><button class="btn p hide" id="nx">${i === M.length - 1 ? "ไปแต่งประโยค →" : "ข้อต่อไป →"}</button></div></div>`;
      let tried = false;
      el.onclick = e => {
        const b = e.target.closest("button"); if (!b) return;
        if (b.dataset.n !== undefined && !$("#nx", el).classList.contains("hide") === false) {
          const ok = +b.dataset.n === m.bad;
          if (ok && !tried) right++;
          tried = true;
          $$(".wd", el)[m.bad].classList.add(ok ? "good" : "bad");
          if (!ok) b.classList.add("bad");
          $("#fb", el).innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ เจอแล้ว!" : `จุดที่ผิดคือ <b>${esc(m.s[m.bad])}</b>`}<br>✔ ${m.fix}<br><span class="muted">${esc(m.why)}</span></div>`;
          $$(".wd", el).forEach(x => x.disabled = true); $("#nx", el).classList.remove("hide");
        } else if (b.id === "nx") { if (i < M.length - 1) { i++; render(); } else { markStep(k, "mistakes"); station(k, "build"); } }
      };
    };
    render();
  },
  build(el, k) {
    const B = U.grammar.build;
    let lv = LS.get(pkey() + ":lv", 1);
    const tabs = () => `<div class="steps" style="--c:var(--c-grammar)">${[1, 2, 3, 4].map(n => `<button data-lv="${n}" class="${n === lv ? "on" : ""}"><span class="lv lv${n}">ระดับ ${n}</span>${["เรียงคำ", "แปลงประโยค", "แต่งจากคำใบ้", "แต่งเอง"][n - 1]}</button>`).join("")}</div><div id="lvb"></div>`;
    el.innerHTML = tabs();
    el.querySelector(".steps").onclick = e => { const b = e.target.closest("button"); if (b) { lv = +b.dataset.lv; LS.set(pkey() + ":lv", lv); STATIONS.grammar.build(el, k); } };
    const box = $("#lvb", el);
    const next = () => { if (lv < 4) { lv++; LS.set(pkey() + ":lv", lv); STATIONS.grammar.build(el, k); } else { markStep(k, "build"); station(k, "quiz"); } };
    if (lv === 1) {
      let i = 0;
      const render = () => {
        const target = B.order[i].w; let picked = [];
        const pool = shuffle(target.map((w, n) => ({ w, n })));
        box.innerHTML = `<div class="card qcard"><span class="qn">เรียงคำเป็นประโยค · ${i + 1} / ${B.order.length}</span>
          <div class="slot" id="sl"></div><div class="words" id="pl">${pool.map(x => `<button class="wd" data-n="${x.n}">${esc(x.w)}</button>`).join("")}</div>
          <div class="row"><button class="btn" id="cl">ล้าง</button><button class="btn p" id="ck">ตรวจ</button></div><div id="fb"></div>
          <div class="qnav"><span></span><button class="btn p hide" id="nx">ต่อไป →</button></div></div>`;
        box.onclick = e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.dataset.n !== undefined && b.parentElement.id === "pl") { picked.push(+b.dataset.n); b.disabled = true; $("#sl", box).insertAdjacentHTML("beforeend", `<span class="wd">${esc(target[+b.dataset.n])}</span>`); }
          else if (b.id === "cl") render();
          else if (b.id === "ck") {
            const got = picked.map(n => target[n]).join(" "), ok = got === target.join(" ");
            $("#fb", box).innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ ถูกต้อง!" : "❌ ยังไม่ถูก"} <b>${esc(target.join(" "))}</b> <button class="btn s" id="sy">🔊</button></div>`;
            $("#sy", box).onclick = () => say(target.join(" "));
            if (ok) say(target.join(" "));
            $("#nx", box).classList.remove("hide");
          } else if (b.id === "nx") { if (i < B.order.length - 1) { i++; render(); } else next(); }
        };
      };
      render();
    } else if (lv === 2 || lv === 3) {
      const list = lv === 2 ? B.transform : B.prompt; let i = 0;
      const render = () => {
        const it = list[i];
        const ask = lv === 2 ? `เปลี่ยนเป็น <b>${it.to === "negative" ? "ประโยคปฏิเสธ (−)" : "คำถาม (?)"}</b><br><span style="font-size:24px">${esc(it.from)}</span>` : `แต่งประโยคจากคำใบ้<br><span style="font-size:24px">${esc(it.p)}</span>`;
        box.innerHTML = `<div class="card qcard"><span class="qn">${lv === 2 ? "แปลงประโยค" : "แต่งจากคำใบ้"} · ${i + 1} / ${list.length}</span><div class="qt">${ask}</div>
          <input class="inp" id="in" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="พิมพ์ประโยคเต็ม">
          <div class="row" style="margin-top:10px"><button class="btn p" id="ck">ตรวจ</button><button class="btn" id="hn">💡 ดูคำใบ้</button></div><div id="fb"></div>
          <div class="qnav"><span></span><button class="btn p hide" id="nx">ต่อไป →</button></div></div>`;
        const inp = $("#in", box); inp.focus(); inp.onkeydown = e => { if (e.key === "Enter") $("#ck", box).click(); };
        box.onclick = e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.id === "ck") {
            const v = norm(inp.value); if (!v) return toast("พิมพ์ประโยคก่อน");
            const ok = it.ans.map(norm).includes(v);
            const model = it.ans[0].replace(/^./, c => c.toUpperCase()) + (lv === 2 && it.to === "question" || /ever/.test(it.ans[0]) && /^have/.test(it.ans[0]) ? "?" : ".");
            const hint = ok ? "" : (checkFree(9, inp.value)[1] || "");
            $("#fb", box).innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ ถูกต้อง!" : `❌ ยังไม่ตรง ลองเทียบกับ: <b>${esc(model)}</b>${hint && !/เยี่ยม/.test(hint) ? `<br><span class="muted">${esc(hint)}</span>` : ""}`}</div>`;
            say(model); $("#nx", box).classList.remove("hide");
          } else if (b.id === "hn") toast(lv === 2 ? (it.to === "negative" ? "ใส่ not หลัง have/has → haven't / hasn't" : "ย้าย Have/Has ไปไว้หน้าประธาน") : "ประธาน + have/has (+ never) + V3 …", 3500);
          else if (b.id === "nx") { if (i < list.length - 1) { i++; render(); } else next(); }
        };
      };
      render();
    } else {
      const saved = LS.get(pkey() + ":free", ["", "", ""]);
      box.innerHTML = `<div class="card"><h3><span class="lv lv4">ระดับ 4</span>แต่งประโยคของคุณเอง (เรื่องจริงของคุณ)</h3>
        ${B.free.map((t, n) => `<div style="margin-top:14px"><p style="margin:0 0 6px">${n + 1}. ${t}</p><input class="inp" data-n="${n}" value="${esc(saved[n])}" autocomplete="off" spellcheck="false"><div id="f${n}"></div></div>`).join("")}
        <div class="row" style="margin-top:14px"><button class="btn p" id="ck">ตรวจทั้งหมด</button></div></div>`;
      $("#ck", box).onclick = () => {
        let all = true;
        $$("input[data-n]", box).forEach(inp => { const n = +inp.dataset.n; saved[n] = inp.value; const [ok, msg] = checkFree(n, inp.value); if (!ok) all = false;
          $("#f" + n, box).innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${esc(msg)}</div>`; });
        LS.set(pkey() + ":free", saved);
        if (all) { markStep(k, "build"); $("#ck", box).insertAdjacentHTML("afterend", `<button class="btn g" id="gq">🎉 แต่งเองได้แล้ว! ไปข้อสอบย่อย →</button>`); $("#gq", box).onclick = () => station(k, "quiz"); }
      };
    }
  },
  quiz(el, k) { runSkillQuiz(el, k, U.grammar.quiz); }
};

/* ---------- SPEAKING ---------- */
function micBanner() {
  return SR ? "" : `<div class="fb bad">⚠️ ${SR_MSG.unsupported}</div>`;
}
STATIONS.speaking = {
  model(el, k) {
    const S = U.speaking;
    el.innerHTML = `<div class="tip">💡 ${S.tip}</div>${micBanner()}
      <div class="card"><h3>ฟังแล้วพูดตามทีละประโยค (Shadowing)</h3><p class="muted">กด 🔊 ฟัง แล้วกด 🎤 พูดตาม ต้องตรงอย่างน้อย 70%</p>
      <div class="dlg">${S.model.map(([sp, t], n) => `<div class="line ${sp === "B" ? "b" : ""}"><span class="sp">${sp}</span><div class="tx"><div>${esc(t)}</div>
        <div class="row" style="margin-top:6px"><button class="btn s" data-p="${n}">🔊</button><button class="btn s g mic" data-m="${n}">🎤 พูดตาม</button></div><div id="h${n}"></div></div></div>`).join("")}</div></div>`;
    let passed = new Set();
    el.onclick = async e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.p) say(S.model[+b.dataset.p][1], { voice: S.model[+b.dataset.p][0] === "B" ? 1 : 0 });
      if (b.dataset.m) { const n = +b.dataset.m; const r = await micTry(b, S.model[n][1], $("#h" + n, el)); if (r && r.ok) { passed.add(n); if (passed.size >= 3) markStep(k, "model"); } }
    };
  },
  phrases(el, k) {
    const S = U.speaking;
    el.innerHTML = `${micBanner()}<div class="card"><h3>สำนวนสำคัญ: ฟัง พูดตาม แล้วฝึกกับเพื่อน</h3><div class="opts" style="margin-top:10px">
      ${S.phrases.map((p, n) => `<div class="row"><button class="btn s" data-p="${n}">🔊</button><button class="btn s g mic" data-m="${n}">🎤</button><span style="font-size:21px">${esc(p)}</span></div><div id="h${n}"></div>`).join("")}</div>
      <div class="tip" style="margin-top:14px">👥 <b>Pair work:</b> ถามเพื่อน 3 คำถาม “Have you ever …?” ใช้ศัพท์จากสถานีคำศัพท์ แล้วถามต่อ “What was it like?”</div></div>`;
    el.onclick = e => { const b = e.target.closest("button"); if (!b) return;
      const t = (n) => S.phrases[n].split(" / ")[0].replace("…", "").trim();
      if (b.dataset.p) say(S.phrases[+b.dataset.p].replace(/…/g, ""));
      if (b.dataset.m) micTry(b, t(+b.dataset.m), $("#h" + b.dataset.m, el), 0.6);
    };
    markStep(k, "phrases");
  },
  quiz(el, k) {
    const Q = U.speaking.quiz;
    if (!SR) { el.innerHTML = `<div class="card">${micBanner()}<p>ข้อสอบย่อยการพูดต้องใช้ไมโครโฟน เปิดหน้านี้ด้วย Chrome หรือ Edge แล้วลองใหม่</p></div>`; return; }
    let i = 0, score = 0, tries = 0; const res = [];
    const render = () => {
      const it = Q[i];
      el.innerHTML = `<div class="card qcard"><span class="qn">ข้อสอบย่อยการพูด · ข้อ ${i + 1} / ${Q.length} · พูดได้ 3 ครั้งต่อข้อ</span>
        ${it.type === "read" ? `<div class="qt">อ่านออกเสียงประโยคนี้</div><div style="font-size:30px;font-family:Kanit;margin-bottom:12px">${esc(it.t)}</div>`
          : `<div class="qt">ฟังคำถาม แล้วตอบด้วยเสียง</div><div class="row"><button class="btn" id="pq">🔊 ฟังคำถาม</button></div><div style="font-size:26px;font-family:Kanit;margin:12px 0">${esc(it.q)}</div><p class="muted">${esc(it.hint)}</p>`}
        <div class="row"><button class="btn g mic" id="mc">🎤 กดแล้วพูด</button><span class="muted">ครั้งที่ ${tries + 1}/3</span></div><div id="hd"></div>
        <div class="qnav"><span></span><button class="btn p hide" id="nx">${i === Q.length - 1 ? "ดูผล" : "ข้อต่อไป →"}</button></div></div>`;
      if (it.type === "answer") { setTimeout(() => say(it.q), 250); $("#pq", el).onclick = () => say(it.q); }
      $("#mc", el).onclick = async e => {
        let ok = false, heard = "";
        if (it.type === "read") { const r = await micTry(e.currentTarget, it.t, $("#hd", el), 0.7); if (!r) return; ok = r.ok; heard = r.t; }
        else {
          const b = e.currentTarget; b.classList.add("rec");
          try { const alts = await listen(); heard = alts[0]; const n = alts.map(norm);
            ok = n.some(t => t.split(" ").length >= 3 && it.need.every(group => group.map(norm).some(g => t.includes(g))));
            $("#hd", el).className = "heard " + (ok ? "ok" : "bad");
            $("#hd", el).innerHTML = `ได้ยินว่า: “${esc(heard)}” ${ok ? "✅ ตอบได้ดี!" : "🔁 ยังไม่ครบ ลองตอบเป็นประโยคเต็ม"}`;
          } catch (er) { $("#hd", el).className = "heard bad"; $("#hd", el).textContent = SR_MSG[er] || "ตรวจเสียงไม่ได้ ลองใหม่"; b.classList.remove("rec"); return; }
          b.classList.remove("rec");
        }
        tries++;
        if (ok || tries >= 3) { if (ok) score++; res.push({ ok, heard }); $("#mc", el).disabled = true; $("#nx", el).classList.remove("hide"); }
        else $(".muted", $("#mc", el).parentElement).textContent = `ครั้งที่ ${tries + 1}/3`;
      };
      $("#nx", el).onclick = () => { tries = 0; i++; if (i < Q.length) render(); else {
        const counted = recordQuiz(k, score, Q.length, { heard: res.map(r => r.heard).slice(0, 8) }); markStep(k, "quiz");
        quizResult(el, k, score, Q.length, counted, () => STATIONS.speaking.quiz(el, k)); } };
    };
    render();
  }
};

/* ---------- WRITING ---------- */
STATIONS.writing = {
  discover(el, k) {
    const W = U.writing;
    el.innerHTML = `<div class="tip">💡 ${W.tip}</div><div id="dq"></div>`;
    quiz($("#dq", el), W.discover.map(d => ({ q: d.s.replace("___", "<b>_____</b>"), o: d.o, a: d.a, why: d.why })), { title: "ค้นพบ who / where / which", onDone: (s, m) => {
      markStep(k, "discover");
      $("#dq", el).innerHTML = `<div class="card"><div class="rule">💡 <b>who</b> = คน · <b>where</b> = สถานที่ · <b>which</b> = สิ่งของ/สัตว์<br>ใช้เชื่อมประโยคเพื่อให้ข้อมูลเพิ่ม: I met a boy. He plays the guitar. → I met a boy <b>who</b> plays the guitar.</div>
        <p>ได้ ${s}/${m}</p><button class="btn p" id="go">ดูตัวอย่างโปสการ์ด →</button></div>`;
      $("#go", el).onclick = () => station(k, "model");
    } });
  },
  model(el, k) {
    const M = U.writing.model;
    el.innerHTML = `<div class="postcard"><div class="msg">${M.lines.map(l => `<p>${esc(l).replace(/\b(who|where|which)\b/g, "<b style='color:var(--rose)'>$1</b>").replace(/(I've \w+|I haven't \w+|haven't \w+)/g, "<u>$1</u>")}</p>`).join("")}
      <button class="btn s" id="pl">🔊 ฟังทั้งใบ</button></div>
      <div class="addr"><div class="stamp">🐘</div><p style="width:100%">To: ${esc(M.to)}<br>___________<br>___________</p></div></div>
      <div class="card" style="margin-top:14px"><h3>สังเกตโครงสร้าง</h3><ol><li>ทักทาย <b>Hi …,</b></li><li>บอกว่าอยู่ที่ไหน + <b>where</b></li><li>สิ่งที่ทำแล้ว <u>I've …</u> และยังไม่ได้ทำ <u>I haven't … yet</u></li><li>เรื่องเมื่อวาน (Past simple) + <b>who</b></li><li>ลงท้าย <b>See you soon!</b> และ <b>P.S.</b> (+ <b>which</b>)</li></ol></div>`;
    $("#pl", el).onclick = () => say(M.lines.join(" "));
    markStep(k, "model");
  },
  write(el, k) {
    const W = U.writing; const saved = P.writing || {};
    el.innerHTML = `<div class="card"><h3>✍️ งานเขียน: โปสการ์ดออนไลน์</h3><p>${esc(W.task)}</p>
      <textarea class="inp" id="tx" placeholder="Hi …,">${esc(saved.text || "")}</textarea>
      <ul class="check" id="ck"></ul>
      <div class="row"><button class="btn p" id="sd">ส่งงานให้ครู</button><span class="muted" id="st">${saved.sentAt ? "ส่งแล้วเมื่อ " + new Date(saved.sentAt).toLocaleString("th-TH") : ""}</span></div>
      <p class="muted" style="font-size:15px">งานเขียนครูเป็นผู้ให้คะแนนชิ้นงาน ส่วนคะแนนเก็บ 1.5 คะแนนมาจากข้อสอบย่อยการเขียน</p></div>`;
    const tx = $("#tx", el);
    const checks = () => {
      const t = tx.value, n = norm(t), words = t.trim() ? t.trim().split(/\s+/).length : 0;
      const pp = (n.match(/\b(have|has)( not| never| ever)? \w+/g) || []).filter(m => V3.includes(m.split(" ").pop())).length;
      const c = [["จำนวนคำ 60–80 คำ (ตอนนี้ " + words + ")", words >= 60 && words <= 80], ["Present perfect อย่างน้อย 2 ครั้ง", pp >= 2],
        ["who / where / which อย่างน้อย 1 ครั้ง", /\b(who|where|which)\b/.test(n)], ["มี P.S.", /p\.?\s?s\./i.test(t)], ["ขึ้นต้นด้วย Hi / Dear", /^\s*(hi|dear|hello)\b/i.test(t)]];
      $("#ck", el).innerHTML = c.map(([l, ok]) => `<li class="${ok ? "y" : ""}">${esc(l)}</li>`).join("");
      return c;
    };
    tx.oninput = () => { P.writing = Object.assign(P.writing || {}, { text: tx.value }); saveP(); checks(); };
    checks();
    $("#sd", el).onclick = async () => {
      const c = checks(); if (tx.value.trim().split(/\s+/).length < 20) return toast("เขียนให้ครบก่อนส่ง");
      const ok = await send({ kind: "writing", skill: "writing", detail: { text: tx.value.slice(0, 2000), checks: Object.fromEntries(c.map(([l, v], i) => ["c" + (i + 1), v])) } });
      P.writing = { text: tx.value, sentAt: Date.now() }; saveP(); markStep(k, "write");
      $("#st", el).textContent = ok ? "✅ ส่งให้ครูแล้ว" : "บันทึกไว้แล้ว จะส่งอัตโนมัติเมื่อมีอินเทอร์เน็ต";
    };
  },
  quiz(el, k) { runSkillQuiz(el, k, U.writing.quiz); }
};

/* ================= POST-TEST & SUMMARY ================= */
function viewPost() {
  const v = $("#v-station"); v.style.setProperty("--c", "var(--c-posttest)");
  v.innerHTML = `<div class="sh"><img src="${ICON("trophy")}" alt=""><div><span class="k">สถานี 7</span><h2>Post-test · ข้อสอบหลังเรียน 20 ข้อ</h2></div></div>
    <div class="tip">ข้อสอบนี้ใช้วิเคราะห์ว่าควรพัฒนาทักษะใด ไม่นับเป็นคะแนนเก็บ ทำอย่างตั้งใจเพื่อผลที่แม่นยำ</div><div id="pt"></div>`;
  show("station");
  const items = U.posttest.map(x => Object.assign({}, x));
  quiz($("#pt", v), items, { title: "Post-test", onDone: (s, m, log) => {
    const per = {};
    SKILLS.forEach(x => per[x.k] = { r: 0, n: 0 });
    log.forEach((x, n) => { const sk = items[n].skill; per[sk].n++; if (x.ok) per[sk].r++; });
    P.post = { s, m, per, at: Date.now() }; saveP();
    const an = analyse();
    send({ kind: "posttest", skill: "all", score: s, max_score: m, detail: { per, weak: an.weak.map(w => w.k) } });
    location.hash = "#summary";
  } });
}
function analyse() {
  const rows = SKILLS.map(s => {
    const q = quizPct(s.k), p = P.post && P.post.per[s.k].n ? P.post.per[s.k].r / P.post.per[s.k].n : null;
    const vals = [q, p].filter(x => x != null);
    return { k: s.k, q, p, pct: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null };
  });
  const weak = rows.filter(r => r.pct != null).sort((a, b) => a.pct - b.pct || U.points[b.k] - U.points[a.k]).slice(0, 3);
  return { rows, weak };
}
function viewSummary() {
  const us = unitScore(), an = analyse();
  const v = $("#v-summary");
  v.innerHTML = `<div class="sh"><img src="${ICON("u6")}" alt=""><div><span class="k">สรุปผล Unit 6</span><h2>${me ? esc(me.name) : ""}</h2></div></div>
    <div class="card"><h3>คะแนนเก็บ Unit 6</h3><div class="score-strip"><span class="big-score">${us.total.toFixed(2)}</span><span>/ 10 คะแนน · ข้อสอบย่อยทำแล้ว ${us.done}/6</span></div>
      <table class="res"><tr><th>ทักษะ</th><th>ข้อสอบย่อย (ครั้งแรก)</th><th>คะแนนเก็บ</th></tr>
      ${SKILLS.map(s => { const q = P.quiz[s.k]; return `<tr><td>${s.name} · ${s.th}</td><td>${q && q.first ? q.first.s + "/" + q.first.m : "—"}</td><td>${q && q.first ? (U.points[s.k] * q.first.s / q.first.m).toFixed(2) : "—"} / ${U.points[s.k]}</td></tr>`; }).join("")}</table></div>
    <div class="card" style="margin-top:16px"><h3>ผลรายทักษะ</h3><p class="muted">เฉลี่ยจากข้อสอบย่อยและข้อสอบหลังเรียน</p><div class="skills">
      ${an.rows.map(r => `<div class="sk"><span>${SK[r.k].name}</span><span class="b"><i style="width:${r.pct == null ? 0 : r.pct * 100}%;background:${SK[r.k].c}"></i></span><b>${r.pct == null ? "—" : Math.round(r.pct * 100) + "%"}</b></div>`).join("")}</div></div>
    <div class="card" style="margin-top:16px"><h3>🚩 3 ทักษะที่ควรพัฒนาเร่งด่วน</h3>
      ${P.post ? `<div class="weak">${an.weak.map(w => `<div><b>${SK[w.k].name} · ${SK[w.k].th} (${Math.round(w.pct * 100)}%)</b><br>${esc(U.advice[w.k])}<br><a class="btn s" href="#${w.k}" style="margin-top:8px">ไปทบทวน ${SK[w.k].th} →</a></div>`).join("")}</div>`
        : `<p>ทำข้อสอบหลังเรียน 20 ข้อก่อน ระบบจะจัดอันดับทักษะที่ควรพัฒนาให้</p><a class="btn p" href="#posttest">ทำข้อสอบหลังเรียน →</a>`}</div>
    <div class="row" style="margin-top:16px"><a class="btn" href="#map">← แผนที่บทเรียน</a>${P.post ? `<a class="btn" href="#posttest">ทำข้อสอบหลังเรียนอีกครั้ง</a>` : ""}</div>`;
  show("summary");
}

/* ================= TEACHER ================= */
let TV = { tab: "slides", i: 0, pin: "", rows: null };
const TEACHER_HASH = "70300ccd47da1a93cc88b1fe027be4dd37727d3d7805f238dd5009f1a9a87d8a";
async function sha(t) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join(""); }
function teacherOk() { try { return sessionStorage.getItem("m3:t") === "1"; } catch (e) { return TV.ok; } }
function teacherGate() {
  const v = $("#v-teacher");
  v.innerHTML = `<div class="sh"><img src="${ICON("clipboard")}" alt=""><div><span class="k">โหมดครู</span><h2>ใส่รหัสครู</h2></div></div>
    <div class="card" style="max-width:480px"><p class="muted">โหมดครูมีโน้ตการสอน เฉลย และผลนักเรียน</p>
    <form id="tg" class="row"><input class="inp" id="tc" type="password" inputmode="numeric" autocomplete="off" placeholder="รหัสครู" style="flex:1"><button class="btn p">เข้าโหมดครู</button></form><div id="te"></div></div>`;
  show("teacher"); $("#tc").focus();
  $("#tg").onsubmit = async e => {
    e.preventDefault(); const c = $("#tc").value.trim(); let ok = false;
    try { ok = (await sha("m3-teacher:" + c)) === TEACHER_HASH; } catch (er) { ok = false; }
    if (!ok) { $("#te").innerHTML = `<div class="fb bad">รหัสไม่ถูกต้อง</div>`; return; }
    TV.ok = true; TV.pin = c; try { sessionStorage.setItem("m3:t", "1"); } catch (er) {}
    viewTeacher();
  };
}
function viewTeacher() {
  if (!teacherOk()) return teacherGate();
  const v = $("#v-teacher");
  v.innerHTML = `<div class="sh"><img src="${ICON("clipboard")}" alt=""><div><span class="k">โหมดครู</span><h2>Unit 6 · สไลด์สอนและผลนักเรียน</h2></div></div>
    <div class="steps">${[["slides", "📽️ สไลด์สอน"], ["results", "📊 ผลนักเรียน"], ["guide", "📘 โครงสร้างบทเรียน"]].map(([k, t]) => `<button data-t="${k}" class="${TV.tab === k ? "on" : ""}">${t}</button>`).join("")}</div><div id="tb"></div>`;
  $(".steps", v).onclick = e => { const b = e.target.closest("button"); if (b) { TV.tab = b.dataset.t; viewTeacher(); } };
  show("teacher");
  ({ slides: tSlides, results: tResults, guide: tGuide })[TV.tab]($("#tb", v));
}
/* ---------- animated answer reveal for exercise slides ---------- */
const SLIDE_KEYS = {
  match: { type: "match", ans: ["E", "B", "F", "C", "A", "D"] },
  practice1: { type: "blank", ans: ["has baked", "haven't seen", "has flown", "have eaten", "haven't visited", "has won"] },
  practice2: { type: "blank", ans: ["who", "where", "which", "where", "who", "which"] },
  exit: { type: "blank", ans: ["swum", "has never eaten", "haven't", "gone", "who"] }
};
function prepAnswers(frame, sid) {
  const K = SLIDE_KEYS[sid]; if (!K) return [];
  const items = [];
  if (K.type === "blank") {
    const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT); const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.includes("____")) nodes.push(walker.currentNode);
    let n = 0;
    nodes.forEach(t => {
      const parts = t.nodeValue.split("____"); const frag = document.createDocumentFragment();
      parts.forEach((txt, j) => {
        frag.appendChild(document.createTextNode(txt));
        if (j < parts.length - 1 && n < K.ans.length) {
          const w = document.createElement("span"); w.className = "kx";
          w.innerHTML = `<span class="kb">____</span><span class="ka">${esc(K.ans[n])}</span>`;
          frag.appendChild(w); n++;
        }
      });
      t.parentNode.replaceChild(frag, t);
    });
  } else if (K.type === "match") {
    const left = Array.from(frame.querySelectorAll("p")).filter(p => /^\s*[1-6]\./.test(p.textContent)).slice(0, 6);
    left.forEach((p, n) => p.insertAdjacentHTML("beforeend", ` <span class="kx"><span class="kb"></span><span class="ka">→ ${esc(K.ans[n])}</span></span>`));
  }
  return Array.from(frame.querySelectorAll(".kx"));
}
function sentenceOf(el) {
  const box = el.closest("li,p,div"); if (!box) return "";
  const c = box.cloneNode(true); c.querySelectorAll(".kb").forEach(x => x.remove());
  return c.textContent.replace(/^\s*\d+\.\s*/, "").replace(/ของ|คือ/g, " ").replace(/\s+/g, " ").trim();
}
function revealOne(x, speak) {
  if (!x || x.classList.contains("on")) return;
  x.classList.add("on");
  const fx = document.createElement("span"); fx.className = "kfx"; fx.textContent = "✨"; x.appendChild(fx); setTimeout(() => fx.remove(), 900);
  if (speak) setTimeout(() => say(sentenceOf(x)), 350);
}
function slideTitle(h) { const m = h.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/); return m ? m[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : ""; }
function slideViewer(el, teacher) {
  const S = window.SLIDES || [];
  const keyName = teacher ? "ti" : "si";
  let cur = LS.get(pkey() + ":" + keyName, 0);
  el.innerHTML = `<div class="spick-bar"><button class="btn s" id="pkt">☰ เลือกหน้าสไลด์</button><div class="spick-row" id="pkr">${S.map((x, n) => `<button data-n="${n}" title="${esc(slideTitle(x.html))}">${n + 1}</button>`).join("")}</div></div>
    <div class="spick hide" id="pk">${S.map((x, n) => `<button data-n="${n}"><b>${n + 1}</b><span>${esc(slideTitle(x.html) || "Slide " + (n + 1))}</span>${SLIDE_KEYS[x.id] ? '<i>เฉลย</i>' : ""}</button>`).join("")}</div>
    <div class="sv-full" id="svf"><div class="sv-stage" id="stg"><div class="sv-frame" id="frm"></div><button class="sv-tap l" id="tl" aria-label="ก่อนหน้า"></button><button class="sv-tap r" id="tr" aria-label="ถัดไป"></button></div></div>
    <div class="qnav"><button class="btn" id="pv">← ก่อนหน้า</button><span class="counter" id="ct"></span><div class="row">${teacher ? `<button class="btn" id="nt">📝 โน้ตครู</button>` : ""}<button class="btn p" id="fs">⛶ เต็มจอ</button><button class="btn" id="nx">ถัดไป →</button></div></div>
    <div class="row hide" id="kbar" style="margin-top:10px"><button class="btn p" id="k1">✨ ${teacher ? "เฉลยทีละข้อ" : "ดูเฉลยทีละข้อ"}</button><button class="btn" id="ka">เฉลยทั้งหมด</button><button class="btn" id="kh">ซ่อนเฉลย</button>
      <label class="row" style="gap:6px;font-size:15px"><input type="checkbox" id="ksp" checked> 🔊 อ่านประโยคเฉลย</label><span class="counter" id="kc"></span></div>
    ${teacher ? `<div class="notes hide" id="nts"></div>` : `<p class="tip" style="margin-top:12px">💡 ลองทำแบบฝึกในสไลด์เองก่อน แล้วค่อยกด “ดูเฉลยทีละข้อ”</p>`}
    <p class="muted" style="font-size:14px">← → / Space เปลี่ยนสไลด์ · A เฉลยทีละข้อ · Shift+A เฉลยทั้งหมด · H ซ่อนเฉลย · F เต็มจอ${teacher ? " · N โน้ตครู (โน้ตไม่แสดงตอนเต็มจอ)" : ""}</p>`;
  let keys = [];
  const kcount = () => { $("#kc", el).textContent = keys.length ? `เฉลยแล้ว ${keys.filter(x => x.classList.contains("on")).length} / ${keys.length}` : ""; };
  const kstep = () => { const nx = keys.find(x => !x.classList.contains("on")); if (nx) revealOne(nx, $("#ksp", el).checked); else toast("เฉลยครบทุกข้อแล้ว"); kcount(); };
  const kall = () => { keys.filter(x => !x.classList.contains("on")).forEach((x, n) => setTimeout(() => { revealOne(x, false); kcount(); }, n * 280)); };
  const khide = () => { keys.forEach(x => x.classList.remove("on")); kcount(); };
  const fit = () => { const st = $("#stg", el); if (st) $("#frm", el).style.transform = `scale(${st.clientWidth / 1920})`; };
  const go = i => {
    cur = Math.max(0, Math.min(S.length - 1, i)); LS.set(pkey() + ":" + keyName, cur);
    $("#frm", el).innerHTML = S[cur].html; keys = prepAnswers($("#frm", el), S[cur].id);
    $("#kbar", el).classList.toggle("hide", !keys.length); kcount();
    $("#ct", el).textContent = `หน้า ${cur + 1} / ${S.length}`;
    if (teacher) $("#nts", el).innerHTML = `<b>สไลด์ ${cur + 1}:</b> ${esc(S[cur].notes)}`;
    $$("#pkr button, #pk button", el).forEach(b => b.classList.toggle("on", +b.dataset.n === cur));
    const on = $(`#pkr button[data-n="${cur}"]`, el); if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "center" });
    $("#pv", el).disabled = cur === 0; $("#nx", el).disabled = cur === S.length - 1;
    fit();
  };
  const pick = e => { const b = e.target.closest("button[data-n]"); if (b) { go(+b.dataset.n); $("#pk", el).classList.add("hide"); } };
  $("#pkr", el).onclick = pick; $("#pk", el).onclick = pick;
  $("#pkt", el).onclick = () => $("#pk", el).classList.toggle("hide");
  $("#pv", el).onclick = $("#tl", el).onclick = () => go(cur - 1);
  $("#nx", el).onclick = $("#tr", el).onclick = () => go(cur + 1);
  if (teacher) $("#nt", el).onclick = () => $("#nts", el).classList.toggle("hide");
  $("#k1", el).onclick = kstep; $("#ka", el).onclick = kall; $("#kh", el).onclick = khide;
  $("#fs", el).onclick = () => { const f = $("#svf", el); try { document.fullscreenElement ? document.exitFullscreen() : f.requestFullscreen().catch(() => toast("เปิดเต็มจอไม่ได้")); } catch (e) { toast("เปิดเต็มจอไม่ได้"); } };
  window.onresize = fit; document.onfullscreenchange = () => setTimeout(fit, 60);
  document.onkeydown = e => {
    if (!$("#frm") || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(cur + 1); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) go(cur - 1);
    else if (e.key === "Home") go(0); else if (e.key === "End") go(S.length - 1);
    else if (e.key === "A" || (e.key === "a" && e.shiftKey)) kall(); else if (e.key === "a") kstep(); else if (/^[hH]$/.test(e.key)) khide();
    else if (/^[fF]$/.test(e.key)) $("#fs", el).click(); else if (teacher && /^[nN]$/.test(e.key)) $("#nt", el).click();
  };
  go(cur);
}
function tSlides(el) { slideViewer(el, true); }
function viewSlides() {
  const v = $("#v-station"); v.style.setProperty("--c", "var(--rose)");
  v.innerHTML = `<div class="sh"><img src="${ICON("u6")}" alt=""><div><span class="k">ทบทวนด้วยตนเอง</span><h2>สไลด์บทเรียน Unit 6</h2></div></div><div id="sb"></div>
    <div class="qnav"><a class="btn" href="#map">← แผนที่บทเรียน</a></div>`;
  show("station"); slideViewer($("#sb", v), false);
}
async function tResults(el) {
  el.innerHTML = `<div class="card" style="max-width:520px"><h3>ใส่ PIN ครู</h3><p class="muted">นักเรียนส่งคะแนนได้อย่างเดียว อ่านผลได้เฉพาะผู้มี PIN</p>
    <form id="pf" class="row"><input class="inp" id="pin" type="password" inputmode="numeric" placeholder="PIN" style="flex:1" value="${esc(TV.pin)}"><button class="btn p">ดูผล</button></form></div><div id="rs" style="margin-top:16px"></div>`;
  $("#pf", el).onsubmit = async e => {
    e.preventDefault(); TV.pin = $("#pin", el).value.trim();
    $("#rs", el).innerHTML = `<p>กำลังโหลด…</p>`;
    try {
      const r = await fetch(`${CFG.supabaseUrl}/rest/v1/rpc/${CFG.teacherFn}`, { method: "POST", headers: { apikey: CFG.supabaseKey, Authorization: `Bearer ${CFG.supabaseKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ p_pin: TV.pin, p_unit: U.id }) });
      if (!r.ok) throw new Error(r.status === 400 || r.status === 404 ? "PIN ไม่ถูกต้อง" : "โหลดไม่ได้ (" + r.status + ")");
      TV.rows = await r.json(); renderResults($("#rs", el));
    } catch (er) { $("#rs", el).innerHTML = `<div class="fb bad">${esc(er.message)}</div>`; }
  };
  if (TV.rows) renderResults($("#rs", el));
}
function renderResults(el) {
  const rows = TV.rows || [], by = {};
  rows.slice().reverse().forEach(r => {   // oldest first so "first attempt" wins
    const id = [r.class, r.student_no, r.student_name].join("|");
    const s = by[id] = by[id] || { name: r.student_name, cls: r.class, no: r.student_no, quiz: {}, post: null, writing: null };
    if (r.kind === "quiz" && !s.quiz[r.skill]) s.quiz[r.skill] = { s: +r.score, m: +r.max_score };
    if (r.kind === "posttest") s.post = r;
    if (r.kind === "writing") s.writing = r;
  });
  const list = Object.values(by).sort((a, b) => (a.cls || "").localeCompare(b.cls || "") || (+a.no || 0) - (+b.no || 0));
  const unit = s => SKILLS.reduce((t, k) => t + (s.quiz[k.k] ? U.points[k.k] * s.quiz[k.k].s / s.quiz[k.k].m : 0), 0);
  const csvRows = [["ห้อง", "เลขที่", "ชื่อ", ...SKILLS.map(s => s.name + " (/8)"), "คะแนนเก็บ (/10)", "Post-test (/20)", "ทักษะที่ควรพัฒนา 1", "2", "3", "งานเขียน"]].concat(
    list.map(s => [s.cls, s.no, s.name, ...SKILLS.map(k => s.quiz[k.k] ? s.quiz[k.k].s : ""), unit(s).toFixed(2), s.post ? s.post.score : "",
      ...((s.post && s.post.detail && s.post.detail.weak) || []).concat(["", "", ""]).slice(0, 3).map(k => k ? SK[k].th : ""), s.writing ? (s.writing.detail || {}).text || "" : ""]));
  el.innerHTML = `<div class="row" style="margin-bottom:10px"><b>${list.length} คน</b><button class="btn s p" id="csv">⬇ ดาวน์โหลด CSV (เปิดด้วย Excel)</button></div>
    <div class="tbl-wrap"><table class="res"><tr><th>ห้อง</th><th>เลขที่</th><th>ชื่อ</th>${SKILLS.map(s => `<th>${s.name}</th>`).join("")}<th>/10</th><th>Post</th><th>ควรพัฒนา</th><th>งานเขียน</th></tr>
    ${list.map(s => `<tr><td>${esc(s.cls)}</td><td>${esc(s.no)}</td><td>${esc(s.name)}</td>${SKILLS.map(k => `<td>${s.quiz[k.k] ? s.quiz[k.k].s : "—"}</td>`).join("")}
      <td><b>${unit(s).toFixed(2)}</b></td><td>${s.post ? s.post.score : "—"}</td><td>${s.post && s.post.detail ? (s.post.detail.weak || []).map(k => SK[k] ? SK[k].th : k).join(", ") : "—"}</td>
      <td>${s.writing ? `<details><summary>อ่าน</summary>${esc((s.writing.detail || {}).text || "")}</details>` : "—"}</td></tr>`).join("")}</table></div>`;
  $("#csv", el).onclick = () => {
    const csv = "﻿" + csvRows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = `unit6-results-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove();
  };
}
function tGuide(el) {
  el.innerHTML = `<div class="card"><h3>โครงสร้างบทเรียน Unit 6</h3>
    <table class="res" style="margin-top:10px"><tr><th>สถานี</th><th>ขั้นเรียน (Active learning)</th><th>ข้อสอบย่อย</th><th>คะแนนเก็บ</th></tr>
    ${SKILLS.map(s => `<tr><td>${s.name}<br><small>${s.th}</small></td><td>${STATION_STEPS[s.k].filter(x => x[0] !== "quiz").map(x => x[1]).join(" → ")}</td><td>8 ข้อ</td><td>${U.points[s.k]}</td></tr>`).join("")}
    <tr><td>Post-test</td><td>20 ข้อ ติดป้ายทักษะ → จัดอันดับ 3 ทักษะที่ควรพัฒนา</td><td>—</td><td>ไม่นับคะแนน</td></tr></table>
    <h3 style="margin-top:16px">โครงคะแนนรายวิชา (100)</h3>
    <table class="res" style="margin-top:8px"><tr><th>ส่วน</th><th>คะแนน</th></tr><tr><td>Unit 6 / 7 / 8 (บทละ 10)</td><td>30</td></tr><tr><td>ชิ้นงาน</td><td>10</td></tr><tr><td>สอบกลางภาค</td><td>20</td></tr><tr><td>สอบปลายภาค</td><td>20</td></tr><tr><td>จิตพิสัย</td><td>10</td></tr><tr><td>มาเรียน</td><td>10</td></tr></table>
    <p class="muted" style="margin-top:12px">ข้อสอบย่อยนับคะแนนครั้งแรก นักเรียนทำซ้ำเพื่อฝึกได้ · การพูดใช้ไมโครโฟนตรวจ (Chrome/Edge/Safari) · ความคืบหน้าเก็บในเครื่องนักเรียน คะแนนส่งเข้าฐานข้อมูลของครู</p></div>`;
}

/* ================= ROUTER ================= */
function route() {
  stopSay(); document.onkeydown = null; window.onresize = null;
  const h = (location.hash || "").slice(1);
  if (h === "teacher") return viewTeacher();
  if (!me) { if (!window.M3_PREVIEW) { location.replace("../index.html#login"); return; } return viewStart(); }
  if (!P) loadP();
  if (h === "start") return viewStart();
  if (SK[h]) return station(h);
  if (h === "posttest") return viewPost();
  if (h === "slides") return viewSlides();
  if (h === "summary") return viewSummary();
  viewMap();
}
whoLine(); if (me) loadP();
if (window.M3_PREVIEW) { const t = document.getElementById("tocLink"); if (t) t.remove(); }
window.addEventListener("hashchange", route);
route();
flushQueue();
window.addEventListener("online", flushQueue);
})();
