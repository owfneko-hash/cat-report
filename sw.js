const CACHE_NAME = 'cat-report-v1';
// キャッシュ（保存）しておくファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './unnamed.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// インストール時にファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// オフラインの時にキャッシュからファイルを返す
self.addEventListener('fetch', event => {
  // GASへのデータ送信（POSTリクエスト）はキャッシュしない
  if (event.request.method === 'POST') return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す、なければネットワークから取得
      return response || fetch(event.request);
    }).catch(() => {
      // 完全にオフラインの場合は何も返さない（エラー落ちを防ぐ）
    })
  );
});
