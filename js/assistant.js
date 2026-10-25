/* «Лёгкость» — ИИ-ассистент. Работает через локальный шлюз server/ai-gateway.mjs → Ollama.
   Если шлюз недоступен — панель скрывается, приложение работает как обычно.
   Отвечает только по делу, действия применяются после подтверждения пользователя.
*/
'use strict';

const AI = {
  enabled: false,
  open: false,
  loading: false,
  available: false,
  model: 'qwen3:4b',
  gateway: (function () {
    try {
      var saved = localStorage.getItem('legkost.ai.gateway');
      if (saved) return saved;
    } catch (e) {}
    return 'http://127.0.0.1:3001';
  })(),
  messages: [], // {role, content, ts}
  lastError: '',
  quickActions: [
    { label: '💰 Сделай дешевле', prompt: 'Сделай рацион дешевле в рамках текущего бюджета. Предложи замены блюд и продуктов.' },
    { label: '🥩 Больше белка', prompt: 'Подбери блюда с большим количеством белка, не выходя за бюджет.' },
    { label: '🍽️ Что приготовить сегодня', prompt: 'Расскажи, что приготовить сегодня из запланированного. Пошагово, кратко.' },
    { label: '🔄 Замени ужин', prompt: 'Замени ужин в ближайшие дни на что-то быстрое (до 30 мин) и дешёвое.' },
    { label: '🛒 Разбор списка', prompt: 'Разбери список покупок: что купить primero, что можно заменить, где сэкономить.' },
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

function pluralize(n, forms) {
  const abs = Math.abs(Number(n) || 0);
  const n10 = abs % 10;
  const n100 = abs % 100;
  if (n100 > 10 && n100 < 20) return forms[2];
  if (n10 > 1 && n10 < 5) return forms[1];
  if (n10 === 1) return forms[0];
  return forms[2];
}

/* ───────── КОНТЕКСТ ДЛЯ ИИ ───────── */
function buildContext() {
  const bridge = window.__legkostAI;
  if (!bridge || !bridge.getContext) return null;
  const ctx = bridge.getContext() || {};
  const today = new Date();
  const dayIdx = ctx.dayIdx !== undefined ? ctx.dayIdx : today.getDay();
  const dayName = ctx.daysShort ? ctx.daysShort[dayIdx] : '';
  const parts = [];
  parts.push('Ты — помощник приложения «Лёгкость» (семейный рацион, Орск). Отвечай по-русски, кратко и по делу.');
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
  parts.push('Магазин: ' + ctx.store + ' (' + ctx.region + '). Цены: ' + ctx.priceSource + '.');
  if (ctx.allergies.length) parts.push('Аллергии: ' + ctx.allergies.join(', ') + '.');
  if (ctx.stops.length) parts.push('Не есть: ' + ctx.stops.join(', ') + '.');
  parts.push('Если предлагаешь замену блюда, укажи: день (ПН–ВС), приём (завтрак/обед/ужин), причину и ограничение (бюджет, время, белок).');
  parts.push('Если не уверен — задай уточняющий вопрос. Не выдумывай блюд, которых нет в каталоге.');
  return parts.join('\n');
}

/* ───────── РЕНДЕР ПАНЕЛИ ───────── */
function toggle() {
  if (!AI.available) return;
  AI.open = !AI.open;
  render();
}

function close() { AI.open = false; render(); }

function clearChat() {
  AI.messages = [];
  AI.lastError = '';
  render();
}

function addMessage(role, content) {
  AI.messages.push({ role: role, content: content || '', ts: Date.now() });
  render();
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(function () {
    const box = document.getElementById('ai-messages');
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);
}

function setStatus(available, model, error) {
  AI.available = available;
  AI.model = model || 'qwen3:4b';
  AI.lastError = error || '';
  if (!available) AI.open = false;
  render();
}

async function checkHealth() {
  try {
    const res = await fetch(AI.gateway + '/api/ai/health', { cache: 'no-store' });
    if (!res.ok) throw new Error('health ' + res.status);
    const data = await res.json();
    return data.ok && data.ollama;
  } catch (e) { return false; }
}

function setGateway(url) {
  AI.gateway = url || 'http://127.0.0.1:3001';
  try { localStorage.setItem('legkost.ai.gateway', AI.gateway); } catch (e) {}
  AI.available = false;
  AI.open = false;
  render();
}
AI.setGateway = setGateway;

async function sendMessage(text) {
  if (!AI.available || AI.loading) return;
  AI.loading = true;
  addMessage('user', text);
  render();

  const context = buildContext();
  const messages = [
    { role: 'system', content: context || '' },
    { role: 'user', content: text }
  ];

  try {
    const res = await fetch(AI.gateway + '/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: AI.model, temperature: 0.4, stream: false })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'ошибка ИИ');
    const content = data.content || 'Пустой ответ.';
    addMessage('assistant', content);
    parseActions(content);
  } catch (e) {
    addMessage('assistant', 'ИИ недоступен: ' + esc(String(e.message || e)) + '. Убедись, что шлюз запущен (server/start-ai.bat).');
  } finally {
    AI.loading = false;
    render();
  }
}

function quickSend(prompt) { sendMessage(prompt); }

/* ────────- РАЗБОР ДЕЙСТВИЙ ИЗ ОТВЕТА ИИ ───────── */
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
function render() {
  if (!AI.available) return '';
  const header = AI.open
    ? '<button type="button" class="ai-chat-close" data-action="ai-close">Закрыть</button>'
    : '<button type="button" class="ai-chat-open" data-action="ai-toggle">🤖 Помощник</button>';
  if (!AI.open) return header;

  const msgs = AI.messages.map(function (m) {
    const cls = 'ai-msg ai-' + m.role;
    const time = new Date(m.ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return '<div class="' + cls + '"><div class="ai-msg-bubble">' + esc(m.content).replace(/\n/g, '<br>') + '</div><div class="ai-msg-time">' + time + '</div></div>';
  }).join('');

  const quicks = AI.quickActions.map(function (q) {
    return '<button type="button" class="ai-quick" data-action="ai-quick" data-prompt="' + esc(q.prompt) + '">' + esc(q.label) + '</button>';
  }).join('');

  const status = AI.lastError
    ? '<div class="ai-status warn">⚠️ ' + esc(AI.lastError) + '</div>'
    : '<div class="ai-status ok">✓ Шлюз работает · модель ' + esc(AI.model) + '</div>';

  return '<div class="ai-panel">' +
    '<div class="ai-header">' + header + '<span class="ai-model">' + esc(AI.model) + '</span></div>' +
    status +
    '<div class="ai-messages" id="ai-messages">' + msgs + '</div>' +
    (AI.messages.length ? '<div class="ai-actions" id="ai-actions"></div>' : '') +
    '<div class="ai-quicks">' + quicks + '</div>' +
    '<div class="ai-input-wrap">' +
    '<input type="text" id="ai-input" placeholder="Спроси помощника…" data-action="ai-input">' +
    '<button type="button" class="ai-send" data-action="ai-send">Отправить</button>' +
    '</div>' +
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
  // Проверяем доступность шлюза один раз при старте
  checkHealth().then(function (ok) {
    setStatus(ok, AI.model, ok ? '' : 'шлюз не отвечает');
  });
  document.addEventListener('keydown', handleInput);
}

window.LegkostAI = AI;
AI.init = init;
AI.toggle = toggle;
AI.close = close;
AI.send = sendMessage;
AI.quick = quickSend;
AI.render = render;
AI.setStatus = setStatus;
