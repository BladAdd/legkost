/* «Лёгкость» — логика и рендер. Обычный скрипт, работает через file://. */
'use strict';

const CONFIG = {
  basePerPerson: 2500,
  kidK: 0.8,
  minBudget: 1000,
  maxBudget: 25000,
  budgetStep: 500,
  levels: [
    { max: 1500, tier: 1, title: 'Строго эконом', desc: 'Курица, яйца, сезонные овощи и крупы — без лишнего.', emoji: '🥕' },
    { max: 2500, tier: 2, title: 'Базовый', desc: 'Индейка, больше овощей и молочки — разнообразно и сытно.', emoji: '🍗' },
    { max: Infinity, tier: 3, title: 'С запасом', desc: 'Рыба, свежая зелень и любые овощи — меню без компромиссов.', emoji: '🐟' }
  ],
  adultsMax: 8,
  kidsMax: 4,
  ageMin: 1,
  ageMax: 17,
  defaultAdults: 2,
  defaultBudget: 12500,
  days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  daysShort: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
  daysUpper: ['ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА', 'ВОСКРЕСЕНЬЕ'],
  meals: {
    breakfast: { name: 'Завтрак', lower: 'завтрак', emoji: '☕', familyTitle: 'Завтрак для всей семьи', selfTitle: 'Завтрак для себя' },
    lunch:     { name: 'Обед',    lower: 'обед',    emoji: '🍜', familyTitle: 'Обед для всей семьи',    selfTitle: 'Обед для себя' },
    dinner:    { name: 'Ужин',    lower: 'ужин',    emoji: '🍽️', familyTitle: 'Ужин для всей семьи',    selfTitle: 'Ужин для себя' }
  },
  mealOrder: ['breakfast', 'lunch', 'dinner'],
  appliances: [
    { id: 'stove', name: 'Плита', emoji: '🔥' },
    { id: 'oven', name: 'Духовка', emoji: '🥧' },
    { id: 'microwave', name: 'Микроволновка', emoji: '🎛️' },
    { id: 'multicooker', name: 'Мультиварка', emoji: '🍲' },
    { id: 'airfryer', name: 'Аэрогриль', emoji: '🌀' },
    { id: 'blender', name: 'Блендер', emoji: '🥤' },
    { id: 'steamer', name: 'Пароварка', emoji: '♨️' },
    { id: 'grill', name: 'Сковорода-гриль', emoji: '🍳' }
  ],
  defaultAppliances: ['stove', 'oven', 'microwave', 'multicooker'],
  allergies: [
    { id: 'none', name: 'Нет аллергий', emoji: '🌿' },
    { id: 'nuts', name: 'Орехи', emoji: '🌰' },
    { id: 'peanut', name: 'Арахис', emoji: '🥜' },
    { id: 'milk', name: 'Молоко', emoji: '🥛' },
    { id: 'egg', name: 'Яйца', emoji: '🥚' },
    { id: 'gluten', name: 'Глютен', emoji: '🌾' },
    { id: 'fish', name: 'Рыба', emoji: '🐟' },
    { id: 'seafood', name: 'Морепродукты', emoji: '🦐' },
    { id: 'soy', name: 'Соя', emoji: '🫘' },
    { id: 'honey', name: 'Мёд', emoji: '🍯' },
    { id: 'citrus', name: 'Цитрусовые', emoji: '🍊' },
    { id: 'sesame', name: 'Кунжут', emoji: '⚪' }
  ],
  frequentStops: ['Свинина', 'Говядина', 'Грибы', 'Лук', 'Баклажаны', 'Кинза', 'Оливки', 'Творог', 'Печень', 'Острое', 'Тофу', 'Перловка'],
  shopGroups: [
    { key: 'protein', title: 'МЯСО, РЫБА, ЯЙЦА', cats: ['meat', 'fish', 'eggs'] },
    { key: 'veg', title: 'ОВОЩИ И ЗЕЛЕНЬ', cats: ['veg'] },
    { key: 'fruit', title: 'ФРУКТЫ И ЯГОДЫ', cats: ['fruit'] },
    { key: 'dairy', title: 'МОЛОЧКА', cats: ['dairy'] },
    { key: 'grain', title: 'КРУПЫ И БАКАЛЕЯ', cats: ['grain'] },
    { key: 'bread', title: 'ХЛЕБ И ВЫПЕЧКА', cats: ['bread'] },
    { key: 'other', title: 'ПРОЧЕЕ', cats: ['other'] }
  ],
  tips: [
    { emoji: '🌍', text: 'На этой неделе — больше запечённого, меньше жарки' },
    { emoji: '🔄', text: 'Не понравилось блюдо? Заменим в одно касание' },
    { emoji: '💡', text: 'План собран под цены выбранного магазина' }
  ],
  avatars: [
    'assets/avatars/avatar-1.jpg',
    'assets/avatars/avatar-2.jpg',
    'assets/avatars/avatar-3.jpg',
    'assets/avatars/avatar-4.jpg',
    'assets/avatars/avatar-5.jpg',
    'assets/avatars/avatar-6.jpg'
  ],
  screens: ['auth', 'register', 'login', 'onboarding', 'loading', 'dashboard', 'week', 'day', 'shopping', 'empty', 'profile', 'profile-edit', 'history', 'region', 'map']
};

const STORAGE_KEY = 'legkost.state.v1';
const PLAN_KEY = 'legkost.plan.v1';
const SESSION_KEY = 'legkost.session.v1';
const GUEST_KEY = 'legkost.guest.v1';
const ING = {};
INGREDIENTS.forEach(function (i) { ING[i.id] = i; });
const DISH = {};
DISHES.forEach(function (d) { DISH[d.id] = d; });

/* ───────── УТИЛИТЫ ───────── */
function pluralize(n, forms) {
  const abs = Math.abs(Number(n) || 0);
  const n10 = abs % 10;
  const n100 = abs % 100;
  if (n100 > 10 && n100 < 20) return forms[2];
  if (n10 > 1 && n10 < 5) return forms[1];
  if (n10 === 1) return forms[0];
  return forms[2];
}
function fmtMoney(n) {
  const v = Math.round(Number(n) || 0);
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}
function fmtNum(n) {
  return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function fmtQty(grams) {
  const g = Math.max(0, Number(grams) || 0);
  if (g >= 1000) {
    const kg = Math.round(g / 100) / 10;
    return String(kg).replace('.', ',') + ' кг';
  }
  return Math.round(g) + ' г';
}
function fmtQtyUnit(ing, qty) {
  if (!ing) return '';
  return ing.unit === 'pc' ? String(Math.round(qty)) + ' шт' : fmtQty(qty);
}
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function normalizeName(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
}
function nameRoot(s) {
  const w = normalizeName(s);
  return w.length > 4 ? w.replace(/(ами|ями|ов|ев|ые|ий|ая|ое|ы|и|а|я|у|ю|е|о|ь)$/, '') : w;
}
function todayIndex() {
  return (new Date().getDay() + 6) % 7;
}
function pluralPeople(n) { return pluralize(n, ['человека', 'человека', 'человек']); }
function pluralPortions(n) { return pluralize(n, ['порция', 'порции', 'порций']); }
function pluralPositions(n) { return pluralize(n, ['позиция', 'позиции', 'позиций']); }
function pluralDays(n) { return pluralize(n, ['день', 'дня', 'дней']); }

/* ───────── STATE ───────── */
function makeDefaultState() {
  return {
    step: 1,
    regionId: 'moscow',
    storeId: null,
    adults: CONFIG.defaultAdults,
    childrenAges: [],
    meals: {
      breakfast: { self: true, family: false },
      lunch: { self: true, family: false },
      dinner: { self: true, family: false }
    },
    budget: CONFIG.defaultBudget,
    allergies: ['none'],
    stop: [],
    appliances: CONFIG.defaultAppliances.slice(),
    plan: null,
    shoppingChecked: [],
    ui: { screen: 'onboarding', dayId: 0, dishId: null, slot: null, mapBack: 'onboarding', profileBack: 'week', regionBack: 'onboarding' }
  };
}

function normalizeState(raw) {
  const d = makeDefaultState();
  if (!raw || typeof raw !== 'object') return d;
  d.step = clamp(parseInt(raw.step, 10) || 1, 1, 7);
  d.regionId = REGIONS.some(function (r) { return r.id === raw.regionId; }) ? raw.regionId : 'moscow';
  const regionStoreIds = (REGIONS.find(function (r) { return r.id === d.regionId; }) || REGIONS[0]).storeIds;
  d.storeId = regionStoreIds.indexOf(raw.storeId) !== -1 ? raw.storeId : null;
  d.adults = clamp(parseInt(raw.adults, 10) || CONFIG.defaultAdults, 1, CONFIG.adultsMax);
  d.childrenAges = Array.isArray(raw.childrenAges)
    ? raw.childrenAges.slice(0, CONFIG.kidsMax).map(function (a) { return clamp(parseInt(a, 10) || 7, CONFIG.ageMin, CONFIG.ageMax); })
    : [];
  if (raw.meals && typeof raw.meals === 'object') {
    CONFIG.mealOrder.forEach(function (slot) {
      const m = raw.meals[slot];
      if (m && typeof m === 'object') {
        d.meals[slot] = { self: !!m.self, family: !!m.family };
      }
    });
  }
  d.budget = clamp(Math.round((parseInt(raw.budget, 10) || CONFIG.defaultBudget) / CONFIG.budgetStep) * CONFIG.budgetStep, CONFIG.minBudget, CONFIG.maxBudget);
  if (Array.isArray(raw.allergies)) {
    const ids = CONFIG.allergies.map(function (a) { return a.id; });
    const list = raw.allergies.filter(function (a) { return ids.indexOf(a) !== -1; });
    d.allergies = list.length ? Array.from(new Set(list)) : [];
  }
  if (Array.isArray(raw.stop)) {
    d.stop = Array.from(new Set(raw.stop.filter(function (s) { return typeof s === 'string' && s.trim(); }).map(function (s) { return s.trim(); }))).slice(0, 20);
  }
  if (Array.isArray(raw.appliances)) {
    const ids = CONFIG.appliances.map(function (a) { return a.id; });
    d.appliances = Array.from(new Set(raw.appliances.filter(function (a) { return ids.indexOf(a) !== -1; })));
  }
  d.plan = isValidPlan(raw.plan) ? raw.plan : null;
  d.shoppingChecked = Array.isArray(raw.shoppingChecked) ? raw.shoppingChecked.filter(function (x) { return typeof x === 'string'; }) : [];
  if (raw.ui && typeof raw.ui === 'object') {
    d.ui.screen = CONFIG.screens.indexOf(raw.ui.screen) !== -1 ? raw.ui.screen : 'onboarding';
    d.ui.dayId = clamp(parseInt(raw.ui.dayId, 10) || 0, 0, 6);
    d.ui.dishId = typeof raw.ui.dishId === 'string' ? raw.ui.dishId : null;
    d.ui.slot = CONFIG.mealOrder.indexOf(raw.ui.slot) !== -1 ? raw.ui.slot : null;
    d.ui.mapBack = ['onboarding', 'week', 'profile'].indexOf(raw.ui.mapBack) !== -1 ? raw.ui.mapBack : 'onboarding';
    d.ui.profileBack = ['week', 'onboarding', 'day', 'shopping'].indexOf(raw.ui.profileBack) !== -1 ? raw.ui.profileBack : 'week';
    d.ui.regionBack = ['onboarding', 'profile', 'week', 'map'].indexOf(raw.ui.regionBack) !== -1 ? raw.ui.regionBack : 'onboarding';
  }
  return d;
}

function isValidPlan(p) {
  if (!p || !Array.isArray(p.days) || p.days.length !== 7) return false;
  return p.days.every(function (day) {
    if (!day || !day.meals || typeof day.meals !== 'object') return false;
    return Object.keys(day.meals).every(function (slot) {
      const m = day.meals[slot];
      return m && DISH[m.dishId] && DISH[m.dishId].slot === slot;
    });
  });
}

function stateKey(userId) { return STORAGE_KEY + '.' + (userId || 'guest'); }
function planKey(userId) { return PLAN_KEY + '.' + (userId || 'guest'); }

function loadStateFor(userId) {
  let raw = null;
  let plan = null;
  try {
    const saved = localStorage.getItem(stateKey(userId));
    if (saved) raw = JSON.parse(saved);
    const savedPlan = localStorage.getItem(planKey(userId));
    if (savedPlan) plan = JSON.parse(savedPlan);
    if (!userId && !saved) {
      const legacy = localStorage.getItem(STORAGE_KEY);
      if (legacy) raw = JSON.parse(legacy);
      const legacyPlan = localStorage.getItem(PLAN_KEY);
      if (legacyPlan) plan = JSON.parse(legacyPlan);
    }
  } catch (e) { raw = null; plan = null; }
  const s = normalizeState(raw);
  if (isValidPlan(plan)) s.plan = plan;
  if (s.plan) {
    if (['week', 'day', 'shopping'].indexOf(s.ui.screen) === -1) s.ui.screen = 'week';
    s.ui.dishId = null;
    s.ui.slot = null;
  } else {
    s.ui.screen = 'onboarding';
    s.ui.dayId = 0;
    s.ui.dishId = null;
    s.ui.slot = null;
  }
  return s;
}

let currentUser = null;
let currentProfile = null;
let profilePlans = [];
let authError = '';
let authBusy = false;
let state = loadStateFor(null);
let lastScreen = null;
let modalOpen = false;
let timers = [];
let intervals = [];
let toastTimer = null;

function saveState() {
  try {
    const snap = JSON.parse(JSON.stringify(state));
    if (['loading', 'dashboard', 'empty', 'auth', 'register', 'login'].indexOf(snap.ui.screen) !== -1) {
      snap.ui.screen = snap.plan ? 'week' : 'onboarding';
    }
    if (!snap.plan && snap.ui.screen !== 'onboarding') snap.ui.screen = 'onboarding';
    localStorage.setItem(stateKey(currentUser ? currentUser.id : null), JSON.stringify(snap));
    if (state.plan) localStorage.setItem(planKey(currentUser ? currentUser.id : null), JSON.stringify(state.plan));
    else localStorage.removeItem(planKey(currentUser ? currentUser.id : null));
  } catch (e) { /* localStorage может быть недоступен — приложение продолжает работать */ }
}

/* ───────── ЛОКАЛЬНЫЕ АККАУНТЫ ───────── */
function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function writeSession(userId) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: userId, at: Date.now() })); } catch (e) {}
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}
function profileInitials(name) {
  const parts = String(name || 'Л').trim().split(/\s+/).filter(Boolean);
  return (parts[0] || 'Л').charAt(0).toUpperCase() + (parts[1] ? parts[1].charAt(0).toUpperCase() : '');
}
function avatarHTML(profile, cls, alt) {
  const src = profile && profile.avatar && CONFIG.avatars.indexOf(profile.avatar) !== -1 ? profile.avatar : null;
  if (src) {
    return '<img class="avatar ' + (cls || '') + '" src="' + esc(src) + '" alt="' + esc(alt || 'Аватар') + '">';
  }
  return '<span class="avatar avatar-initials ' + (cls || '') + '" aria-hidden="true">' + esc(profileInitials(profile && profile.name)) + '</span>';
}
function profileButtonHTML() {
  if (!currentUser) {
    return '<button type="button" class="auth-pill" data-action="open-auth">Войти</button>';
  }
  return '<button type="button" class="avatar-btn" data-action="open-profile" aria-label="Открыть профиль">' +
    avatarHTML(currentProfile, 'avatar-sm', 'Профиль') + '</button>';
}
function defaultProfileFor(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: CONFIG.avatars[0],
    regionId: state.regionId || 'moscow',
    createdAt: user.createdAt || Date.now(),
    plansCount: 0,
    replacedCount: 0
  };
}
async function persistProfile() {
  if (!currentProfile) return;
  try { await dbPut('profiles', currentProfile); } catch (e) {}
}
async function loadProfilePlans() {
  profilePlans = [];
  if (!currentUser) return;
  try {
    const list = await dbGetAllByIndex('plans', 'userId', currentUser.id);
    profilePlans = (list || []).sort(function (a, b) { return b.createdAt - a.createdAt; });
  } catch (e) { profilePlans = []; }
}
function formatProfileDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return ''; }
}
function planSnapshotForHistory() {
  const info = planInfo();
  if (!info || !state.plan || !currentUser) return null;
  return {
    userId: currentUser.id,
    createdAt: Date.now(),
    cost: info.cost,
    people: peopleCount(),
    regionId: state.regionId,
    storeId: state.storeId,
    budget: state.budget,
    settings: {
      adults: state.adults,
      childrenAges: state.childrenAges.slice(),
      meals: JSON.parse(JSON.stringify(state.meals)),
      budget: state.budget,
      allergies: state.allergies.slice(),
      stop: state.stop.slice(),
      appliances: state.appliances.slice(),
      regionId: state.regionId,
      storeId: state.storeId
    },
    plan: JSON.parse(JSON.stringify(state.plan)),
    shoppingChecked: state.shoppingChecked.slice()
  };
}
async function savePlanToHistory() {
  if (!currentUser) return;
  const snap = planSnapshotForHistory();
  if (!snap) return;
  try {
    await dbAdd('plans', snap);
    currentProfile.plansCount = (currentProfile.plansCount || 0) + 1;
    await persistProfile();
    await loadProfilePlans();
  } catch (e) { /* история не должна мешать генерации */ }
}
function recordReplacement() {
  if (!currentProfile) return;
  currentProfile.replacedCount = (currentProfile.replacedCount || 0) + 1;
  persistProfile();
}

/* ───────── АУТЕНТИФИКАЦИЯ ───────── */
const authDraft = { name: '', email: '', regionId: '' };
let profileAvatarDraft = CONFIG.avatars[0];

function showAuth(screen) {
  authError = '';
  state.ui.screen = screen || 'auth';
  animateNext = true;
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function enterGuest() {
  currentUser = null;
  currentProfile = null;
  profilePlans = [];
  clearSession();
  try { localStorage.setItem(GUEST_KEY, '1'); } catch (e) {}
  state = loadStateFor(null);
  state.ui.screen = state.plan ? 'week' : 'onboarding';
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function finishAuth(user, profile, welcome) {
  currentUser = user;
  currentProfile = profile;
  try { localStorage.removeItem(GUEST_KEY); } catch (e) {}
  writeSession(user.id);
  state = loadStateFor(user.id);
  if (state.plan) {
    state.ui.screen = 'week';
  } else {
    state.ui.screen = 'onboarding';
  }
  if (profile.regionId && REGIONS.some(function (r) { return r.id === profile.regionId; })) {
    state.regionId = profile.regionId;
    if (state.storeId && !availableStores().some(function (s) { return s.id === state.storeId; })) {
      state.storeId = null;
    }
  }
  saveState();
  render();
  toast(welcome);
}
async function registerUser(event) {
  event.preventDefault();
  if (authBusy) return;
  const form = event.target;
  const name = String((document.getElementById('reg-name') || {}).value || '').trim().replace(/\s+/g, ' ');
  const email = normalizeEmail((document.getElementById('reg-email') || {}).value);
  const password = String((document.getElementById('reg-password') || {}).value || '');
  const password2 = String((document.getElementById('reg-password2') || {}).value || '');
  const regionId = (document.getElementById('reg-region') || {}).value || 'moscow';
  authDraft.name = name; authDraft.email = email; authDraft.regionId = regionId;

  if (name.length < 2) { authError = 'Введи имя — хотя бы 2 символа'; render(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { authError = 'Проверь адрес почты'; render(); return; }
  if (password.length < 6) { authError = 'Пароль должен быть не короче 6 символов'; render(); return; }
  if (password !== password2) { authError = 'Пароли не совпадают'; render(); return; }
  if (!REGIONS.some(function (r) { return r.id === regionId; })) { authError = 'Выбери регион'; render(); return; }

  authBusy = true;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) { submit.disabled = true; submit.textContent = 'Создаём аккаунт…'; }
  try {
    const existing = await dbGetByIndex('users', 'email', email);
    if (existing) {
      authBusy = false;
      authError = 'Аккаунт с такой почтой уже есть в этом браузере';
      render();
      return;
    }
    const rec = await passwordRecord(password);
    const user = {
      id: randomId(),
      name: name,
      email: email,
      password: rec,
      createdAt: Date.now()
    };
    await dbAdd('users', user);
    state.regionId = regionId;
    const profile = defaultProfileFor(user);
    profile.regionId = regionId;
    await dbPut('profiles', profile);

    const guest = loadStateFor(null);
    const hasGuestProgress = guest.plan || guest.step > 1 || guest.storeId;
    state = hasGuestProgress ? guest : makeDefaultState();
    state.regionId = regionId;
    if (state.storeId && !availableStores().some(function (s) { return s.id === state.storeId; })) state.storeId = null;
    /* Переносим гостевой прогресс под ключ нового аккаунта до finishAuth. */
    currentUser = user;
    currentProfile = profile;
    writeSession(user.id);
    saveState();
    authBusy = false;
    authError = '';
    finishAuth(user, profile, 'Аккаунт создан — данные хранятся локально');
    if (state.plan) savePlanToHistory();
  } catch (err) {
    authBusy = false;
    authError = 'Не удалось сохранить аккаунт в этом браузере';
    render();
  }
}
async function loginUser(event) {
  event.preventDefault();
  if (authBusy) return;
  const form = event.target;
  const email = normalizeEmail((document.getElementById('login-email') || {}).value);
  const password = String((document.getElementById('login-password') || {}).value || '');
  authDraft.email = email;
  if (!email || !password) { authError = 'Введи почту и пароль'; render(); return; }
  authBusy = true;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) { submit.disabled = true; submit.textContent = 'Входим…'; }
  try {
    const user = await dbGetByIndex('users', 'email', email);
    if (!user) {
      authBusy = false;
      authError = 'Аккаунт не найден в этом браузере';
      render();
      return;
    }
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      authBusy = false;
      authError = 'Неверный пароль';
      render();
      return;
    }
    let profile = await dbGet('profiles', user.id);
    currentUser = user;
    if (!profile) {
      profile = defaultProfileFor(user);
      await dbPut('profiles', profile);
    }
    authBusy = false;
    authError = '';
    finishAuth(user, profile, 'С возвращением, ' + user.name.split(' ')[0] + '!');
  } catch (err) {
    authBusy = false;
    authError = 'Не удалось войти. Попробуй ещё раз';
    render();
  }
}
async function logoutUser() {
  saveState();
  clearSession();
  try { localStorage.removeItem(GUEST_KEY); } catch (e) {}
  currentUser = null;
  currentProfile = null;
  profilePlans = [];
  authDraft.name = '';
  authDraft.email = '';
  authDraft.regionId = '';
  state = makeDefaultState();
  state.ui.screen = 'auth';
  modalOpen = false;
  render();
  toast('Вы вышли из профиля');
}
async function openProfile() {
  if (!currentUser) { showAuth('auth'); return; }
  if (['onboarding', 'week', 'day', 'shopping'].indexOf(state.ui.screen) !== -1) {
    state.ui.profileBack = state.ui.screen;
  }
  await loadProfilePlans();
  if (currentProfile) currentProfile.plansCount = Math.max(currentProfile.plansCount || 0, profilePlans.length);
  state.ui.screen = 'profile';
  modalOpen = false;
  animateNext = true;
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function openProfileEdit() {
  if (!currentUser) { showAuth('auth'); return; }
  profileAvatarDraft = (currentProfile && currentProfile.avatar) || CONFIG.avatars[0];
  state.ui.screen = 'profile-edit';
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
async function saveProfileEdit(event) {
  event.preventDefault();
  const name = String((document.getElementById('profile-name') || {}).value || '').trim().replace(/\s+/g, ' ');
  if (name.length < 2) { toast('Имя должно быть не короче 2 символов'); return; }
  if (!currentUser || !currentProfile) return;
  currentUser.name = name;
  currentProfile.name = name;
  currentProfile.avatar = profileAvatarDraft;
  try {
    await dbPut('users', currentUser);
    await persistProfile();
    state.ui.screen = 'profile';
    render();
    toast('Профиль сохранён');
  } catch (e) {
    toast('Не удалось сохранить профиль');
  }
}
async function deleteAccount() {
  if (!currentUser) return;
  if (!window.confirm('Удалить локальный аккаунт и все сохранённые рационы? Это действие необратимо.')) return;
  const userId = currentUser.id;
  try {
    const plans = await dbGetAllByIndex('plans', 'userId', userId);
    await Promise.all((plans || []).map(function (p) { return dbDelete('plans', p.id); }));
    await dbDelete('profiles', userId);
    await dbDelete('users', userId);
  } catch (e) {}
  try {
    localStorage.removeItem(stateKey(userId));
    localStorage.removeItem(planKey(userId));
  } catch (e) {}
  clearSession();
  try { localStorage.removeItem(GUEST_KEY); } catch (e) {}
  currentUser = null;
  currentProfile = null;
  profilePlans = [];
  authDraft.name = '';
  authDraft.email = '';
  authDraft.regionId = '';
  state = makeDefaultState();
  state.ui.screen = 'auth';
  render();
  toast('Аккаунт удалён');
}
function openRegion(from) {
  state.ui.regionBack = from || (state.ui.screen === 'profile' ? 'profile' : 'onboarding');
  state.ui.screen = 'region';
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function selectRegion(regionId) {
  const region = REGIONS.find(function (r) { return r.id === regionId; });
  if (!region) return;
  const back = state.ui.regionBack;
  state.regionId = regionId;
  if (state.storeId && !availableStores().some(function (s) { return s.id === state.storeId; })) {
    state.storeId = state.plan ? (availableStores()[0] || {}).id || null : null;
  }
  if (currentProfile) {
    currentProfile.regionId = regionId;
    persistProfile();
  }
  saveState();
  toast('Регион: ' + region.name + '. Цены пересчитаны');
  if (back === 'profile') openProfile();
  else if (back === 'week' && state.plan) setScreen('week');
  else if (back === 'map') { state.ui.screen = 'map'; render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  else goStep(1);
}
function openMap(back) {
  state.ui.mapBack = back || (state.ui.screen === 'week' ? 'week' : state.ui.screen === 'profile' ? 'profile' : 'onboarding');
  state.ui.screen = 'map';
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function mapPointList() {
  const region = getRegion();
  const offsets = [
    [0.008, 0.014], [-0.013, 0.020], [0.021, -0.006], [-0.006, -0.019],
    [0.030, 0.018], [-0.024, -0.010], [0.004, 0.032], [0.026, -0.026],
    [-0.031, 0.009], [0.015, -0.038]
  ];
  return availableStores().map(function (store, i) {
    const off = offsets[i % offsets.length];
    return {
      store: store,
      lat: region.center[0] + off[0],
      lon: region.center[1] + off[1]
    };
  });
}
function mapEmbedURL() {
  const region = getRegion();
  const points = mapPointList().map(function (p) {
    return p.lon.toFixed(5) + ',' + p.lat.toFixed(5) + ',pm2rdm';
  }).join('~');
  return 'https://yandex.ru/map-widget/v1/?ll=' + encodeURIComponent(region.center[1].toFixed(5) + ',' + region.center[0].toFixed(5)) +
    '&z=' + region.zoom + '&pt=' + encodeURIComponent(points) + '&lang=ru_RU';
}
function yandexMapsLink() {
  const region = getRegion();
  return 'https://yandex.ru/maps/?ll=' + encodeURIComponent(region.center[1].toFixed(5) + ',' + region.center[0].toFixed(5)) + '&z=' + region.zoom;
}
function storeMapsLink(store) {
  const q = (store ? store.name : 'магазин') + ' ' + getRegion().name;
  return 'https://yandex.ru/maps/?text=' + encodeURIComponent(q);
}
async function restorePlan(id) {
  const plan = profilePlans.find(function (p) { return String(p.id) === String(id); });
  if (!plan) return;
  const settings = plan.settings || {};
  state = normalizeState(Object.assign({}, state, settings, {
    plan: plan.plan,
    shoppingChecked: plan.shoppingChecked || [],
    ui: { screen: 'week', dayId: 0, dishId: null, slot: null, mapBack: 'week', profileBack: 'week', regionBack: 'onboarding' }
  }));
  if (currentProfile && plan.regionId) {
    currentProfile.regionId = plan.regionId;
    persistProfile();
  }
  modalOpen = false;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
  toast('Рацион от ' + formatProfileDate(plan.createdAt) + ' восстановлен');
}
async function deletePlan(id) {
  if (!window.confirm('Удалить этот рацион из истории?')) return;
  try { await dbDelete('plans', id); } catch (e) {}
  profilePlans = profilePlans.filter(function (p) { return String(p.id) !== String(id); });
  if (currentProfile) currentProfile.plansCount = profilePlans.length;
  persistProfile();
  state.ui.screen = 'history';
  render();
  toast('Рацион удалён');
}
async function openHistory() {
  await loadProfilePlans();
  state.ui.screen = 'history';
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function clearTimers() {
  timers.forEach(function (id) { clearTimeout(id); });
  intervals.forEach(function (id) { clearInterval(id); });
  timers = [];
  intervals = [];
}
function later(fn, ms) {
  const id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}
function every(fn, ms) {
  const id = setInterval(fn, ms);
  intervals.push(id);
  return id;
}

/* ───────── ВЫБОРКИ И РАСЧЁТЫ ───────── */
function getRegion() {
  return REGIONS.find(function (r) { return r.id === state.regionId; }) || REGIONS[0];
}
function availableStores() {
  const region = getRegion();
  return region.storeIds.map(function (id) {
    return STORES.find(function (s) { return s.id === id; });
  }).filter(Boolean);
}
function getStore() {
  return availableStores().find(function (s) { return s.id === state.storeId; }) || null;
}
function effectiveStoreCoef(store) {
  const region = getRegion();
  if (!store) return region.priceCoef;
  return store.coef * region.priceCoef * ((region.storeCoefs && region.storeCoefs[store.id]) || 1);
}
function storeCoef() {
  return effectiveStoreCoef(getStore());
}
function coefLabel(store) {
  const diff = Math.round((effectiveStoreCoef(store) - 1) * 100);
  if (diff === 0) return 'база';
  return (diff > 0 ? '+' : '−') + Math.abs(diff) + '%';
}
function ingredientPrice(ing) {
  return Math.round(ing.pricePerUnit * storeCoef());
}
function peopleCount() { return state.adults + state.childrenAges.length; }
function volumeK() { return state.adults * 1 + state.childrenAges.length * CONFIG.kidK; }
function activeSlots() {
  return CONFIG.mealOrder.filter(function (slot) {
    return state.meals[slot] && (state.meals[slot].self || state.meals[slot].family);
  });
}
function isFamilySlot(slot) { return !!(state.meals[slot] && state.meals[slot].family); }
function slotPortions(slot) { return isFamilySlot(slot) ? peopleCount() : 1; }
function slotK(slot) { return isFamilySlot(slot) ? volumeK() : 1; }
function realAllergies() {
  return state.allergies.filter(function (a) { return a !== 'none'; });
}
function budgetTier() {
  return budgetLevel().tier;
}
function budgetLevel() {
  const per = state.budget / Math.max(1, peopleCount());
  return CONFIG.levels.find(function (level) { return per < level.max; }) || CONFIG.levels[CONFIG.levels.length - 1];
}

function ingredientMatchesStop(ing, stopList) {
  if (!ing || !stopList.length) return false;
  const n = normalizeName(ing.name);
  const nr = nameRoot(ing.name);
  const syn = (ing.syn || []).map(normalizeName);
  return stopList.some(function (raw) {
    const q = normalizeName(raw);
    if (!q || q === 'острое') return false;
    if (n === q || n.indexOf(q) !== -1 || q.indexOf(n) !== -1) return true;
    const qr = nameRoot(q);
    if (qr.length >= 4 && nr.length >= 4 && (nr.indexOf(qr) === 0 || qr.indexOf(nr) === 0)) return true;
    return syn.some(function (x) {
      if (!x) return false;
      if (x === q || x.indexOf(q) !== -1 || q.indexOf(x) !== -1) return true;
      const xr = nameRoot(x);
      return xr.length >= 4 && qr.length >= 4 && (xr.indexOf(qr) === 0 || qr.indexOf(xr) === 0);
    });
  });
}

function dishIsStopped(dish) {
  const stop = state.stop;
  if (!stop.length) return false;
  const spicyStopped = stop.some(function (s) { return normalizeName(s) === 'острое'; });
  if (spicyStopped && dish.spicy) return true;
  return dish.ingredients.some(function (it) {
    return ingredientMatchesStop(ING[it.ingId], stop);
  });
}

function dishCandidates(slot) {
  const tier = budgetTier();
  const allergies = realAllergies();
  return DISHES.filter(function (dish) {
    if (dish.slot !== slot) return false;
    if (dish.tier > tier) return false;
    if (state.childrenAges.length && dish.spicy) return false;
    if (!dish.appliances.every(function (a) { return state.appliances.indexOf(a) !== -1; })) return false;
    if (dish.allergens.some(function (a) { return allergies.indexOf(a) !== -1; })) return false;
    if (dishIsStopped(dish)) return false;
    return true;
  });
}

function hasAnyCandidates() {
  return activeSlots().some(function (slot) { return dishCandidates(slot).length > 0; });
}

function ingredientCost(ing, qty, k) {
  const p = ingredientPrice(ing);
  if (ing.unit === 'pc') return p * Math.ceil(qty * k - 1e-9);
  return p * (qty * k) / 1000;
}
function dishCost(dish, family) {
  if (!dish) return 0;
  const k = family ? volumeK() : 1;
  let total = 0;
  dish.ingredients.forEach(function (it) {
    const ing = ING[it.ingId];
    if (ing) total += ingredientCost(ing, it.qtyPerServing, k);
  });
  return Math.round(total);
}

function generatePlan() {
  const slots = activeSlots();
  if (!slots.length) return false;
  const pools = {};
  slots.forEach(function (slot) { pools[slot] = dishCandidates(slot); });
  if (slots.every(function (slot) { return pools[slot].length === 0; })) return false;

  const days = [];
  const lastUsed = {};
  slots.forEach(function (s) { lastUsed[s] = {}; });

  for (let day = 0; day < 7; day++) {
    const meals = {};
    const skipped = [];
    slots.forEach(function (slot) {
      const pool = pools[slot];
      if (!pool.length) { skipped.push(slot); return; }
      const fresh = pool.filter(function (dish) {
        const last = lastUsed[slot][dish.id];
        return last === undefined || day - last >= 3;
      });
      const pickFrom = fresh.length ? fresh : pool;
      const dish = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      meals[slot] = { dishId: dish.id, family: isFamilySlot(slot) };
      lastUsed[slot][dish.id] = day;
    });
    days.push({ meals: meals, skipped: skipped });
  }

  state.plan = {
    createdAt: Date.now(),
    days: days,
    partial: days.some(function (d) { return d.skipped.length > 0; })
  };
  state.shoppingChecked = [];
  saveState();
  return true;
}

function mealInfo(day, slot) {
  if (!day || !day.meals || !day.meals[slot]) return null;
  const m = day.meals[slot];
  const dish = DISH[m.dishId];
  if (!dish) return null;
  const family = !!m.family;
  const portions = family ? peopleCount() : 1;
  const cost = dishCost(dish, family);
  return {
    slot: slot,
    dish: dish,
    family: family,
    portions: portions,
    k: family ? volumeK() : 1,
    cost: cost,
    perPortion: Math.max(1, Math.round(cost / portions))
  };
}
function dayInfo(dayIndex) {
  if (!state.plan || !state.plan.days[dayIndex]) return null;
  const day = state.plan.days[dayIndex];
  const active = activeSlots();
  const meals = active.map(function (slot) { return mealInfo(day, slot); }).filter(Boolean);
  const cost = meals.reduce(function (sum, m) { return sum + m.cost; }, 0);
  const denom = Math.max(1, peopleCount() * Math.max(1, active.length));
  return {
    day: day,
    meals: meals,
    cost: cost,
    perPortion: Math.round(cost / denom),
    active: active,
    dayIndex: dayIndex
  };
}
function planInfo() {
  if (!state.plan) return null;
  const days = state.plan.days.map(function (_, i) { return dayInfo(i); });
  const cost = days.reduce(function (sum, d) { return sum + (d ? d.cost : 0); }, 0);
  const portions = days.reduce(function (sum, d) { return sum + (d ? d.meals.length : 0); }, 0);
  const perPerson = Math.round(cost / Math.max(1, peopleCount()));
  return {
    days: days,
    cost: cost,
    perPerson: perPerson,
    portions: portions,
    over: cost - state.budget,
    under: cost <= state.budget,
    shopping: shoppingInfo()
  };
}

function shoppingInfo() {
  const map = {};
  if (!state.plan) return { items: [], groups: [], total: 0, count: 0, checked: 0 };
  state.plan.days.forEach(function (day) {
    activeSlots().forEach(function (slot) {
      const m = mealInfo(day, slot);
      if (!m) return;
      m.dish.ingredients.forEach(function (it) {
        const ing = ING[it.ingId];
        if (!ing) return;
        if (!map[ing.id]) map[ing.id] = { ing: ing, grams: 0, pieces: 0, cost: 0 };
        const entry = map[ing.id];
        if (ing.unit === 'pc') {
          const qty = Math.ceil(it.qtyPerServing * m.k - 1e-9);
          entry.pieces += qty;
          entry.cost += ingredientPrice(ing) * qty;
        } else {
          const qty = it.qtyPerServing * m.k;
          entry.grams += qty;
          entry.cost += ingredientPrice(ing) * qty / 1000;
        }
      });
    });
  });
  const items = Object.keys(map).map(function (id) {
    const e = map[id];
    return {
      ing: e.ing,
      qty: e.ing.unit === 'pc' ? e.pieces : e.grams,
      display: e.ing.unit === 'pc' ? Math.round(e.pieces) + ' шт' : fmtQty(e.grams),
      cost: Math.round(e.cost)
    };
  }).sort(function (a, b) { return a.ing.name.localeCompare(b.ing.name, 'ru'); });

  const groups = CONFIG.shopGroups.map(function (g) {
    const list = items.filter(function (it) { return g.cats.indexOf(it.ing.category) !== -1; });
    return { key: g.key, title: g.title, items: list };
  }).filter(function (g) { return g.items.length > 0; });
  const total = items.reduce(function (s, it) { return s + it.cost; }, 0);
  const checked = items.filter(function (it) { return state.shoppingChecked.indexOf(it.ing.id) !== -1; }).length;
  return { items: items, groups: groups, total: total, count: items.length, checked: checked };
}

/* ───────── ОБЩИЕ HTML-БЛОКИ ───────── */
function ringSVG(ratio, label, sub, size, color) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const safe = clamp(ratio, 0, 1);
  return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px;--ring-color:' + (color || '#2F9E63') + '">' +
    '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" aria-hidden="true">' +
    '<circle class="ring-track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"></circle>' +
    '<circle class="ring-fill" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" ' +
    'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - safe)).toFixed(1) + '"></circle>' +
    '</svg><div class="ring-center"><span class="ring-label">' + label + '</span>' +
    (sub ? '<span class="ring-sub">' + sub + '</span>' : '') + '</div></div>';
}
function logoHTML() {
  return '<div class="app-logo" aria-hidden="true">🥗</div>';
}
function backButton(action) {
  return '<button type="button" class="round-btn back-btn" data-action="' + (action || 'back') + '" aria-label="Назад">‹</button>';
}
function wizardHeader() {
  const step = state.step;
  const names = ['Магазин', 'Кто ест', 'Приёмы пищи', 'Бюджет', 'Аллергии', 'Стоп-продукты', 'Кухня'];
  return '<div class="wizard-head">' +
    '<div class="wizard-top">' + backButton('back') + '<div class="wizard-user">' + profileButtonHTML() + '</div></div>' +
    '<div class="segments">' + [1, 2, 3, 4, 5, 6, 7].map(function (n) {
      return '<span class="segment' + (n <= step ? ' done' : '') + '"></span>';
    }).join('') + '</div>' +
    '<div class="step-meta"><span>' + names[step - 1] + '</span><span>Шаг ' + step + ' из 7</span></div>' +
    '</div>';
}
function ctaBar(inner) {
  return '<div class="cta-bar"><div class="cta-inner">' + inner + '</div></div>';
}
function screenWrap(cls, inner, withCta) {
  return '<section class="screen ' + cls + '">' +
    (withCta ? '<div class="screen-body">' + inner + '</div>' : '<div class="screen-body">' + inner + '</div>') +
    (withCta || '') + '</section>';
}
function primaryBtn(label, action, disabled, extra) {
  return '<button type="button" class="btn btn-primary" data-action="' + action + '"' +
    (disabled ? ' disabled' : '') + (extra ? ' ' + extra : '') + '>' + label + '</button>';
}
function activeMealsText() {
  return activeSlots().map(function (s) { return CONFIG.meals[s].lower; }).join(', ');
}

/* ───────── ВХОД, РЕГИСТРАЦИЯ, ПРОФИЛЬ ───────── */
function authErrorHTML() {
  return authError ? '<div class="auth-error" role="alert">' + esc(authError) + '</div>' : '';
}

function renderAuth() {
  const images = ['b_avocado_egg', 'b_syrniki', 'l_borsch', 'd_salmon_rice'];
  return '<section class="screen auth-screen"><div class="auth-wrap">' +
    '<div class="auth-top"><span class="auth-wordmark">🥗 ЛЁГКОСТЬ</span><span class="auth-local">локальный профиль</span></div>' +
    '<div class="auth-collage">' +
    images.map(function (id, i) {
      return '<img class="auth-photo auth-photo-' + (i + 1) + '" src="' + esc(DISH[id] ? DISH[id].image : '') + '" alt="">';
    }).join('') +
    '</div>' +
    '<h1 class="auth-title">Неделя еды.<br>Без лишних мыслей.</h1>' +
    '<p class="auth-sub">Семейное меню, цены твоего региона и готовый список покупок — в одном приложении.</p>' +
    '<div class="auth-actions">' +
    '<button type="button" class="btn btn-primary" data-action="auth-register">Создать аккаунт</button>' +
    '<button type="button" class="btn btn-secondary" data-action="auth-login">Войти</button>' +
    '<button type="button" class="auth-link" data-action="auth-guest">Продолжить без профиля</button>' +
    '</div>' +
    '<div class="auth-features">' +
    '<div class="auth-feature"><span>📍</span><div><b>Цены региона</b><small>магазины и стоимость зависят от города</small></div></div>' +
    '<div class="auth-feature"><span>🗺️</span><div><b>Магазины на карте</b><small>Яндекс.Карты и ближайшие точки</small></div></div>' +
    '<div class="auth-feature"><span>💾</span><div><b>Локальная база</b><small>профиль и рационы остаются в браузере</small></div></div>' +
    '</div>' +
    '<p class="auth-note">Аккаунт создаётся только на этом устройстве. Почта и пароль никуда не отправляются.</p>' +
    '</div></section>';
}

function renderRegister() {
  const selectedRegion = authDraft.regionId || state.regionId || 'moscow';
  const options = REGIONS.map(function (r) {
    return '<option value="' + r.id + '"' + (selectedRegion === r.id ? ' selected' : '') + '>' + esc(r.name) + '</option>';
  }).join('');
  return '<section class="screen auth-screen auth-form-screen"><div class="screen-body auth-form-wrap">' +
    '<div class="wizard-top">' + backButton('auth-back') + '</div>' +
    '<header class="page-head"><div class="eyebrow">ЛОКАЛЬНЫЙ АККАУНТ</div><h1>Создать профиль</h1>' +
    '<p class="sub">Имя, почта и пароль нужны только для входа в этом браузере.</p></header>' +
    '<form class="auth-form" data-form="register" novalidate>' +
    '<label class="field"><span>Как тебя зовут</span><input id="reg-name" type="text" autocomplete="name" maxlength="40" value="' + esc(authDraft.name) + '" placeholder="Например, Аня"></label>' +
    '<label class="field"><span>Почта</span><input id="reg-email" type="email" autocomplete="username" inputmode="email" value="' + esc(authDraft.email) + '" placeholder="anna@example.ru"></label>' +
    '<label class="field"><span>Пароль</span><input id="reg-password" type="password" autocomplete="new-password" minlength="6" placeholder="Минимум 6 символов"></label>' +
    '<label class="field"><span>Повтори пароль</span><input id="reg-password2" type="password" autocomplete="new-password" minlength="6" placeholder="Ещё раз"></label>' +
    '<label class="field"><span>Регион</span><select id="reg-region">' + options + '</select></label>' +
    authErrorHTML() +
    '<button type="submit" class="btn btn-primary">Создать аккаунт</button>' +
    '</form>' +
    '<button type="button" class="auth-link" data-action="auth-login">Уже есть аккаунт? Войти</button>' +
    '<p class="auth-note">Пароль хранится в виде криптографического хеша в IndexedDB. Данные не покидают устройство.</p>' +
    '</div></section>';
}

function renderLogin() {
  return '<section class="screen auth-screen auth-form-screen"><div class="screen-body auth-form-wrap">' +
    '<div class="wizard-top">' + backButton('auth-back') + '</div>' +
    '<header class="page-head"><div class="eyebrow">С ВОЗВРАЩЕНИЕМ</div><h1>Войти в профиль</h1>' +
    '<p class="sub">Продолжи со своим рационом, настройками и списком покупок.</p></header>' +
    '<form class="auth-form" data-form="login" novalidate>' +
    '<label class="field"><span>Почта</span><input id="login-email" type="email" autocomplete="username" inputmode="email" value="' + esc(authDraft.email) + '" placeholder="anna@example.ru"></label>' +
    '<label class="field"><span>Пароль</span><input id="login-password" type="password" autocomplete="current-password" placeholder="Твой пароль"></label>' +
    authErrorHTML() +
    '<button type="submit" class="btn btn-primary">Войти</button>' +
    '</form>' +
    '<button type="button" class="auth-link" data-action="auth-register">Нет аккаунта? Создать</button>' +
    '<p class="auth-note">Восстановление пароля недоступно: аккаунт хранится только в этом браузере.</p>' +
    '</div></section>';
}

function renderProfile() {
  if (!currentUser) return renderAuth();
  const region = getRegion();
  const store = getStore();
  const plans = profilePlans.slice(0, 3);
  const created = currentProfile && currentProfile.createdAt ? currentProfile.createdAt : Date.now();
  const days = Math.max(1, Math.floor((Date.now() - created) / 86400000) + 1);
  const count = profilePlans.length || (currentProfile && currentProfile.plansCount) || 0;
  const historyHTML = plans.length ? plans.map(function (p) {
    const r = REGIONS.find(function (x) { return x.id === p.regionId; });
    const st = STORES.find(function (x) { return x.id === p.storeId; });
    return '<div class="history-row">' +
      '<button type="button" class="history-main" data-action="restore-plan" data-id="' + p.id + '">' +
      '<span class="history-date">' + esc(formatProfileDate(p.createdAt)) + '</span>' +
      '<span class="history-meta">' + esc((st ? st.name : 'Магазин') + ' · ' + (r ? r.name : 'Регион')) + '</span>' +
      '</button>' +
      '<span class="history-cost">' + fmtMoney(p.cost) + '</span>' +
      '</div>';
  }).join('') : '<div class="profile-empty">Пока нет сохранённых рационов. Собери первый — он появится здесь.</div>';

  return '<section class="screen profile-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('profile-back') + '<div class="eyebrow">ПРОФИЛЬ</div></div>' +
    '<div class="card profile-card">' +
    '<button type="button" class="avatar-edit" data-action="edit-profile" aria-label="Изменить профиль">' + avatarHTML(currentProfile, 'avatar-xl', 'Аватар') + '<span>✎</span></button>' +
    '<div class="profile-identity"><h1 class="profile-name">' + esc(currentProfile.name) + '</h1>' +
    '<div class="profile-email">' + esc(currentProfile.email) + '</div>' +
    '<div class="profile-since">В «Лёгкости» с ' + esc(formatProfileDate(created)) + '</div></div>' +
    '</div>' +
    '<div class="profile-stats">' +
    '<div class="stat-tile"><b>' + count + '</b><span>рационов</span></div>' +
    '<div class="stat-tile"><b>' + ((currentProfile && currentProfile.replacedCount) || 0) + '</b><span>замен</span></div>' +
    '<div class="stat-tile"><b>' + days + '</b><span>' + pluralize(days, ['день', 'дня', 'дней']) + '</span></div>' +
    '</div>' +
    '<div class="profile-section"><div class="section-title">Настройки рациона</div><div class="settings-card">' +
    '<button type="button" class="setting-row" data-action="open-region" data-from="profile"><span class="setting-icon">📍</span><span class="setting-main"><span class="setting-label">Регион</span><span class="setting-value">' + esc(region.name) + ' · ' + availableStores().length + ' магазинов</span></span><span class="setting-arrow">›</span></button>' +
    '<button type="button" class="setting-row" data-action="edit-step" data-step="1"><span class="setting-icon">🛒</span><span class="setting-main"><span class="setting-label">Магазин</span><span class="setting-value">' + (store ? esc(store.name) : 'Не выбран') + '</span></span><span class="setting-arrow">›</span></button>' +
    '<button type="button" class="setting-row" data-action="edit-step" data-step="2"><span class="setting-icon">👨‍👩‍👧</span><span class="setting-main"><span class="setting-label">Семья</span><span class="setting-value">' + state.adults + ' взр.' + (state.childrenAges.length ? ' · ' + state.childrenAges.length + ' детей' : ' · без детей') + '</span></span><span class="setting-arrow">›</span></button>' +
    '<button type="button" class="setting-row" data-action="edit-step" data-step="4"><span class="setting-icon">💰</span><span class="setting-main"><span class="setting-label">Бюджет</span><span class="setting-value">' + fmtMoney(state.budget) + ' на неделю</span></span><span class="setting-arrow">›</span></button>' +
    '</div></div>' +
    '<div class="profile-section"><div class="profile-section-head"><div class="section-title">Мои рационы</div>' +
    (profilePlans.length ? '<button type="button" class="text-link" data-action="open-history">Все</button>' : '') + '</div>' +
    '<div class="history-card">' + historyHTML + '</div></div>' +
    '<div class="profile-actions">' +
    '<button type="button" class="btn btn-secondary" data-action="edit-profile">Редактировать профиль</button>' +
    '<button type="button" class="btn btn-ghost" data-action="logout">Выйти</button>' +
    '</div>' +
    '<div class="profile-data"><b>Локальная база IndexedDB</b><span>Профиль, настройки и рационы не отправляются на сервер. Фото блюд — Wikimedia Commons.</span>' +
    '<a href="https://github.com/BladAdd/legkost/blob/main/assets/CREDITS.md" target="_blank" rel="noopener">Авторы фотографий</a></div>' +
    '<button type="button" class="danger-link" data-action="delete-account">Удалить аккаунт</button>' +
    '</div></section>';
}

function renderProfileEdit() {
  if (!currentUser) return renderAuth();
  const avatars = CONFIG.avatars.map(function (src) {
    return '<button type="button" class="avatar-choice' + (profileAvatarDraft === src ? ' selected' : '') + '" data-action="select-avatar" data-src="' + esc(src) + '" aria-label="Выбрать аватар"><img src="' + esc(src) + '" alt=""></button>';
  }).join('');
  return '<section class="screen auth-screen auth-form-screen"><div class="screen-body auth-form-wrap">' +
    '<div class="wizard-top">' + backButton('profile-back') + '</div>' +
    '<header class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Редактировать</h1><p class="sub">Имя и аватар видны только тебе — это локальный профиль.</p></header>' +
    '<form class="auth-form" data-form="profile-edit" novalidate>' +
    '<div class="field"><span>Аватар</span><div class="avatar-picker">' + avatars + '</div></div>' +
    '<label class="field"><span>Имя</span><input id="profile-name" type="text" maxlength="40" autocomplete="name" value="' + esc(currentProfile.name) + '"></label>' +
    '<label class="field"><span>Почта</span><input type="email" value="' + esc(currentProfile.email) + '" disabled></label>' +
    '<button type="submit" class="btn btn-primary">Сохранить</button>' +
    '</form>' +
    '<p class="auth-note">Почту изменить нельзя: она привязана к локальному аккаунту.</p>' +
    '</div></section>';
}

function renderHistory() {
  if (!currentUser) return renderAuth();
  const rows = profilePlans.length ? profilePlans.map(function (p) {
    const r = REGIONS.find(function (x) { return x.id === p.regionId; });
    const st = STORES.find(function (x) { return x.id === p.storeId; });
    return '<div class="history-row">' +
      '<button type="button" class="history-main" data-action="restore-plan" data-id="' + p.id + '">' +
      '<span class="history-date">' + esc(formatProfileDate(p.createdAt)) + '</span>' +
      '<span class="history-meta">' + esc((st ? st.name : 'Магазин') + ' · ' + (r ? r.name : 'Регион') + ' · ' + p.people + ' чел.') + '</span>' +
      '</button>' +
      '<span class="history-cost">' + fmtMoney(p.cost) + '</span>' +
      '<button type="button" class="history-delete" data-action="delete-plan" data-id="' + p.id + '" aria-label="Удалить рацион">×</button>' +
      '</div>';
  }).join('') : '<div class="profile-empty">История пока пуста.</div>';
  return '<section class="screen profile-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('profile-back') + '<div class="eyebrow">ИСТОРИЯ</div></div>' +
    '<header class="page-head"><h1>Мои рационы</h1><p class="sub">Сохранённые планы можно восстановить в один клик.</p></header>' +
    '<div class="history-card">' + rows + '</div>' +
    '</div></section>';
}

function renderRegion() {
  const current = getRegion();
  const rows = REGIONS.map(function (r) {
    const diff = Math.round((r.priceCoef - 1) * 100);
    const price = diff === 0 ? 'базовые цены' : (diff > 0 ? '+' : '−') + Math.abs(diff) + '% к цене';
    return '<button type="button" class="region-row' + (r.id === current.id ? ' selected' : '') + '" data-action="select-region" data-id="' + r.id + '">' +
      '<span class="region-pin">📍</span><span class="region-main"><span class="region-name">' + esc(r.name) + '</span>' +
      '<span class="region-meta">' + esc(r.area) + ' · ' + r.storeIds.length + ' магазинов</span></span>' +
      '<span class="region-price">' + esc(price) + '</span><span class="check-badge">✓</span></button>';
  }).join('');
  return '<section class="screen region-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('region-back') + '<div class="eyebrow">РЕГИОН</div></div>' +
    '<header class="page-head"><h1>Откуда ты?</h1><p class="sub">От региона зависят доступные магазины и цены в рационе.</p></header>' +
    '<div class="region-list">' + rows + '</div>' +
    '<p class="footnote">Цены демонстрационные: базовая стоимость умножается на индекс региона и коэффициент магазина.</p>' +
    '</div></section>';
}

function renderMap() {
  const region = getRegion();
  const stores = availableStores();
  const rows = stores.map(function (s) {
    return '<button type="button" class="map-store-row' + (state.storeId === s.id ? ' selected' : '') + '" data-action="map-select-store" data-id="' + s.id + '">' +
      '<span class="store-logo" style="background:' + s.color + '">' + esc(s.letter) + '</span>' +
      '<span class="map-store-main"><span class="map-store-name">' + esc(s.name) + '</span><span class="map-store-slogan">' + esc(s.slogan) + '</span></span>' +
      '<span class="map-store-coef">' + coefLabel(s) + '</span>' +
      (state.storeId === s.id ? '<span class="check-badge">✓</span>' : '<span class="map-store-arrow">›</span>') +
      '</button>';
  }).join('');
  return '<section class="screen map-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('map-back') + '<div class="eyebrow">ЯНДЕКС.КАРТЫ</div></div>' +
    '<header class="page-head"><h1>Магазины рядом</h1><p class="sub">' + esc(region.name) + ' · ' + stores.length + ' доступных магазинов</p></header>' +
    '<div class="region-pill"><span>📍 ' + esc(region.name) + '</span><button type="button" class="text-link" data-action="open-region" data-from="map">Сменить</button></div>' +
    '<div class="map-frame"><iframe src="' + esc(mapEmbedURL()) + '" title="Карта магазинов в регионе ' + esc(region.name) + '" loading="lazy" allowfullscreen></iframe></div>' +
    '<div class="map-caption"><span>Точки — ориентир по магазинам региона.</span><a href="' + esc(yandexMapsLink()) + '" target="_blank" rel="noopener">Открыть в Яндекс.Картах ↗</a></div>' +
    '<div class="map-stores">' + rows + '</div>' +
    '<p class="footnote">Карта загружается с сервиса Яндекс.Карт. Выбор магазина сразу применяет его цены к рациону.</p>' +
    '</div></section>';
}

function renderOnboarding() {
  const map = {
    1: renderStepStore,
    2: renderStepPeople,
    3: renderStepMeals,
    4: renderStepBudget,
    5: renderStepAllergies,
    6: renderStepStop,
    7: renderStepAppliances
  };
  return (map[state.step] || renderStepStore)();
}

function renderStepStore() {
  const region = getRegion();
  const stores = availableStores();
  const cards = stores.map(function (s) {
    const selected = state.storeId === s.id;
    return '<button type="button" class="store-card' + (selected ? ' selected' : '') + '" data-action="select-store" data-id="' + s.id + '" data-search="' + esc((s.name + ' ' + s.slogan + ' ' + region.name).toLowerCase()) + '">' +
      '<span class="store-logo" style="background:' + s.color + '">' + esc(s.letter) + '</span>' +
      '<span class="store-name">' + esc(s.name) + '</span>' +
      '<span class="store-slogan">' + esc(s.slogan) + '</span>' +
      '<span class="store-coef">' + coefLabel(s) + '</span>' +
      '<span class="check-badge">✓</span>' +
      '</button>';
  }).join('');
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Где покупаешь продукты?</h1>' +
    '<p class="sub">Соберём меню из того, что есть на полках в твоём регионе, и посчитаем по местным ценам.</p></header>' +
    '<div class="region-bar">' +
    '<button type="button" class="region-current" data-action="open-region" data-from="onboarding">' +
    '<span class="region-current-pin">📍</span><span><b>' + esc(region.name) + '</b><small>' + stores.length + ' магазинов · ' + esc(region.note) + '</small></span><span class="region-change">Изменить</span></button>' +
    '<button type="button" class="region-map-btn" data-action="open-map" data-back="onboarding" aria-label="Открыть карту магазинов">🗺️<span>Карта</span></button>' +
    '</div>' +
    '<label class="search-field"><span class="search-icon">🔍</span>' +
    '<input type="search" id="store-search" placeholder="Найти магазин в ' + esc(region.name) + '" autocomplete="off" aria-label="Найти магазин"></label>' +
    '<div class="store-grid" id="store-grid">' + cards + '</div>' +
    '<div class="empty-search" id="store-empty" hidden>Магазин не найден</div>' +
    '</div>' +
    ctaBar(primaryBtn('Дальше', 'step-next', !state.storeId)) +
    '</section>';
}

function renderStepPeople() {
  const n = peopleCount();
  const hasKids = state.childrenAges.length > 0;
  const children = hasKids ? '<div class="card children-card">' +
    state.childrenAges.map(function (age, i) {
      return '<div class="child-row">' +
        '<span class="child-name">Ребёнок ' + (i + 1) + '</span>' +
        '<div class="stepper stepper-sm">' +
        '<button type="button" class="step-btn" data-action="child-dec" data-index="' + i + '" aria-label="Меньше лет"' + (age <= CONFIG.ageMin ? ' disabled' : '') + '>−</button>' +
        '<span class="step-value small">' + age + ' <small>' + pluralize(age, ['год', 'года', 'лет']) + '</small></span>' +
        '<button type="button" class="step-btn" data-action="child-inc" data-index="' + i + '" aria-label="Больше лет"' + (age >= CONFIG.ageMax ? ' disabled' : '') + '>+</button>' +
        '</div></div>';
    }).join('') +
    (state.childrenAges.length < CONFIG.kidsMax ? '<button type="button" class="add-child" data-action="child-add">+ Добавить ребёнка</button>' : '') +
    '</div>' : '';

  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Кто будет кушать?</h1></header>' +
    '<div class="card adults-card">' +
    '<div class="card-label">Взрослые</div>' +
    '<div class="adults-row">' +
    '<button type="button" class="step-btn big" data-action="adult-dec" aria-label="Меньше взрослых"' + (state.adults <= 1 ? ' disabled' : '') + '>−</button>' +
    '<div class="adults-number">' + state.adults + '</div>' +
    '<button type="button" class="step-btn big" data-action="adult-inc" aria-label="Больше взрослых"' + (state.adults >= CONFIG.adultsMax ? ' disabled' : '') + '>+</button>' +
    '</div>' +
    '<p class="hint">Влияет на размер порций и объём закупки</p>' +
    '</div>' +
    '<div class="card toggle-card">' +
    '<div class="toggle-text"><div class="card-label">Есть дети?</div><p class="hint">Порции меньше, меню мягче</p></div>' +
    '<button type="button" class="ios-toggle' + (hasKids ? ' on' : '') + '" data-action="children-toggle" role="switch" aria-checked="' + hasKids + '" aria-label="Есть дети"><span></span></button>' +
    '</div>' +
    children +
    '<div class="info-card"><span class="info-emoji">🍽️</span><div>' +
    '<div class="info-title">Готовим на ' + n + ' ' + pluralPeople(n) + '</div>' +
    '<div class="info-text">Общее блюдо — ' + n + ' ' + pluralPortions(n) + ' за одну готовку.</div>' +
    '</div></div>' +
    '</div>' +
    ctaBar(primaryBtn('Дальше', 'step-next', false)) +
    '</section>';
}

function renderStepMeals() {
  const section = function (kind, title, suffix) {
    return '<div class="meal-section"><div class="caps-label">' + title + '</div>' +
      CONFIG.mealOrder.map(function (slot) {
        const checked = state.meals[slot][kind];
        return '<button type="button" class="meal-row' + (checked ? ' checked' : '') + '" data-action="meal-toggle" data-slot="' + slot + '" data-kind="' + kind + '">' +
          '<span class="meal-emoji">' + CONFIG.meals[slot].emoji + '</span>' +
          '<span class="meal-name">' + CONFIG.meals[slot].name + suffix + '</span>' +
          '<span class="checkbox">' + (checked ? '✓' : '') + '</span>' +
          '</button>';
      }).join('') + '</div>';
  };
  const none = activeSlots().length === 0;
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Сколько приёмов пищи в день?</h1>' +
    '<p class="sub">Отметь, что готовишь только себе, а что — на всю семью.</p></header>' +
    section('self', 'ТЫ', '') +
    section('family', 'СЕМЬЯ', '') +
    '<p class="footnote">' + (none ? '⚠️ Выбери хотя бы один приём пищи' : 'Если приём включён для семьи, готовим одно общее блюдо на всех.') + '</p>' +
    '</div>' +
    ctaBar(primaryBtn('Дальше', 'step-next', none)) +
    '</section>';
}

function renderStepBudget() {
  const n = peopleCount();
  const perPerson = Math.round((state.budget / Math.max(1, n)) / 50) * 50;
  const level = budgetLevel();
  const fill = ((state.budget - CONFIG.minBudget) / (CONFIG.maxBudget - CONFIG.minBudget)) * 100;
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Бюджет на неделю</h1>' +
    '<p class="sub">Не будем предлагать то, что в него не влезет.</p></header>' +
    '<div class="budget-value" id="budget-value">' + (state.budget >= CONFIG.maxBudget ? fmtMoney(CONFIG.maxBudget) + '+' : fmtMoney(state.budget)) + '</div>' +
    '<div class="slider-wrap">' +
    '<input type="range" id="budget-slider" min="' + CONFIG.minBudget + '" max="' + CONFIG.maxBudget + '" step="' + CONFIG.budgetStep + '" value="' + state.budget + '" style="--fill:' + fill + '%" aria-label="Бюджет на неделю">' +
    '<div class="slider-scale"><span>' + fmtMoney(CONFIG.minBudget) + '</span><span>' + fmtMoney(CONFIG.maxBudget) + '+</span></div>' +
    '</div>' +
    '<p class="per-person" id="per-person">≈ ' + fmtMoney(perPerson) + ' на человека в неделю</p>' +
    '<div class="card level-card" id="level-card">' +
    '<span class="level-emoji" id="level-emoji">' + level.emoji + '</span>' +
    '<div><div class="level-title" id="level-title">' + level.title + '</div>' +
    '<div class="level-desc" id="level-desc">' + level.desc + '</div></div>' +
    '</div>' +
    '<div id="budget-banner">' + budgetBannerHTML() + '</div>' +
    '</div>' +
    ctaBar(primaryBtn('Дальше', 'step-next', false)) +
    '</section>';
}

function renderStepAllergies() {
  const chips = CONFIG.allergies.map(function (a) {
    const selected = state.allergies.indexOf(a.id) !== -1;
    return '<button type="button" class="chip allergy-chip' + (selected ? ' selected' : '') + '" data-action="allergy-toggle" data-id="' + a.id + '">' +
      '<span class="chip-emoji">' + a.emoji + '</span><span class="chip-label">' + a.name + '</span>' +
      '<span class="check-badge">✓</span></button>';
  }).join('');
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Есть аллергии?</h1>' +
    '<p class="sub">Эти продукты не появятся ни в одном блюде.</p></header>' +
    '<div class="chip-grid allergy-grid">' + chips + '</div>' +
    '<p class="footnote">Можно изменить в любой момент в настройках.</p>' +
    '</div>' +
    ctaBar(primaryBtn('Дальше', 'step-next', false) +
      '<button type="button" class="btn btn-secondary" data-action="no-allergies-next">У меня нет аллергий</button>') +
    '</section>';
}

function renderStepStop() {
  const selected = state.stop.map(function (name, i) {
    return '<button type="button" class="tag" data-action="stop-remove" data-index="' + i + '">' + esc(name) + '<span class="tag-x" aria-hidden="true">×</span></button>';
  }).join('');
  const frequent = CONFIG.frequentStops.map(function (name) {
    const active = state.stop.some(function (s) { return normalizeName(s) === normalizeName(name); });
    return '<button type="button" class="freq-chip' + (active ? ' active' : '') + '" data-action="stop-frequent" data-name="' + esc(name) + '">' +
      (active ? '✓ ' : '+ ') + esc(name) + '</button>';
  }).join('');
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Что не готовим?</h1>' +
    '<p class="sub">Продукты, которые просто не любишь. Аллергии мы уже учли отдельно.</p></header>' +
    '<div class="stop-input-row">' +
    '<input type="text" id="stop-input" maxlength="40" placeholder="Например, баклажаны" autocomplete="off" aria-label="Добавить стоп-продукт">' +
    '<button type="button" class="add-square" data-action="stop-add" aria-label="Добавить продукт">+</button>' +
    '</div>' +
    (selected ? '<div class="tags-wrap">' + selected + '</div>' : '') +
    '<div class="caps-label spaced">ЧАСТО ИСКЛЮЧАЮТ</div>' +
    '<div class="freq-wrap">' + frequent + '</div>' +
    '<p class="footnote">Шаг необязательный — можно пропустить.</p>' +
    '</div>' +
    ctaBar(primaryBtn(state.stop.length ? 'Дальше' : 'Готовлю всё', 'step-next', false)) +
    '</section>';
}

function renderStepAppliances() {
  const grid = CONFIG.appliances.map(function (a) {
    const selected = state.appliances.indexOf(a.id) !== -1;
    return '<button type="button" class="appliance-card' + (selected ? ' selected' : '') + '" data-action="appliance-toggle" data-id="' + a.id + '">' +
      '<span class="appliance-emoji">' + a.emoji + '</span>' +
      '<span class="appliance-name">' + a.name + '</span>' +
      '<span class="check-badge">✓</span></button>';
  }).join('');
  return '<section class="screen onboarding">' +
    '<div class="screen-body">' +
    wizardHeader() +
    '<header class="page-head"><h1>Что есть на кухне?</h1>' +
    '<p class="sub">Отметь всё, чем реально готовишь. Рецепты подберём только под это.</p></header>' +
    '<div class="chip-grid appliance-grid">' + grid + '</div>' +
    '<p class="footnote">' + (state.appliances.length ? 'Рецепты будут только с этой техникой.' : '⚠️ Выбери хотя бы одну единицу техники') + '</p>' +
    '</div>' +
    ctaBar(primaryBtn('Собрать рацион', 'generate', state.appliances.length === 0)) +
    '</section>';
}

/* ───────── ЗАГРУЗКА И ДАШБОРД ───────── */
function renderLoading() {
  const store = getStore();
  const storeLabel = store ? store.name : 'магазине';
  const items = [
    'Смотрим цены в «' + storeLabel + '»',
    'Считаем норму калорий',
    'Убираем стоп-продукты',
    'Подбираем блюда на неделю'
  ];
  return '<section class="screen loading-screen"><div class="loading-wrap">' +
    logoHTML() +
    '<h1>Собираем твой рацион...</h1>' +
    '<p class="loading-sub">Это займёт пару секунд</p>' +
    '<ul class="load-list" id="loading-list">' +
    items.map(function (text, i) {
      return '<li data-load="' + i + '"><span class="load-status"><span class="spinner"></span></span><span>' + esc(text) + '</span></li>';
    }).join('') +
    '</ul></div></section>';
}

function renderDashboard() {
  const info = planInfo();
  const total = info ? info.portions : 0;
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = info ? info.days[i] : null;
    const meal = d && d.meals.length ? d.meals[d.meals.length - 1] : null;
    days.push(
      '<div class="dash-day" data-dashday="' + i + '">' +
      '<div class="dash-skel"><span class="skeleton sk-circle"></span><span class="sk-lines"><span class="skeleton sk-line"></span><span class="skeleton sk-line short"></span></span></div>' +
      '<div class="dash-real">' +
      '<img class="dash-mini-photo" src="' + esc(meal ? meal.dish.image : 'assets/food/dishes/l_borsch.jpg') + '" alt="">' +
      '<span class="dash-day-name">' + CONFIG.days[i] + '</span>' +
      '<span class="dash-day-price">' + (d ? fmtMoney(d.cost) : '') + '</span>' +
      '</div></div>'
    );
  }
  const checklist = ['Подбираем блюда под твой магазин', 'Балансируем неделю по КБЖУ', 'Собираем список покупок'];
  return '<section class="screen dashboard-screen"><div class="dash-wrap">' +
    '<div class="greeting">👋 Добрый день!</div>' +
    '<p class="dash-sub">Собираем твой рацион…</p>' +
    '<div class="card build-card">' +
    '<div class="build-head"><span class="dashed-spinner"></span><span>Готовим план...</span></div>' +
    '<ul class="dash-checklist" id="dash-checklist">' +
    checklist.map(function (text, i) {
      return '<li data-dashlist="' + i + '"><span class="dash-status"><span class="spinner small"></span></span><span>' + text + '</span></li>';
    }).join('') + '</ul></div>' +
    '<div class="tip-banner" id="dash-tip"><span>🌍</span><span>' + CONFIG.tips[0].text + '</span></div>' +
    '<div class="dash-counter" id="dash-count">✨ Готово блюд: 0…</div>' +
    '<div class="dash-days" id="dash-days">' + days.join('') + '</div>' +
    '</div></section>';
}

/* ───────── ПЛАН НЕДЕЛИ ───────── */
function renderWeek() {
  const info = planInfo();
  if (!info) { state.ui.screen = 'onboarding'; return renderOnboarding(); }
  const shop = info.shopping;
  const ringLabel = info.cost >= 10000 ? Math.round(info.cost / 1000) + 'k' : fmtNum(info.cost);
  const ringColor = info.under ? '#2F9E63' : '#E96D3F';
  const store = getStore();
  const budgetLine = info.under
    ? '<div class="budget-line ok">✅ Бюджет: ' + fmtMoney(state.budget) + '</div>'
    : '<div class="budget-line over">⚠️ Превышение: ' + fmtMoney(info.over) + '</div>';

  const dayCards = info.days.map(function (d, i) {
    if (!d) return '';
    const meal = d.meals.length ? d.meals[d.meals.length - 1] : null;
    const isToday = i === todayIndex();
    return '<button type="button" class="day-card' + (isToday ? ' today' : '') + '" data-action="open-day" data-day="' + i + '">' +
      '<img class="day-photo" src="' + esc(meal ? meal.dish.image : 'assets/food/dishes/l_borsch.jpg') + '" alt="">' +
      '<span class="day-body">' +
      '<span class="day-title-row"><span class="day-title">' + CONFIG.days[i] + '</span>' +
      (isToday ? '<span class="today-badge">СЕГОДНЯ</span>' : '') + '</span>' +
      '<span class="day-meals">' + (d.meals.length ? d.meals.map(function (m) { return CONFIG.meals[m.slot].lower; }).join(', ') : 'Нет подобранных блюд') + '</span>' +
      '</span>' +
      '<span class="day-cost-wrap"><span class="day-cost">' + fmtMoney(d.cost) + '</span><span class="day-pp">' + d.perPortion + ' ₽/порц</span></span>' +
      '</button>';
  }).join('');

  return '<section class="screen week-screen"><div class="screen-body">' +
    '<div class="week-head"><div><div class="eyebrow">ЛЁГКОСТЬ</div><h1>Твоя неделя</h1></div>' +
    '<div class="week-actions">' + profileButtonHTML() +
    '<button type="button" class="reset-link" data-action="reset">Сбросить</button></div></div>' +
    '<p class="week-store">' + (store ? 'Меню для «' + esc(store.name) + '» · ' : '') + esc(getRegion().name) +
    ' <button type="button" class="inline-link" data-action="open-map" data-back="week">на карте</button></p>' +
    '<button type="button" class="shop-hero" data-action="open-shopping">' +
    '<span class="shop-hero-top"><span>🛒 ' + shop.count + ' ' + pluralPositions(shop.count) + '</span></span>' +
    '<span class="shop-hero-title">Открыть список покупок <span class="title-arrow">›</span></span>' +
    '<span class="shop-hero-sub">Всё, что нужно купить на неделю</span>' +
    '</button>' +
    (state.plan && state.plan.partial ? '<div class="banner warning small"><span class="banner-emoji">⚠️</span><div><div class="banner-title">Часть блюд не подобралась</div><div class="banner-text">Не смогли подобрать блюда для части приёмов — ослабь ограничения.</div></div></div>' : '') +
    '<div class="card summary-card">' +
    '<div class="summary-ring">' + ringSVG(info.under ? info.cost / Math.max(1, state.budget) : 0.98, ringLabel, 'всего', 92, ringColor) + '</div>' +
    '<div class="summary-text">' +
    '<div class="summary-label">💰 Стоимость плана</div>' +
    '<div class="summary-days">7 дней на ' + peopleCount() + ' ' + pluralPeople(peopleCount()) + ' · <span class="nowrap">' + fmtMoney(info.perPerson) + '</span></div>' +
    budgetLine +
    '</div></div>' +
    '<div class="days-list">' + dayCards + '</div>' +
    '<p class="week-footnote">Нажми на день, чтобы посмотреть блюда и рецепты.</p>' +
    '</div></section>';
}

/* ───────── ДЕНЬ ───────── */
function renderDay() {
  const idx = clamp(parseInt(state.ui.dayId, 10) || 0, 0, 6);
  state.ui.dayId = idx;
  const d = dayInfo(idx);
  const slots = activeSlots();
  if (!d) { state.ui.screen = 'week'; return renderWeek(); }
  const mealSections = slots.map(function (slot) {
    const m = mealInfo(d.day, slot);
    const family = isFamilySlot(slot);
    const title = family ? CONFIG.meals[slot].familyTitle : CONFIG.meals[slot].selfTitle;
    if (!m) {
      return '<div class="slot-block"><div class="slot-title"><span class="slot-emoji">' + CONFIG.meals[slot].emoji + '</span><span>' + title + '</span></div>' +
        '<div class="empty-slot">Блюдо не подобралось — ослабь фильтры в настройках.</div></div>';
    }
    return '<div class="slot-block">' +
      '<div class="slot-title"><span class="slot-emoji">' + CONFIG.meals[slot].emoji + '</span><span>' + title + '</span></div>' +
      '<button type="button" class="dish-card" data-action="open-recipe" data-day="' + idx + '" data-slot="' + slot + '">' +
      '<img class="dish-thumb" src="' + esc(m.dish.image) + '" alt="">' +
      '<span class="dish-body"><span class="dish-name">' + esc(m.dish.name) + '</span>' +
      '<span class="dish-meta">🕐 ' + m.dish.timeMin + ' мин · 👥 ' + m.portions + ' ' + pluralPortions(m.portions) + '</span></span>' +
      '<span class="dish-price"><span>' + fmtMoney(m.cost) + '</span><small>' + m.perPortion + ' ₽/порц</small></span>' +
      '</button></div>';
  }).join('');

  return '<section class="screen day-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('back') + '<div class="eyebrow">' + CONFIG.daysShort[idx] + '</div></div>' +
    '<header class="page-head"><h1>' + CONFIG.days[idx] + '</h1></header>' +
    '<div class="card day-total-card">' +
    '<div class="day-total-left"><div class="card-label">День целиком</div>' +
    '<div class="day-total-value">' + fmtMoney(d.cost) + '</div>' +
    '<div class="hint">' + d.perPortion + ' ₽/порция · ' + d.meals.length + ' ' + pluralize(d.meals.length, ['приём', 'приёма', 'приёмов']) + ' пищи</div></div>' +
    '<div class="day-total-emoji">🥗</div></div>' +
    mealSections +
    '</div></section>';
}

/* ───────── СПИСОК ПОКУПОК ───────── */
function renderShopping() {
  const shop = shoppingInfo();
  const total = shop.count;
  const checked = shop.checked;
  const ratio = total ? checked / total : 0;
  const groups = shop.groups.map(function (g) {
    const done = g.items.filter(function (it) { return state.shoppingChecked.indexOf(it.ing.id) !== -1; }).length;
    const rows = g.items.map(function (it) {
      const isChecked = state.shoppingChecked.indexOf(it.ing.id) !== -1;
      return '<button type="button" class="shop-row' + (isChecked ? ' checked' : '') + '" data-action="toggle-shop" data-id="' + it.ing.id + '" data-row="' + it.ing.id + '" aria-pressed="' + isChecked + '">' +
        '<span class="check-circle">' + (isChecked ? '✓' : '') + '</span>' +
        '<span class="shop-emoji">' + it.ing.emoji + '</span>' +
        '<span class="shop-main"><span class="shop-name">' + esc(it.ing.name) + '</span><span class="shop-qty">' + it.display + '</span></span>' +
        '<span class="shop-price">' + fmtMoney(it.cost) + '</span>' +
        '</button>';
    }).join('');
    return '<div class="shop-group" data-group="' + g.key + '">' +
      '<div class="shop-cat"><span>' + g.title + '</span><span class="shop-cat-count" data-count="' + g.key + '">' + done + '/' + g.items.length + '</span></div>' +
      rows + '</div>';
  }).join('');

  return '<section class="screen shopping-screen"><div class="screen-body">' +
    '<div class="day-head">' + backButton('back') + '</div>' +
    '<header class="page-head"><h1>Список покупок</h1></header>' +
    '<div class="card shop-progress-card">' +
    '<div class="shop-progress-text"><div class="shop-progress-big" id="shop-progress-big">' + checked + ' из ' + total + '</div>' +
    '<p class="hint">Отмечай, что уже в корзине</p>' +
    '<div class="shop-total">Итого ≈ ' + fmtMoney(shop.total) + '</div></div>' +
    '<div id="shop-ring">' + ringSVG(ratio, Math.round(ratio * 100) + '%', 'готово', 88, '#2F9E63') + '</div>' +
    '</div>' +
    groups +
    '<p class="week-footnote">Цена списка может отличаться от плана на пару процентов из-за округлений.</p>' +
    '</div></section>';
}

function renderEmpty() {
  return '<section class="screen empty-screen"><div class="empty-wrap">' +
    logoHTML() +
    '<h1>Ничего не нашлось</h1>' +
    '<p class="sub">Под выбранные ограничения не подошло ни одно блюдо. Попробуй ослабить фильтры — аллергии, стоп-продукты или технику.</p>' +
    '<button type="button" class="btn btn-primary" data-action="reset-filters">Сбросить фильтры</button>' +
    '<button type="button" class="btn btn-ghost" data-action="back-to-setup">Изменить настройки</button>' +
    '</div></section>';
}

/* ───────── МОДАЛКА РЕЦЕПТА ───────── */
function renderRecipeModal() {
  if (!modalOpen) return '';
  const dayIdx = clamp(parseInt(state.ui.dayId, 10) || 0, 0, 6);
  const slot = state.ui.slot;
  if (!state.plan || !state.plan.days[dayIdx] || !slot) return '';
  const m = mealInfo(state.plan.days[dayIdx], slot);
  if (!m) return '';
  const k = m.k;
  const ings = m.dish.ingredients.map(function (it) {
    const ing = ING[it.ingId];
    if (!ing) return '';
    const qty = ing.unit === 'pc' ? Math.ceil(it.qtyPerServing * k - 1e-9) + ' шт' : fmtQty(it.qtyPerServing * k);
    return '<div class="ing-row"><span class="ing-emoji">' + ing.emoji + '</span>' +
      '<span class="ing-name">' + esc(ing.name) + '</span>' +
      '<span class="ing-qty">' + qty + '</span></div>';
  }).join('');
  const steps = m.dish.steps.map(function (s, i) {
    return '<div class="step-row"><span class="step-num">' + (i + 1) + '</span><span class="step-text">' + esc(s) + '</span></div>';
  }).join('');

  return '<div class="modal-overlay" data-action="modal-backdrop">' +
    '<div class="recipe-modal" role="dialog" aria-modal="true" aria-label="' + esc(m.dish.name) + '">' +
    '<div class="recipe-banner">' +
    '<img class="recipe-cover" src="' + esc(m.dish.image) + '" alt="' + esc(m.dish.name) + '">' +
    '<div class="recipe-banner-shade"></div>' +
    '<button type="button" class="round-btn modal-close" data-action="close-modal" aria-label="Закрыть">×</button>' +
    '<span class="recipe-banner-emoji">' + m.dish.emoji + '</span></div>' +
    '<div class="recipe-content">' +
    '<div class="recipe-overline">' + CONFIG.daysUpper[dayIdx] + ' · ' + CONFIG.meals[slot].name.toUpperCase() + '</div>' +
    '<h1 class="recipe-title">' + esc(m.dish.name) + '</h1>' +
    '<div class="recipe-chips">' +
    '<span class="meta-chip">🕐 ' + m.dish.timeMin + ' мин</span>' +
    '<span class="meta-chip">👥 ' + m.portions + ' ' + pluralPortions(m.portions) + '</span>' +
    '<span class="meta-chip accent">' + m.perPortion + ' ₽/порция</span>' +
    '</div>' +
    '<div class="macro-grid">' +
    '<div class="macro macro-kcal"><span class="macro-val">' + m.dish.macros.kcal + '</span><span class="macro-name">ккал</span></div>' +
    '<div class="macro macro-p"><span class="macro-val">' + m.dish.macros.p + ' г</span><span class="macro-name">белки</span></div>' +
    '<div class="macro macro-c"><span class="macro-val">' + m.dish.macros.c + ' г</span><span class="macro-name">углеводы</span></div>' +
    '<div class="macro macro-f"><span class="macro-val">' + m.dish.macros.f + ' г</span><span class="macro-name">жиры</span></div>' +
    '</div>' +
    '<div class="recipe-section"><div class="section-title">🛒 Ингредиенты</div><div class="ing-list">' + ings + '</div></div>' +
    '<div class="recipe-section"><div class="section-title">📋 Приготовление</div><div class="steps-list">' + steps + '</div></div>' +
    '</div>' +
    '<div class="modal-cta"><button type="button" class="btn btn-primary" data-action="replace-dish">🔄 Заменить блюдо</button></div>' +
    '</div></div>';
}

/* ───────── РЕНДЕР И НАВИГАЦИЯ ───────── */
let animateNext = true;

function render() {
  const app = document.getElementById('app');
  if (!app) return;
  if (!state.plan && ['week', 'day', 'shopping'].indexOf(state.ui.screen) !== -1) {
    state.ui.screen = 'onboarding';
  }
  let html = '';
  switch (state.ui.screen) {
    case 'auth': html = renderAuth(); break;
    case 'register': html = renderRegister(); break;
    case 'login': html = renderLogin(); break;
    case 'loading': html = renderLoading(); break;
    case 'dashboard': html = renderDashboard(); break;
    case 'week': html = renderWeek(); break;
    case 'day': html = renderDay(); break;
    case 'shopping': html = renderShopping(); break;
    case 'empty': html = renderEmpty(); break;
    case 'profile': html = renderProfile(); break;
    case 'profile-edit': html = renderProfileEdit(); break;
    case 'history': html = renderHistory(); break;
    case 'region': html = renderRegion(); break;
    case 'map': html = renderMap(); break;
    default: html = renderOnboarding();
  }
  app.innerHTML = html;
  const screenEl = app.firstElementChild;
  if (screenEl && animateNext) {
    screenEl.classList.add('screen-enter');
    animateNext = false;
  }
  document.getElementById('modal-root').innerHTML = renderRecipeModal();
  document.body.classList.toggle('modal-open', modalOpen);
}

function setScreen(name, options) {
  clearTimers();
  if (['week', 'day', 'shopping'].indexOf(name) !== -1 && !state.plan) name = 'onboarding';
  state.ui.screen = name;
  state.ui.dishId = null;
  state.ui.slot = null;
  if (name !== 'day') state.ui.dayId = clamp(parseInt(state.ui.dayId, 10) || 0, 0, 6);
  modalOpen = false;
  animateNext = true;
  saveState();
  render();
  if (!options || options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function goStep(step) {
  clearTimers();
  state.step = clamp(step, 1, 7);
  state.ui.screen = 'onboarding';
  modalOpen = false;
  animateNext = true;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function nextStep() {
  if (state.step === 1 && !state.storeId) { toast('Сначала выбери магазин'); return; }
  if (state.step === 3 && !activeSlots().length) { toast('Выбери хотя бы один приём пищи'); return; }
  if (state.step === 7) { startGeneration(); return; }
  goStep(state.step + 1);
}

function startGeneration() {
  if (!state.storeId) { goStep(1); return; }
  if (!activeSlots().length) { toast('Выбери хотя бы один приём пищи'); goStep(3); return; }
  if (!hasAnyCandidates()) {
    state.plan = null;
    setScreen('empty');
    return;
  }
  const ok = generatePlan();
  if (!ok) {
    state.plan = null;
    setScreen('empty');
    return;
  }
  savePlanToHistory();
  setScreen('loading');
  runLoadingAnimation();
}

function runLoadingAnimation() {
  const items = document.querySelectorAll('#loading-list li');
  items.forEach(function (item, i) {
    later(function () {
      item.classList.add('done');
      const status = item.querySelector('.load-status');
      if (status) status.innerHTML = '✅';
    }, 650 * (i + 1));
  });
  later(function () {
    setScreen('dashboard');
    runDashboardAnimation();
  }, 650 * items.length + 420);
}

function runDashboardAnimation() {
  const checks = document.querySelectorAll('#dash-checklist li');
  checks.forEach(function (item, i) {
    later(function () {
      item.classList.add('done');
      const status = item.querySelector('.dash-status');
      if (status) status.innerHTML = '✅';
    }, 620 * (i + 1));
  });

  const tipEl = document.getElementById('dash-tip');
  let tipIndex = 0;
  every(function () {
    if (!tipEl) return;
    tipIndex = (tipIndex + 1) % CONFIG.tips.length;
    const tip = CONFIG.tips[tipIndex];
    tipEl.innerHTML = '<span>' + tip.emoji + '</span><span>' + tip.text + '</span>';
    tipEl.classList.remove('tip-pop');
    void tipEl.offsetWidth;
    tipEl.classList.add('tip-pop');
  }, 1500);

  const info = planInfo();
  const total = info ? info.portions : 0;
  const counterEl = document.getElementById('dash-count');
  let shown = 0;
  if (total > 0) {
    every(function () {
      shown = Math.min(total, shown + Math.max(1, Math.ceil(total / 26)));
      if (counterEl) {
        counterEl.textContent = '✨ Готово блюд: ' + shown + (shown < total ? '…' : '');
      }
    }, 65);
  }

  const dayEls = document.querySelectorAll('.dash-day');
  dayEls.forEach(function (el, i) {
    later(function () { el.classList.add('show'); }, 280 + i * 330);
  });

  later(function () {
    setScreen('week');
  }, 3150);
}

function openDay(idx) {
  state.ui.dayId = clamp(parseInt(idx, 10) || 0, 0, 6);
  setScreen('day');
}

function openRecipe(dayIdx, slot) {
  if (!state.plan || !state.plan.days[dayIdx]) return;
  const m = mealInfo(state.plan.days[dayIdx], slot);
  if (!m) return;
  state.ui.dayId = dayIdx;
  state.ui.slot = slot;
  state.ui.dishId = m.dish.id;
  modalOpen = true;
  const root = document.getElementById('modal-root');
  root.innerHTML = renderRecipeModal();
  document.body.classList.add('modal-open');
}

function closeModal() {
  modalOpen = false;
  state.ui.dishId = null;
  state.ui.slot = null;
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = '';
  document.body.classList.remove('modal-open');
}

function replaceDish() {
  const dayIdx = clamp(parseInt(state.ui.dayId, 10) || 0, 0, 6);
  const slot = state.ui.slot;
  if (!state.plan || !slot) return;
  const current = mealInfo(state.plan.days[dayIdx], slot);
  if (!current) return;
  const pool = dishCandidates(slot).slice().sort(function (a, b) { return a.id.localeCompare(b.id); });
  if (!pool.length) { toast('Других вариантов нет'); return; }
  const curIdx = pool.findIndex(function (d) { return d.id === current.dish.id; });
  const next = pool[(curIdx + 1 + pool.length) % pool.length];
  if (!next || next.id === current.dish.id) { toast('Других вариантов нет'); return; }
  state.plan.days[dayIdx].meals[slot] = { dishId: next.id, family: current.family };
  state.plan.createdAt = Date.now();
  state.plan.partial = state.plan.days.some(function (d) { return d.skipped && d.skipped.length; });
  saveState();
  recordReplacement();
  render();
  toast('Блюдо заменено');
}

function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
}

/* ───────── БЮДЖЕТ ───────── */
function budgetBannerHTML() {
  const n = peopleCount();
  const good = state.budget >= CONFIG.basePerPerson * n;
  const thresholdSum = CONFIG.basePerPerson * n;
  return '<div class="banner ' + (good ? 'good' : 'warning') + '">' +
    '<span class="banner-emoji">' + (good ? '✅' : '⚠️') + '</span>' +
    '<div><div class="banner-title">' + (good ? 'Хороший бюджет' : 'Бюджет ниже расчётного') + '</div>' +
    '<div class="banner-text">Расчёт идёт от ' + fmtMoney(CONFIG.basePerPerson) + ' на человека в неделю — на ' + n + ' ' + pluralPeople(n) + ' это ' + fmtMoney(thresholdSum) + '.</div></div></div>';
}

function updateBudgetUI() {
  const slider = document.getElementById('budget-slider');
  const valueEl = document.getElementById('budget-value');
  const perEl = document.getElementById('per-person');
  const bannerEl = document.getElementById('budget-banner');
  const levelEl = document.getElementById('level-card');
  if (!slider || !valueEl) return;
  const n = peopleCount();
  const perPerson = Math.round((state.budget / Math.max(1, n)) / 50) * 50;
  const fill = ((state.budget - CONFIG.minBudget) / (CONFIG.maxBudget - CONFIG.minBudget)) * 100;
  slider.style.setProperty('--fill', fill + '%');
  valueEl.textContent = state.budget >= CONFIG.maxBudget ? '25 000 ₽+' : fmtMoney(state.budget);
  if (perEl) perEl.textContent = '≈ ' + fmtMoney(perPerson) + ' на человека в неделю';
  if (bannerEl) bannerEl.innerHTML = budgetBannerHTML();
  if (levelEl) {
    const level = budgetLevel();
    const emoji = levelEl.querySelector('.level-emoji');
    const title = levelEl.querySelector('.level-title');
    const desc = levelEl.querySelector('.level-desc');
    if (emoji) emoji.textContent = level.emoji;
    if (title) title.textContent = level.title;
    if (desc) desc.textContent = level.desc;
  }
}

/* ───────── МАГАЗИНЫ / СТОП-ПРОДУКТЫ ───────── */
function filterStores(value) {
  const q = normalizeName(value);
  let visible = 0;
  document.querySelectorAll('#store-grid .store-card').forEach(function (card) {
    const hay = normalizeName(card.getAttribute('data-search') || '');
    const show = !q || hay.indexOf(q) !== -1;
    card.hidden = !show;
    if (show) visible++;
  });
  const empty = document.getElementById('store-empty');
  if (empty) empty.hidden = visible !== 0;
}

function addStopFromInput() {
  const input = document.getElementById('stop-input');
  if (!input) return;
  const value = input.value.trim().replace(/\s+/g, ' ');
  if (!value) return;
  if (state.stop.length >= 20) { toast('Достаточно 20 стоп-продуктов'); input.value = ''; return; }
  if (state.stop.some(function (s) { return normalizeName(s) === normalizeName(value); })) {
    input.value = '';
    return;
  }
  state.stop.push(value);
  saveState();
  render();
  const next = document.getElementById('stop-input');
  if (next) next.focus();
}

/* ───────── ПОКУПКИ ───────── */
function toggleShopping(id) {
  const idx = state.shoppingChecked.indexOf(id);
  if (idx === -1) state.shoppingChecked.push(id);
  else state.shoppingChecked.splice(idx, 1);
  saveState();
  const rows = document.querySelectorAll('.shop-row');
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].getAttribute('data-row') === id) {
      const checked = state.shoppingChecked.indexOf(id) !== -1;
      rows[i].classList.toggle('checked', checked);
      const circle = rows[i].querySelector('.check-circle');
      if (circle) circle.textContent = checked ? '✓' : '';
      rows[i].setAttribute('aria-pressed', String(checked));
      break;
    }
  }
  refreshShoppingUI();
}

function refreshShoppingUI() {
  const shop = shoppingInfo();
  const big = document.getElementById('shop-progress-big');
  const ring = document.getElementById('shop-ring');
  if (big) big.textContent = shop.checked + ' из ' + shop.count;
  if (ring) {
    const ratio = shop.count ? shop.checked / shop.count : 0;
    ring.innerHTML = ringSVG(ratio, Math.round(ratio * 100) + '%', 'готово', 88, '#2F9E63');
  }
  shop.groups.forEach(function (g) {
    const done = g.items.filter(function (it) { return state.shoppingChecked.indexOf(it.ing.id) !== -1; }).length;
    const counter = document.querySelector('[data-count="' + g.key + '"]');
    if (counter) counter.textContent = done + '/' + g.items.length;
    const group = document.querySelector('.shop-group[data-group="' + g.key + '"]');
    if (group) group.classList.toggle('group-done', done === g.items.length);
  });
}

/* ───────── СОБЫТИЯ ───────── */
function onClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.getAttribute('data-action');
  if (action === 'modal-backdrop') {
    if (e.target === target) closeModal();
    return;
  }
  switch (action) {
    case 'open-auth':
      showAuth('auth');
      break;
    case 'auth-register':
      authError = '';
      showAuth('register');
      break;
    case 'auth-login':
      authError = '';
      showAuth('login');
      break;
    case 'auth-back':
      showAuth('auth');
      break;
    case 'auth-guest':
      enterGuest();
      break;
    case 'open-profile':
      openProfile();
      break;
    case 'edit-profile':
      openProfileEdit();
      break;
    case 'select-avatar':
      profileAvatarDraft = target.getAttribute('data-src');
      document.querySelectorAll('.avatar-choice').forEach(function (el) {
        el.classList.toggle('selected', el.getAttribute('data-src') === profileAvatarDraft);
      });
      break;
    case 'profile-back':
      if (state.ui.screen === 'profile-edit' || state.ui.screen === 'history') {
        state.ui.screen = 'profile';
        render();
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        const back = state.ui.profileBack || 'week';
        if (back === 'onboarding') goStep(state.step);
        else setScreen(back);
      }
      break;
    case 'logout':
      logoutUser();
      break;
    case 'delete-account':
      deleteAccount();
      break;
    case 'open-history':
      openHistory();
      break;
    case 'restore-plan':
      restorePlan(target.getAttribute('data-id'));
      break;
    case 'delete-plan':
      deletePlan(target.getAttribute('data-id'));
      break;
    case 'open-region':
      openRegion(target.getAttribute('data-from') || (state.ui.screen === 'profile' ? 'profile' : 'onboarding'));
      break;
    case 'select-region':
      selectRegion(target.getAttribute('data-id'));
      break;
    case 'region-back':
      if (state.ui.regionBack === 'profile') openProfile();
      else if (state.ui.regionBack === 'week' && state.plan) setScreen('week');
      else if (state.ui.regionBack === 'map') { state.ui.screen = 'map'; render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
      else goStep(1);
      break;
    case 'open-map':
      openMap(target.getAttribute('data-back') || (state.ui.screen === 'week' ? 'week' : 'onboarding'));
      break;
    case 'map-back':
      if (state.ui.mapBack === 'week' && state.plan) setScreen('week');
      else if (state.ui.mapBack === 'profile') openProfile();
      else goStep(1);
      break;
    case 'map-select-store':
      state.storeId = target.getAttribute('data-id');
      saveState();
      toast('Магазин выбран — цены обновлены');
      if (state.ui.mapBack === 'week' && state.plan) setScreen('week');
      else if (state.ui.mapBack === 'profile') openProfile();
      else goStep(1);
      break;
    case 'edit-step':
      goStep(parseInt(target.getAttribute('data-step'), 10) || 1);
      break;
    case 'back':
      if (state.ui.screen === 'onboarding') {
        if (state.step > 1) goStep(state.step - 1);
      } else if (state.ui.screen === 'day' || state.ui.screen === 'shopping') {
        setScreen('week');
      }
      break;
    case 'step-next':
      nextStep();
      break;
    case 'select-store':
      state.storeId = target.getAttribute('data-id');
      animateNext = false;
      saveState();
      render();
      break;
    case 'adult-dec':
      state.adults = clamp(state.adults - 1, 1, CONFIG.adultsMax);
      animateNext = false; saveState(); render();
      break;
    case 'adult-inc':
      state.adults = clamp(state.adults + 1, 1, CONFIG.adultsMax);
      animateNext = false; saveState(); render();
      break;
    case 'children-toggle':
      state.childrenAges = state.childrenAges.length ? [] : [7];
      animateNext = false; saveState(); render();
      break;
    case 'child-inc': {
      const i = parseInt(target.getAttribute('data-index'), 10);
      if (state.childrenAges[i] !== undefined) {
        state.childrenAges[i] = clamp(state.childrenAges[i] + 1, CONFIG.ageMin, CONFIG.ageMax);
        animateNext = false; saveState(); render();
      }
      break;
    }
    case 'child-dec': {
      const i = parseInt(target.getAttribute('data-index'), 10);
      if (state.childrenAges[i] !== undefined) {
        state.childrenAges[i] = clamp(state.childrenAges[i] - 1, CONFIG.ageMin, CONFIG.ageMax);
        animateNext = false; saveState(); render();
      }
      break;
    }
    case 'child-add':
      if (state.childrenAges.length < CONFIG.kidsMax) {
        state.childrenAges.push(7);
        animateNext = false; saveState(); render();
      }
      break;
    case 'meal-toggle': {
      const slot = target.getAttribute('data-slot');
      const kind = target.getAttribute('data-kind');
      if (state.meals[slot] && (kind === 'self' || kind === 'family')) {
        state.meals[slot][kind] = !state.meals[slot][kind];
        animateNext = false; saveState(); render();
      }
      break;
    }
    case 'allergy-toggle': {
      const id = target.getAttribute('data-id');
      if (id === 'none') {
        state.allergies = ['none'];
      } else {
        const clean = state.allergies.filter(function (a) { return a !== 'none'; });
        const pos = clean.indexOf(id);
        if (pos === -1) clean.push(id); else clean.splice(pos, 1);
        state.allergies = clean;
      }
      animateNext = false; saveState(); render();
      break;
    }
    case 'no-allergies-next':
      state.allergies = ['none'];
      goStep(6);
      break;
    case 'stop-add':
      addStopFromInput();
      break;
    case 'stop-remove': {
      const i = parseInt(target.getAttribute('data-index'), 10);
      if (state.stop[i] !== undefined) {
        state.stop.splice(i, 1);
        animateNext = false; saveState(); render();
      }
      break;
    }
    case 'stop-frequent': {
      const name = target.getAttribute('data-name');
      const pos = state.stop.findIndex(function (s) { return normalizeName(s) === normalizeName(name); });
      if (pos === -1) state.stop.push(name); else state.stop.splice(pos, 1);
      animateNext = false; saveState(); render();
      break;
    }
    case 'appliance-toggle': {
      const id = target.getAttribute('data-id');
      const pos = state.appliances.indexOf(id);
      if (pos === -1) state.appliances.push(id); else state.appliances.splice(pos, 1);
      animateNext = false; saveState(); render();
      break;
    }
    case 'generate':
      startGeneration();
      break;
    case 'open-day':
      openDay(parseInt(target.getAttribute('data-day'), 10));
      break;
    case 'open-shopping':
      setScreen('shopping');
      break;
    case 'open-recipe':
      openRecipe(parseInt(target.getAttribute('data-day'), 10), target.getAttribute('data-slot'));
      break;
    case 'close-modal':
      closeModal();
      break;
    case 'replace-dish':
      replaceDish();
      break;
    case 'toggle-shop':
      toggleShopping(target.getAttribute('data-id'));
      break;
    case 'reset':
      if (window.confirm('Сбросить весь прогресс и вернуться в начало?')) {
        clearTimers();
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PLAN_KEY);
        state = makeDefaultState();
        modalOpen = false;
        lastScreen = null;
        animateNext = true;
        saveState();
        render();
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      break;
    case 'reset-filters':
      state.allergies = ['none'];
      state.stop = [];
      state.appliances = CONFIG.appliances.map(function (a) { return a.id; });
      state.shoppingChecked = [];
      startGeneration();
      break;
    case 'back-to-setup':
      goStep(5);
      break;
    default:
      break;
  }
}

function onSubmit(e) {
  const form = e.target;
  if (!form || !form.getAttribute || !form.getAttribute('data-form')) return;
  const kind = form.getAttribute('data-form');
  if (kind === 'register') registerUser(e);
  else if (kind === 'login') loginUser(e);
  else if (kind === 'profile-edit') saveProfileEdit(e);
}

function onInput(e) {
  const el = e.target;
  if (el.id === 'store-search') {
    filterStores(el.value);
    return;
  }
  if (el.id === 'budget-slider') {
    state.budget = clamp(parseInt(el.value, 10) || CONFIG.defaultBudget, CONFIG.minBudget, CONFIG.maxBudget);
    updateBudgetUI();
    saveState();
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && modalOpen) { closeModal(); return; }
  if (e.key === 'Enter' && e.target && e.target.id === 'stop-input') {
    e.preventDefault();
    addStopFromInput();
  }
}

/* ───────── ИНИЦИАЛИЗАЦИЯ ───────── */
async function init() {
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onInput);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('keydown', onKeydown);
  try { await openDB(); } catch (e) { /* гостевой режим останется доступен */ }

  const session = readSession();
  if (session && session.userId) {
    try {
      const user = await dbGet('users', session.userId);
      if (user) {
        currentUser = user;
        let profile = await dbGet('profiles', user.id);
        if (!profile) {
          state = loadStateFor(user.id);
          profile = defaultProfileFor(user);
          await dbPut('profiles', profile);
        }
        currentProfile = profile;
        state = loadStateFor(user.id);
        state.ui.screen = state.plan ? 'week' : 'onboarding';
        saveState();
        render();
        return;
      }
      clearSession();
    } catch (e) {
      clearSession();
    }
  }
  try {
    if (localStorage.getItem(GUEST_KEY) === '1') {
      state = loadStateFor(null);
      state.ui.screen = state.plan ? 'week' : 'onboarding';
      render();
      return;
    }
  } catch (e) {}
  state.ui.screen = 'auth';
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

