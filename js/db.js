/* «Лёгкость» — локальная база данных на IndexedDB.
   Пользователи, профили и сохранённые рационы остаются в этом браузере. */
'use strict';

const LEGKOST_DB = {
  name: 'legkost-db',
  version: 1
};

let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise(function (resolve, reject) {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB не поддерживается'));
      return;
    }
    const req = indexedDB.open(LEGKOST_DB.name, LEGKOST_DB.version);
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
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error || new Error('Не удалось открыть базу')); };
    req.onblocked = function () { reject(new Error('База занята другой вкладкой')); };
  });
  return _dbPromise;
}

function reqValue(req) {
  return new Promise(function (resolve, reject) {
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

function dbGet(storeName, key) {
  return openDB().then(function (db) {
    const tx = db.transaction(storeName, 'readonly');
    return reqValue(tx.objectStore(storeName).get(key));
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
      } catch (err) {
        reject(err);
        return;
      }
      tx.onerror = function () { reject(tx.error || new Error('Ошибка базы данных')); };
      tx.onabort = function () { reject(tx.error || new Error('Транзакция отменена')); };
    });
  });
}

function dbPut(storeName, value) {
  return dbWrite(storeName, 'readwrite', function (store) { return store.put(value); });
}

function dbAdd(storeName, value) {
  return dbWrite(storeName, 'readwrite', function (store) { return store.add(value); });
}

function dbDelete(storeName, key) {
  return dbWrite(storeName, 'readwrite', function (store) { return store.delete(key); });
}

function dbGetByIndex(storeName, indexName, value) {
  return openDB().then(function (db) {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).index(indexName).get(value);
    return reqValue(req);
  });
}

function dbGetAllByIndex(storeName, indexName, value) {
  return openDB().then(function (db) {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).index(indexName).getAll(value);
    return reqValue(req);
  });
}

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

async function passwordRecord(password) {
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
  if (!record || !record.salt || !record.hash) return false;
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
