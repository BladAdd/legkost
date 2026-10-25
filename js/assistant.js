/* «Лёгкость» — ИИ-помощник.
   Два режима:
   • cloud  — бесплатный облачный ИИ (без ключа и без ноутбука). Работает у всех посетителей.
   • local  — свой шлюз server/ai-gateway.mjs → Ollama (быстрее и приватнее, но нужен запущенный ПК).
   Если сети нет совсем — отвечает офлайн по данным плана (бюджет, БЖУ, блюда считает код).
   ИИ только предлагает действия, применяет их пользователь.
*/
'use strict';

/* ВАЖНО: модуль обёрнут в IIFE, чтобы не перезаписывать глобальные
   функции приложения (render, init, esc и т.д.). Наружу отдаём только AI. */
(function () {

const CLOUD_URL = 'https://text.pollinations.ai/openai';
const CLOUD_MODEL = 'openai-fast';
const CLOUD_LABEL = 'GPT-OSS 20B · облако';
const LOCAL_DEFAULT = 'http://127.0.0.1:3001';
const COOLDOWN_KEY = 'legkost.ai.cooldown';

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) { return fallback; }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

const AI = {
  enabled: true,
  open: false,
  loading: false,
  available: true,
  mode: readLS('legkost.ai.mode', 'cloud') === 'local' ? 'local' : 'cloud',
  model: CLOUD_MODEL,
  gateway: readLS('legkost.ai.gateway', '') || LOCAL_DEFAULT,
  messages: [], // {role, content, ts, note}
  lastError: '',
  cooldownUntil: Number(readLS(COOLDOWN_KEY, '0')) || 0,
  quickActions: [
    { label: '💰 Сделай дешевле', prompt: 'Сделай рацион дешевле в рамках текущего бюджета. Предложи 3 конкретные замены блюд и продуктов.' },
    { label: '🥩 Больше белка', prompt: 'Подбери блюда с большим количеством белка, не выходя за бюджет.' },
    { label: '🍽️ Что приготовить сегодня', prompt: 'Расскажи, что приготовить сегодня из запланированного. Кратко и по шагам.' },
    { label: '🔄 Замени ужин', prompt: 'Замени ужин в ближайшие дни на что-то быстрое (до 30 мин) и дешёвое.' },
    { label: '🛒 Разбор списка', prompt: 'Разбери список покупок: что купить в первую очередь, что можно заменить, где сэкономить.' },
    { label: '⚠️ Бюджет превышен', prompt: 'Бюджет превышен. Какие блюда заменить, чтобы уложиться, не теряя белка?' }
  ]
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtMoney(n) {
  const v = Math.round(Number(n) || 0);
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

/* Лёгкое форматирование ответа: **жирный**, маркированные списки, без сырого markdown */
function formatMessage(text) {
  let safe = esc(text);
  safe = safe.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/(^|\n)#{1,4}\s*/g, '$1');
  safe = safe.replace(/(^|\n)[-*]\s+/g, '$1• ');
  return safe.replace(/\n/g, '<br>');
}

/* ───────── КОНТЕКСТ ДЛЯ ИИ ───────── */
function buildContext() {
  const bridge = window.__legkostAI;
  if (!bridge || !bridge.getContext) return null;
  const ctx = bridge.getContext() || {};
  if (!ctx.meals) return null;
  const today = new Date();
  const dayIdx = ctx.dayIdx !== undefined ? ctx.dayIdx : today.getDay();
  const dayName = ctx.daysShort ? ctx.daysShort[dayIdx] : '';
  const parts = [];
  parts.push('Ты — помощник приложения «Лёгкость» (семейный рацион, Орск). Отвечай по-русски, кратко и по делу.');
  parts.push('Формат: максимум 4–6 коротких предложений или список из 3–5 пунктов. Не рассуждай вслух, не пересказывай задание — сразу давай ответ.');
  parts.push('Сегодня: ' + (ctx.weekday || '') + ' (' + dayName + ').');
  if (ctx.meals && ctx.meals.length) {
    parts.push('Запланировано на сегодня:');
    ctx.meals.forEach(function (m) {
      parts.push('- ' + m.slotName + ': ' + m.dishName + ' · ' + m.time + ' мин · ' + m.cost + ' ₽ (' + m.perPortion + ' ₽/порц) · ' + m.portions + ' порц.');
    });
    parts.push('Стоимость дня: ' + ctx.dayCost + ' ₽. БЖУ: ккал ' + ctx.macros.kcal + ', Б ' + ctx.macros.p + ', Ж ' + ctx.macros.f + ', У ' + ctx.macros.c + '.');
  } else {
    parts.push('На сегодня блюд не запланировано.');
  }
  parts.push('Неделя: ' + ctx.people + ' чел., бюджет ' + fmtMoney(ctx.budget) + ', потрачено по плану ' + fmtMoney(ctx.cost) + ' (' + (ctx.under ? 'в рамках' : 'превышение на ' + fmtMoney(Math.abs(ctx.over))) + ').');
  if (ctx.week && ctx.week.length) {
    parts.push('Блюда недели:');
    ctx.week.forEach(function (d) {
      if (!d.meals || !d.meals.length) return;
      parts.push('- ' + d.day + ': ' + d.meals.map(function (m) { return m.slot + ' — ' + m.name + ' (' + m.cost + ' ₽)'; }).join('; ') + '. Итого ' + d.cost + ' ₽.');
    });
  }
  if (ctx.proteinPool && ctx.proteinPool.length) {
    parts.push('Лучший белок за рубль (обед/ужин): ' + ctx.proteinPool.slice(0, 4).map(function (d) {
      return d.name + ' — Б' + d.protein + ' г за ' + d.cost + ' ₽';
    }).join('; ') + '.');
  }
  if (ctx.shop) {
    parts.push('Список покупок: ' + ctx.shop.count + ' позиций, по граммам ' + fmtMoney(ctx.shop.gramsTotal) + ', целыми упаковками ≈ ' + fmtMoney(ctx.shop.total) + '.');
  }
  parts.push('Магазин: ' + ctx.store + ' (' + ctx.region + '). Цены: ' + ctx.priceSource + '.');
  if (ctx.allergies.length) parts.push('Аллергии: ' + ctx.allergies.join(', ') + '.');
  if (ctx.stops.length) parts.push('Не есть: ' + ctx.stops.join(', ') + '.');
  parts.push('Если предлагаешь замену блюда, укажи: день (ПН–ВС), приём (завтрак/обед/ужин) и причину. Не выдумывай блюд, которых нет в неделе.');
  return parts.join('\n');
}

/* ───────── РЕНДЕР ПАНЕЛИ ───────── */
/* Перерисовывает страницу приложения. app.js сам обновляет #ai-root через AI.render(). */
function paint() {
  try {
    if (typeof window.render === 'function') {
      window.render();
      return;
    }
  } catch (e) { /* приложение ещё не инициализировано */ }
  const root = document.getElementById('ai-root');
  if (root) root.innerHTML = AI.available ? render() : '';
}

function toggle() {
  AI.open = !AI.open;
  paint();
  if (AI.open) scrollToBottom();
}

function close() { AI.open = false; paint(); }

function clearChat() {
  AI.messages = [];
  AI.lastError = '';
  paint();
}

function addMessage(role, content, note) {
  AI.messages.push({ role: role, content: content || '', ts: Date.now(), note: note || '' });
  paint();
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(function () {
    const box = document.getElementById('ai-messages');
    if (box) box.scrollTop = box.scrollHeight;
  }, 60);
}

function setMode(mode) {
  AI.mode = mode === 'local' ? 'local' : 'cloud';
  AI.model = AI.mode === 'local' ? 'локальная модель' : CLOUD_MODEL;
  AI.lastError = '';
  AI.messages = [];
  writeLS('legkost.ai.mode', AI.mode);
  paint();
  if (AI.mode === 'local') checkHealth().then(function (ok) {
    if (!ok) {
      AI.lastError = 'Локальный шлюз не отвечает. Запусти server/start-ai.bat или переключись на облако.';
      paint();
    } else {
      AI.lastError = '';
      paint();
    }
  });
}

function setGateway(url) {
  AI.gateway = url || LOCAL_DEFAULT;
  writeLS('legkost.ai.gateway', AI.gateway);
  setMode('local');
}

async function checkHealth() {
  try {
    const res = await fetch(AI.gateway + '/api/ai/health', { cache: 'no-store' });
    if (!res.ok) throw new Error('health ' + res.status);
    const data = await res.json();
    if (data.model) AI.model = data.model;
    return !!(data.ok && data.ollama);
  } catch (e) { return false; }
}

/* ───────── ЗАПРОСЫ ───────── */
async function chatCloud(messages) {
  const payload = JSON.stringify({ model: CLOUD_MODEL, messages: messages, temperature: 0.4, private: true });

  async function attempt() {
    const res = await fetch(CLOUD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    const raw = await res.text();
    let data = null;
    try { data = JSON.parse(raw); } catch (e) { data = null; }

    if (res.status === 402) {
      const msg = (data && data.error && data.error.message) || '';
      const wait = /retry after (\d+)\s*s/i.exec(msg);
      const sec = wait ? Math.max(5, parseInt(wait[1], 10)) : 30;
      AI.cooldownUntil = Date.now() + sec * 1000;
      writeLS(COOLDOWN_KEY, String(AI.cooldownUntil));
      const err = new Error('Лимит бесплатных ответов: 1 раз в 30 секунд. Подожди ' + sec + ' сек.');
      err.cooldown = sec;
      throw err;
    }
    if (res.status >= 500) {
      const err = new Error('облако перегружено (' + res.status + ')');
      err.retryable = true;
      throw err;
    }
    if (!res.ok) throw new Error('облако ответило ' + res.status);
    const content = data && data.choices && data.choices[0] && data.choices[0].message
      ? (data.choices[0].message.content || '')
      : (typeof raw === 'string' ? raw : '');
    if (!content.trim()) throw new Error('пустой ответ облака');
    return content.trim();
  }

  try {
    return await attempt();
  } catch (e) {
    if (!e.retryable) throw e;
    await new Promise(function (r) { setTimeout(r, 1200); });
    return attempt();
  }
}

async function chatLocal(messages) {
  const res = await fetch(AI.gateway + '/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages, model: AI.model, temperature: 0.4, stream: false })
  });
  if (!res.ok) throw new Error('шлюз ответил ' + res.status);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'ошибка шлюза');
  if (!data.content) throw new Error('пустой ответ модели');
  if (data.model) AI.model = data.model;
  return data.content;
}

/* ───────── ОФЛАЙН-ОТВЕТ (без сети) ───────── */
function offlineAnswer(text) {
  const q = String(text || '').toLowerCase();
  const bridge = window.__legkostAI;
  const ctx = bridge && bridge.getContext ? bridge.getContext() : null;
  if (!ctx) {
    return 'Пока нет плана на неделю. Сгенерируй рацион — и я смогу подсказать по бюджету, белку и покупкам.';
  }
  const lines = [];

  if (/покуп|список|магазин|корзин|купить/.test(q) && ctx.shop) {
    lines.push('В списке ' + ctx.shop.count + ' позиций на ' + fmtMoney(ctx.shop.gramsTotal) + ' по граммам.');
    lines.push('Целыми упаковками выйдет ≈ ' + fmtMoney(ctx.shop.total) + ' — остатки перейдут на следующие недели.');
    if (ctx.shop.items && ctx.shop.items.length) {
      lines.push('Начать стоит с: ' + ctx.shop.items.slice(0, 5).map(function (i) {
        return i.name + ' (' + fmtMoney(i.price) + ')';
      }).join(', ') + '.');
    }
    return lines.join('\n');
  }

  if (/белок|протеин|мясо|рыб|сытн/.test(q) && ctx.proteinPool && ctx.proteinPool.length) {
    lines.push('Больше всего белка за рубль (на семью):');
    ctx.proteinPool.slice(0, 5).forEach(function (d) {
      lines.push('• ' + d.name + ' — Б' + d.protein + ' г за ' + fmtMoney(d.cost));
    });
    lines.push('Сейчас в плане ' + Math.round(ctx.macros.p) + ' г белка в среднем за день.');
    return lines.join('\n');
  }

  if (/бюджет|дорого|дешев|эконом|улож|перерасход|превыш/.test(q)) {
    if (ctx.under) {
      lines.push('В бюджет укладываемся: план ' + fmtMoney(ctx.cost) + ' из ' + fmtMoney(ctx.budget) + '.');
      lines.push('Остаток ' + fmtMoney(ctx.budget - ctx.cost) + '. Можно добавить рыбу или больше фруктов.');
    } else {
      lines.push('Перерасход ' + fmtMoney(Math.abs(ctx.over)) + ': план ' + fmtMoney(ctx.cost) + ' при бюджете ' + fmtMoney(ctx.budget) + '.');
      lines.push('Самый быстрый способ — заменить самое дорогое блюдо недели на блюдо из дешёвого белка:');
      (ctx.proteinPool || []).slice(-3).forEach(function (d) {
        lines.push('• ' + d.name + ' — ' + fmtMoney(d.cost));
      });
    }
    return lines.join('\n');
  }

  if (/сегодня|приготов|ужин|обед|завтрак|меню|план/.test(q)) {
    if (!ctx.meals || !ctx.meals.length) return 'На сегодня ничего не запланировано — свободный день.';
    lines.push('Сегодня (' + ctx.weekday + '):');
    ctx.meals.forEach(function (m) {
      lines.push('• ' + m.slotName + ': ' + m.dishName + ' — ' + m.time + ' мин, ' + fmtMoney(m.cost) + ' (' + m.perPortion + ' ₽/порц, ' + m.portions + ' порц.)');
    });
    lines.push('Итого ' + fmtMoney(ctx.dayCost) + ', ' + Math.round(ctx.macros.kcal) + ' ккал, Б' + Math.round(ctx.macros.p) + ' / Ж' + Math.round(ctx.macros.f) + ' / У' + Math.round(ctx.macros.c) + '.');
    lines.push('Шаги приготовления — в карточке блюда.');
    return lines.join('\n');
  }

  lines.push('Коротко по неделе: ' + ctx.people + ' чел., план ' + fmtMoney(ctx.cost) + ' при бюджете ' + fmtMoney(ctx.budget) + ' (' + (ctx.under ? 'в рамках' : 'перерасход ' + fmtMoney(Math.abs(ctx.over))) + ').');
  if (ctx.meals && ctx.meals.length) {
    lines.push('Сегодня: ' + ctx.meals.map(function (m) { return m.slotName.toLowerCase() + ' — ' + m.dishName; }).join(', ') + '.');
  }
  lines.push('Спроси про бюджет, белок, список покупок или что приготовить сегодня.');
  return lines.join('\n');
}

/* ───────── ОТПРАВКА ───────── */
function cooldownLeft() {
  return Math.max(0, Math.ceil((AI.cooldownUntil - Date.now()) / 1000));
}

let cooldownTimer = null;
function startCooldownTicker() {
  if (cooldownTimer) return;
  cooldownTimer = setInterval(function () {
    const el = document.querySelector('#ai-root .ai-status');
    const left = cooldownLeft();
    if (el) {
      if (left > 0) {
        el.className = 'ai-status warn';
        el.textContent = '⏳ Бесплатный лимит · ещё ' + left + ' сек.';
      } else {
        el.className = 'ai-status ok';
        el.textContent = AI.mode === 'local' ? '✓ Локальный шлюз · ' + AI.model : '✓ Облачный помощник · бесплатно';
      }
    }
    if (left <= 0) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
}

async function sendMessage(text) {
  if (AI.loading) return;
  const value = String(text || '').trim();
  if (!value) return;

  const left = cooldownLeft();
  if (left > 0) {
    addMessage('assistant', 'Секунду — бесплатный ИИ отвечает раз в 30 секунд. Осталось ' + left + ' сек.', 'wait');
    return;
  }

  AI.loading = true;
  addMessage('user', value);

  const context = buildContext();
  const messages = [];
  if (context) messages.push({ role: 'system', content: context });
  // последние 6 реплик для связного диалога
  AI.messages.slice(-7, -1).forEach(function (m) {
    if (m.note === 'offline' || m.note === 'wait') return;
    messages.push({ role: m.role, content: m.content });
  });
  messages.push({ role: 'user', content: value });

  try {
    const content = AI.mode === 'local'
      ? await chatLocal(messages)
      : await chatCloud(messages);
    AI.lastError = '';
    addMessage('assistant', content);
    parseActions(content);
  } catch (e) {
    const msg = String(e && e.message ? e.message : e);
    if (e && e.cooldown) {
      AI.lastError = msg;
      addMessage('assistant', '⏳ ' + msg);
      startCooldownTicker();
    } else {
      AI.lastError = '';
      const local = offlineAnswer(value);
      addMessage('assistant', local, 'offline');
      const why = AI.mode === 'local'
        ? 'Локальный шлюз не отвечает (' + msg + ').'
        : 'Облако не ответило (' + msg + ').';
      addMessage('assistant', why + ' Это ответ по твоему плану без ИИ.', 'note');
    }
  } finally {
    AI.loading = false;
    paint();
  }
}

function quickSend(prompt) { sendMessage(prompt); }

/* ───────── РАЗБОР ДЕЙСТВИЙ ИЗ ОТВЕТА ИИ ───────── */
function parseActions(text) {
  // Ищем JSON-блоки вида {"action":...} в ответе
  const bridge = window.__legkostAI;
  if (!bridge || !bridge.applyAction) return;

  const blocks = [];
  const re = /\{[\s\S]*?"action"[\s\S]*?\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    try {
      const action = JSON.parse(m[0]);
      if (action && action.action) blocks.push(action);
    } catch (e) {}
  }

  if (!blocks.length) return;

  const container = document.getElementById('ai-actions');
  if (!container) return;
  container.innerHTML = '';
  blocks.forEach(function (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-action-btn';
    btn.textContent = 'Применить: ' + esc(action.action + (action.reason ? ' (' + action.reason + ')' : ''));
    btn.onclick = function () {
      bridge.applyAction(action);
      container.innerHTML = '';
      addMessage('assistant', 'Действие применено: ' + esc(action.action));
    };
    container.appendChild(btn);
  });
}

/* ───────── HTML ───────── */
function statusHTML() {
  const left = cooldownLeft();
  if (left > 0) {
    return '<div class="ai-status warn">⏳ Бесплатный лимит · ещё ' + left + ' сек.</div>';
  }
  if (AI.lastError) {
    return '<div class="ai-status warn">⚠️ ' + esc(AI.lastError) + '</div>';
  }
  if (AI.mode === 'local') {
    return '<div class="ai-status ok">✓ Локальный шлюз · ' + esc(AI.model) + '</div>';
  }
  return '<div class="ai-status ok">✓ Облачный помощник · бесплатно</div>';
}

function render() {
  if (!AI.available) return '';
  if (!AI.open) {
    return '<button type="button" class="ai-chat-open" data-action="ai-toggle">🤖 Помощник</button>';
  }
  const header = '<div class="ai-header"><span class="ai-title">🤖 Помощник</span>' +
    '<button type="button" class="ai-chat-close" data-action="ai-close">Закрыть</button></div>';

  const msgs = AI.messages.map(function (m) {
    const cls = 'ai-msg ai-' + m.role + (m.note === 'offline' ? ' ai-offline' : '');
    const time = new Date(m.ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return '<div class="' + cls + '"><div class="ai-msg-bubble">' + formatMessage(m.content) + '</div><div class="ai-msg-time">' + time + '</div></div>';
  }).join('');

  const quicks = AI.quickActions.map(function (q) {
    return '<button type="button" class="ai-quick" data-action="ai-quick" data-prompt="' + esc(q.prompt) + '">' + esc(q.label) + '</button>';
  }).join('');

  const modeRow = '<div class="ai-mode">' +
    '<button type="button" class="ai-mode-btn' + (AI.mode === 'cloud' ? ' active' : '') + '" data-action="ai-mode" data-mode="cloud">🌐 Облако</button>' +
    '<button type="button" class="ai-mode-btn' + (AI.mode === 'local' ? ' active' : '') + '" data-action="ai-mode" data-mode="local">💻 Свой ПК</button>' +
    '</div>';

  const body = AI.messages.length
    ? '<div class="ai-messages" id="ai-messages">' + msgs + '</div>'
    : '<div class="ai-empty" id="ai-messages">' +
      '<div class="ai-empty-emoji">🤖</div>' +
      '<p>Спроси про бюджет, белок, покупки или что приготовить сегодня. Я вижу твой план и считаю по нему.</p>' +
      '<p class="ai-empty-note">Бюджет и БЖУ считает сам сайт — ИИ только советует.</p>' +
      '</div>';

  const privacy = AI.mode === 'local'
    ? 'Локальный режим: запросы идут только на твой ПК, данные не покидают устройство.'
    : 'Облачный режим: текст запроса и план недели уходят на внешний бесплатный сервис. Нужна приватность — переключись на «Свой ПК».';

  return '<div class="ai-panel">' +
    header +
    statusHTML() +
    modeRow +
    body +
    (AI.loading ? '<div class="ai-typing"><span></span><span></span><span></span></div>' : '') +
    (AI.messages.length ? '<div class="ai-actions" id="ai-actions"></div>' : '') +
    '<div class="ai-quicks">' + quicks + '</div>' +
    '<div class="ai-input-wrap">' +
    '<input type="text" id="ai-input" placeholder="Спроси помощника…" data-action="ai-input"' + (AI.loading ? ' disabled' : '') + '>' +
    '<button type="button" class="ai-send" data-action="ai-send"' + (AI.loading ? ' disabled' : '') + '>Отправить</button>' +
    '</div>' +
    '<p class="ai-disclaimer">' + privacy + ' Советы ИИ могут быть неточными — цены и БЖУ проверяй в карточках блюд.</p>' +
    '</div>';
}

function handleInput(e) {
  if (e.target && e.target.id === 'ai-input' && e.key === 'Enter') {
    e.preventDefault();
    const val = e.target.value.trim();
    if (val) { e.target.value = ''; sendMessage(val); }
  }
}

function init() {
  document.addEventListener('keydown', handleInput);
  // Локальный режим: проверяем шлюз один раз. Облако проверяем первым запросом,
  // чтобы не тратить бесплатный лимит на health-check.
  if (AI.mode === 'local') {
    checkHealth().then(function (ok) {
      if (!ok) {
        AI.lastError = 'Локальный шлюз не отвечает. Запусти server/start-ai.bat или переключись на облако.';
      }
      paint();
    });
  }
}

window.LegkostAI = AI;
window.AI = AI;
AI.init = init;
AI.toggle = toggle;
AI.close = close;
AI.clear = clearChat;
AI.send = sendMessage;
AI.quick = quickSend;
AI.render = render;
AI.setMode = setMode;
AI.setGateway = setGateway;

})();
