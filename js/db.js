/* «Лёгкость» — локальная база данных на IndexedDB.
   Пользователи, профили и сохранённые рационы остаются в этом браузере.
   Если IndexedDB недоступна (приватный режим, старый браузер, блокировка),
   приложение автоматически переходит на localStorage и сообщает об этом. */
'use strict';

const LEGKOST_DB = {
  name: 'legkost-db',
  version: 1
};

const DB_FALLBACK_PREFIX = 'legkost-db-fallback.';
const DB_STORES = ['users', 'profiles', 'plans'];

let _dbPromise = null;
let _db = null;
let _dbState = {
  mode: 'indexeddb',
  ready: false,
  error: null,
  openedAt: null,
  lastCheck: null,
  counts: { users: 0, profiles: 0, plans: 0 },
  estimate: null
};

function storageErrorText(error) {
  const message = String((error && error.message) || error || '').trim();
  if (!message) return 'IndexedDB недоступна';
  if (/undefined|not a function|is not supported|indexeddb/i.test(message)) {
    return 'IndexedDB недоступна в этом браузере';
  }
  if (/quota|exceeded/i.test(message)) {
    return 'Хранилище браузера заполнено';
  }
  if (/security|denied|blocked|запрещ/i.test(message)) {
    return 'Браузер ограничил доступ к локальной базе';
  }
  return message.length > 180 ? message.slice(0, 177) + '…' : message;
}

function dbStatus() {
  return {
    mode: _dbState.mode,
    modeLabel: _dbState.mode === 'indexeddb' ? 'IndexedDB' : 'localStorage · резерв',
    ready: !!_dbState.ready,
    error: _dbState.error,
    openedAt: _dbState.openedAt,
    lastCheck: _dbState.lastCheck,
    counts: Object.assign({}, _dbState.counts),
    estimate: _dbState.estimate
  };
}

function activateFallback(error) {
  if (_dbState.mode === 'localstorage' && _dbState.ready) return;
  _dbState.mode = 'localstorage';
  _dbState.error = storageErrorText(error);
  _dbState.ready = false;
  try {
    const probe = DB_FALLBACK_PREFIX + 'probe';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    _dbState.ready = true;
  } catch (e) {
    _dbState.error += '; localStorage тоже недоступен: ' + (e.message || e);
  }
  _dbState.openedAt = Date.now();
  if (window.console && console.warn) console.warn('[Лёгкость] Переход на локальное хранилище:', _dbState.error);
}

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise(function (resolve, reject) {
    if (!('indexedDB' in window)) {
      activateFallback(new Error('IndexedDB не поддерживается браузером'));
      reject(new Error('IndexedDB не поддерживается'));
      return;
    }
    let settled = false;
    const timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      activateFallback(new Error('База не ответила за 5 секунд'));
      reject(new Error('База не ответила за 5 секунд'));
    }, 5000);
    let req;
    try {
      req = indexedDB.open(LEGKOST_DB.name, LEGKOST_DB.version);
    } catch (e) {
      clearTimeout(timer);
      activateFallback(e);
      reject(e);
      return;
    }
    req.onupgradeneeded = function () {
      const db = req.result;
      if (!db.objectStoreNames.contains('users')) {
        const users = db.createObjectStore('users', { keyPath: 'id' });
        users.createIndex('email', 'email', { unique: true });
      }
      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('plans')) {
        const plans = db.createObjectStore('plans', { keyPath: 'id', autoIncrement: true });
        plans.createIndex('userId', 'userId', { unique: false });
        plans.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      _db = req.result;
      _db.onversionchange = function () {
        try { _db.close(); } catch (e) {}
        _db = null;
        _dbPromise = null;
      };
      _dbState.mode = 'indexeddb';
      _dbState.ready = true;
      _dbState.error = null;
      _dbState.openedAt = Date.now();
      resolve(_db);
    };
    req.onerror = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const err = req.error || new Error('Не удалось открыть базу');
      activateFallback(err);
      reject(err);
    };
    req.onblocked = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      activateFallback(new Error('База занята другой вкладкой. Закрой лишние вкладки и обнови страницу.'));
      reject(new Error('База занята другой вкладкой'));
    };
  });
  return _dbPromise;
}

async function ensureDB() {
  if (_dbState.mode === 'localstorage') return null;
  try {
    return await openDB();
  } catch (e) {
    if (_dbState.mode !== 'localstorage') activateFallback(e);
    return null;
  }
}

function reqValue(req) {
  return new Promise(function (resolve, reject) {
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error || new Error('Ошибка запроса к базе')); };
  });
}

function dbWrite(storeName, mode, work) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      let tx;
      try {
        tx = db.transaction(storeName, mode);
        const req = work(tx.objectStore(storeName));
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error || new Error('Ошибка записи')); };
      } catch (err) {
        reject(err);
        return;
      }
      tx.onerror = function () { reject(tx.error || new Error('Ошибка базы данных')); };
      tx.onabort = function () { reject(tx.error || new Error('Транзакция отменена')); };
    });
  });
}

/* ───────── РЕЗЕРВНОЕ ХРАНИЛИЩЕ НА LOCALSTORAGE ───────── */
function localRead(storeName) {
  try {
    const raw = localStorage.getItem(DB_FALLBACK_PREFIX + storeName);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}
function localWrite(storeName, rows) {
  localStorage.setItem(DB_FALLBACK_PREFIX + storeName, JSON.stringify(rows));
}
function localRemoveRows(storeName, shouldRemove) {
  try {
    const rows = localRead(storeName);
    const kept = rows.filter(function (row) { return !shouldRemove(row); });
    if (kept.length) localWrite(storeName, kept);
    else localStorage.removeItem(DB_FALLBACK_PREFIX + storeName);
  } catch (e) { /* очистка резерва не должна мешать запуску */ }
}
function localGet(storeName, key) {
  const rows = localRead(storeName);
  return rows.find(function (row) { return String(row.id) === String(key); }) || undefined;
}
function localGetAll(storeName) {
  return localRead(storeName).slice();
}
function localPut(storeName, value) {
  const rows = localRead(storeName);
  const idx = rows.findIndex(function (row) { return String(row.id) === String(value.id); });
  if (idx === -1) rows.push(value); else rows[idx] = value;
  localWrite(storeName, rows);
  return value.id;
}
function localAdd(storeName, value) {
  const rows = localRead(storeName);
  let id = value.id;
  if (storeName === 'plans') {
    const max = rows.reduce(function (m, row) { return Math.max(m, Number(row.id) || 0); }, 0);
    if (!id) id = max + 1;
  }
  const next = Object.assign({}, value, { id: id });
  const idx = rows.findIndex(function (row) { return String(row.id) === String(id); });
  if (idx !== -1) throw new Error('Запись с таким ключом уже существует');
  rows.push(next);
  localWrite(storeName, rows);
  return id;
}
function localDelete(storeName, key) {
  const rows = localRead(storeName).filter(function (row) { return String(row.id) !== String(key); });
  localWrite(storeName, rows);
}
function localGetByIndex(storeName, indexName, value) {
  return localRead(storeName).find(function (row) {
    if (indexName === 'email') return normalizeEmail(row.email) === normalizeEmail(value);
    return String(row[indexName]) === String(value);
  });
}
function localGetAllByIndex(storeName, indexName, value) {
  return localRead(storeName).filter(function (row) {
    return String(row[indexName]) === String(value);
  });
}

/* Если аккаунт был создан в резервном localStorage, при следующем успешном
   открытии IndexedDB переносим записи туда. Резервные копии не удаляем:
   так данные можно восстановить, даже если база снова станет недоступна. */
async function migrateFallbackToIndexedDB() {
  if (!_db || _dbState.mode !== 'indexeddb') return { users: 0, profiles: 0, plans: 0 };
  const result = { users: 0, profiles: 0, plans: 0 };
  const users = localRead('users');
  const profiles = localRead('profiles');
  const plans = localRead('plans');
  if (!users.length && !profiles.length && !plans.length) return result;
  const migratedUsers = new Set();
  const migratedProfiles = new Set();
  const migratedPlans = new Set();

  for (const u of users) {
    try {
      const byId = await dbGet('users', u.id);
      if (byId) { migratedUsers.add(String(u.id)); continue; }
      const sameEmail = await dbGetByIndex('users', 'email', u.email);
      if (sameEmail) {
        if (String(sameEmail.id) === String(u.id)) migratedUsers.add(String(u.id));
        continue;
      }
      await dbPut('users', u);
      migratedUsers.add(String(u.id));
      result.users++;
    } catch (e) {
      if (window.console && console.warn) console.warn('[Лёгкость] Не удалось перенести аккаунт:', e);
    }
  }
  for (const p of profiles) {
    try {
      if (await dbGet('profiles', p.id)) { migratedProfiles.add(String(p.id)); continue; }
      if (!(await dbGet('users', p.id))) continue;
      await dbPut('profiles', p);
      migratedProfiles.add(String(p.id));
      result.profiles++;
    } catch (e) {
      if (window.console && console.warn) console.warn('[Лёгкость] Не удалось перенести профиль:', e);
    }
  }
  for (const p of plans) {
    try {
      if (await dbGet('plans', p.id)) { migratedPlans.add(String(p.id)); continue; }
      if (!(await dbGet('users', p.userId))) continue;
      await dbPut('plans', p);
      migratedPlans.add(String(p.id));
      result.plans++;
    } catch (e) {
      if (window.console && console.warn) console.warn('[Лёгкость] Не удалось перенести рацион:', e);
    }
  }

  // Перенесённые строки убираем из резерва, иначе удалённый аккаунт
  // мог бы «воскреснуть» при следующем запуске. Неперенесённые оставляем.
  localRemoveRows('users', function (u) { return migratedUsers.has(String(u.id)); });
  localRemoveRows('profiles', function (p) { return migratedProfiles.has(String(p.id)); });
  localRemoveRows('plans', function (p) { return migratedPlans.has(String(p.id)); });

  if ((result.users || result.profiles || result.plans) && window.console && console.info) {
    console.info('[Лёгкость] Данные перенесены из localStorage:', result);
  }
  return result;
}

function dbPurgeFallbackAccount(userId) {
  const id = String(userId);
  localRemoveRows('users', function (u) { return String(u.id) === id; });
  localRemoveRows('profiles', function (p) { return String(p.id) === id; });
  localRemoveRows('plans', function (p) { return String(p.userId) === id; });
}

/* ───────── ПУБЛИЧНЫЙ API ХРАНИЛИЩА ───────── */
async function dbGet(storeName, key) {
  const db = await ensureDB();
  if (!db) return localGet(storeName, key);
  const tx = db.transaction(storeName, 'readonly');
  return reqValue(tx.objectStore(storeName).get(key));
}

async function dbGetAll(storeName) {
  const db = await ensureDB();
  if (!db) return localGetAll(storeName);
  const tx = db.transaction(storeName, 'readonly');
  return reqValue(tx.objectStore(storeName).getAll());
}

async function dbPut(storeName, value) {
  const db = await ensureDB();
  if (!db) return localPut(storeName, value);
  return dbWrite(storeName, 'readwrite', function (store) { return store.put(value); });
}

async function dbAdd(storeName, value) {
  const db = await ensureDB();
  if (!db) return localAdd(storeName, value);
  return dbWrite(storeName, 'readwrite', function (store) { return store.add(value); });
}

async function dbDelete(storeName, key) {
  const db = await ensureDB();
  if (!db) { localDelete(storeName, key); return; }
  return dbWrite(storeName, 'readwrite', function (store) { return store.delete(key); });
}

async function dbGetByIndex(storeName, indexName, value) {
  const db = await ensureDB();
  if (!db) return localGetByIndex(storeName, indexName, value);
  const tx = db.transaction(storeName, 'readonly');
  return reqValue(tx.objectStore(storeName).index(indexName).get(value));
}

async function dbGetAllByIndex(storeName, indexName, value) {
  const db = await ensureDB();
  if (!db) return localGetAllByIndex(storeName, indexName, value);
  const tx = db.transaction(storeName, 'readonly');
  return reqValue(tx.objectStore(storeName).index(indexName).getAll(value));
}

async function dbDiagnostics() {
  const info = dbStatus();
  try {
    const users = await dbGetAll('users');
    const profiles = await dbGetAll('profiles');
    const plans = await dbGetAll('plans');
    info.counts = { users: users.length, profiles: profiles.length, plans: plans.length };
    _dbState.counts = info.counts;
    if (navigator.storage && typeof navigator.storage.estimate === 'function') {
      try {
        const est = await navigator.storage.estimate();
        info.estimate = { usage: est.usage || 0, quota: est.quota || 0 };
        _dbState.estimate = info.estimate;
      } catch (e) {}
    }
    info.lastCheck = Date.now();
    _dbState.lastCheck = info.lastCheck;
    return info;
  } catch (e) {
    info.error = storageErrorText(e);
    return info;
  }
}

async function dbExportAll() {
  const users = await dbGetAll('users');
  const profiles = await dbGetAll('profiles');
  const plans = await dbGetAll('plans');
  return {
    app: 'legkost',
    version: 1,
    exportedAt: new Date().toISOString(),
    storage: dbStatus().modeLabel,
    users: users,
    profiles: profiles,
    plans: plans
  };
}

function validateBackup(data) {
  if (!data || data.app !== 'legkost' || !Array.isArray(data.users)) {
    throw new Error('Это не файл резервной копии «Лёгкости»');
  }
  const users = data.users;
  const profiles = Array.isArray(data.profiles) ? data.profiles : [];
  const plans = Array.isArray(data.plans) ? data.plans : [];
  const emails = new Set();
  const ids = new Set();
  users.forEach(function (u, i) {
    if (!u || typeof u !== 'object' || !u.id || !normalizeEmail(u.email)) {
      throw new Error('В копии повреждён аккаунт №' + (i + 1) + ': нужны ID и почта');
    }
    if (!u.password || !u.password.hash || !u.password.salt) {
      throw new Error('В копии повреждён аккаунт №' + (i + 1) + ': нет хеша пароля');
    }
    const email = normalizeEmail(u.email);
    if (emails.has(email)) throw new Error('В копии две записи с одной почтой: ' + email);
    if (ids.has(String(u.id))) throw new Error('В копии повторяется ID аккаунта: ' + u.id);
    emails.add(email);
    ids.add(String(u.id));
  });
  profiles.forEach(function (p, i) {
    if (!p || typeof p !== 'object' || !p.id) {
      throw new Error('В копии повреждён профиль №' + (i + 1));
    }
    if (!ids.has(String(p.id))) {
      throw new Error('В копии профиль №' + (i + 1) + ' не связан с аккаунтом');
    }
  });
  plans.forEach(function (p, i) {
    if (!p || typeof p !== 'object' || p.id === undefined || !p.userId) {
      throw new Error('В копии повреждён рацион №' + (i + 1) + ': нужен ID и владелец');
    }
    if (!ids.has(String(p.userId))) {
      throw new Error('В копии рацион №' + (i + 1) + ' не связан с аккаунтом');
    }
  });
  return { users: users, profiles: profiles, plans: plans };
}

async function dbImportAll(data) {
  const checked = validateBackup(data);
  const users = checked.users;
  const profiles = checked.profiles;
  const plans = checked.plans;
  const db = await ensureDB();
  if (!db) {
    users.forEach(function (u) { localPut('users', u); });
    profiles.forEach(function (p) { localPut('profiles', p); });
    plans.forEach(function (p) {
      const rows = localRead('plans');
      const idx = rows.findIndex(function (x) { return String(x.id) === String(p.id); });
      if (idx === -1) rows.push(p); else rows[idx] = p;
      localWrite('plans', rows);
    });
  } else {
    for (const u of users) await dbPut('users', u);
    for (const p of profiles) await dbPut('profiles', p);
    for (const p of plans) await dbPut('plans', p);
  }
  const info = await dbDiagnostics();
  return { imported: { users: users.length, profiles: profiles.length, plans: plans.length }, info: info };
}

/* ───────── ПАРОЛИ ───────── */
function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function randomId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

function bytesToB64(bytes) {
  let binary = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary);
}

function b64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function webCryptoAvailable() {
  return !!(window.crypto && window.crypto.subtle && typeof window.crypto.subtle.importKey === 'function');
}

async function passwordRecord(password) {
  if (!webCryptoAvailable()) {
    throw new Error('Браузер не поддерживает Web Crypto. Открой сайт по HTTPS или обнови браузер.');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 120000;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password)),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-256' },
    key,
    256
  );
  return {
    algo: 'PBKDF2-SHA256',
    iterations: iterations,
    salt: bytesToB64(salt),
    hash: bytesToB64(bits)
  };
}

async function verifyPassword(password, record) {
  if (!record || !record.salt || !record.hash || !webCryptoAvailable()) return false;
  const salt = b64ToBytes(record.salt);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password)),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt, iterations: record.iterations || 120000, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToB64(bits) === record.hash;
}
