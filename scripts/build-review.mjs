// Собирает review/index.html — единую страницу для человека:
//   1) итог автотестов (test-results/e2e.json),
//   2) находки аудита (review/audit.json),
//   3) чек-лист «проверь сама» (docs/testing/human-checklist.json) со скриншотами.
// Страница самодостаточна (картинки встроены), её можно открыть локально или опубликовать.
// Запуск: npm run review   (сначала снимает скриншоты, затем собирает страницу)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...p) => path.join(root, ...p);
const readJson = (p) => (fs.existsSync(rel(p)) ? JSON.parse(fs.readFileSync(rel(p), 'utf8')) : null);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const checklist = readJson('docs/testing/human-checklist.json');
const audit = readJson('review/audit.json');
const e2e = readJson('test-results/e2e.json');
const shotsDir = rel('review/screenshots');

let commit = '';
try { commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(); } catch {}

// --- автотесты ---
const tests = [];
const walk = (suite, trail) => {
  for (const s of suite.suites || []) walk(s, [...trail, s.title]);
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const last = t.results[t.results.length - 1] || {};
      tests.push({
        title: [...trail.slice(1), spec.title].filter(Boolean).join(' › '),
        file: spec.file, project: t.projectName, status: t.status, // expected | unexpected | flaky | skipped
        expectedStatus: t.expectedStatus, annotations: t.annotations || [], error: last.error?.message || '',
      });
    }
  }
};
if (e2e) for (const s of e2e.suites) walk(s, [s.title]);
const passed = tests.filter((t) => t.status === 'expected' && t.expectedStatus === 'passed');
const failed = tests.filter((t) => t.status === 'unexpected');
const knownBugs = tests.filter((t) => t.status === 'expected' && t.expectedStatus === 'failed');
const humanNotes = tests.flatMap((t) => t.annotations.filter((a) => a.type === 'human-check').map((a) => a.description));

// --- скриншоты ---
const shot = (name) => {
  const f = path.join(shotsDir, `${name}.jpg`);
  return fs.existsSync(f) ? `data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}` : null;
};
const shotLabel = (n) => n.replace(/-(desktop|tablet|mobile)$/, (_, v) => ` · ${{ desktop: 'компьютер', tablet: 'планшет', mobile: 'телефон' }[v]}`)
  .replace(/^top/, 'Первый экран').replace(/^ai-creator/, 'AI-CREATOR').replace(/^handmade/, 'Handmade')
  .replace(/^about/, 'Обо мне').replace(/^contacts/, 'Контакты').replace(/^full/, 'Вся страница')
  .replace(/^lightbox-image/, 'Просмотр картины').replace(/^lightbox-storyboard/, 'Просмотр раскадровки');

const sevLabel = { high: 'Важно', medium: 'Средне', low: 'Мелочь', info: 'Инфо' };
const uniqueTitles = (arr) => [...new Map(arr.map((t) => [t.title, t])).values()];

const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Проверка сайта Ineczka</title>
<style>
:root{--bg:#F6F5F8;--card:#FFFFFF;--ink:#29292B;--muted:#6C6B71;--line:#E4E3E8;--brand:#782182;--ok:#2E7D4F;--okbg:#E6F4EC;--warn:#A0561B;--warnbg:#FCEFE3;--bad:#B3261E;--badbg:#FBE9E8;--chip:#EFEDF3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17161A;--card:#211F25;--ink:#EDEBF0;--muted:#A19FA8;--line:#34313A;--brand:#C98AD1;--ok:#7BD3A0;--okbg:#1C3327;--warn:#F0B37E;--warnbg:#3A2A1C;--bad:#F2A09A;--badbg:#3B1F1D;--chip:#2C2931}}
:root[data-theme="dark"]{--bg:#17161A;--card:#211F25;--ink:#EDEBF0;--muted:#A19FA8;--line:#34313A;--brand:#C98AD1;--ok:#7BD3A0;--okbg:#1C3327;--warn:#F0B37E;--warnbg:#3A2A1C;--bad:#F2A09A;--badbg:#3B1F1D;--chip:#2C2931}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1040px;margin:0 auto;padding:28px 16px 80px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:40px 0 12px}.muted{color:var(--muted)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:20px 0}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}.stat b{display:block;font-size:26px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin:12px 0}
.chip{display:inline-block;font-size:12px;padding:2px 8px;border-radius:999px;background:var(--chip);color:var(--muted);margin-right:6px}
.sev-high{background:var(--badbg);color:var(--bad)}.sev-medium{background:var(--warnbg);color:var(--warn)}
details summary{cursor:pointer;font-weight:600}ul.small{margin:8px 0 0;padding-left:18px;font-size:13px;color:var(--muted)}
.shots{display:flex;gap:10px;overflow-x:auto;margin:12px 0;padding-bottom:4px}
.shots figure{margin:0;flex:0 0 auto}.shots img{height:180px;width:auto;border-radius:8px;border:1px solid var(--line);cursor:zoom-in;display:block}
.shots figcaption{font-size:12px;color:var(--muted);margin-top:4px}
.why{font-size:13px;color:var(--muted);border-left:3px solid var(--line);padding-left:10px;margin:10px 0}
.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:8px 14px;cursor:pointer}
button.on-ok{background:var(--okbg);border-color:var(--ok);color:var(--ok)}button.on-fix{background:var(--warnbg);border-color:var(--warn);color:var(--warn)}
textarea{width:100%;min-height:60px;margin-top:10px;font:inherit;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--bg);color:var(--ink)}
.card.done-ok{border-color:var(--ok)}.card.done-fix{border-color:var(--warn)}
.bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap}
.progress{font-weight:600}
#zoom{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:flex-start;justify-content:center;overflow:auto;z-index:9;padding:16px;cursor:zoom-out}
#zoom img{max-width:100%;height:auto}
</style></head><body>
<div class="wrap">
<h1>Проверка сайта Ineczka</h1>
<div class="muted">Собрано ${esc(new Date().toLocaleString('ru-RU'))}${commit ? ` · версия ${esc(commit)}` : ''}</div>

<div class="stats">
  <div class="stat"><b style="color:var(--ok)">${uniqueTitles(passed).length}</b>автопроверок пройдено</div>
  <div class="stat"><b style="color:var(--bad)">${uniqueTitles(failed).length}</b>автопроверок упало</div>
  <div class="stat"><b style="color:var(--warn)">${uniqueTitles(knownBugs).length}</b>известных багов</div>
  <div class="stat"><b>${checklist.items.length}</b>вопросов к тебе</div>
</div>
${e2e ? '' : '<div class="card">Автотесты ещё не запускались — выполни <code>npm test</code> перед <code>npm run review</code>.</div>'}

<h2>1. Проверь сама — это может только человек</h2>
<p class="muted">Посмотри скриншоты (клик — увеличить), нажми «Всё хорошо» или «Нужна правка» и, если нужно, напиши комментарий. Ответы сохраняются в этом браузере. В конце нажми «Скопировать ответы» и отправь их Claude.</p>
${checklist.items.map((it) => `
<div class="card" data-id="${esc(it.id)}">
  <span class="chip">${esc(it.area)}</span><span class="chip">${esc(it.id)}</span>
  <h3 style="margin:8px 0 6px;font-size:17px">${esc(it.title)}</h3>
  <div>${esc(it.how)}</div>
  ${it.shots.length ? `<div class="shots">${it.shots.map((s) => { const src = shot(s); return src ? `<figure><img src="${src}" alt="${esc(shotLabel(s))}"><figcaption>${esc(shotLabel(s))}</figcaption></figure>` : ''; }).join('')}</div>` : ''}
  <div class="why">Почему не робот: ${esc(it.why)}</div>
  <div class="btns"><button data-v="ok">✅ Всё хорошо</button><button data-v="fix">✏️ Нужна правка</button></div>
  <textarea placeholder="Комментарий: что именно поправить"></textarea>
</div>`).join('')}

<h2>2. Что нашли автотесты (стоит решить, чинить ли)</h2>
${audit ? audit.findings.map((f) => `
<div class="card"><span class="chip sev-${f.severity}">${sevLabel[f.severity]}</span><span class="chip">${esc(f.id)}</span>
<details${f.severity === 'high' ? ' open' : ''}><summary>${esc(f.title)}</summary><ul class="small">${f.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></details></div>`).join('')
  : '<div class="card muted">Аудит не запускался (npm run test:audit).</div>'}

<h2>3. Известные баги (тест описывает правильное поведение, сейчас оно нарушено)</h2>
${knownBugs.length ? uniqueTitles(knownBugs).map((t) => `<div class="card"><b>${esc(t.title)}</b><div class="muted" style="font-size:13px">${esc(t.annotations.filter((a) => a.type === 'fail').map((a) => a.description).join('; '))}</div></div>`).join('') : '<div class="card muted">Нет.</div>'}

${failed.length ? `<h2>Упавшие автотесты</h2>${failed.map((t) => `<div class="card sev-high"><b>[${esc(t.project)}] ${esc(t.title)}</b><ul class="small"><li>${esc(t.error.split('\n')[0])}</li></ul></div>`).join('')}` : ''}

<h2>4. Что робот проверил сам</h2>
<details class="card"><summary>Показать все ${uniqueTitles(passed).length} пройденных проверок</summary>
<ul class="small">${uniqueTitles(passed).map((t) => `<li>${esc(t.title)}</li>`).join('')}</ul></details>
${humanNotes.length ? `<div class="card"><b>Пометки робота «нужен человек»:</b><ul class="small">${[...new Set(humanNotes)].map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>` : ''}
</div>

<div class="bar"><span class="progress" id="progress"></span><button id="copy">📋 Скопировать ответы</button><button id="reset">Сбросить</button></div>
<div id="zoom"><img alt=""></div>
<script>
(function(){
  var KEY='ineczka-review-${esc(commit || 'local')}';
  var state={};try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
  var cards=[].slice.call(document.querySelectorAll('.card[data-id]'));
  function paint(){var n=0;cards.forEach(function(c){var s=state[c.dataset.id]||{};
    c.classList.toggle('done-ok',s.v==='ok');c.classList.toggle('done-fix',s.v==='fix');if(s.v)n++;
    c.querySelector('[data-v="ok"]').classList.toggle('on-ok',s.v==='ok');c.querySelector('[data-v="fix"]').classList.toggle('on-fix',s.v==='fix');
    var ta=c.querySelector('textarea');if(document.activeElement!==ta)ta.value=s.c||'';});
    document.getElementById('progress').textContent='Отвечено '+n+' из '+cards.length;}
  cards.forEach(function(c){var id=c.dataset.id;
    c.querySelectorAll('button[data-v]').forEach(function(b){b.onclick=function(){state[id]=state[id]||{};state[id].v=b.dataset.v;save();paint();}});
    c.querySelector('textarea').oninput=function(e){state[id]=state[id]||{};state[id].c=e.target.value;save();paint();};});
  document.getElementById('copy').onclick=function(){
    var lines=['# Ответы по проверке сайта (${esc(commit)})',''];
    cards.forEach(function(c){var s=state[c.dataset.id]||{};var t=c.querySelector('h3').textContent;
      lines.push('- ['+(s.v==='ok'?'x':' ')+'] '+c.dataset.id+' — '+t+': '+(s.v==='ok'?'всё хорошо':s.v==='fix'?'НУЖНА ПРАВКА':'не проверено')+(s.c?'\\n  > '+s.c.replace(/\\n/g,'\\n  > '):''));});
    var txt=lines.join('\\n');
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){alert('Скопировано — вставь в чат с Claude')},function(){prompt('Скопируй текст:',txt)});};
  document.getElementById('reset').onclick=function(){if(confirm('Сбросить все ответы?')){state={};save();paint();}};
  var z=document.getElementById('zoom');
  document.querySelectorAll('.shots img').forEach(function(i){i.onclick=function(){z.firstChild.src=i.src;z.style.display='flex'}});
  z.onclick=function(){z.style.display='none'};
  paint();
})();
</script>
</body></html>`;

fs.mkdirSync(rel('review'), { recursive: true });
fs.writeFileSync(rel('review/index.html'), html);
console.log(`review/index.html собран: ${passed.length} ok, ${failed.length} упало, ${knownBugs.length} известных багов, ${checklist.items.length} ручных проверок`);
